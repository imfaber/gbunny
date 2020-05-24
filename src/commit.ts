#!/usr/bin/env node

import os from 'os';
import path from 'path';
import simpleGit from 'simple-git/promise';
import chalk, { Chalk } from 'chalk';
import minimist from 'minimist';
import inquirerCommandPrompt from 'inquirer-command-prompt';
import inquirer from 'inquirer';
import createGitCommand from './common/git-command-factory';
import { GitArea, GitIndexedFile } from './common/types';
import hasAllArgument from './common/has-all-argument';
import print from './common/print';
import { grey } from './common/hex-colors';
import exitWithError from './common/exit-with-error';
import { pointerRightTall } from './common/symbols';
import isRepl from './common/is-repl';

export const askForMessage = async (
    intro?: string | Chalk,
    defaultMessage?: string | null
): Promise<string> => {
    if (intro) {
        print(intro);
    }

    const historyFolder = path.join(os.tmpdir(), '.gbunny-commit-messages');

    inquirerCommandPrompt.setConfig({
        history: {
            save: true,
            folder: historyFolder,
            limit: 10,
            blacklist: ['exit']
        }
    });

    inquirer.registerPrompt('command', inquirerCommandPrompt);

    const { message } = await inquirer.prompt([
        {
            type: 'command',
            name: 'message',
            message: chalk.hex(grey)(
                `${defaultMessage ? 'Amend' : 'Commit'} message:`
            ),
            prefix: pointerRightTall,
            suffix: '',
            save: true,
            folder: os.tmpdir(),
            default: defaultMessage
        }
    ]);

    return Promise.resolve(message);
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
        args.includes('--help') ||
        args.includes('-h') ||
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

export const run = async (options?: string[]) => {
    const cmd = await createGitCommand(options);
    const { git, canRun } = cmd;
    const args = cmd.args || [];
    const indexedCollection = cmd.getActiveEntityCollection();
    const fileList = indexedCollection.list as GitIndexedFile[];

    if (!canRun) return;

    try {
        let filesToCommit = fileList;
        let filesToCommitCount: number;
        let commitIntroText = 'Committing all files';
        const stagedFiles = fileList.filter((f) => f.area === GitArea.Stage);
        const workTreeFiles = fileList.filter(
            (f) => f.area === GitArea.WorkTree
        );

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

        if (filesToCommit.length === 0 && !args.includes('--amend')) {
            print('There are no changes staged for commit.', true);

            if (!isRepl()) {
                process.exit(0);
            }

            return;
        }

        if (hasMessage(args)) {
            await cmd.run('commit');
        } else {
            const commitIntro = buildCommitIntro(
                commitIntroText,
                filesToCommitCount
            );

            const defaultMessage = args.includes('--amend')
                ? (await git.log(['-1'])).latest.message
                : null;

            const message = await askForMessage(commitIntro, defaultMessage);
            await cmd.run('commit', ['-m', `"${message}"`]);
        }
    } catch (error) {
        exitWithError(error);
    }
};

if (!isRepl()) run();

export default run;
