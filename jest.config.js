module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    moduleFileExtensions: ["js", "ts"],
    testMatch: ["**/__tests__/**/*.(test|spec).ts"],
    globals: {
      expect: true,
    },
  };