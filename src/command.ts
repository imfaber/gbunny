import status from './status';
import commit from './commit';
import branch from './branch';

export const commands = {
    status: () => status(),
    st: () => status(),
    s: () => status(),
    branch: () => branch(),
    b: (opts?: string[]) => branch(opts),
    ba: () => branch(['-a']),
    commit: () => commit(),
    c: () => commit(),
    ca: () => commit(['-a'])
} as any;

export const exitCommands = ['exit', 'quit', 'q'];
