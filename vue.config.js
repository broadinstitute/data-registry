/* We define all the pages first in an object that can be modified BEFORE being
 * exported so we can add/remove pages based on build type.
 */

let pages = {
    index: {
        entry: "src/views/Index/main.js",
        template: "public/index.html",
        filename: "index.html",
        title: "Home",
        chunks: ["chunk-vendors", "chunk-common", "index"],
    },
    dataregistry: {
        entry: "src/views/DataRegistry/main.js",
        template: "public/index.html",
        filename: "data_registry.html",
        title: "Data Registry",
        chunks: ["chunk-vendors", "chunk-common", "dataregistry"],
    },
    byorconfigbuilder: {
        entry: "src/views/BYORConfigBuilder/main.js",
        template: "public/index.html",
        filename: "byor_config_builder.html",
        title: "BYOR Configuration Builder",
        chunks: ["chunk-vendors", "chunk-common", "byorconfigbuilder"],
    },
};

// remove the debug page in production
if (process.env.NODE_ENV === "production") {
    delete pages.debug;
}

module.exports = {
    devServer: {
        writeToDisk: true, // https://webpack.js.org/configuration/dev-server/#devserverwritetodisk-
    },
    configureWebpack: (config) => {
        // create inline maps for dev builds
        if (process.env.NODE_ENV !== "production") {
            //config.devtool = "inline-source-map";

            //https://stackoverflow.com/questions/48047150/chrome-extension-compiled-by-webpack-throws-unsafe-eval-error
            config.devtool = "cheap-module-source-map";
        }
    },
    productionSourceMap: false,
    pages,
};
