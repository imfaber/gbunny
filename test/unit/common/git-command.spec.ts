import createGitCommand from '@/common/git-command-factory';

describe('Git command factory', () => {
    it('should create a git command object', async () => {
        const command = await createGitCommand('log');
        expect(command).toHaveProperty('args');
        expect(command).toHaveProperty('canRun');
    });
});
