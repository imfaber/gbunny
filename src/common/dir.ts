import fs from 'fs';
import path from 'path';

export default {
    getCurrentDirectoryBase: (): string => {
        return path.basename(process.cwd());
    },

    directoryExists: (filePath: string): boolean => {
        return fs.existsSync(filePath);
    },
};
