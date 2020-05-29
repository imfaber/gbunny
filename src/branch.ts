#!/usr/bin/env node

import Separator from 'inquirer/lib/objects/separator';
import { gitCommand as createGitCommand } from './common/git-command-factory';
import { GitEntityType, EntitySelectorChoice } from './common/types';
import hasAllArgument from './common/has-all-argument';
import isRepl from './common/is-repl';
import selectEntity from './common/select-entity';

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

        choices.splice(index, 0, new Separator());

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

if (!isRepl()) run();

export default run;
