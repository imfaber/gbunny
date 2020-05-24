import simpleGit from 'simple-git/promise';
import { exec } from 'shelljs';
import { GitCommand, GitEntityType, GitIndexedEntityCollection } from './types';
import createIndexedBranchCollection from './indexed-branch-collection-factory';
import createIndexedFilesCollection from './indexed-file-collection-factory';
import indexArgTransformer from './index-args-transformer';
import isRepl from './is-repl';
import checkGit from './check-git';
import print from './print';
import hasColorOption from './has-color-option';
import exitWithError from './exit-with-error';

export const gitCommand = async (
    options: string[] = []
): Promise<GitCommand> => {
    checkGit();

    const git = simpleGit().silent(true);
    const canRun = process.env.JEST_WORKER_ID === undefined;
    let activeEntityCollection: GitIndexedEntityCollection;

    const setActiveEntityCollection = async (type: GitEntityType | string) => {
        if (type === GitEntityType.Branch) {
            const { branches } = await git.branch();
            activeEntityCollection = createIndexedBranchCollection(branches);
        } else {
            const { files } = await git.status();
            activeEntityCollection = createIndexedFilesCollection(files);
        }
    };

    const getActiveGitIndexedEntity = async (): Promise<string | string[]> => {
        const config = await git.listConfig();
        return (
            config.values['.git/config']['gbunny.indextype'] ||
            GitEntityType.Branch
        );
    };

    const setActiveGitIndexedEntity = async (type: GitEntityType) => {
        await git.addConfig('gbunny.indextype', type);
        await setActiveEntityCollection(type);
    };

    const getActiveEntityCollection = () => activeEntityCollection;
    const activeGitIndexedEntityType = await getActiveGitIndexedEntity();
    await setActiveEntityCollection(activeGitIndexedEntityType.toString());

    let args: string[] | undefined;
    args = isRepl() ? options : process.argv.slice(2);
    args =
        args.length > 0
            ? (args = indexArgTransformer(
                  args,
                  getActiveEntityCollection().list
              ))
            : undefined;

    const run = async (cmdName: string, extraArgs?: string[]) => {
        const colorOption: string[] = [];

        try {
            if (hasColorOption(cmdName)) colorOption.push('--color');

            const result = exec(
                [
                    'git',
                    cmdName,
                    ...(args || []),
                    ...(extraArgs || []),
                    ...colorOption
                ].join(' ')
            );

            print(result ? '' : '\n👍', true);

            if (!isRepl()) {
                process.exit(0);
            }
        } catch (error) {
            exitWithError(error);
        }
    };

    return {
        git,
        args,
        canRun,
        run,
        setActiveGitIndexedEntity,
        getActiveEntityCollection
    } as GitCommand;
};

export default gitCommand;
