#!/usr/bin/env node

import createGitCommand from './common/git-command-factory';

export const run = async () => {
    const { git, canRun, args } = await createGitCommand();

    if (!canRun) return;

    try {
        if (args) {
            await git.checkout(args);
        }
    } catch (error) {
        console.error(error.message);
    }
};

run();
