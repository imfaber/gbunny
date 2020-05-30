import { spawnSync } from 'child_process';
import print from './print';

export const runCmd = (
    cmd: string,
    options: string[] = [],
    useSpace: boolean = true
) => {
    if (useSpace) {
        print();
    }

    spawnSync(cmd, options, {
        shell: true,
        stdio: 'inherit'
    });

    if (useSpace) {
        print();
    }
};

export const runGitCmd = (args: string[]) => {
    runCmd('git', [...args]);
};

export default runCmd;
