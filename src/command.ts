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
    ba: () => branch(['-a']),
    bd: (opts: string[]) => branch(['-d', ...opts]),
    bD: (opts: string[]) => branch(['-D', ...opts]),

    // Commit
    commit: (opts: string[]) => commit(opts),
    c: (opts: string[]) => commit(opts),
    ca: () => commit(['-a']),
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
    aa: () => add(['-A']),
    au: () => add(['-u']),

    // Stash
    st: (opts: string[]) => runCmd('git', ['stash', ...opts]),
    sta: (opts: string[]) => runCmd('git', ['stash', 'apply', ...opts]),
    stp: (opts: string[]) => runCmd('git', ['stash', 'pop', ...opts]),
    stl: (opts: string[]) => runCmd('git', ['stash', 'list', ...opts]),

    // Blame
    bl: () => runCmd('git', ['blame']),

    // Clean
    cl: () => runCmd('git', ['clean']),
    clf: () => runCmd('git', ['clean', '-fd'])
} as any;

export const exitCommands = ['exit', 'quit', 'q'];
