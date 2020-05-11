import {
    getIndentedFileStatus,
    getFileStatus,
    getStagedFiles,
    getUnstagedFiles,
    getUntrackedFiles,
    addIndexToFiles
} from '@/status';
import { cleanStatus, dirtyStatus } from './__fixtures__/git-status-result';

describe('Status summary', () => {
    describe('getIndentedFileStatus()', () => {
        it('should indent the file status', () => {
            expect(getIndentedFileStatus('test', 0)).toMatch('      test');
            expect(getIndentedFileStatus('test')).toBe('            test');
        });
    });

    describe('getFileStatus()', () => {
        it('should return an added file status object', () => {
            expect(getFileStatus('test', 'A')).toEqual({
                path: 'test',
                status: 'Added',
                statusKey: 'A'
            });
        });

        it('should return a deleted file status object', () => {
            expect(getFileStatus('test', 'D')).toEqual({
                path: 'test',
                status: 'Deleted',
                statusKey: 'D'
            });
        });

        it('should return an unknown file status object', () => {
            expect(getFileStatus('test', '')).toEqual({
                path: 'test',
                status: 'Unknown',
                statusKey: ''
            });
        });
    });

    describe('getStagedFiles()', () => {
        it('should return the staged files', () => {
            expect(getStagedFiles(dirtyStatus.files)).toEqual([
                { path: 'file1', status: 'Modified', statusKey: 'M' },
                { path: 'created-file', status: 'Added', statusKey: 'A' },
                { path: 'committed-file', status: 'Added', statusKey: 'A' }
            ]);
        });

        it("should not return any file when there aren't any staged files", () => {
            expect(getStagedFiles(cleanStatus.files)).toEqual([]);
        });
    });

    describe('getUnstagedFiles()', () => {
        it('should return the unstaged files', () => {
            expect(getUnstagedFiles(dirtyStatus.files)).toEqual([
                { path: 'src/file2.ts', status: 'Modified', statusKey: 'M' }
            ]);
        });

        it('should not return any file when there are no unstaged files', () => {
            expect(getUnstagedFiles(cleanStatus.files)).toEqual([]);
        });
    });

    describe('getUntrackedFiles()', () => {
        it('should return the untracked files', () => {
            expect(getUntrackedFiles(dirtyStatus.files)).toEqual([
                { path: 'not-added-file', status: 'Untracked', statusKey: '?' },
                {
                    path: 'src/another-modified-file.ts',
                    status: 'Untracked',
                    statusKey: '?'
                }
            ]);
        });

        it('should not return any file when there are no untracked files', () => {
            expect(getUntrackedFiles(cleanStatus.files)).toEqual([]);
        });
    });

    describe('addIndexToFiles()', () => {
        it('should return the indexed files', () => {
            let files = getUnstagedFiles(dirtyStatus.files);
            expect(addIndexToFiles(files)).toEqual([
                {
                    index: 1,
                    path: 'src/file2.ts',
                    status: 'Modified',
                    statusKey: 'M'
                }
            ]);

            files = getUnstagedFiles(dirtyStatus.files);
            expect(addIndexToFiles(files, 5)).toEqual([
                {
                    index: 5,
                    path: 'src/file2.ts',
                    status: 'Modified',
                    statusKey: 'M'
                }
            ]);
        });
    });
});
