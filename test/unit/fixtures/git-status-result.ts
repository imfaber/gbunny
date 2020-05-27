import { StatusResult } from 'simple-git/typings/response.d';

export const cleanStatus: StatusResult = {
    not_added: [],
    conflicted: [],
    created: [],
    deleted: [],
    modified: [],
    renamed: [],
    files: [],
    staged: [],
    ahead: 0,
    behind: 0,
    current: 'master',
    tracking: 'origin/master',
    isClean: () => true
};

export const dirtyStatus: StatusResult = {
    not_added: ['not-added-file'],
    conflicted: [],
    created: ['created-file'],
    deleted: [],
    modified: ['file1', 'file2.ts'],
    renamed: [],
    files: [
        { path: 'file1', index: 'M', working_dir: ' ' },
        { path: 'created-file', index: 'A', working_dir: ' ' },
        { path: 'committed-file', index: 'A', working_dir: 'D' },
        { path: 'file2.ts', index: ' ', working_dir: 'M' },
        { path: 'not-added-file', index: '?', working_dir: '?' },
        { path: 'conflict-file', index: 'D', working_dir: 'D' },
        { path: 'conflict-file', index: 'A', working_dir: 'U' },
        { path: 'conflict-file', index: 'U', working_dir: 'D' },
        { path: 'conflict-file', index: 'U', working_dir: 'A' },
        { path: 'conflict-file', index: 'D', working_dir: 'U' },
        { path: 'conflict-file', index: 'A', working_dir: 'A' },
        { path: 'conflict-file', index: 'U', working_dir: 'U' },
        {
            path: 'another-modified-file.ts',
            index: '?',
            working_dir: '?'
        }
    ],
    staged: ['file1'],
    ahead: 1,
    behind: 1,
    current: 'feature/my-feature',
    tracking: 'origin/feature/my-feature',
    isClean: () => false
};
