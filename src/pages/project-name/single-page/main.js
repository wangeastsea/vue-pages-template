import Vue from 'vue'
import App from './App.vue'
import router from './router'
import routerInterceptor from './router/router-interceptor'
import '@/utils/common'
import jsBridge from '@/utils/js-bridge.js'
// import optionStore from './store'
import storeMethod from '@/store/index.js'
import i18n from '@/utils/common/plugins/yl-i18n/index.js'
import { messages } from '@/utils/i18n-message/project-name/single-page/index.js'
const store = storeMethod()
import { lang } from '@/utils/html-utils.js'
import vConsole from '@/utils/common/plugins/v-console.js'
Vue.use(vConsole)
Vue.use(i18n, {
    lang,
    messages
})
Vue.config.productionTip = false
Vue.prototype.$jsBridge = jsBridge
let init = async () => {
    try {
        // 刷新 初始化数据 数据持久化
        await store.dispatch('initAction')
        // 路由拦截器
    } catch (e) {
        console.log(e) // 未登录
    } finally {
        routerInterceptor(router, store)
        new Vue({
            router,
            store,
            render: h => h(App)
        }).$mount('#app')
    }
}
init()
