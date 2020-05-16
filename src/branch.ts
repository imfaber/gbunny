#!/usr/bin/env node

import createIndexedBranchList from './common/indexed-branch-list-factory';
import createGitCommand from './common/git-command-factory';
import { GitEntityType } from './common/types';

export const run = async () => {
    const cmd = await createGitCommand();
    const { git, args } = cmd;

    if (!cmd.canRun) return;

    const isListAll = args && (args.includes('-a') || args.includes('--all'));

    try {
        const { branches } = isListAll
            ? await git.branch()
            : await git.branchLocal();

        const indexedBranchList = createIndexedBranchList(branches);

        if (!args || isListAll) {
            indexedBranchList.prompt();
            cmd.setGitIndexedEntityType(GitEntityType.Branch);
        } else {
            await git.branch(args);
        }
    } catch (error) {
        console.error(error.message);
    }
};

run();
