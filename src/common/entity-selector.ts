import inquirer from 'inquirer';
import Separator from 'inquirer/lib/objects/separator';
import chalk from 'chalk';
import { GitIndexedEntity } from './types';
import { pointerRightTall } from './symbols';
import { grey, greyLight } from './hex-colors';

export default async (
    list: GitIndexedEntity[],
    question: string,
    singleChoice: boolean = true
) => {
    const choices: { name: string; value: string }[] | Separator[] = list.map(
        (e) => {
            const color = e.name.startsWith('remotes/')
                ? chalk.red
                : chalk.hex(greyLight);

            return {
                name: `[${e.entityIndex}] ${e.name}`,
                value: e.name
            };
        }
    );

    const { selection } = await inquirer.prompt({
        type: 'list',
        name: 'selection',
        message: chalk.hex(grey)(question),
        prefix: chalk.hex(grey)(pointerRightTall),
        suffix: '',
        choices: [
            ...choices,
            choices.length > 15 ? new inquirer.Separator() : ''
        ].filter((e) => e),
        pageSize: 15,
        filter(input) {
            console.log(input);
            return input.toLowerCase();
        }
    });
};
