/* eslint-disable unicorn/prefer-module */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const withImages = require("next-images")

module.exports = withImages({
    reactStrictMode: true,
    images: {
        disableStaticImages: true,
    },
    // webpack(config) {
    //     config.module.rules.push({
    //         test: /\.svg$/,
    //         use: ["@svgr/webpack"],
    //     })

    //     return config
    // },
})
