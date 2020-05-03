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
