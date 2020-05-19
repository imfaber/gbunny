#!/usr/bin/env node

import readline from 'readline';
import chalk, { Chalk } from 'chalk';
import minimist from 'minimist';
import createGitCommand from './common/git-command-factory';
import { GitArea, GitIndexedFile } from './common/types';
import hasAllArgument from './common/has-all-argument';
import print from './common/print';
import hexColors from './common/hex-colors';
import exitWithError from './common/exit-with-error';

export const exitIfNoFileHasChanged = (files: GitIndexedFile[]) => {
    if (files.length === 0) {
        print('There are no changes staged for commit.');
        process.exit(0);
    }
};

export const askForMessage = (intro?: string | Chalk): Promise<string> => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    if (intro) {
        print(intro);
    }

    return new Promise((resolve) => {
        rl.question(chalk.bold.hex(hexColors.grey)('Commit message: '), (m) => {
            rl.close();
            resolve(m);
        });
    });
};

export const hasMessage = (args: string[] | undefined): boolean => {
    const argsObj = minimist(args || []);

    if (!args || args.length === 0) {
        return false;
    }

    if (args.includes('-m') || args.includes('--message')) {
        const message = args.includes('-m') ? argsObj.m : argsObj.message;
        return !!message;
    }

    if (
        args.includes('-F') ||
        args.includes('--file') ||
        args.includes('-c') ||
        args.includes('-C') ||
        args.includes('--reuse-message') ||
        args.includes('--reedit-message')
    ) {
        return true;
    }

    return false;
};

const buildCommitIntro = (introText: string, filesCount: number): string => {
    return chalk.yellow(`${introText} (${chalk.red(filesCount)})`);
};

export const run = async () => {
    const cmd = await createGitCommand();
    const { git, canRun } = cmd;
    const args = cmd.args || [];
    const fileList = cmd.indexedEntityList as GitIndexedFile[];

    if (!canRun) return;

    const commit = async (options: string[]) => {
        // Use raw to allow the options -c/-C/-F
        const result = await git.raw(['commit', ...options]);
        print(result.trim());
        process.exit(0);
    };

    const stagedFiles = fileList.filter((f) => f.area === GitArea.Stage);
    const workTreeFiles = fileList.filter((f) => f.area === GitArea.WorkTree);

    try {
        let filesToCommit = fileList;
        let filesToCommitCount: number;
        let commitIntroText = 'Committing all files';

        if (hasAllArgument(args)) {
            const allFileNames = [
                ...stagedFiles.map((f) => f.name),
                ...workTreeFiles.map((f) => f.name)
            ];

            filesToCommitCount = [...new Set(allFileNames)].length;
        } else {
            filesToCommit = stagedFiles;
            filesToCommitCount = stagedFiles.length;
            commitIntroText = 'Committing staged files';
        }

        exitIfNoFileHasChanged(filesToCommit);

        const commitIntro = buildCommitIntro(
            commitIntroText,
            filesToCommitCount
        );

        if (hasMessage(args)) {
            await commit(args);
        } else {
            const message = await askForMessage(commitIntro);
            await commit([...args, '-m', message]);
        }
    } catch (error) {
        exitWithError(error);
    }
};

run();
