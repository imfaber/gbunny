import createGitCommand from '@/shared/git-command-factory';

describe('Git command factory', () => {
    it('should create a git command object', async () => {
        const command = await createGitCommand('log');
        expect(command).toHaveProperty('args');
        expect(command).toHaveProperty('canRun');
    });
});
