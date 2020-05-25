export default (cmd: string): boolean => {
    // @TODO FInd better way to determine if the command support
    // the --color option
    const coloredCommands = ['log', 'diff'];

    return coloredCommands.includes(cmd);
};
