import {
    getIndentedFileStatus,
    getStagedFiles,
    getUnstagedFiles,
    getUntrackedFiles,
    getUnmergedFiles,
    isUnmergedFile,
    getStatusByCode,
    getList
} from '@/common/indexed-file-collection-factory';
import { cleanStatus, dirtyStatus } from '../fixtures/git-status-result';

describe('Status summary', () => {
    describe('getIndentedFileStatus()', () => {
        it('should indent the file status', () => {
            expect(getIndentedFileStatus('test', 0)).toMatch('      test');
            expect(getIndentedFileStatus('test')).toBe('        test');
        });
    });

    describe('isUnmergedFile()', () => {
        it('should determine whether the file is unmerged', () => {
            dirtyStatus.files
                .filter((f) => f.path === 'conflict-file')
                .forEach((f) => expect(isUnmergedFile(f)).toBeTruthy());
            dirtyStatus.files
                .filter((f) => f.path !== 'conflict-file')
                .forEach((f) => expect(isUnmergedFile(f)).toBeFalsy());
        });
    });

    describe('getStagedFiles()', () => {
        it('should return the staged files', () => {
            expect(getStagedFiles(dirtyStatus.files)).toEqual([
                { path: 'file1', working_dir: ' ', index: 'M' },
                { path: 'created-file', working_dir: ' ', index: 'A' },
                { path: 'committed-file', working_dir: 'D', index: 'A' }
            ]);
        });

        it("should not return any file when there aren't any staged files", () => {
            expect(getStagedFiles(cleanStatus.files)).toEqual([]);
        });
    });

    describe('getUnstagedFiles()', () => {
        it('should return the unstaged files', () => {
            expect(getUnstagedFiles(dirtyStatus.files)).toEqual([
                { path: 'committed-file', working_dir: 'D', index: 'A' },
                { path: 'file2.ts', working_dir: 'M', index: ' ' }
            ]);
        });

        it('should not return any file when there are no unstaged files', () => {
            expect(getUnstagedFiles(cleanStatus.files)).toEqual([]);
        });
    });

    describe('getUntrackedFiles()', () => {
        it('should return the untracked files', () => {
            expect(getUntrackedFiles(dirtyStatus.files)).toEqual([
                { path: 'not-added-file', working_dir: '?', index: '?' },
                {
                    path: 'another-modified-file.ts',
                    working_dir: '?',
                    index: '?'
                }
            ]);
        });

        it('should not return any file when there are no untracked files', () => {
            expect(getUntrackedFiles(cleanStatus.files)).toEqual([]);
        });
    });

    describe('getUnmergedFiles()', () => {
        it('should return the unmerged files', () => {
            expect(getUnmergedFiles(dirtyStatus.files)).toEqual([
                { path: 'conflict-file', index: 'D', working_dir: 'D' },
                { path: 'conflict-file', index: 'A', working_dir: 'U' },
                { path: 'conflict-file', index: 'U', working_dir: 'D' },
                { path: 'conflict-file', index: 'U', working_dir: 'A' },
                { path: 'conflict-file', index: 'D', working_dir: 'U' },
                { path: 'conflict-file', index: 'A', working_dir: 'A' },
                { path: 'conflict-file', index: 'U', working_dir: 'U' }
            ]);
        });

        it('should not return any file when there are no untracked files', () => {
            expect(getUnmergedFiles(cleanStatus.files)).toEqual([]);
        });
    });

    describe('getStatusByCode()', () => {
        it('should return correct status', () => {
            expect(getStatusByCode('')).toBe('Unmodified');
            expect(getStatusByCode('A')).toBe('Added');
            expect(getStatusByCode('D')).toBe('Deleted');
            expect(getStatusByCode('R')).toBe('Renamed');
            expect(getStatusByCode('C')).toBe('Copied');
            expect(getStatusByCode('U')).toBe('Unmerged');
            expect(getStatusByCode('?')).toBe('Untracked');
            expect(getStatusByCode('!')).toBe('Ignored');
        });
    });

    describe('getList()', () => {
        it('should return the list of indexed files', () => {
            expect(getList(dirtyStatus.files)).toEqual([
                {
                    area: 1,
                    entityIndex: 1,
                    name: 'file1',
                    status: 'Modified',
                    type: 'file'
                },
                {
                    area: 1,
                    entityIndex: 2,
                    name: 'created-file',
                    status: 'Added',
                    type: 'file'
                },
                {
                    area: 1,
                    entityIndex: 3,
                    name: 'committed-file',
                    status: 'Added',
                    type: 'file'
                },
                {
                    area: 2,
                    entityIndex: 4,
                    name: 'committed-file',
                    status: 'Deleted',
                    type: 'file'
                },
                {
                    area: 2,
                    entityIndex: 5,
                    name: 'file2.ts',
                    status: 'Modified',
                    type: 'file'
                },
                {
                    area: 0,
                    entityIndex: 6,
                    name: 'not-added-file',
                    status: 'Untracked',
                    type: 'file'
                },
                {
                    area: 0,
                    entityIndex: 7,
                    name: 'another-modified-file.ts',
                    status: 'Untracked',
                    type: 'file'
                },
                {
                    area: 3,
                    entityIndex: 8,
                    name: 'conflict-file',
                    status: 'Both deleted',
                    type: 'file'
                },
                {
                    area: 3,
                    entityIndex: 9,
                    name: 'conflict-file',
                    status: '',
                    type: 'file'
                },
                {
                    area: 3,
                    entityIndex: 10,
                    name: 'conflict-file',
                    status: 'Deleted by them',
                    type: 'file'
                },
                {
                    area: 3,
                    entityIndex: 11,
                    name: 'conflict-file',
                    status: 'Added by them',
                    type: 'file'
                },
                {
                    area: 3,
                    entityIndex: 12,
                    name: 'conflict-file',
                    status: 'Added by us',
                    type: 'file'
                },
                {
                    area: 3,
                    entityIndex: 13,
                    name: 'conflict-file',
                    status: 'Both added',
                    type: 'file'
                },
                {
                    area: 3,
                    entityIndex: 14,
                    name: 'conflict-file',
                    status: 'Both modified',
                    type: 'file'
                }
            ]);
            expect(getList(cleanStatus.files)).toEqual([]);
        });
    });
});
