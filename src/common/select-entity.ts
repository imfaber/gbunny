import inquirer from 'inquirer';
import Separator from 'inquirer/lib/objects/separator';
import chalk from 'chalk';
import { EntitySelectorChoice } from './types';
import { pointerRightTall } from './symbols';
import { grey } from './hex-colors';
import print from './print';

export default async (
    label: string,
    choices: (EntitySelectorChoice | string | Separator)[],
    singleChoice: boolean = true
): Promise<string[]> => {
    print('', true);

    const { selection } = await inquirer.prompt({
        type: singleChoice ? 'list' : 'checkbox',
        name: 'selection',
        message: chalk.hex(grey)(label),
        prefix: chalk.hex(grey)(pointerRightTall),
        suffix: '',
        choices: [
            ...choices,
            choices.length > 15 ? new inquirer.Separator() : ''
        ].filter((e) => e),
        pageSize: 15
    });

    return singleChoice ? [selection] : selection;
};
