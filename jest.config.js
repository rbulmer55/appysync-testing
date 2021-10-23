module.exports = {
  preset: "ts-jest",
  testPathIgnorePatterns: ["node_modules/", "lib/"],
  transformIgnorePatterns: ["^.+\\.js$"],
  testMatch: ["**/__tests__/**/*.ts?(x)", "**/?(*.)+(spec|test|steps).ts?(x)"],
};
