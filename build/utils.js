const glob = require('glob')
const fs = require('fs')

module.exports = {
    // 组装多页的参数
    getPages: globPath => {
        const entries = {}
        glob.sync(globPath).forEach(function(entry) {
            const paths = entry.split('/') || []
            // 单页名 apply
            const entryName = paths[4]
            // 模块名，如open-account-hk
            const moduleName = paths[3]
            // 模块根html路径
            let moduleIndexHtmlPath = `public/${moduleName}/index.html`
            // 单页根html路径
            let pageIndexHtmlPath = `public/${moduleName}/${entryName}/index.html`
            // 如果模块或者单页有特定的根html路径，则使用，没有就用public/index.html
            let template =
                (fs.existsSync(pageIndexHtmlPath) && pageIndexHtmlPath) ||
                (fs.existsSync(moduleIndexHtmlPath) && moduleIndexHtmlPath) ||
                'public/index.html'
            // 组装多页参数
            entries[entryName] = {
                entry,
                template: template,
                filename: `${entryName}.html`
            }
        })
        // 🌰如下形式：
        /**
         * pages {
         *      'asset-manage': {
         *          entry: './src/pages/asset-manage/main.js',
         *          template: '/Users/wangdonghai/Documents/WDH_library/youxin_workspace/youxin-asset-manage/public/index.html',
         *          filename: 'index.html'
         *      }
         * }
         */
        return entries
    },

    // 获取命令参数
    /**
     *  🌰process.argv:
     *      [
     *       '/usr/local/Cellar/node/11.1.0/bin/node',
     *       '/Users/$$$$/Documents/WDH_library/youxin_workspace/webapp-jy/build/dev.js',
     *       'projectName1’,
     *       '--proxy=sit'
     *       ]
     */
    getCommandParam: key => {
        const reg = new RegExp(`^--${key}`)
        const index = process.argv.findIndex(argv => reg.test(argv))
        return process.argv[index] && process.argv[index].split('=')[1]
    }
}
