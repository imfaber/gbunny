import git from 'simple-git/promise';

export const getConfig = async (
    configName: string
): Promise<string | undefined> => {
    const config = await git().raw(['config', '--get', `gbunny.${configName}`]);

    if (config) {
        return config.trim();
    }

    return undefined;
};
