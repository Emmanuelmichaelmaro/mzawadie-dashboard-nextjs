module.exports = {
    collectCoverageFrom: ["**/*.{js,jsx,ts,tsx}", "!**/*.d.ts", "!**/node_modules/**"],
    moduleNameMapper: {
        /* Handle CSS imports (with CSS modules)
        https://jestjs.io/docs/webpack#mocking-css-modules */
        "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",

        // Handle CSS imports (without CSS modules)
        "^.+\\.(css|sass|scss)$": "<rootDir>/__mocks__/styleMock.js",

        /* Handle image imports
        https://jestjs.io/docs/webpack#handling-static-assets */
        "^.+\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/__mocks__/fileMock.js",

        "@assets(.*)$": "<rootDir>/public/assets/$1",
        "@locale(.*)$": "<rootDir>/locale/$1",
        "@mzawadie(?!.*macaw)(.*)$": "<rootDir>/src/$1",
        "@test/(.*)$": "<rootDir>/testUtils/$1",
        "^lodash-es(.*)$": "lodash/$1",
        "^@material-ui/core$": "<rootDir>/node_modules/@material-ui/core",
        "^@material-ui/icons$": "<rootDir>/node_modules/@material-ui/icons",
        "^@material-ui/styles$": "<rootDir>/node_modules/@material-ui/styles",
        "^react$": "<rootDir>/node_modules/react",
        "^react-dom$": "<rootDir>/node_modules/react-dom",
    },
    testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.next/"],
    testEnvironment: "jsdom",
    transform: {
        /* Use babel-jest to transpile tests with the next/babel preset
        https://jestjs.io/docs/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object */
        "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }],
    },
    transformIgnorePatterns: ["/.next/", "/node_modules/", "^.+\\.module\\.(css|sass|scss)$"],
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js", "<rootDir>/config/setupTests.js"],
    snapshotSerializers: ["enzyme-to-json/serializer"],
    watchPlugins: ["jest-watch-typeahead/filename", "jest-watch-typeahead/testname"],

    // https://github.com/zeit/next.js/issues/8663#issue-490553899
    globals: {
        // we must specify a custom tsconfig for tests because we need the typescript transform
        // to transform jsx into js rather than leaving it jsx such as the next build requires. you
        // can see this setting in tsconfig.jest.json -> "jsx": "react"
        "ts-jest": {
            tsConfig: "<rootDir>/tsconfig.jest.json",
        },
    },
};
