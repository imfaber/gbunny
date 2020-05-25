import status from './status';
import commit from './commit';
import branch from './branch';

export const commands = {
    status: (opts: string[]) => status(opts),
    st: (opts: string[]) => status(opts),
    s: (opts: string[]) => status(opts),
    branch: (opts: string[]) => branch(opts),
    b: (opts: string[]) => branch(opts),
    ba: () => branch(['-a']),
    commit: (opts: string[]) => commit(opts),
    c: (opts: string[]) => commit(opts),
    ca: () => commit(['-a'])
} as any;

export const exitCommands = ['exit', 'quit', 'q'];
