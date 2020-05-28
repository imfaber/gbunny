#!/usr/bin/env node

import createGitCommand from './common/git-command-factory';
import selectEntity from './common/select-entity';
import { GitEntityType, EntitySelectorChoice } from './common/types';
import isRepl from './common/is-repl';
import print from './common/print';

export const run = async (cmdArgs?: string[]) => {
    const cmd = await createGitCommand(cmdArgs);
    const { args } = cmd;

    if (!cmd.canRun) return;

    if (args) {
        await cmd.run('add');
        return;
    }

    await cmd.setActiveGitIndexedEntity(GitEntityType.File);
    const indexedCollection = cmd.getActiveEntityCollection();
    const { list } = indexedCollection;

    if (list.length === 0) {
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
        await cmd.run('add', [...selectedFiles]);
    } else {
        print('No file was selected.', true);
    }
};

if (!isRepl()) run();

export default run;
