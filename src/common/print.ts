import { Chalk } from 'chalk';

export default function (
    msg?: string | Chalk,
    emptyNewLine: boolean = false
): void {
    const { log } = console;

    if (msg) {
        log(msg);
    }

    if (emptyNewLine) {
        log();
    }
}
