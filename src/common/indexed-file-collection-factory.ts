import chalk from 'chalk';
import path from 'path';
import { FileStatusResult } from 'simple-git/typings/response.d';
import print from './print';
import {
    GitIndexedEntityCollection,
    GitEntityType,
    GitIndexedFile,
    StatusCode,
    GitArea,
    PrintFilesArgs
} from './types';
import hexColors from './hex-colors';
import getRepoDir from './get-repo-dir';

/**
 * Determine whether the given file is unmerged
 * @param file The file (FileStatusResult)
 */
export const isUnmergedFile = (file: FileStatusResult): boolean => {
    return (
        (file.index === StatusCode.Deleted &&
            file.working_dir === StatusCode.Deleted) ||
        (file.index === StatusCode.Added &&
            file.working_dir === StatusCode.Unmerged) ||
        (file.index === StatusCode.Unmerged &&
            file.working_dir === StatusCode.Deleted) ||
        (file.index === StatusCode.Unmerged &&
            file.working_dir === StatusCode.Added) ||
        (file.index === StatusCode.Deleted &&
            file.working_dir === StatusCode.Unmerged) ||
        (file.index === StatusCode.Added &&
            file.working_dir === StatusCode.Added) ||
        (file.index === StatusCode.Unmerged &&
            file.working_dir === StatusCode.Unmerged)
    );
};

/**
 * Returns the staged files
 * @param files - An array of FileStatusResult
 * @returns An array of FileStatus
 */
export const getStagedFiles = (
    files: FileStatusResult[]
): FileStatusResult[] => {
    return files.filter(
        (f) =>
            f.index.trim() &&
            !isUnmergedFile(f) &&
            f.index !== StatusCode.Untracked &&
            f.index !== StatusCode.Unmodified
    );
};

/**
 * Returns the non-staged files
 * @param files - An array of FileStatusResult
 * @returns An array of FileStatus
 */
export const getUnstagedFiles = (
    files: FileStatusResult[]
): FileStatusResult[] => {
    return files.filter(
        (f) =>
            f.working_dir.trim() &&
            !isUnmergedFile(f) &&
            f.working_dir !== StatusCode.Untracked &&
            f.working_dir !== StatusCode.Unmodified
    );
};

/**
 * Returns the untracked files
 * @param files - An array of FileStatusResult
 * @returns An array of FileStatus
 */
export const getUntrackedFiles = (
    files: FileStatusResult[]
): FileStatusResult[] => {
    return files.filter(
        (f) =>
            f.index === StatusCode.Untracked &&
            f.working_dir === StatusCode.Untracked
    );
};

/**
 * Returns the unmerged files
 * @param files - An array of FileStatusResult
 * @returns An array of FileStatus
 */
export const getUnmergedFiles = (
    files: FileStatusResult[]
): FileStatusResult[] => {
    return files.filter((f) => isUnmergedFile(f));
};

/**
 * Indent the file status
 *
 * @param status The file status
 * @param spaces The amount of spaces for the indentation
 * @returns The indented file status string
 */
