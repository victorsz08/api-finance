const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
    testMatch: ["**/__test__/**/*.ts?(x)", "**/?(*.)+(spec|test).ts?(x)"],
    testEnvironment: "node",
    preset: "ts-jest",
    transform: {
        ...tsJestTransformCfg,
    },
};
