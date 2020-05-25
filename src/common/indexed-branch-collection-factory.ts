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

export const getList = (branches: {
    [name: string]: GitBranch;
}): GitIndexedEntity[] => {
    const list: GitIndexedEntity[] = [];

    Object.keys(branches).forEach((b: string, i) => {
        list.push({
            entityIndex: i + 1,
            type: GitEntityType.Branch,
            isLocal: branches[b].name.startsWith('remotes/'),
            ...branches[b]
        });
    });

    return list;
};

export const printEntities = (list: GitIndexedEntity[]) => {
    print('', true);

    list.forEach((b) => {
        const isCurrent = b.current;
        const index = chalk.hex(hexColors.greyLight)(`[${b.entityIndex}]`);
        const currentMarker = isCurrent ? chalk.green(pointerRight) : ' ';
        let branch: string;

        if (b.name.startsWith('remotes/')) {
            branch = chalk.red(b.name);
        } else {
            branch = isCurrent
                ? chalk.green(b.name)
                : chalk.hex(hexColors.greyLight)(b.name);
        }

        print(`${currentMarker} ${index} ${branch}`);
    });

    print('', true);
};

export default (branches: {
    [name: string]: GitBranch;
}): GitIndexedEntityCollection => {
    const _list = getList(branches);

    return {
        list: _list,
        printEntities: (list?: GitIndexedEntity[]) =>
            printEntities(list || _list)
    };
};
