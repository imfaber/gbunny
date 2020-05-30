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
import print from './common/print';

export const run = async (cmdArgs?: string[]) => {
    const cmd = await createGitCommand('checkout', cmdArgs);
    const { args } = cmd;

    if (!cmd.canRun) return;

    if (args) {
        await cmd.run();
        return;
    }

    const getIndexedList = async (
        type: GitEntityType
    ): Promise<GitIndexedEntity[]> => {
        await cmd.setActiveGitEntityType(type);
        const indexedCollection = await cmd.getActiveEntityCollection();
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

    const list = await getIndexedList(entityType as GitEntityType);

    const choices: (EntitySelectorChoice | Separator)[] = list.map((e) => ({
        name: `[${e.entityIndex}] ${e.name}`,
        value: e.name
    }));

    if (entityType === GitEntityType.Path) {
        if (list.length === 0) {
            print('There are no changed files to checkout.', true);
            return;
        }

        const selectedFiles = await selectEntity(
            'Select the files to checkout:',
            choices,
            false
        );

        if (selectedFiles.length > 0) {
            await cmd.run([...selectedFiles]);
        } else {
            print('No file was selected.', true);
        }
    }

    if (entityType === GitEntityType.Branch) {
        const index = list.findIndex((b) => b.name.startsWith('remotes/'));
        choices.splice(index, 0, new Separator());

        const selectedBranch = await selectEntity(
            'Select the branch to checkout:',
            choices
        );

        await cmd.run([selectedBranch as string]);
    }

    if (entityType === GitEntityType.Tag) {
        const selectedTag = await selectEntity(
            'Select the tag to checkout:',
            choices
        );

        await cmd.run([selectedTag as string]);
    }
};

if (!isRepl()) run();

export default run;
