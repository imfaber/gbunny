import { spawnSync } from 'child_process';

export default (cmd: string, options: string[] = []) => {
    spawnSync(cmd, options, {
        shell: true,
        stdio: 'inherit'
    });
};
