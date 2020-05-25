import status from './status';
import commit from './commit';
import branch from './branch';

export const commands = {
    status: () => status(),
    st: () => status(),
    s: () => status(),
    branch: (opts?: string[]) => branch(opts),
    b: (opts?: string[]) => branch(opts),
    ba: () => branch(['-a']),
    commit: (opts?: string[]) => commit(opts),
    c: (opts?: string[]) => commit(opts),
    ca: () => commit(['-a'])
} as any;

export const exitCommands = ['exit', 'quit', 'q'];
