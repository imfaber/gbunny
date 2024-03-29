#!/usr/bin/env node

import path from 'path';
import os from 'os';
import chalk from 'chalk';
import git from 'simple-git/promise';
import figlet from 'figlet';
import inquirerCommandPrompt from 'inquirer-command-prompt';
import inquirer from 'inquirer';
import clear from 'clear';
import print from './shared/print';
import checkGit from './shared/check-git';
import { exitCommands, gBunnyCommandList } from './command';
import { grey, greyLight } from './shared/hex-colors';
import { gitCommand as createGitCommand } from './shared/git-command-factory';
import replPrompt from './shared/repl-prompt';
import runCmd from './shared/run-cmd';
import exitWithError from './shared/exit-with-error';
import { getConfig } from './shared/config';

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
    const theme = (await getConfig('repltheme')) || 'agnoster';

    if (!(theme in replPrompt)) {
        exitWithError(`Theme '${theme}' not found`);
        return;
    }

    const prefix = await (replPrompt as any)[theme]();

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
            folder: path.join(os.tmpdir(), '.gbunny'),
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

    print('Type "h" for help.', true);
};

export default {
    askCommand
};

if (process.env.JEST_WORKER_ID === undefined) {
    (async () => {
        checkGit();
        const args = process.argv.slice(2);
        const isRepo = await git().checkIsRepo();

        if (!isRepo) {
            // Allow help, init and clone commands.
            const allowedCommands = ['clone', 'cln', 'init', 'i'];

            if (
                args.length === 0 ||
                (args.length && allowedCommands.includes(args[0]))
            ) {
                runCmd('git', args, false);
                return;
            }

            print('The current directory is not a git repository!');
            return;
        }

        if (process.argv.slice(2).length > 0) {
            run(args.join(' '));
        } else {
            registerPropmpt();
            welcome();
            await askCommand();
        }
    })();
}
