#!/usr/bin/env node

import os from 'os';
import path from 'path';
import chalk, { Chalk } from 'chalk';
import minimist from 'minimist';
import simpleGit from 'simple-git/promise';
import inquirerCommandPrompt from 'inquirer-command-prompt';
import inquirer from 'inquirer';
import createGitCommand from './shared/git-command-factory';
import { GitArea, GitIndexedFile } from './shared/types';
import hasAllArgument from './shared/has-all-argument';
import print from './shared/print';
import { grey } from './shared/hex-colors';
import exitWithError from './shared/exit-with-error';
import { pointerRightTall } from './shared/symbols';
import hasHelpArgument from './shared/has-help-argument';

export const askForMessage = async (
    intro?: string | Chalk,
    defaultMessage?: string | null
): Promise<string> => {
    if (intro) {
        print();
        print(intro);
    }

    const historyFolder = path.join(os.tmpdir(), '.gbunny');

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
            default: defaultMessage,
            context: 1
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

export const run = async (cmdArgs?: string[]) => {
    const cmd = await createGitCommand('commit', cmdArgs);
    const args = cmd.args || [];
    const indexedCollection = await cmd.getActiveEntityCollection();
    const fileList = indexedCollection.list as GitIndexedFile[];

    if (!cmd.canRun) return;

    try {
        let filesToCommit = fileList;
        let filesToCommitCount: number;
        let commitIntroText = 'Committing all files';
        const stagedFiles = fileList.filter((f) => f.area === GitArea.Stage);
        const workTreeFiles = fileList.filter(
            (f) => f.area === GitArea.WorkTree
        );

        const { _: providedFiles } = minimist(args || []);

        if (hasAllArgument(args)) {
            const allFileNames = [
                ...stagedFiles.map((f) => f.name),
                ...workTreeFiles.map((f) => f.name)
            ];

            filesToCommitCount = [...new Set(allFileNames)].length;
        } else if (providedFiles.length > 0) {
            filesToCommit = stagedFiles.filter((f) =>
                providedFiles.includes(f.name)
            );
            filesToCommitCount = providedFiles.length;
            commitIntroText = 'Committing staged files';
        } else {
            filesToCommit = stagedFiles;
            filesToCommitCount = stagedFiles.length;
            commitIntroText = 'Committing all staged files';
        }

        if (
            filesToCommit.length === 0 &&
            !args.includes('--amend') &&
            !hasHelpArgument(args)
        ) {
            print();
            print('There are no changes staged for commit.', true);

            return;
        }

        if (hasMessage(args)) {
            await cmd.run();
        } else {
            const commitIntro = buildCommitIntro(
                commitIntroText,
                filesToCommitCount
            );

            const defaultMessage = args.includes('--amend')
                ? (await simpleGit().log(['-1'])).latest.message
                : null;

            const message = await askForMessage(commitIntro, defaultMessage);
            await cmd.run(['-m', `"${message}"`]);
        }
    } catch (error) {
        exitWithError(error);
    }
};

export default run;
