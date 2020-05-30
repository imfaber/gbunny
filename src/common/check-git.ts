import shell from 'shelljs';
import exitWithError from './exit-with-error';

export default function (): boolean {
    if (!shell.which('git')) {
        exitWithError('Sorry, gBunny requires git!');
        return false;
    }

    return true;
}
