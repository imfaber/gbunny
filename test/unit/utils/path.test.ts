import dir from '@/utils/dir';

test('getCurrentDirectoryBase', () => {
    expect(dir.getCurrentDirectoryBase()).toBe('git-bunny');
});

test('directoryExists', () => {
    expect(dir.directoryExists(process.cwd())).toBeTruthy();
    expect(dir.directoryExists(`${process.cwd()}/doesntexist`)).toBeFalsy();
});
