#!/usr/bin/env node

import Separator from 'inquirer/lib/objects/separator';
import { gitCommand as createGitCommand } from './shared/git-command-factory';
import { GitEntityType, EntitySelectorChoice } from './shared/types';
import hasAllArgument from './shared/has-all-argument';
import selectEntity from './shared/select-entity';

export const run = async (cmdArgs?: string[]) => {
    const cmd = await createGitCommand('branch', cmdArgs);
    const { args } = cmd;

    if (!cmd.canRun) return;

    await cmd.setActiveGitEntityType(GitEntityType.Branch);

    const indexedCollection = await cmd.getActiveEntityCollection();
    const { list: allBranches } = indexedCollection;

    if (!args || hasAllArgument(args)) {
        const branchList = hasAllArgument(args)
            ? allBranches
            : allBranches.filter((b) => !b.isLocal);

        indexedCollection.printEntities(branchList);
        return;
    }

    if (args.length === 1 && (args.includes('-d') || args.includes('-D'))) {
        const choices: (EntitySelectorChoice | Separator)[] = allBranches.map(
            (e) => ({
                name: `[${e.entityIndex}] ${e.name}`,
                value: e.name
            })
        );

        const index = allBranches.findIndex((b) =>
            b.name.startsWith('remotes/')
        );

        if (index > 0) {
            choices.splice(index, 0, new Separator());
        }

        const selectedBranches = await selectEntity(
            'Select the branches to delete:',
            choices,
            false
        );

        await cmd.run(selectedBranches as string[]);
        return;
    }

    await cmd.run();
};

export default run;
