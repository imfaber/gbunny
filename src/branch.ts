#!/usr/bin/env node

import chalk from 'chalk';
import createIndexedBranchList from './common/indexed-branch-list-factory';
import createGitCommand from './common/git-command-factory';
import { GitEntityType } from './common/types';
import hasAllArgument from './common/has-all-argument';
import print from './common/print';

export const run = async () => {
    const cmd = await createGitCommand();
    const { git, args } = cmd;

    if (!cmd.canRun) return;

    try {
        const { branches } = hasAllArgument(args)
            ? await git.branch()
            : await git.branchLocal();

        const indexedBranchList = createIndexedBranchList(branches);

        if (!args || hasAllArgument(args)) {
            indexedBranchList.printEntities();
            cmd.setGitIndexedEntityType(GitEntityType.Branch);
        } else {
            await git.branch(args);
        }
    } catch (error) {
        print(chalk.red(error.message.trim()));
        process.exit(1);
    }
};

run();
