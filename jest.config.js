module.exports = {
    collectCoverageFrom: ['src/**/*.ts'],
    watchPathIgnorePatterns: ['/node_modules/', '/dist/', '/.git/'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
    rootDir: __dirname,
    testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)']
};
