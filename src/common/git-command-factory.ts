import simpleGit, { SimpleGit } from 'simple-git/promise';
import { GitCommand } from './types';

export default function (basePath?: string): GitCommand {
    const commandObj = {
        git: simpleGit(basePath).silent(true),
        canRun: process.env.JEST_WORKER_ID === undefined,
        args: null
    } as GitCommand;

    const args = process.argv.slice(2);
    if (args.length > 0) {
        commandObj.args = args;
    }

    return commandObj;
}
