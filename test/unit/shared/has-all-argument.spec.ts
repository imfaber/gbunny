import hasAllArgument from '@/shared/has-all-argument';

describe('hasAllArgument()', () => {
    it('should determine wheter the args contain -a or -all', () => {
        expect(hasAllArgument(undefined)).toBeFalsy();
        expect(hasAllArgument([])).toBeFalsy();
        expect(hasAllArgument(['test', 'test'])).toBeFalsy();
        expect(hasAllArgument(['test', '-a'])).toBeTruthy();
        expect(hasAllArgument(['test', '--all'])).toBeTruthy();
    });
});
