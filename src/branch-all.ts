#!/usr/bin/env node

import { spawnSync } from 'child_process';

spawnSync('gbunny-gb ', ['-a'], {
    shell: true,
    stdio: 'inherit'
});
