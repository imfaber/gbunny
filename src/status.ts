#!/usr/bin/env node

import simpleGit from 'simple-git/promise';
import chalk, { Chalk } from 'chalk';
import { StatusResult, FileStatusResult } from 'simple-git/typings/response.d';
import { StatusHeaderArgs, FileStatus, StatusKey } from './common/types';

const git = simpleGit();

/**
 * Indent the file status
 *
 * @param status The file status
 * @param spaces The amount of spaces for the indentation
 * @returns The indented file status string
 */
export const getIndentedFileStatus = (status: string, spaces: number = 6) => {
    let indentation = '';

    for (let i = 0; i < spaces; i++) {
        indentation += ' ';
    }

    // Align to right
    for (let i = 0; i < 10 - status.length; i++) {
        indentation += ' ';
    }

    return `${indentation}${status}`;
};

/**
 * Returns a FileStatus object for the given file path and status key
 * @param path The file path
 * @param statusKey The status key ('A', 'M', 'D', '?')
 * @returns FileStatus | undefined
 */
export const getFileStatus = (path: string, statusKey: string): FileStatus => {
    let status: keyof typeof StatusKey = 'Unknown';

    Object.keys(StatusKey).forEach((memeber: string) => {
        if (statusKey === StatusKey[memeber as keyof typeof StatusKey]) {
            status = memeber as keyof typeof StatusKey;
        }
    });

    return {
        path,
        status,
        statusKey: statusKey as StatusKey
    };
};

/**
 * Returns the staged files
 * @param files - An array of FileStatusResult
 * @returns An array of FileStatus
 */
export const getStagedFiles = (files: FileStatusResult[]): FileStatus[] => {
    return files
        .filter((f) => f.index.trim() && f.index !== '?')
        .map((f): FileStatus => getFileStatus(f.path, f.index));
};

/**
 * Returns the non-staged files
 * @param files - An array of FileStatusResult
 * @returns An array of FileStatus
 */
export const getUnstagedFiles = (files: FileStatusResult[]): FileStatus[] => {
    return files
        .filter((f) => !f.index.trim() && f.working_dir !== '?')
        .map((f): FileStatus => getFileStatus(f.path, f.working_dir));
};

/**
 * Returns the untracked files
 * @param files - An array of FileStatusResult
 * @returns An array of FileStatus
 */
export const getUntrackedFiles = (files: FileStatusResult[]): FileStatus[] => {
    return files
        .filter((f) => f.working_dir === '?')
        .map((f): FileStatus => getFileStatus(f.path, '?'));
};

/**
 * Add an index to each file
 * @param files An array of FileStatus
 * @param indexStart A namber as index starting point
 * @returns An array of FileStatus
 */
export const addIndexToFiles = (
    files: FileStatus[],
    indexStart: number = 1
) => {
    return files.map((f, i) => ({
        ...f,
        index: i + indexStart
    }));
};

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

const print = (msg: string | Chalk = '', emptyNewLine: boolean = false) => {
    const { log } = console;
    log(msg);

    if (emptyNewLine) {
        log();
    }
};

const printStatusHeader = (status: StatusHeaderArgs): undefined => {
    if (!status.branch) {
        return;
    }

    let header = chalk`On branch: {whiteBright ${status.branch}}`;

    if (status.tracking) {
        header += ` ⟹  ${status.tracking}`;
    }

    if (status.diverge) {
        header += ` | ${status.diverge}`;
    }

    print(chalk.grey(header), true);
};

const printStatusSection = (
    title: string,
    files: FileStatus[],
    useChalk: Chalk
) => {
    if (files.length === 0) {
        return;
    }

    print(useChalk(`➤  ${title}`), true);

    files.forEach((f) => {
        const index = chalk.white(`[${f.index}]`);

        const status =
            f.statusKey === StatusKey.Deleted
                ? chalk.red(getIndentedFileStatus(f.status))
                : getIndentedFileStatus(f.status);

        print(useChalk(`${status}: ${index} ${f.path}`));
    });

    print();
};

async function printStatus() {
    const s = await git.status();

    const stagedFiles = addIndexToFiles(getStagedFiles(s.files));
    const unstagedFiles = addIndexToFiles(
        getUnstagedFiles(s.files),
        stagedFiles.length + 1
    );
    const untrackedFiles = addIndexToFiles(
        getUntrackedFiles(s.files),
        stagedFiles.length + unstagedFiles.length + 1
    );

    printStatusHeader({
        branch: s.current ?? undefined,
        tracking: getTrackingInfo(s),
        diverge: getDivergeInfo(s)
    });

    printStatusSection(
        'Stage - Changes to be committed',
        stagedFiles,
        chalk.green
    );

    printStatusSection(
        'Changes not staged for commit',
        unstagedFiles,
        chalk.yellow
    );

    printStatusSection('Untracked files', untrackedFiles, chalk.grey);
}

printStatus();
