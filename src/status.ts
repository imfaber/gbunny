#!/usr/bin/env node

import chalk, { Chalk } from 'chalk';
import { StatusResult } from 'simple-git/typings/response.d';
import createGitCommand from './common/git-command-factory';
import print from './common/print';
import { StatusHeaderArgs, GitEntityType } from './common/types';
import createIndexedFilesList from './common/indexed-file-list-factory';

export const getTrackingInfo = (status: StatusResult): string => {
    return status.tracking ? `[${chalk.white(status.tracking)}]` : '';
};

export const getDivergeInfo = (status: StatusResult): string => {
    let info = '';

    if (status.behind > 0) {
        info += ` ↓${status.behind}`;
    }

    if (status.ahead > 0) {
        info += ` ↑${status.ahead}`;
    }

    return info ? chalk.hex('ffcd3a')(info) : '';
};

const printStatusHeader = (status: StatusHeaderArgs): undefined => {
    if (!status.branch) {
        return;
    }

    let header = chalk`On branch: {whiteBright ${status.branch}}`;

    if (status.tracking) {
        header += ` 🠊 ${status.tracking}`;
    }

    if (status.diverge) {
        header += ` | ${status.diverge}`;
    }

    print(chalk.grey(header), true);
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

        indexedFileList.prompt();
        setGitIndexedEntityType(GitEntityType.File);
    } catch (error) {
        console.error(error.message);
    }
};

run();
