import Vue from 'vue'
import { Toast, Dialog } from 'vant'
import { lang } from '@/utils/html-utils'
const langMap = {
    zhCHS: {
        loading: '加载中...',
        confirmButtonText: '确认',
        cancelButtonText: '取消	',
        okToSure: '我知道了'
    },
    zhCHT: {
        loading: '加載中...',
        confirmButtonText: '確認',
        cancelButtonText: '取消	',
        okToSure: '我知道了'
    },
    en: {
        loading: 'loading...',
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        okToSure: 'OK'
    }
}

Vue.use(Dialog)
Vue.prototype.$close = all => {
    if (all) {
        Toast.clear(true)
        return
    }
    Toast.clear()
}
Vue.prototype.$loading = msg => {
    Toast.loading({
        mask: true,
        message: msg || langMap[lang]['loading'],
        duration: 0,
        position: 'center'
    })
}
Vue.prototype.$confirm = arg => {
    arg = {
        confirmButtonText: langMap[lang]['confirmButtonText'],
        cancelButtonText: langMap[lang]['cancelButtonText'],
        ...arg,
        'message-align': 'center'
    }
    return Dialog.confirm(arg)
}
export const alertModule = arg => {
    if (typeof arg === 'string') {
        arg = {
            message: arg,
            confirmButtonText: langMap[lang]['okToSure']
        }
    }
    arg = {
        ...arg,
        'message-align': 'center'
    }
    return Dialog.alert(arg)
}
Vue.prototype.$alert = alertModule

Vue.prototype.$toast = (msg, direction = 'bottom', options) => {
    return new Promise((resolve, reject) => {
        try {
            if (!msg) {
                resolve()
                return
            }
            Toast({
                position: direction,
                message: msg,
                duration: 2000,
                onClose: resolve,
                ...options
            })
        } catch (e) {
            reject(e)
        }
    })
}
