import { spawnSync } from 'child_process';
import print from './print';

export default (cmd: string, options: string[] = []) => {
    print('', true);

    spawnSync(cmd, options, {
        shell: true,
        stdio: 'inherit'
    });

    print('', true);
};
