import print from './print';
import isRepl from './is-repl';

/**
 * Print message and exit with code 1
 * @param message The message to print
 */
export const exitWithError = (error?: string | Error) => {
    if (!error && !isRepl()) {
        process.exit(1);
    }

    if (typeof error === 'string') {
        print(error.trim(), true);
    }

    if (typeof error === 'object' && 'message' in error) {
        print(error.message.trim(), true);
    }

    if (!isRepl()) {
        process.exit(1);
    }
};

export default exitWithError;
