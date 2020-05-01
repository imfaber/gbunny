#!/usr/bin/env node

import git from './git';
import clear from 'clear';
import chalk from 'chalk';

const log = console.log;

const showStatus = async () => {
    const s = await git.status();

    clear();

    const tracking = s.tracking
        ? ` | [${chalk.white(s.tracking)}]`
        : null;

    log(
        chalk.grey(
            `On branch: ${chalk.white(s.current)}${tracking ?? ''}`
        )
    );

    return s;
};

showStatus();