export const getIndentedFileStatus = (
    status: string = '',
    spaces: number = 2
): string | undefined => {
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

export const printStatusSection = (options: PrintFilesArgs) => {
    const { files, chalkColor, indexLength, showIndex, title } = options;
    let index: string;

    if (files.length === 0) {
        return;
    }

    const color = chalkColor || chalk.gray;

    if (title) {
        print(color(title), true);
    }

    files.forEach((f) => {
        if (showIndex) {
            let indentation = '';
            for (
                let i = 0;
                i < (indexLength || 1) - f.entityIndex.toString().length;
                i++
            ) {
                indentation += ' ';
            }
            index = chalk.hex(hexColors.greyLight)(
                ` ${indentation}[${f.entityIndex}]`
            );
        }

        const status =
            f.status === 'Deleted'
                ? chalk.red(getIndentedFileStatus(f.status))
                : getIndentedFileStatus(f.status);

        print(color(`${status}:${index || ''} ${f.name}`));
    });

    print('', true);
};

/**
 * Return the status by its code
 * @param statusCode The status code
 * @returns The status
 */
export const getStatusByCode = (statusCode: string): string => {
    let status: keyof typeof StatusCode = 'Unmodified';

    Object.keys(StatusCode).forEach((member: string) => {
        if (statusCode === StatusCode[member as keyof typeof StatusCode]) {
            status = member as keyof typeof StatusCode;
        }
    });

    return status;
};

/**
 * Returns the list of indexed files
 * @param files The unindexd files (FileStatusResult[])
 */
export const getList = (files: FileStatusResult[]): GitIndexedFile[] => {
    const repoDir = getRepoDir();

    const stagedFiles = getStagedFiles(files).map((f) => ({
        name: path.relative(process.cwd(), path.join(repoDir, f.path)),
        area: GitArea.Stage,
        status: getStatusByCode(f.index)
    }));

    const unstagedFiles = getUnstagedFiles(files).map((f) => ({
        name: path.relative(process.cwd(), path.join(repoDir, f.path)),
        area: GitArea.WorkTree,
        status: getStatusByCode(f.working_dir)
    }));

    const untrackedFiles = getUntrackedFiles(files).map((f) => ({
        name: path.relative(process.cwd(), path.join(repoDir, f.path)),
        area: GitArea.Untracked,
        status: 'Untracked'
    }));

    const unmergedFiles = getUnmergedFiles(files).map((f) => {
        let status = '';

        if (
            f.index === StatusCode.Deleted &&
            f.working_dir === StatusCode.Deleted
        ) {
            status = 'Both deleted';
        }

        if (
            f.index === StatusCode.Unmerged &&
            f.working_dir === StatusCode.Deleted
        ) {
            status = 'Deleted by them';
        }

        if (
            f.index === StatusCode.Deleted &&
            f.working_dir === StatusCode.Unmerged
        ) {
            status = 'Deleted by us';
        }

        if (
            f.index === StatusCode.Added &&
            f.working_dir === StatusCode.Added
        ) {
            status = 'Both added';
        }

        if (
            f.index === StatusCode.Unmerged &&
            f.working_dir === StatusCode.Added
        ) {
            status = 'Added by them';
        }

        if (
            f.index === StatusCode.Deleted &&
            f.working_dir === StatusCode.Unmerged
        ) {
            status = 'Added by us';
        }

        if (
            f.index === StatusCode.Unmerged &&
            f.working_dir === StatusCode.Unmerged
        ) {
            status = 'Both modified';
        }

        return {
            name: path.relative(process.cwd(), path.join(repoDir, f.path)),
            area: GitArea.Unmerged,
            status
        };
    });

    const newList = stagedFiles
        .concat(unstagedFiles, untrackedFiles, unmergedFiles)
        .map((f, i) => ({
            ...f,
            type: GitEntityType.File,
            entityIndex: i + 1
        }));

    return newList;
};

export const printEntities = (list: GitIndexedFile[]) => {
    if (list.length === 0) {
        print(chalk.green('No changes (working directory clean)'), true);
        return;
    }

    const printOptions = {
        indexLength: list.length.toString().length,
        showIndex: true
    };

    printStatusSection({
        ...printOptions,
        title: 'Stage - Changes to be committed',
        files: list.filter((f) => f.area === GitArea.Stage),
        chalkColor: chalk.green
    });

    printStatusSection({
        ...printOptions,
        title: 'Changes not staged for commit',
        files: list.filter((f) => f.area === GitArea.WorkTree),
        chalkColor: chalk.yellowBright
    });

    printStatusSection({
        ...printOptions,
        title: 'Untracked files',
        files: list.filter((f) => f.area === GitArea.Untracked),
        chalkColor: chalk.hex(hexColors.grey)
    });

    printStatusSection({
        ...printOptions,
        title: 'Conflicted files',
        files: list.filter((f) => f.area === GitArea.Unmerged),
        chalkColor: chalk.red
    });
};

export default (files: FileStatusResult[]): GitIndexedEntityCollection => {
    const list = getList(files);

    return {
        list,
        printEntities: () => printEntities(list),
        getStagedFiles: () => getStagedFiles(files),
        getUnstagedFiles: () => getUnstagedFiles(files),
        getUntrackedFiles: () => getUntrackedFiles(files),
        getUnmergedFiles: () => getUnmergedFiles(files)
    };
};
