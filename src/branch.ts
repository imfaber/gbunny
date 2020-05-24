#!/usr/bin/env node

import { gitCommand as createGitCommand } from './common/git-command-factory';
import { GitEntityType } from './common/types';
import hasAllArgument from './common/has-all-argument';
import isRepl from './common/is-repl';

export const run = async (options?: string[]) => {
    const cmd = await createGitCommand(options);
    const { args } = cmd;

    if (!cmd.canRun) return;

    await cmd.setActiveGitIndexedEntity(GitEntityType.Branch);

    if (!args || hasAllArgument(args)) {
        const indexedCollection = cmd.getActiveEntityCollection();
        const { list: allBranches } = indexedCollection;
        const branchList = hasAllArgument(args)
            ? allBranches
            : allBranches.filter((b) => !b.isLocal);

        indexedCollection.printEntities(branchList);
    } else {
        await cmd.run('branch');
    }
};

if (!isRepl()) run();

export default run;
