#!/usr/bin/env node

import createGitCommand from './common/git-command-factory';
import selectEntity from './common/select-entity';
import { GitEntityType, EntitySelectorChoice } from './common/types';
import isRepl from './common/is-repl';
import print from './common/print';

export const run = async (cmdArgs?: string[]) => {
    const cmd = await createGitCommand('merge', cmdArgs);
    const { args } = cmd;

    if (!cmd.canRun) return;

    await cmd.setActiveGitEntityType(GitEntityType.Branch);

    if (args && !args.includes('--squash')) {
        await cmd.run();
        return;
    }

    const indexedCollection = await cmd.getActiveEntityCollection();
    const { list } = indexedCollection;

    const choices: EntitySelectorChoice[] = list.map((e) => ({
        name: `[${e.entityIndex}] ${e.name}`,
        value: e.name
    }));

    const selected = await selectEntity('Select the branch to merge:', choices);

    if (selected.length > 0) {
        await cmd.run([selected as string, ...(args || [])]);
    } else {
        print('No branch was selected.', true);
    }
};

if (!isRepl()) run();

export default run;
