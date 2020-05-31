import indexArgsTransformer from '@/shared/index-args-transformer';
import { GitIndexedEntity, GitEntityType } from '@/shared/types';

const indexedEntities: GitIndexedEntity[] = [
    {
        entityIndex: 1,
        name: 'Entity 1',
        type: GitEntityType.Branch
    },
    {
        entityIndex: 2,
        name: 'Entity 2',
        type: GitEntityType.Branch
    },
    {
        entityIndex: 3,
        name: 'Entity 3',
        type: GitEntityType.Branch
    },
    {
        entityIndex: 4,
        name: 'Entity 4',
        type: GitEntityType.Branch
    }
];

describe('Index arguments transformer', () => {
    it('should transform index argumenets into entity names', () => {
        expect(indexArgsTransformer(undefined, indexedEntities)).toEqual([]);
        expect(indexArgsTransformer(null, indexedEntities)).toEqual([]);
        expect(indexArgsTransformer([], indexedEntities)).toEqual([]);
        expect(
            indexArgsTransformer(['-a', '--foo', '-2'], indexedEntities)
        ).toEqual(['-a', '--foo', '-2']);
        expect(indexArgsTransformer(['1', '2'], indexedEntities)).toEqual([
            'Entity 1',
            'Entity 2'
        ]);
        expect(
            indexArgsTransformer(['-a', '1', '--foo', '2'], indexedEntities)
        ).toEqual(['-a', 'Entity 1', '--foo', 'Entity 2']);
        expect(indexArgsTransformer(['1', '2-4'], indexedEntities)).toEqual([
            'Entity 1',
            'Entity 2',
            'Entity 3',
            'Entity 4'
        ]);
    });
});
