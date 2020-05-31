import status from './status';
import commit from './commit';
import branch from './branch';
import checkout from './checkout';
import tag from './tag';
import add from './add';
import merge from './merge';
import gbHelp from './help';
import { runGitCmd } from './shared/run-cmd';
import { GBunnyCommand } from './shared/types';

const gbCmd = (
    run: () => Promise<void> | void,
    help: string = ''
): GBunnyCommand =>
    ({
        run: () => run(),
        help: () => help
    } as GBunnyCommand);

export const gBunnyCommandList: {
    [key: string]: (opts?: string[]) => GBunnyCommand;
} = {
    // Add
    add: (opts: string[]) =>
        gbCmd(() => add(opts), 'Run add command with path selection'),
    a: (opts: string[]) => gbCmd(() => add(opts), 'Shorthand for "add"'),
    aa: (opts: string[]) =>
        gbCmd(() => add(['-A', ...opts]), 'Shorthand for "add -A"'),
    au: (opts: string[]) =>
        gbCmd(() => add(['-u', ...opts]), 'Shorthand for "add -u"\n'),

    // Blame
    blame: (opts: string[]) => gbCmd(() => runGitCmd(['blame', ...opts])),
    bl: (opts: string[]) =>
        gbCmd(() => runGitCmd(['blame', ...opts]), 'Shorthand for "blame"\n'),

    // Branch
    branch: (opts: string[]) =>
        gbCmd(
            () => branch(opts),
            'Run branch command and show indexed branches'
        ),
    b: (opts: string[]) => gbCmd(() => branch(opts), 'Shorthand for "branch"'),
    ba: (opts: string[]) =>
        gbCmd(() => branch(['-a', ...opts]), 'Shorthand for "branch -a"'),
    bd: (opts: string[]) =>
        gbCmd(
            () => branch(['-d', ...opts]),
            'Shorthand for "branch -d" with branch selection'
        ),
    bD: (opts: string[]) =>
        gbCmd(
            () => branch(['-D', ...opts]),
            'Shorthand for "branch -D" with branch selection\n'
        ),

    // Clean
    clean: (opts: string[]) => gbCmd(() => runGitCmd(['clean', ...opts])),
    cl: (opts: string[]) =>
        gbCmd(() => runGitCmd(['clean', ...opts]), 'Shorthand for "clean"'),
    clf: (opts: string[]) =>
        gbCmd(
            () => runGitCmd(['clean -fd', ...opts]),
            'Shorthand for "clean -df"\n'
        ),

    // Checkout
    checkout: (opts: string[]) =>
        gbCmd(
            () => checkout(opts),
            'Run checkout command with entity selection'
        ),
    co: (opts: string[]) =>
        gbCmd(() => checkout(opts), 'Shorthand for "checkout"'),
    cob: (opts: string[]) =>
        gbCmd(() => checkout(['-b', ...opts]), 'Shorthand for "checkout -b"'),
    com: (opts: string[]) =>
        gbCmd(
            () => checkout(['master', ...opts]),
            'Shorthand for "checkout master"\n'
        ),

    // Commit
    commit: (opts: string[]) =>
        gbCmd(() => commit(opts), 'Run commit command with message prompt'),
    c: (opts: string[]) => gbCmd(() => commit(opts), 'Shorthand for "commit"'),
    ca: (opts: string[]) =>
        gbCmd(() => commit(['-a', ...opts]), 'Shorthand for "commit -a"'),
    ch: (opts: string[]) =>
        gbCmd(
            () => commit(['-C HEAD', ...opts]),
            'Shorthand for "commit -C HEAD"'
        ),
    cm: (opts: string[]) =>
        gbCmd(
            () => commit(['--amend', ...opts]),
            'Shorthand for "commit --amend"'
        ),
    cmh: (opts: string[]) =>
        gbCmd(
            () => commit(['--amend -C HEAD', ...opts]),
            'Shorthand for "commit --amend -C HEAD"\n'
        ),

    // Diff
    diff: (opts: string[]) => gbCmd(() => runGitCmd(['diff --', ...opts])),
    d: (opts: string[]) =>
        gbCmd(() => runGitCmd(['diff --', ...opts]), 'Shorthand for "diff --"'),
    dw: (opts: string[]) =>
        gbCmd(
            () => runGitCmd(['diff --word-diff', ...opts]),
            'Shorthand for "diff --word-diff"'
        ),
    dt: (opts: string[]) =>
        gbCmd(
            () => runGitCmd(['difftool', ...opts]),
            'Shorthand for "difftool"'
        ),
    dc: (opts: string[]) =>
        gbCmd(
            () => runGitCmd(['diff --cached --', ...opts]),
            'Shorthand for "diff --cached --"\n'
        ),

    // Fetch
    fetch: (opts: string[]) => gbCmd(() => runGitCmd(['fetch', ...opts]), ''),
    f: (opts: string[]) =>
        gbCmd(() => runGitCmd(['fetch', ...opts]), 'Shorthand for "fetch"'),
    fa: (opts: string[]) =>
        gbCmd(
            () => runGitCmd(['fetch --all', ...opts]),
            'Shorthand for "fetch --all"\n'
        ),

    // gBunny Help
    h: () => gbCmd(() => gbHelp()),

    // Log
    log: (opts: string[]) => gbCmd(() => runGitCmd(['log'])),
    l: (opts: string[]) =>
        gbCmd(() => runGitCmd(['log']), 'Shorthand for "log"'),
    lg: (opts: string[]) =>
        gbCmd(
            () =>
                runGitCmd([
                    'log',
                    '--graph',
                    '--pretty="format:%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset"',
                    '--abbrev-commit',
                    ...opts
                ]),
            'Shorthand for "log --graph" with pretty format\n'
        ),

    // Merge
    merge: (opts: string[]) =>
        gbCmd(
            () => merge([...opts]),
            'Run merge command with branch selection'
        ),
    m: (opts: string[]) =>
        gbCmd(() => merge([...opts]), 'Shorthand for "branch"'),
    mff: (opts: string[]) =>
        gbCmd(() => merge(['--ff', ...opts]), 'Shorthand for "branch --ff"'),
    mnff: (opts: string[]) =>
        gbCmd(
            () => merge(['--no-ff', ...opts]),
            'Shorthand for "branch --no-ff"\n'
        ),

    // Pull
    pull: (opts: string[]) => gbCmd(() => runGitCmd(['pull', ...opts])),
    pl: (opts: string[]) =>
        gbCmd(() => runGitCmd(['pull', ...opts]), 'Shorthand for "pull"\n'),

    // Push
    push: (opts: string[]) => gbCmd(() => runGitCmd(['push', ...opts])),
    ps: (opts: string[]) =>
        gbCmd(() => runGitCmd(['push', ...opts]), 'Shorthand for "push"'),
    psf: (opts: string[]) =>
        gbCmd(
            () => runGitCmd(['push -f', ...opts]),
            'Shorthand for "push -f"\n'
        ),

    // Remote
    remote: (opts: string[]) => gbCmd(() => runGitCmd(['remote -v', ...opts])),
    r: (opts: string[]) =>
        gbCmd(
            () => runGitCmd(['remote -v', ...opts]),
            'Shorthand for "remote"\n'
        ),

    // Rebase
    rebase: (opts: string[]) => gbCmd(() => runGitCmd(['rebase', ...opts])),
    rb: (opts: string[]) =>
        gbCmd(() => runGitCmd(['rebase', ...opts]), 'Shorthand for "rebase"'),
    rba: (opts: string[]) =>
        gbCmd(
            () => runGitCmd(['rebase --abort', ...opts]),
            'Shorthand for "rebase --abort"'
        ),
    rbc: (opts: string[]) =>
        gbCmd(
            () => runGitCmd(['rebase --continue', ...opts]),
            'Shorthand for "rebase --continue"\n'
        ),

    // Remove
    rm: (opts: string[]) => gbCmd(() => runGitCmd(['rm', ...opts])),

    // Reset
    reset: (opts: string[]) =>
        gbCmd(
            () => runGitCmd(['reset --', ...opts]),
            'Run reset command with path selection'
        ),
    rs: (opts: string[]) =>
        gbCmd(
            () => runGitCmd(['reset --', ...opts]),
            'Shorthand for "reset --"'
        ),
    rsh: (opts: string[]) =>
        gbCmd(
            () => runGitCmd(['reset --hard', ...opts]),
            'Shorthand for "reset --hard"'
        ),
    rsH: (opts: string[]) =>
        gbCmd(
            () => runGitCmd(['reset HEAD~', ...opts]),
            'Shorthand for "reset HEAD~"\n'
        ),

    // show
    show: (opts: string[]) => gbCmd(() => runGitCmd(['show', ...opts])),
    sh: (opts: string[]) =>
        gbCmd(() => runGitCmd(['show', ...opts]), 'Shorthand for "show"'),
    shm: (opts: string[]) =>
        gbCmd(
            () => runGitCmd(['show --summary', ...opts]),
            'Shorthand for "show --summary"\n'
        ),

    // Status
    status: (opts: string[]) =>
        gbCmd(() => status(opts), 'Run status command and show indexed paths'),
    s: (opts: string[]) =>
        gbCmd(() => status(opts), 'Shorthand for "status"\n'),

    // Stash
    stash: (opts: string[]) => gbCmd(() => runGitCmd(['stash', ...opts])),
    st: (opts: string[]) =>
        gbCmd(() => runGitCmd(['stash', ...opts]), 'Shorthand for "stash"'),
    sta: (opts: string[]) =>
        gbCmd(
            () => runGitCmd(['stash apply', ...opts]),
            'Shorthand for "stash"'
        ),
    stp: (opts: string[]) =>
        gbCmd(() => runGitCmd(['stash pop', ...opts]), 'Shorthand for "stash"'),
    stl: (opts: string[]) =>
        gbCmd(
            () => runGitCmd(['stash list', ...opts]),
            'Shorthand for "stash"\n'
        ),

    // Tag
    tag: (opts: string[]) =>
        gbCmd(() => tag(opts), 'Run tag command and show indexed tags'),
    t: (opts: string[]) => gbCmd(() => tag(opts), 'Shorthand for "tag"'),
    td: (opts: string[]) =>
        gbCmd(() => tag(['-d', ...opts]), 'Shorthand for "tag"\n')
} as any;

export const exitCommands = ['exit', 'quit', 'q'];
