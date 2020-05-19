export default (args: string[] | undefined): boolean =>
    args !== undefined && (args.includes('-a') || args.includes('--all'));
