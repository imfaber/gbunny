#!/usr/bin/env node

import indexArgTransformer from './common/index-args-transformer';
import createIndexedBranchList from './common/indexed-branch-list-factory';
import createGitCommand from './common/git-command-factory';

export const run = async () => {
    const { git, canRun, args } = createGitCommand();

    if (!canRun) return;

    const isListAll = args && (args.includes('-a') || args.includes('--all'));

    try {
        const { branches } = isListAll
            ? await git.branch()
            : await git.branchLocal();

        const indexedBranchList = createIndexedBranchList(branches);

        if (!args || isListAll) {
            indexedBranchList.prompt();
        } else {
            const options = indexArgTransformer(args, indexedBranchList.list);
            await git.branch(options);
        }
    } catch (error) {
        console.error(error.message);
    }
};

run();
