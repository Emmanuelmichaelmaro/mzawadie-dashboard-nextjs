const withPlugins = require("next-compose-plugins");
const withImages = require("next-images");
const withPWA = require("next-pwa");
const { transform } = require("@formatjs/ts-transformer");

// optional next.js configuration
const nextConfig = {
    reactStrictMode: true,
    webpack: (config) => {
        const fileLoaderRule = config.module.rules.find((rule) => rule.test && rule.test.test(".svg"));

        fileLoaderRule.exclude = /\.svg$/;

        config.module.rules.push(
            {
                test: /\.(png|jpg|gif|woff|woff2|otf|ttf|svg)$/i,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 100000,
                        },
                    },
                ],
            },
            {
                test: /\.(png|jpe?g|gif|mp3|aif)$/i,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "static/media/[name].[hash:8].[ext]",
                        },
                    },
                ],
            },
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: "ts-loader",
                        options: {
                            getCustomTransformers() {
                                return {
                                    before: [
                                        transform({
                                            overrideIdFn: "[sha512:contenthash:base64:6]",
                                        }),
                                    ],
                                };
                            },
                        },
                    },
                ],
            }
        );

        return config;
    },
    i18n: {
        // These are all the locales you want to support in
        // your application
        locales: ["en", "fr", "es", "sw"],
        // This is the default locale you want to be used when visiting
        // a non-locale prefixed path e.g. `/hello`
        defaultLocale: "en",
        localeDetection: false,
    },
};

module.exports = withPlugins(
    [
        [withImages],
        // [
        //     withPWA,
        //     {
        //         pwa: {
        //             dest: "public",
        //             // disable: process.env.NODE_ENV === 'development',
        //             // register: true,
        //             // scope: '/app',
        //             // sw: 'service-worker.js',
        //             //...
        //         },
        //     },
        // ],
    ],
    nextConfig
);
