#!/usr/bin/env node

import chalk, { Chalk } from 'chalk';
import { StatusResult } from 'simple-git/typings/response.d';
import createGitCommand from './common/git-command-factory';
import print from './common/print';
import { StatusHeaderArgs, GitEntityType } from './common/types';
import createIndexedFilesList from './common/indexed-file-list-factory';
import symbols from './common/symbols';
import hexColors from './common/hex-colors';
import exitWithError from './common/exit-with-error';

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

    print(chalk.hex(hexColors.grey)(header), true);
};

export const run = async () => {
    const { git, canRun, setGitIndexedEntityType } = await createGitCommand();

    if (!canRun) return;

    try {
        const s = await git.status();
        const indexedFileList = createIndexedFilesList(s.files);

        printStatusHeader({
            branch: s.current || undefined,
            tracking: getTrackingInfo(s),
            diverge: getDivergeInfo(s)
        });

        indexedFileList.printEntities();
        setGitIndexedEntityType(GitEntityType.File);
    } catch (error) {
        exitWithError(error);
    }
};

run();
