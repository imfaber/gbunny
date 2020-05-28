import status from './status';
import commit from './commit';
import branch from './branch';
import checkout from './checkout';
import add from './add';
import { runGitCmd } from './common/run-cmd';

export const commands = {
    // Add
    add: (opts: string[]) => add(opts),
    a: (opts: string[]) => add(opts),
    aa: (opts: string[]) => add(['-A', ...opts]),
    au: (opts: string[]) => add(['-u', ...opts]),

    // Blame
    bl: (opts: string[]) => runGitCmd(['blame', ...opts]),

    // Branch
    branch: (opts: string[]) => branch(opts),
    b: (opts: string[]) => branch(opts),
    ba: (opts: string[]) => branch(['-a', ...opts]),
    bd: (opts: string[]) => branch(['-d', ...opts]),
    bD: (opts: string[]) => branch(['-D', ...opts]),

    // Clean
    cl: (opts: string[]) => runGitCmd(['clean', ...opts]),
    clf: (opts: string[]) => runGitCmd(['clean -fd', ...opts]),

    // Checkout
    checkout: (opts: string[]) => checkout(opts),
    co: (opts: string[]) => checkout(opts),
    cob: (opts: string[]) => checkout(['-b', ...opts]),

    // Commit
    commit: (opts: string[]) => commit(opts),
    c: (opts: string[]) => commit(opts),
    ca: (opts: string[]) => commit(['-a', ...opts]),
    ch: (opts: string[]) => commit(['-C HEAD', ...opts]),
    cm: (opts: string[]) => commit(['--amend', ...opts]),
    cmh: (opts: string[]) => commit(['--amend -C HEAD', ...opts]),

    // Diff
    d: (opts: string[]) => runGitCmd(['diff --', ...opts]),
    dw: (opts: string[]) => runGitCmd(['diff --word-diff', ...opts]),
    dt: (opts: string[]) => runGitCmd(['difftool', ...opts]),
    dc: (opts: string[]) => runGitCmd(['diff --cached --', ...opts]),

    // Fetch
    f: (opts: string[]) => runGitCmd(['fetch', ...opts]),
    fa: (opts: string[]) => runGitCmd(['fetch --all', ...opts]),

    // Log
    l: (opts: string[]) =>
        runGitCmd([
            'log',
            '--graph',
            '--pretty="format:%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset"',
            '--abbrev-commit',
            ...opts
        ]),

    // Merge
    m: (opts: string[]) => runGitCmd(['merge', ...opts]),
    mff: (opts: string[]) => runGitCmd(['merge --ff', ...opts]),
    mnff: (opts: string[]) => runGitCmd(['merge --no-ff', ...opts]),

    // Pull
    pl: (opts: string[]) => runGitCmd(['pull', ...opts]),

    // Push
    ps: (opts: string[]) => runGitCmd(['push', ...opts]),
    psf: (opts: string[]) => runGitCmd(['push -f', ...opts]),

    // Remote
    r: (opts: string[]) => runGitCmd(['remote -v', ...opts]),

    // Rebase
    rb: (opts: string[]) => runGitCmd(['rebase', ...opts]),
    rba: (opts: string[]) => runGitCmd(['rebase --abort', ...opts]),
    rbc: (opts: string[]) => runGitCmd(['rebase --continue', ...opts]),

    // Remove
    rm: (opts: string[]) => runGitCmd(['rm', ...opts]),

    // Reset
    rs: (opts: string[]) => runGitCmd(['reset --', ...opts]),
    rsh: (opts: string[]) => runGitCmd(['reset --hard', ...opts]),
    rsH: (opts: string[]) => runGitCmd(['reset HEAD~', ...opts]),

    // show
    sh: (opts: string[]) => runGitCmd(['show', ...opts]),
    shm: (opts: string[]) => runGitCmd(['show --summary', ...opts]),

    // Status
    status: (opts: string[]) => status(opts),
    s: (opts: string[]) => status(opts),

    // Stash
    st: (opts: string[]) => runGitCmd(['stash', ...opts]),
    sta: (opts: string[]) => runGitCmd(['stash apply', ...opts]),
    stp: (opts: string[]) => runGitCmd(['stash pop', ...opts]),
    stl: (opts: string[]) => runGitCmd(['stash list', ...opts]),

    // Tag
    t: (opts: string[]) => runGitCmd(['tag', ...opts])
} as any;

export const exitCommands = ['exit', 'quit', 'q'];
