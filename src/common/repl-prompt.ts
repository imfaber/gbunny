import chalk from 'chalk';
import simpleGit from 'simple-git/promise';
import { exec } from 'shelljs';
import { getDivergeInfo } from '../status';
import { gitPL, pointerRightRoundedPL, pointerRightPL } from './symbols';
import { purple } from './hex-colors';

export default async () => {
    const status = await simpleGit().status();
    let prompt = '';
    const diverge = chalk.black(getDivergeInfo(status));
    const repoDir = exec('git rev-parse --show-toplevel', { silent: true })
        .split('/')
        .pop();
    const branch = chalk.black(` ${gitPL} ${status.current}`);

    prompt =
        chalk.bgHex(purple)(` ${(repoDir || '').trim()}`) +
        chalk[status.files.length === 0 ? 'bgGreenBright' : 'bgYellow'](
            chalk.hex(purple)(pointerRightRoundedPL)
        );

    prompt +=
        status.files.length === 0
            ? `${chalk.bgGreenBright(branch + diverge)}${chalk.greenBright(
                  pointerRightPL
              )}`
            : `${chalk.bgYellow(branch + diverge)}${chalk.yellow(
                  pointerRightRoundedPL
              )}`;

    return prompt;
};
