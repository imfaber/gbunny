import print from './shared/print';
import { gBunnyCommandList } from './command';

export const run = async () => {
    print();

    print('gBunny can be run using the following commands:');
    print('\tgbunny');
    print('\tgb');
    print('\tg', true);

    print('Usage: gbunny <command>|<git-command>', true);

    print('When no sub-commands are given a new REPL session is started.');
    print(
        'In REPL mode, sub-commands can be executed omitting the "gbunny" command.'
    );
    print(
        'i.e. "gbunny fetch" and "fetch" will produce the same result.',
        true
    );

    print(
        'Branches, paths and tags are indexed thus indexes can be used in commands.'
    );
    print(
        'Indexes can be seen using the commands "status", "branch" or "tag".\nWhen one those commands are run, the indexes specified afterwards will be translated into the associated entity.',
        true
    );

    print('Available Commands:');

    Object.keys(gBunnyCommandList).forEach((c) => {
        const help = gBunnyCommandList[c]().help();
        const cmdColWidth = 14;
        const helpIndentation = new Array(cmdColWidth - c.length);
        if (help) {
            print(`\t${c}${helpIndentation.join(' ')}${help}`);
        }
    });

    print();
};

export default run;
