import createIndexedTagList from '@/common/indexed-tag-collection-factory';

const tags: string[] = ['tag1', 'tag2', 'tag3'];

const indexedTagList = createIndexedTagList(tags);

describe('Indexed tag list', () => {
    describe('getList()', () => {
        it('should return an array of indexed tags', async () => {
            expect(indexedTagList.list).toEqual([
                {
                    entityIndex: 1,
                    name: 'tag1',
                    type: 'tag'
                },
                {
                    entityIndex: 2,
                    name: 'tag2',
                    type: 'tag'
                },
                {
                    entityIndex: 3,
                    name: 'tag3',
                    type: 'tag'
                }
            ]);
        });
    });
});
