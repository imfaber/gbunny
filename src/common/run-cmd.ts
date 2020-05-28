import { spawnSync } from 'child_process';
import print from './print';

export const runCmd = (cmd: string, options: string[] = []) => {
    spawnSync(cmd, options, {
        shell: true,
        stdio: 'inherit'
    });
};

export const runGitCmd = (args: string[]) => {
    print('', true);
    runCmd('git', [...args]);
    print('', true);
};

export default runCmd;