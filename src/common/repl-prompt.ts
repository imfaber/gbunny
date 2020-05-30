import chalk from 'chalk';
import simpleGit from 'simple-git/promise';
import { FileStatusResult } from 'simple-git/typings/response.d';
import { getDivergeInfo } from '../status';
import {
    gitPL,
    pointerRightRoundedPL,
    verticalBar,
    pointerRightTall
} from './symbols';
import { purple, orange, green, yellow } from './hex-colors';
import createIndexedFilesCollection from './indexed-file-collection-factory';
import { StatusCode } from './types';
import getRepoDir from './get-repo-dir';

export default async () => {
    const status = await simpleGit().status();
    const filesCollection = createIndexedFilesCollection(status.files);
    const diverge = chalk.black(getDivergeInfo(status));
    const repoDir = getRepoDir().split('/').pop();
    const branch = chalk.black(` ${gitPL} ${status.current}`);

    const stagedFiles: FileStatusResult[] = filesCollection.getStagedFiles();
    const unstagedFiles: FileStatusResult[] = filesCollection.getUnstagedFiles();

    const stagedAdded = stagedFiles.filter((f) => f.index === StatusCode.Added)
        .length;
    const stagedModified = stagedFiles.filter(
        (f) => f.index === StatusCode.Modified
    ).length;
    const stagedDeleted = stagedFiles.filter(
        (f) => f.index === StatusCode.Deleted
    ).length;

    const unstagedAdded = unstagedFiles.filter(
        (f) => f.working_dir === StatusCode.Added
    ).length;
    const unstagedModified = unstagedFiles.filter(
        (f) => f.working_dir === StatusCode.Modified
    ).length;
    const unstagedDeleted = unstagedFiles.filter(
        (f) => f.working_dir === StatusCode.Deleted
    ).length;

    let fileStatusStage =
        stagedAdded || unstagedAdded ? `+${stagedAdded} ` : '';
    fileStatusStage +=
        stagedModified || unstagedModified ? `~${stagedModified} ` : '';
    fileStatusStage +=
        stagedDeleted || unstagedDeleted ? `-${stagedDeleted} ` : '';

    let fileStatusWorkTree =
        stagedAdded || unstagedAdded ? `+${unstagedAdded} ` : '';
    fileStatusWorkTree +=
        stagedModified || unstagedModified ? `~${unstagedModified} ` : '';
    fileStatusWorkTree +=
        stagedDeleted || unstagedDeleted ? `-${unstagedDeleted} ` : '';

    const changes =
        fileStatusStage || fileStatusWorkTree
            ? `${fileStatusStage.trim()} ${verticalBar} ${fileStatusWorkTree.trim()}`
            : '';

    const conflicts = status.conflicted.length
        ? ` ${verticalBar} !${status.conflicted.length}`
        : '';

    let fileStatus = changes ? ` ${changes}` : '';
    fileStatus += conflicts;

    let prompt = `gBunny ${pointerRightTall} `;

    // Project
    prompt +=
        chalk.bgHex(purple).black(` ${(repoDir || '').trim()} `) +
        chalk.bgHex(status.files.length === 0 ? green : orange).hex(purple)(
            pointerRightRoundedPL
        );

    // Branch
    prompt += chalk.bgHex(status.files.length === 0 ? green : orange)(
        `${branch} `
    );

    // File status
    if (fileStatus || diverge) {
        prompt += chalk.bgHex(yellow)(
            chalk.hex(status.files.length === 0 ? green : orange)(
                pointerRightRoundedPL
            )
        );

        prompt += `${chalk.bgHex(yellow)(
            `${chalk.black(diverge + fileStatus)} `
        )}${chalk.hex(yellow)(pointerRightRoundedPL)}`;
    } else {
        prompt += chalk.hex(status.files.length === 0 ? green : orange)(
            pointerRightRoundedPL
        );
    }

    return prompt;
};
