module.exports = {
    client: {
        addTypename: true,
        includes: ["src/**/*.ts", "src/**/*.tsx"],
        excludes: ["**/__tests__/**", "**/*.d.ts"],
        name: "dashboard",
        service: {
            localSchemaFile: "schema.graphql",
            name: "saleor",
        },
    },
};
