import print from '@/shared/print';

describe('Print', () => {
    it('should call console log with the given argument', () => {
        const consoleLog = jest.spyOn(console, 'log');
        print('This is a test', true);
        expect(consoleLog.mock.calls).toEqual([['This is a test'], []]);
    });
});
