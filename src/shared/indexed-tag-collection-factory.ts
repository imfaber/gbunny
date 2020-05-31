import chalk from 'chalk';
import print from './print';
import {
    GitIndexedEntityCollection,
    GitIndexedEntity,
    GitBranch,
    GitEntityType
} from './types';
import { pointerRight } from './symbols';
import hexColors from './hex-colors';

export const getList = (tags: string[]): GitIndexedEntity[] => {
    return tags.map((t: string, i) => ({
        name: t,
        entityIndex: i + 1,
        type: GitEntityType.Tag
    }));
};

export const printEntities = (list: GitIndexedEntity[]) => {
    print();

    list.forEach((t) => {
        const index = chalk.hex(hexColors.greyLight)(`[${t.entityIndex}]`);
        print(`${index} ${t.name}`);
    });

    print();
};

export default (tags: string[]): GitIndexedEntityCollection => {
    const _list = getList(tags);

    return {
        list: _list,
        printEntities: () => printEntities(_list)
    };
};
