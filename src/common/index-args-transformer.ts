import parseRange from 'parse-numeric-range';
import flatten from 'lodash.flatten';
import { GitIndexedEntity } from './types';

export default function (
    args: string[],
    indexedEntites: GitIndexedEntity[]
): string[] {
    const newArgs: any[] = [...args];

    args.forEach((arg, i) => {
        if (/^\d+-\d+$/.test(arg) || /^\d+$/.test(arg)) {
            const transformedIndexes = parseRange(arg).map((index) => {
                const indexedEntity = indexedEntites.filter(
                    (e) => e.index === index
                );

                return indexedEntity[0] ? indexedEntity[0].name : null;
            });
            newArgs[i] = transformedIndexes.filter((e) => e);
        }
    });

    return flatten(newArgs);
}
