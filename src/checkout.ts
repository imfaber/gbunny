#!/usr/bin/env node

import Separator from 'inquirer/lib/objects/separator';
import createGitCommand from './common/git-command-factory';
import selectEntity from './common/select-entity';
import {
    GitEntityType,
    GitIndexedEntity,
    EntitySelectorChoice
} from './common/types';
import isRepl from './common/is-repl';

export const run = async (cmdArgs?: string[]) => {
    const cmd = await createGitCommand(cmdArgs);
    const { args } = cmd;

    if (!cmd.canRun) return;

    if (args) {
        await cmd.run('checkout');
        return;
    }

    const getIndexedList = async (
        type: GitEntityType
    ): Promise<GitIndexedEntity[]> => {
        await cmd.setActiveGitIndexedEntity(type);
        const indexedCollection = cmd.getActiveEntityCollection();
        const { list } = indexedCollection;
        return list;
    };

    const entityType = await selectEntity(
        'What do you want to checkout?',
        Object.keys(GitEntityType).map((x) => ({
            name: x,
            value: GitEntityType[x as keyof typeof GitEntityType]
        }))
    );

    if (entityType === GitEntityType.File) {
        const list = await getIndexedList(GitEntityType.File);
        const choices: EntitySelectorChoice[] = list.map((e) => ({
            name: `[${e.entityIndex}] ${e.name}`,
            value: e.name
        }));

        const selectedFiles = await selectEntity(
            'Select the files to checkout:',
            choices,
            false
        );

        await cmd.run('checkout', [...selectedFiles]);
    }

    if (entityType === GitEntityType.Branch) {
        const list = await getIndexedList(GitEntityType.Branch);
        const choices: (EntitySelectorChoice | Separator)[] = list.map((e) => ({
            name: `[${e.entityIndex}] ${e.name}`,
            value: e.name
        }));
        const index = list.findIndex((b) => b.name.startsWith('remotes/'));
        choices.splice(index, 0, new Separator());

        const selectedBranch = await selectEntity(
            'Select the branch to checkout:',
            choices
        );

        await cmd.run('checkout', [selectedBranch as string]);
    }
};

if (!isRepl()) run();

export default run;
