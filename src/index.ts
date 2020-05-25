#!/usr/bin/env node

import path from 'path';
import os from 'os';
import chalk from 'chalk';
import figlet from 'figlet';
import inquirerCommandPrompt from 'inquirer-command-prompt';
import inquirer from 'inquirer';
import simpleGit from 'simple-git/promise';
import clear from 'clear';
import print from './common/print';
import { pointerRightTall, pointerRightPL } from './common/symbols';
import checkGit from './common/check-git';
import { exitCommands, commands } from './command';
import { grey, greyLight, greyDark } from './common/hex-colors';
import { gitCommand as createGitCommand } from './common/git-command-factory';
import exitWithError from './common/exit-with-error';
import { getDivergeInfo } from './status';

const run = async () => {
    const status = await simpleGit().status();
    const { prompt } = inquirer;
    let prefix = chalk.black(` ${status.current}`);
    const diverge = getDivergeInfo(status);

    if (diverge) {
        prefix += `${diverge}`;
    }

    prefix = chalk.black(`${prefix} `);

    prefix =
        status.files.length === 0
            ? `${chalk.bgGreenBright(prefix)}${chalk.greenBright(
                  pointerRightPL
              )}`
            : `${chalk.bgYellow(prefix)}${chalk.yellow(pointerRightPL)}`;

    const { cmd } = await prompt([
        {
            type: 'command',
            name: 'cmd',
            message: chalk.hex(greyDark)('git'),
            prefix,
            transformer: (input) => chalk.hex(greyLight)(input)
        }
    ]);

    if (!cmd) {
        await run();
        return;
    }

    if (exitCommands.includes(cmd)) {
        print('Bye bye!', true);
        process.exit(0);
    }

    const [cmdName, ...options] = cmd
        .trim()
        .replace(/^git\s/, '')
        .replace(/^g/, '')
        .split(' ');

    if (cmdName in commands) {
        await commands[cmdName](options);
    } else {
        const gitCommand = await createGitCommand(options);
        await gitCommand.run(cmdName);
    }

    await run();
};

const registerPropmpt = () => {
    inquirerCommandPrompt.setConfig({
        history: {
            save: true,
            folder: path.join(os.tmpdir(), '.gbunny-commands'),
            limit: 1000,
            blacklist: exitCommands
        }
    });

    inquirer.registerPrompt('command', inquirerCommandPrompt);
};

const welcome = () => {
    clear();
    print(
        chalk.green(
            figlet.textSync('gBunny', {
                horizontalLayout: 'full',
                font: 'Larry 3D'
            })
        ),
        true
    );
};

export default {
    run
};

if (process.env.JEST_WORKER_ID === undefined) {
    (async () => {
        checkGit();
        registerPropmpt();
        welcome();
        await run();
    })();
}
