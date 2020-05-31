#!/usr/bin/env node

import createGitCommand from './shared/git-command-factory';
import selectEntity from './shared/select-entity';
import { GitEntityType, EntitySelectorChoice } from './shared/types';
import isRepl from './shared/is-repl';
import print from './shared/print';

export const run = async (cmdArgs?: string[]) => {
    const cmd = await createGitCommand('add', cmdArgs);
    const { args } = cmd;

    if (!cmd.canRun) return;

    await cmd.setActiveGitEntityType(GitEntityType.Path);

    if (args) {
        await cmd.run();
        return;
    }

    const indexedCollection = await cmd.getActiveEntityCollection();
    const { list } = indexedCollection;

    if (list.length === 0) {
        print();
        print('There are no changed files to add to stage.', true);
        return;
    }

    const choices: EntitySelectorChoice[] = list.map((e) => ({
        name: `[${e.entityIndex}] ${e.name}`,
        value: e.name
    }));

    const selectedFiles = await selectEntity(
        'Select the files to add to stage:',
        choices,
        false
    );

    if (selectedFiles.length > 0) {
        await cmd.run([...selectedFiles]);
    } else {
        print('No file was selected.', true);
    }
};

if (!isRepl()) run();

export default run;
