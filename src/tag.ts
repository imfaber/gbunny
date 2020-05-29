#!/usr/bin/env node

import Separator from 'inquirer/lib/objects/separator';
import { gitCommand as createGitCommand } from './common/git-command-factory';
import { GitEntityType, EntitySelectorChoice } from './common/types';
import hasAllArgument from './common/has-all-argument';
import isRepl from './common/is-repl';
import selectEntity from './common/select-entity';
import print from './common/print';

export const run = async (cmdArgs?: string[]) => {
    const cmd = await createGitCommand('tag', cmdArgs);
    const { args } = cmd;

    if (!cmd.canRun) return;

    await cmd.setActiveGitEntityType(GitEntityType.Tag);

    const indexedCollection = await cmd.getActiveEntityCollection();
    const { list } = indexedCollection;

    if (list.length === 0) {
        print('There are no tags.', true);
        return;
    }

    console.log( args);

    if (!args) {
        indexedCollection.printEntities(list);
        return;
    }

    if (
        args.length === 1 &&
        (args.includes('-d') || args.includes('--delete'))
    ) {
        const choices: EntitySelectorChoice[] = list.map((e) => ({
            name: `[${e.entityIndex}] ${e.name}`,
            value: e.name
        }));

        const selectedTags = await selectEntity(
            'Select the tags to delete:',
            choices,
            false
        );

        if (selectedTags.length > 0) {
            await cmd.run([...selectedTags]);
        } else {
            print('No tag was selected.', true);
        }

        return;
    }

    await cmd.run();
};

if (!isRepl()) run();

export default run;
