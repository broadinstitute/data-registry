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
        devMiddleware: {
            writeToDisk: true, // https://webpack.js.org/configuration/dev-server/#devserverwritetodisk-
        },
    },
    configureWebpack: (config) => {
        let data_registry_key = process.env.DATA_REGISTRY_API_KEY;
        if(!data_registry_key){
            console.error("DATA_REGISTRY_API_KEY needs to be set");
            process.exit(1);
        }
        let bioindex_dev = process.env.BIOINDEX_DEV;
        let bioindex_host = "https://bioindex.hugeamp.org"; // production by default
        //set private bioindex host if variable is defined, otherwise use default
        let bioindex_host_private =
            process.env.BIOINDEX_HOST_PRIVATE || "https://bioindex.hugeamp.org";

        if (!!bioindex_dev) {
            bioindex_host =
                bioindex_dev == "localhost"
                    ? "http://localhost:5000"
                    : "https://bioindex-dev.hugeamp.org";
        }

        // output which vue config file and bioindex is being used
        console.log(
            `VUE_CONFIG_PATH=${process.env.VUE_CLI_SERVICE_CONFIG_PATH}; BIOINDEX_DEV=${process.env.BIOINDEX_DEV}; using ${bioindex_host} and ${bioindex_host_private}`,
        );

        // add the transform rule for bioindex
        config.module.rules.push({
            test: /bioIndexUtils\.js$/,
            loader: "string-replace-loader",
            options: {
                search: "SERVER_IP_ADDRESS",
                replace: bioindex_host,
                flags: "g",
            },
        });

        config.module.rules.push({
            test: /dataRegistryUtils\.js$/,
            loader: "string-replace-loader",
            options: {
                search: "REGISTY_API_TOKEN",
                replace: data_registry_key,
                flags: "g",
            },
        });

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
