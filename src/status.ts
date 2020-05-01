#!/usr/bin/env node

const git = require('simple-git/promise');
const chalk = require('chalk');
const clear = require('clear');

const showStatus = async () => {
    const s = await git().status();

    clear();

    console.log(chalk.yellow('ddd'));

    return s;
};

showStatus();
