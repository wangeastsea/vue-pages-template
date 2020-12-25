const fs = require('fs')

// vue.config.js 通用配置
module.exports = project => ({
    // 输出目录
    outputDir: `dist/${project}`,
    // 项目服务器部署根目录
    // 类似于： http://m-sit.yxzq.com/webapp/open-account-hk/apply.html#/qrcode 中的 webapp
    publicPath: `/webapp/${project}`,
    // 配置全局 sass 访问的变量和文件 详情请参考：https://cli.vuejs.org/zh/config/#css-sourcemap
    css: {
        loaderOptions: {
            less: {
                // 配置请参考：
                // https://cli.vuejs.org/zh/guide/css.html#%E5%90%91%E9%A2%84%E5%A4%84%E7%90%86%E5%99%A8-loader-%E4%BC%A0%E9%80%92%E9%80%89%E9%A1%B9
                // https://github.com/webpack-contrib/less-loader
                // http://lesscss.org/usage/#less-options-strict-units
                // 启动运行时修改 less变量,暂时用不到此配置
                // 配置报错，降级处理，可参考https://github.com/ant-design/ant-design-landing/issues/235
                modifyVars: {
                    green: '#10ba70',
                    blue: '#3c78fa',
                    red: '#e72653',
                    'button-primary-background-color': '#285AC8',
                    'button-primary-color': '#EBEBEB',
                    'button-primary-border-color': '#285AC8'
                }
            },
            // 配置请参考：https://www.jianshu.com/p/8b7b49824bdf
            sass: {
                prependData: `@import "@/assets/styles/theme.scss";`
            }
        }
    }
})
