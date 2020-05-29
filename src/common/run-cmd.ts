import { spawnSync } from 'child_process';
import print from './print';
import checkGit from './check-git';

export const runCmd = (cmd: string, options: string[] = []) => {
    print('', true);
    spawnSync(cmd, options, {
        shell: true,
        stdio: 'inherit'
    });
    print('', true);
};

export const runGitCmd = (args: string[]) => {
    checkGit();
    runCmd('git', [...args]);
};

export default runCmd;
