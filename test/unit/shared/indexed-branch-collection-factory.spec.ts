import createIndexedBranchList from '@/shared/indexed-branch-collection-factory';
import { GitBranch } from '@/shared/types';

const branches: {
    [name: string]: GitBranch;
} = {
    master: {
        current: true,
        name: 'master'
    },
    'branch-1': {
        current: false,
        name: 'branch-1'
    }
};

const indexedBranchList = createIndexedBranchList(branches);

describe('Indexed branch list', () => {
    describe('getList()', () => {
        it('should return an array of indexed branches', async () => {
            expect(indexedBranchList.list).toEqual([
                {
                    current: true,
                    entityIndex: 1,
                    isLocal: false,
                    name: 'master',
                    type: 'branch'
                },
                {
                    current: false,
                    entityIndex: 2,
                    isLocal: false,
                    name: 'branch-1',
                    type: 'branch'
                }
            ]);
        });
    });
});
