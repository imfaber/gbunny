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
import { purple } from './hex-colors';
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
        chalk[status.files.length === 0 ? 'bgGreenBright' : 'bgYellow'].hex(
            purple
        )(pointerRightRoundedPL);

    // Branch
    prompt += chalk[status.files.length === 0 ? 'bgGreenBright' : 'bgYellow'](
        `${branch} `
    );

    // File status
    if (fileStatus || diverge) {
        prompt += chalk.bgYellowBright(
            chalk[status.files.length === 0 ? 'greenBright' : 'yellow'](
                pointerRightRoundedPL
            )
        );

        prompt += `${chalk.bgYellowBright(
            `${chalk.black(diverge + fileStatus)} `
        )}${chalk.yellowBright(pointerRightRoundedPL)}`;
    } else {
        prompt += chalk[status.files.length === 0 ? 'greenBright' : 'yellow'](
            pointerRightRoundedPL
        );
    }

    return prompt;
};
