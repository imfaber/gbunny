import { SimpleGit } from 'simple-git/promise';

export interface GBunny {
    git: SimpleGit;
    args?: string[];
}

export interface StatusHeaderArgs {
    branch?: string;
    tracking?: string | null;
    diverge?: string | null;
}

export enum StatusCode {
    Unmodified = '',
    Added = 'A',
    Modified = 'M',
    Deleted = 'D',
    Renamed = 'R',
    Copied = 'R',
    Unmerged = 'U',
    Untracked = '?',
    Ignored = '!'
}

// export interface FileStatus {
//     path: string;
//     status: keyof typeof StatusCode;
//     statusCode: StatusCode;
//     index?: number;
// }

export interface Colors {
    white: string;
    black: string;
    red: string;
    green: string;
    yellow: string;
    magenta: string;
    cyan: string;
    blue: string;
    grey: string;
}

export type Color = keyof Colors;

export interface GitCommand {
    git: SimpleGit;
    canRun: boolean;
    args: string[] | null;
    run?: () => void;
}

export enum GitEntityType {
    File = 'file',
    Branch = 'branch'
}

export interface GitEntity {
    name: string;
    type: GitEntityType;
}

export interface GitBranch {
    name: string;
    current: boolean;
    commit?: string;
    label?: string;
}

export interface GitIndexedEntity extends GitEntity {
    entityIndex: number;
    [key: string]: any;
}

export interface GitIndexedEntityList {
    list: GitIndexedEntity[];
    prompt: () => void;
}
