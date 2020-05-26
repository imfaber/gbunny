#!/usr/bin/env node

import path from 'path';
import os from 'os';
import chalk from 'chalk';
import figlet from 'figlet';
import inquirerCommandPrompt from 'inquirer-command-prompt';
import inquirer from 'inquirer';
import clear from 'clear';
import print from './common/print';
import checkGit from './common/check-git';
import { exitCommands, commands } from './command';
import { grey, greyLight } from './common/hex-colors';
import { gitCommand as createGitCommand } from './common/git-command-factory';
import replPrompt from './common/repl-prompt';

const run = async () => {
    const { prompt } = inquirer;
    const prefix = await replPrompt();
    const { cmd } = await prompt([
        {
            type: 'command',
            name: 'cmd',
            message: chalk.hex(grey)('git'),
            prefix,
            transformer: (input) => chalk.hex(greyLight)(input),
            autoCompletion: [
                'help',
                'add',
                'mv',
                'reset',
                'rm',
                'bisect',
                'grep',
                'log',
                'show',
                'status',
                'branch',
                'checkout',
                'commit',
                'diff',
                'merge',
                'rebase',
                'tag',
                'fetch',
                'pull',
                'push',
                'remote'
            ]
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
