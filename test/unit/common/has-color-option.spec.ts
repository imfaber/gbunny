import hasColorOption from '@/common/has-color-option';

describe('hasColorrOption()', () => {
    it('should determine wheter the command has the color option', async () => {
        expect(await hasColorOption('log')).toBeTruthy();
        expect(await hasColorOption('commit')).toBeFalsy();
    });
});
