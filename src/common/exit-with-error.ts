import chalk from 'chalk';
import print from './print';

/**
 * Print message and exit with code 1
 * @param message The message to print
 */
export const exitWithError = (error?: string | Error) => {
    if (!error) {
        process.exit(1);
    }

    if (typeof error === 'string') {
        print(chalk.red(error.trim()));
    }

    if (typeof error === 'object' && 'message' in error) {
        print(chalk.red(error.message.trim()));
    }

    process.exit(1);
};

export default exitWithError;
