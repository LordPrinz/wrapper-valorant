module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    setupFiles: ["./src/setup-tests.ts"],
    modulePathIgnorePatterns: ["<rootDir>/lib/", "<rootDir>/node_modules"],
};