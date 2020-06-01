#!/usr/bin/env node

import { gitCommand as createGitCommand } from './shared/git-command-factory';
import { GitEntityType, EntitySelectorChoice } from './shared/types';
import isRepl from './shared/is-repl';
import selectEntity from './shared/select-entity';
import print from './shared/print';

export const run = async (cmdArgs?: string[]) => {
    const cmd = await createGitCommand('tag', cmdArgs);
    const { args } = cmd;

    if (!cmd.canRun) return;

    await cmd.setActiveGitEntityType(GitEntityType.Tag);

    const indexedCollection = await cmd.getActiveEntityCollection();
    const { list } = indexedCollection;

    if (list.length === 0) {
        print();
        print('There are no tags.', true);
        return;
    }

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

export default run;
