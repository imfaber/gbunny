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

export enum StatusKey {
    Unknown = '',
    Added = 'A',
    Modified = 'M',
    Deleted = 'D',
    Untracked = '?'
}

export interface FileStatus {
    path: string;
    status: keyof typeof StatusKey;
    statusKey: StatusKey;
    index?: number;
}

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
    index: number;
    [key: string]: any;
}
export interface GitIndexedEntityList {
    list: GitIndexedEntity[];
    prompt: () => void;
}
