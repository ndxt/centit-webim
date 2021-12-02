module.exports = {
    publicPath: "./",
    outputDir: "dist",
    assetsDir: "assets",
    configureWebpack: {
        externals: {
            Vue: "vue",
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
            '/api/ws/chat/im': {
                target: 'ws://192.168.134.4:10085/im',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '/api/ws/chat/im': '/im'
                }
            },

            '/api/chat/im': {
                target: 'http://192.168.134.4:10085/im',
                changeOrigin: true,
                pathRewrite: {
                    '/api/chat/im': '/im'
                }
            },

            '/api': {
                changeOrigin: true,
                target: 'http://ceshi.centit.com/platform',
                cookiePathRewrite: {
                    '/platform': '/',
                },
            }
        },
    }
}
