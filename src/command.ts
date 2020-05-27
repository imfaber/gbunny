import status from './status';
import commit from './commit';
import branch from './branch';
import checkout from './checkout';

export const commands = {
    // Status
    status: (opts: string[]) => status(opts),
    st: (opts: string[]) => status(opts),
    s: (opts: string[]) => status(opts),

    // Branch
    branch: (opts: string[]) => branch(opts),
    b: (opts: string[]) => branch(opts),
    ba: () => branch(['-a']),

    // Commit
    commit: (opts: string[]) => commit(opts),
    c: (opts: string[]) => commit(opts),
    ca: () => commit(['-a']),

    // Checkout
    checkout: (opts: string[]) => checkout(opts),
    co: (opts: string[]) => checkout(opts)
} as any;

export const exitCommands = ['exit', 'quit', 'q'];
