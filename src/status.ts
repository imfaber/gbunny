import chalk from 'chalk';
import simpleGit from 'simple-git/promise';
import { StatusResult } from 'simple-git/typings/response.d';
import createGitCommand from './shared/git-command-factory';
import { StatusHeaderArgs, GitEntityType } from './shared/types';
import symbols from './shared/symbols';
import print from './shared/print';
import hexColors, { cyan, yellow } from './shared/hex-colors';
import exitWithError from './shared/exit-with-error';

export const getTrackingInfo = (status: StatusResult): string => {
    return status.tracking ? `[${chalk.hex(cyan)(status.tracking)}]` : '';
};

export const getDivergeInfo = (status: StatusResult): string => {
    let info = '';

    if (status.behind > 0) {
        info += ` ${symbols.arrowDown}${status.behind}`;
    }

    if (status.ahead > 0) {
        info += ` ${symbols.arrowUp}${status.ahead}`;
    }

    return info || '';
};

const printStatusHeader = (status: StatusHeaderArgs): undefined => {
    if (!status.branch) {
        return;
    }

    let header = `On branch: ${chalk.hex(cyan)(status.branch)}`;

    if (status.tracking) {
        header += ` ${symbols.arrowRight} ${status.tracking}`;
    }

    if (status.diverge) {
        header += ` |${chalk.hex(yellow)(status.diverge)}`;
    }

    print(chalk.hex(hexColors.greyLight)(header), true);
};

export const run = async (cmdArgs?: string[]) => {
    const cmd = await createGitCommand('status', cmdArgs);
    const { canRun, args } = cmd;

    if (!canRun) return;

    await cmd.setActiveGitEntityType(GitEntityType.Path);

    if (args) {
        await cmd.run();
        return;
    }

    try {
        const status = await simpleGit().status();
        const indexedCollection = await cmd.getActiveEntityCollection();

        print();

        printStatusHeader({
            branch: status.current || undefined,
            tracking: getTrackingInfo(status),
            diverge: getDivergeInfo(status)
        });

        indexedCollection.printEntities();
    } catch (error) {
        exitWithError(error);
    }
};

export default run;
