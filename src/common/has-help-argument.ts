export default (args: string[] | undefined): boolean =>
    args !== undefined && (args.includes('-h') || args.includes('--help'));
