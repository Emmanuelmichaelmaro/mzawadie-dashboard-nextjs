module.exports = {
    client: {
        addTypename: true,
        includes: ["src/**/*.ts", "src/**/*.tsx"],
        excludes: ["**/__tests__/**", "**/*.d.ts", "**/graphql/**"],
        name: "dashboard",
        service: {
            localSchemaFile: ["schema.graphql", "src/client-schema-extensions.graphql"],
            name: "mzawadie",
        },
    },
};
