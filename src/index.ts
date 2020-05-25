#!/usr/bin/env node

import path from 'path';
import os from 'os';
import chalk from 'chalk';
import figlet from 'figlet';
import inquirerCommandPrompt from 'inquirer-command-prompt';
import inquirer from 'inquirer';
import clear from 'clear';
import print from './common/print';
import { pointerRightTall } from './common/symbols';
import checkGit from './common/check-git';
import { exitCommands, commands } from './command';
import { grey, greyLight, greyDark } from './common/hex-colors';
import { gitCommand as createGitCommand } from './common/git-command-factory';

const run = async () => {
    const { prompt } = inquirer;
    const { cmd } = await prompt([
        {
            type: 'command',
            name: 'cmd',
            message: chalk.hex(greyDark)('git'),
            prefix: chalk.hex(grey)(pointerRightTall),
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
        .replace(/^git\s/, '')
        .replace(/^g/, '')
        .trim()
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
            figlet.textSync('g-Bunny', {
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
