import { SimpleGit } from 'simple-git/promise';
import { Chalk } from 'chalk';

export interface GBunny {
    git: SimpleGit;
    args?: string[];
}

export interface StatusHeaderArgs {
    branch?: string;
    tracking?: string | null;
    diverge?: string | null;
}

export interface PrintFilesArgs {
    title?: string;
    files: GitIndexedFile[];
    indexLength?: number;
    showIndex?: boolean;
    chalkColor?: Chalk;
}

export enum StatusCode {
    Unmodified = '',
    Added = 'A',
    Modified = 'M',
    Deleted = 'D',
    Renamed = 'R',
    Copied = 'C',
    Unmerged = 'U',
    Untracked = '?',
    Ignored = '!'
}

export type Status = keyof typeof StatusCode;

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
    args: string[] | undefined;
    setGitIndexedEntityType: (indexType: GitEntityType) => void;
    indexedEntityList: GitIndexedEntity[];
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

export interface GitIndexedFile extends GitIndexedEntity {
    status: string;
    area: GitArea;
}

export enum GitArea {
    Untracked,
    Stage,
    WorkTree,
    Unmerged
}

export interface GitIndexedEntityList {
    list: GitIndexedEntity[];
    printEntities: () => void;
}
