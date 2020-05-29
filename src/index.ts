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
import { exitCommands, gBunnyCommandList } from './command';
import { grey, greyLight } from './common/hex-colors';
import { gitCommand as createGitCommand } from './common/git-command-factory';
import replPrompt from './common/repl-prompt';

const run = async (cmd: string) => {
    const [cmdName, ...options] = cmd
        .trim()
        .replace(/^git\s/, '')
        .replace(/^g/, '')
        .split(' ');

    const gitCommand = await createGitCommand(cmdName, options);

    if (cmdName in gBunnyCommandList) {
        await gBunnyCommandList[cmdName](gitCommand.args || []).run();
    } else {
        await gitCommand.run();
    }
};

const askCommand = async () => {
    const { prompt } = inquirer;
    const prefix = await replPrompt();
    const { cmd } = await prompt([
        {
            type: 'command',
            name: 'cmd',
            message: chalk.hex(grey)('git'),
            prefix,
            transformer: (input) => chalk.hex(greyLight)(input),
            autoCompletion: Object.keys(gBunnyCommandList)
        }
    ]);

    if (!cmd) {
        await askCommand();
        return;
    }

    if (exitCommands.includes(cmd)) {
        print('Bye bye!', true);
        process.exit(0);
    }

    await run(cmd);
    await askCommand();
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
    askCommand
};

if (process.env.JEST_WORKER_ID === undefined) {
    (async () => {
        checkGit();

        if (process.argv.slice(2).length > 0) {
            run(process.argv.slice(2).join(' '));
        } else {
            registerPropmpt();
            welcome();
            await askCommand();
        }
    })();
}
