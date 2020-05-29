#!/usr/bin/env node

import chalk from 'chalk';
import simpleGit from 'simple-git/promise';
import { StatusResult } from 'simple-git/typings/response.d';
import createGitCommand from './common/git-command-factory';
import { StatusHeaderArgs, GitEntityType } from './common/types';
import symbols from './common/symbols';
import print from './common/print';
import hexColors from './common/hex-colors';
import exitWithError from './common/exit-with-error';
import isRepl from './common/is-repl';

export const getTrackingInfo = (status: StatusResult): string => {
    return status.tracking ? `[${chalk.cyan(status.tracking)}]` : '';
};

export const getDivergeInfo = (status: StatusResult): string => {
    let info = '';

    if (status.behind > 0) {
        info += ` ${symbols.arrowDown}${status.behind}`;
    }

    if (status.ahead > 0) {
        info += ` ${symbols.arrowUp}${status.ahead}`;
    }

    return info || '';
};

const printStatusHeader = (status: StatusHeaderArgs): undefined => {
    if (!status.branch) {
        return;
    }

    let header = chalk`On branch: {cyan ${status.branch}}`;

    if (status.tracking) {
        header += ` ${symbols.arrowRight} ${status.tracking}`;
    }

    if (status.diverge) {
        header += ` |${chalk.yellowBright(status.diverge)}`;
    }

    print(chalk.hex(hexColors.greyLight)(header), true);
};

export const run = async (cmdArgs?: string[]) => {
    const cmd = await createGitCommand('status', cmdArgs);
    const { canRun, args } = cmd;

    if (!canRun) return;

    await cmd.setActiveGitEntityType(GitEntityType.Path);

    if (args) {
        await cmd.run();
        return;
    }

    try {
        const status = await simpleGit().status();
        const indexedCollection = await cmd.getActiveEntityCollection();

        print('', true);

        printStatusHeader({
            branch: status.current || undefined,
            tracking: getTrackingInfo(status),
            diverge: getDivergeInfo(status)
        });

        indexedCollection.printEntities();
    } catch (error) {
        exitWithError(error);
    }
};

if (!isRepl()) run();

export default run;
