// webpack 压缩插件
const CompressionWebpackPlugin = require('compression-webpack-plugin')
// 代码的封装与抽离，返回公共的配置
const commonConfig = require('./vue-common-config')
const { getPages, getCommandParam } = require('./utils')
const fs = require('fs')
// 返回构建项目的名称
const project = getCommandParam('project')

// 获取project下的所有单页，作为entry，一个 project 下可能多个单页
const pages = getPages(`./src/pages/${project}/**/main.js`)
console.log('pages==>', pages)
let openPage = ''
// 将当前项目的第一个单页作为浏览器启动后第一个项目展示
if (Object.values(pages)[0]) {
    openPage = Object.values(pages)[0].filename // 当前项目的第一个单页
}

// 开发环境代理的类型, 默认是 sit
// 命令行启动参数示例：
// yarn serve open-account --proxy=dev
// yarn serve open-account open-account-hk --proxy=uat
const proxyType = getCommandParam('proxy') || 'sit'

// 根据proxyType获取环境配置参数
const getApi = (proxyType, apiType) => {
    const jyApiMap = {
        dev: 'http://jy-dev.yxzq.com',
        dev1: 'http://jy1-dev.yxzq.com',
        sit: 'http://jy-sit.yxzq.com',
        sit1: 'http://jy1-sit.yxzq.com',
        uat: 'http://jy-uat.yxzq.com',
        uat1: 'http://jy1-uat.yxzq.com',
        pro: 'http://jy.yxzq.com'
    }
    const hzApiMap = {
        dev: 'http://hz-dev.yxzq.com',
        dev1: 'http://hz1-dev.yxzq.com',
        sit: 'http://hz-sit.yxzq.com',
        sit1: 'http://hz1-sit.yxzq.com',
        uat: 'http://hz-uat.yxzq.com',
        uat1: 'http://hz1-uat.yxzq.com',
        pro: 'http://hz.yxzq.com'
    }
    const webAppApiMap = {
        dev: 'http://m-dev.yxzq.com',
        dev1: 'http://m1-dev.yxzq.com',
        sit: 'http://m-sit.yxzq.com',
        sit1: 'http://m1-sit.yxzq.com',
        uat: 'http://m-uat.yxzq.com',
        uat1: 'http://m1-uat.yxzq.com',
        pro: 'http://m.yxzq.com'
    }
    const apiTypeMap = {
        jy: jyApiMap,
        hz: hzApiMap,
        webapp: webAppApiMap
    }
    return apiTypeMap[apiType][proxyType]
}

const jyApi = getApi(proxyType, 'jy')
const hzApi = getApi(proxyType, 'hz')
const webappApi = getApi(proxyType, 'webapp')
// config 配置
module.exports = {
    ...commonConfig(project),
    pages: {
        ...pages
    },
    chainWebpack: config => {
        // 将public静态目录下的project下的文件夹（跟单页的名称保持一致）原样输出到dist目录
        config.plugin('copy').tap(options => {
            if (fs.existsSync(`public/${project}`)) {
                options[0][0] = {
                    from: `public/${project}`,
                    to: '',
                    toType: 'dir',
                    ignore: []
                }
            } else {
                options[0] = []
            }
            return options
        })

        // TODO 待解析此块优化的作用
        // todo：其他较少复用的node_modules模块需要单独提取
        // 不能提取其他公共文件，除非将相应chunk加入到htmlWebpackPlugin中，否则会丢失chunk
        config.optimization.splitChunks({
            cacheGroups: {
                // 公共包
                vendors: {
                    name: 'chunk-vendors',
                    test: /[\\\/]node_modules[\\\/](vue|axios|badjs-report|fastclick|core-js|@babel|path-browserify|vue-loader|is-buffer|node-libs-browser|regenerator-runtime)[\\\/]/,
                    priority: -10,
                    chunks: 'initial'
                },
                // 其余公共代码
                common: {
                    name: 'chunk-common',
                    minChunks: 2,
                    priority: -20,
                    chunks: 'initial',
                    reuseExistingChunk: true
                }
            }
        })
    },
    configureWebpack: config => {
        if (process.env.NODE_ENV === 'production') {
            // 生产环境开启gzip压缩
            config.plugins.push(
                new CompressionWebpackPlugin({
                    filename: '[path].gz[query]',
                    algorithm: 'gzip',
                    test: new RegExp(
                        '\\.(' + ['js', 'css', 'html'].join('|') + ')$'
                    ),
                    minRatio: 0.8
                })
            )
        }
    },
    devServer: {
        disableHostCheck: true,
        open: true, // 是否打开页面
        host: '0.0.0.0',
        sockHost: 'localhost',
        port: 8080,
        https: false,
        hotOnly: true,
        openPage, // 当前项目的第一个单页
        proxy: {
            '/quotes-dataservice': {
                target: hzApi,
                changOrigin: true
            },
            '/quotes-search': {
                target: hzApi,
                changOrigin: true
            },
            '/config-manager': {
                target: jyApi,
                changOrigin: true
            },
            '/stock-capital-server': {
                target: jyApi,
                changOrigin: true
            },
            'stock-capital-server': {
                target: jyApi,
                changOrigin: true
            },
            '/stock-order-server': {
                target: jyApi,
                changOrigin: true
            },
            '/user-server': {
                target: jyApi,
                changOrigin: true
            },
            '/user-account-server': {
                target: jyApi,
                changOrigin: true
            },
            '/faceid': {
                target: 'https://api.megvii.com',
                changOrigin: true
            },
            '/news-configserver': {
                target: hzApi,
                changOrigin: true
            },
            // 帮助中心接口
            '/news-helpcenter': {
                target: hzApi,
                changOrigin: true
            },
            // 代理其他项目的图片
            '^/webapp': {
                target: webappApi,
                changOrigin: true
            },
            //奖励中心
            '/product-server': {
                target: jyApi,
                changOrigin: true
            },
            '/customer-relationship-server': {
                target: jyApi,
                changOrigin: true
            },
            '/message-server': {
                target: jyApi,
                changOrigin: true
            },
            '/account': {
                target: webappApi,
                changOrigin: true
            }
        },
        historyApiFallback: {}
    },
    productionSourceMap: false
}
