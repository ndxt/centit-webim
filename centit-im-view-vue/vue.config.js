module.exports = {
    publicPath: "/",
    outputDir: "dist",
    assetsDir: "assets",
    configureWebpack: {
        externals: {
            vue: "vue",
        }
    },
    filenameHashing: true,
    lintOnSave: true,
    runtimeCompiler: false,
    transpileDependencies: [
    ],
    productionSourceMap: false,
    css: {
        loaderOptions: {
            css: {
                importLoaders: 1,
            },
            less: {
                importLoaders: 1,
            }
        }
    },
    devServer: {
        host: "0.0.0.0",
        port: 8099,
        https: false,
        proxy: {
            '/api/chat/im': {
                target: 'http://localhost/webapp',
                changeOrigin: true,
                pathRewrite: {
                    '/api/chat/im': '/im'
                }
            },

        }
    },
}
