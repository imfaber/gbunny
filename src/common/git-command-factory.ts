import simpleGit from 'simple-git/promise';
import { GitCommand, GitEntityType } from './types';
import createIndexedBranchList from './indexed-branch-list-factory';
import createIndexedFilesList from './indexed-file-list-factory';
import indexArgTransformer from './index-args-transformer';

export default async function (basePath?: string): Promise<GitCommand> {
    const git = simpleGit(basePath).silent(true);

    const cmd = {
        git,
        canRun: process.env.JEST_WORKER_ID === undefined,
        args: null
    } as GitCommand;

    const getActiveGitIndexedEntity = async (): Promise<string | string[]> => {
        const config = await git.listConfig();
        return (
            config.values['.git/config']['gbunny.indextype'] ||
            GitEntityType.Branch
        );
    };

    cmd.setGitIndexedEntityType = async (type: GitEntityType) => {
        await git.addConfig('gbunny.indextype', type);
    };

    const activeGitIndexedEntityType = await getActiveGitIndexedEntity();

    if (activeGitIndexedEntityType === GitEntityType.Branch) {
        const { branches } = await git.branch();
        cmd.indexedEntityList = createIndexedBranchList(branches).list;
    } else {
        const { files } = await git.status();
        cmd.indexedEntityList = createIndexedFilesList(files).list;
    }

    const args = process.argv.slice(2);
    if (args.length > 0) {
        cmd.args = indexArgTransformer(args, cmd.indexedEntityList);
    }

    return cmd;
}
