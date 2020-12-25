import domain from '@/utils/DOMAIN'
import { isPc } from '@/utils/html-utils.js'

// jsBridge插件
export default {
    install(Vue, { use_console = true } = { use_console: true }) {
        // 异步导入控制台
        if (
            use_console &&
            !domain.IS_PRO &&
            !domain.IS_PRO_HK &&
            !domain.IS_USMART &&
            !isPc
        ) {
            import(/*webpackChunkName: "VConsole"*/ 'vconsole').then(
                ({ default: VConsole }) => {
                    window.vConsole = new VConsole()
                }
            )
        }
    }
}
