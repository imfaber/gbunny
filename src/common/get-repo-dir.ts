import { exec } from 'shelljs';

export default () => {
    return exec('git rev-parse --show-toplevel', {
        silent: true
    }).trim();
};
