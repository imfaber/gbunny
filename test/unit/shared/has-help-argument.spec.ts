import hasAllArgument from '@/shared/has-help-argument';

describe('hasHelpArgument()', () => {
    it('should determine wheter the args contain -h or -help', () => {
        expect(hasAllArgument(undefined)).toBeFalsy();
        expect(hasAllArgument([])).toBeFalsy();
        expect(hasAllArgument(['test', 'test'])).toBeFalsy();
        expect(hasAllArgument(['test', '-h'])).toBeTruthy();
        expect(hasAllArgument(['test', '--help'])).toBeTruthy();
    });
});
