import chalk from 'chalk';
import simpleGit from 'simple-git/promise';
import { exec } from 'shelljs';
import { FileStatusResult } from 'simple-git/typings/response.d';
import { getDivergeInfo } from '../status';
import { gitPL, pointerRightRoundedPL, pointerRightPL, verticalBar } from './symbols';
import { purple } from './hex-colors';
import createIndexedFilesCollection from './indexed-file-collection-factory';
import { StatusCode } from './types';

export default async () => {
    const status = await simpleGit().status();
    const filesCollection = createIndexedFilesCollection(status.files);
    const diverge = chalk.black(getDivergeInfo(status));
    const repoDir = exec('git rev-parse --show-toplevel', { silent: true })
        .split('/')
        .pop();
    const branch = chalk.black(` ${gitPL} ${status.current}`);

    let prompt =
        chalk.bgHex(purple)(` ${chalk.black((repoDir || '').trim())}`) +
        chalk[status.files.length === 0 ? 'bgGreenBright' : 'bgYellow'](
            chalk.hex(purple)(pointerRightRoundedPL)
        );

    prompt +=
        chalk[status.files.length === 0 ? 'bgGreenBright' : 'bgYellow'](
            branch
        ) +
        chalk[status.files.length === 0 ? 'bgGreenBright' : 'bgYellowBright'](
            chalk[status.files.length === 0 ? 'greenBright' : 'yellow'](
                pointerRightRoundedPL
            )
        );

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

    let fileStatusStage = stagedAdded ? `+${stagedAdded} ` : '';
    fileStatusStage += stagedModified ? `~${stagedModified} ` : '';
    fileStatusStage += stagedDeleted ? `-${stagedDeleted} ` : '';
    fileStatusStage = fileStatusStage.trim();

    let fileStatusWorkTree = unstagedAdded ? `+${unstagedAdded} ` : '';
    fileStatusWorkTree += unstagedModified ? `~${unstagedModified} ` : '';
    fileStatusWorkTree += unstagedDeleted ? `-${unstagedDeleted} ` : '';
    fileStatusWorkTree = fileStatusWorkTree.trim();
    fileStatusWorkTree = fileStatusStage
        ? ` ${verticalBar} ${fileStatusWorkTree}`
        : fileStatusWorkTree;

    const changes = fileStatusStage + fileStatusWorkTree;

    const conflicts = status.conflicted.length
        ? ` ${verticalBar} !${status.conflicted.length}`
        : '';

    let fileStatus = changes ? ` ${changes}` : '';
    fileStatus += conflicts;

    prompt += `${chalk.bgYellowBright(
        chalk.black(diverge + fileStatus)
    )}${chalk.yellowBright(pointerRightRoundedPL)}`;

    return prompt;
};
