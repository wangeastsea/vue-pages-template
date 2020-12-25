import { isYouxinApp } from '@/utils/html-utils'
import Vue from 'vue'
import { setTitle } from '@/utils/html-utils'
export default (router, store) => {
    router.beforeEach(async (to, from, next) => {
        setTitle(to.meta.title)
        document.body.scrollIntoView()
        // 需要绑定手机号但是未绑定的情况 未登录先登录
        if (to.meta.auth !== false) {
            if (isYouxinApp) {
                // app
                try {
                    await store.dispatch('loginCommonAction')
                    next()
                } catch (e) {
                    console.log(e)
                }
            } else {
                if (!store.getters.isLogin || !store.getters.phoneNumber) {
                    // 登录到H5 登录注册页
                    // router.replace({
                    //     name: 'register-hk',
                    //     query: {
                    //         fullPath: to.fullPath
                    //     }
                    // })
                }
                next()
            }
        } else {
            next()
        }
    })
    router.afterEach(() => {
        Vue.prototype.$close()
    })
}
