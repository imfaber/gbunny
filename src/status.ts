#!/usr/bin/env node

import git from 'simple-git/promise';
import clear from 'clear';

const showStatus = async () => {
    const s = await git().status();

    clear();

    console.log(s);

    return s;
};

showStatus();
