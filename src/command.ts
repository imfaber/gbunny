import status from './status';
import commit from './commit';
import branch from './branch';
import checkout from './checkout';
import add from './add';
import runCmd from './common/run-cmd';

export const commands = {
    // Status
    status: (opts: string[]) => status(opts),
    s: (opts: string[]) => status(opts),

    // Branch
    branch: (opts: string[]) => branch(opts),
    b: (opts: string[]) => branch(opts),
    ba: (opts: string[]) => branch(['-a', ...opts]),
    bd: (opts: string[]) => branch(['-d', ...opts]),
    bD: (opts: string[]) => branch(['-D', ...opts]),

    // Commit
    commit: (opts: string[]) => commit(opts),
    c: (opts: string[]) => commit(opts),
    ca: (opts: string[]) => commit(['-a', ...opts]),
    ch: (opts: string[]) => commit(['-C', 'HEAD', ...opts]),
    cm: (opts: string[]) => commit(['--amend', ...opts]),
    cmh: (opts: string[]) => commit(['--amend', '-C', 'HEAD', ...opts]),

    // Checkout
    checkout: (opts: string[]) => checkout(opts),
    co: (opts: string[]) => checkout(opts),
    cob: (opts: string[]) => checkout(['-b', ...opts]),

    // Add
    add: (opts: string[]) => add(opts),
    a: (opts: string[]) => add(opts),
    aa: (opts: string[]) => add(['-A', ...opts]),
    au: (opts: string[]) => add(['-u', ...opts]),

    // Stash
    st: (opts: string[]) => runCmd('git', ['stash', ...opts]),
    sta: (opts: string[]) => runCmd('git', ['stash', 'apply', ...opts]),
    stp: (opts: string[]) => runCmd('git', ['stash', 'pop', ...opts]),
    stl: (opts: string[]) => runCmd('git', ['stash', 'list', ...opts]),

    // Blame
    bl: (opts: string[]) => runCmd('git', ['blame', ...opts]),

    // Push
    ps: (opts: string[]) => runCmd('git', ['push', ...opts]),

    // Pull
    pl: (opts: string[]) => runCmd('git', ['pull', ...opts]),

    // Clean
    cl: (opts: string[]) => runCmd('git', ['clean', ...opts]),
    clf: (opts: string[]) => runCmd('git', ['clean', '-fd', ...opts])
} as any;

export const exitCommands = ['exit', 'quit', 'q'];
