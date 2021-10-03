const path = require("path")

module.exports = {
    webpackFinal: async (baseConfig, options) => {
        // Modify or replace config. Mutating the original reference object can cause unexpected bugs.
        const { module = {} } = baseConfig;

        const newConfig = {
            ...baseConfig,
            module: {
                ...module,
                rules: [...(module.rules || [])]
            }
        };

        // TypeScript with Next.js
        newConfig.module.rules.push({
            test: /\.(ts|tsx)$/,
            include: [
                path.resolve(__dirname, '../src/components'),
                path.resolve(__dirname, '../src/stories')
            ],
            use: [
                {
                    loader: 'babel-loader',
                    options: {
                        presets: ['next/babel'],
                        plugins: ['react-docgen']
                    }
                }
            ]
        });

        newConfig.resolve.extensions.push('.ts', '.tsx');

        //
        // CSS Modules
        // Many thanks to https://github.com/storybookjs/storybook/issues/6055#issuecomment-521046352
        //

        // First we prevent webpack from using Storybook CSS rules to process CSS modules
        newConfig.module.rules.find(
            rule => rule.test.toString() === '/\\.css$/'
        ).exclude = /\.module\.css$/;

        // Then we tell webpack what to do with CSS modules
        newConfig.module.rules.push({
            test: /\.module\.(sc|sa|c)ss$/,
            include: path.resolve(__dirname, '../src/components'),
            use: [
                'style-loader',
                {
                    loader: 'css-loader',
                    options: {
                        importLoaders: 1,
                        modules: true
                    }
                },
                "sass-loader",
                {
                    loader: "postcss-loader",
                    options: {
                        // it "compiles" when I omit these options but I didn't confirm whether the correct postcss
                        // version is imported when omiting this.. So having it here helps me sleep at night
                        implementation: require("postcss"),
                        postcssOptions: {
                            sourceMap: true,
                            config: path.resolve(__dirname, "../postcss.config.js"),
                        },
                    },
                },
            ]
        });

        return newConfig;
    }
}
