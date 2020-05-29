import git from 'simple-git/promise';
import { GitCommand, GitEntityType, GitIndexedEntityCollection } from './types';
import createIndexedBranchCollection from './indexed-branch-collection-factory';
import createIndexedFilesCollection from './indexed-file-collection-factory';
import indexArgTransformer from './index-args-transformer';
import isRepl from './is-repl';
import checkGit from './check-git';
import runCmd from './run-cmd';

const getActiveGitEntityType = async (): Promise<string | string[]> => {
    const config = await git().listConfig();
    return (
        config.values['.git/config']['gbunny.indextype'] || GitEntityType.Branch
    );
};

const getEntityCollection = async (): Promise<GitIndexedEntityCollection> => {
    const type = await getActiveGitEntityType();

    if (type === GitEntityType.Branch) {
        const { branches } = await git().branch();
        return createIndexedBranchCollection(branches);
    }

    const { files } = await git().status();
    return createIndexedFilesCollection(files);
};

const getTransformedArgs = (
    cmdArgs: string[],
    indexedEntityCollection: GitIndexedEntityCollection
): string[] | undefined => {
    const args = isRepl() ? cmdArgs : process.argv.slice(2);
    return args.length > 0
        ? indexArgTransformer(args, indexedEntityCollection.list)
        : undefined;
};

const runGitCommand = async (cmdName: string, args: string[] = []) => {
    const transformedArgs = getTransformedArgs(
        args,
        await getEntityCollection()
    );

    runCmd('git', [cmdName, ...(transformedArgs || [])]);

    if (!isRepl()) {
        process.exit(0);
    }
};

export const gitCommand = async (
    cmdName: string,
    cmdArgs: string[] = []
): Promise<GitCommand> => {
    checkGit();

    const canRun = process.env.JEST_WORKER_ID === undefined;
    const args = getTransformedArgs(cmdArgs || [], await getEntityCollection());

    const getActiveEntityCollection = async () => getEntityCollection();

    const run = async (extraArgs?: string[]) =>
        runGitCommand(cmdName, [...cmdArgs, ...(extraArgs || [])]);

    const setActiveGitEntityType = async (type: GitEntityType) => {
        await git().addConfig('gbunny.indextype', type);
    };

    return {
        args,
        canRun,
        run,
        setActiveGitEntityType,
        getActiveEntityCollection
    } as GitCommand;
};

export default gitCommand;
