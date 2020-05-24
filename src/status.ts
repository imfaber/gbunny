#!/usr/bin/env node

import chalk from 'chalk';
import { StatusResult } from 'simple-git/typings/response.d';
import createGitCommand from './common/git-command-factory';
import print from './common/print';
import { StatusHeaderArgs, GitEntityType } from './common/types';
import symbols from './common/symbols';
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

    return info ? chalk.hex('ffcd3a')(info) : '';
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
        header += ` |${status.diverge}`;
    }

    print(chalk.hex(hexColors.greyLight)(header), true);
};

export const run = async () => {
    const cmd = await createGitCommand();
    const { git, canRun } = cmd;

    if (!canRun) return;

    await cmd.setActiveGitIndexedEntity(GitEntityType.File);

    try {
        const s = await git.status();
        const indexedCollection = cmd.getActiveEntityCollection();

        printStatusHeader({
            branch: s.current || undefined,
            tracking: getTrackingInfo(s),
            diverge: getDivergeInfo(s)
        });

        indexedCollection.printEntities();
    } catch (error) {
        exitWithError(error);
    }
};

if (!isRepl()) run();

export default run;
