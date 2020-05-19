#!/usr/bin/env node

import createGitCommand from './common/git-command-factory';
import exitWithError from './common/exit-with-error';

export const run = async () => {
    const { git, canRun, args } = await createGitCommand();

    if (!canRun) return;

    try {
        if (args) {
            await git.checkout(args);
        }
    } catch (error) {
        exitWithError(error);
    }
};

run();
