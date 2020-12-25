// 加载 vue 的一些指令
import './vue-directive'

// plugins
import './plugins/vant.js'

// 全局组件
import './global-components'

// 生产环境上报日志
import { ENV } from '../DOMAIN'
if (ENV === 'PRO' || ENV === 'PRO_HK' || ENV === 'USMART') {
    require('./log-report.js')
}

import LS from '../local-storage'

import Vue from 'vue'

import axios from '../http-request'

// 盈立证券公共库
import { jsBridge, uSmartInit, htmlUtils } from 'yx-base-h5'

const { isYouxinIos, isYouxinApp, appType, setTitle } = htmlUtils
// 盈立证券初始化方法
uSmartInit()
// @babel/preset-env会根据源代码中出现的语言特性自动检测需要的 polyfill
// 但不会检测vue模板中的polyfill，防止仅在模板中使用了includes而报错，故需要引用
console.log([].includes)

Vue.prototype.$axios = axios
// fastclick
// import FastClick from 'fastclick'
// FastClick.attach(document.body)

Vue.prototype.$LS = LS
// 是否开启调试模式
Vue.prototype.$debug = true
// 使用bus
Vue.prototype.$bus = new Vue()

// 当前环境和当前的环境配置的host
import DOMAIN from '../DOMAIN.js'
Vue.prototype.$DOMAIN = DOMAIN

const appOrigin = appType.Ch
    ? location.origin
    : location.origin.replace(/yxzq\.com$/, 'usmartsecurities.com')
Vue.prototype.$appOrigin = appOrigin

// Vue mixin 自定义属性 i18n 合并策略
// 本组件 i18n 属性值优先级最高，若本组件 i18n 属性值为空，那么 mixin 进来的属性可以进行覆盖
// parent 可以理解为 mixin
// child 是本组件的属性
Vue.config.optionMergeStrategies.i18n = function(parent, child) {
    let props = ['zhCHS', 'zhCHT', 'en']
    if (parent) {
        if (!child) {
            // 存在 mixin ，本组件不存在，则直接返回 mixin
            return parent
        }
        props.forEach(prop => {
            if (!parent[prop]) {
                parent[prop] = {}
            }
            Object.keys(parent[prop]).forEach(parentKey => {
                if (!child[prop]) {
                    child[prop] = {}
                }
                // 只有本组件不存在该属性值，才进行覆盖
                if (!child[prop][parentKey]) {
                    child[prop][parentKey] = parent[prop][parentKey]
                }
            })
        })
    }
    return child
}

const guid = () => {
    var d = Date.now()
    if (
        typeof performance !== 'undefined' &&
        typeof performance.now === 'function'
    ) {
        d += performance.now() //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random() * 16) % 16 | 0
        d = Math.floor(d / 16)
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
    })
}
/**
 *   grayStatusBit 灰度标识
 *   offsetIndex 某个灰度的二进制位索引，例如 1000，则 offsetIndex为4
 */
export const checkGrayStatus = (grayStatusBit, grayStatusIndex) => {
    if (!grayStatusIndex || grayStatusIndex < 1) return false
    let offsetIndex = grayStatusIndex - 1
    return (grayStatusBit & (1 << offsetIndex)) === Math.pow(2, offsetIndex)
}

Vue.prototype.$guid = guid

// 内部方法this指向本身
Vue.prototype.$setTitle = setTitle

function parentIsAlive(component) {
    let parent = component.$parent
    if (parent) {
        if (parent.$options.keepalive) {
            return true
        } else {
            return parentIsAlive(parent)
        }
    }
    return false
}

// 设置客服按钮
const setTitleBarCSButton = function() {
    if (isYouxinApp) {
        jsBridge.registerFn('GOTO_CUSTOMER_SERVICE', function() {
            jsBridge.gotoCustomerService()
        })
        jsBridge.callApp('command_set_titlebar_button', {
            position: 2,
            type: 'icon',
            icon: 'service',
            clickCallback: 'GOTO_CUSTOMER_SERVICE'
        })
    }
}

// 设置消息中心按钮
const setTitleBarMeButton = function() {
    if (isYouxinApp) {
        // 跳转消息中心
        window.GOTO_MESSAGE_CENTER = function() {
            jsBridge.gotoNativeModule('yxzq_goto://message_center')
        }
        jsBridge.callApp('command_set_titlebar_button', {
            position: 2,
            type: 'icon',
            icon: 'message',
            clickCallback: 'GOTO_MESSAGE_CENTER'
        })
    }
}
// 清除客服按钮
const clearTitleBarCSButton = function() {
    if (isYouxinApp) {
        jsBridge.callApp('command_set_titlebar_button', {
            type: 'hide',
            position: 2,
            icon: '',
            clickCallback: ''
        })
    }
}

Vue.mixin({
    mixins: [
        {
            beforeRouteEnter(to, from, next) {
                next(vm => {
                    let meta = to.meta || {}
                    // 设置title
                    let title = meta.title || ''
                    // 如果支持多语言 标题也设置成多语言
                    if (vm.$t && vm.$t(title)) {
                        title = vm.$t(title)
                    }
                    // 香港app开户隐藏title
                    if (
                        appType.Hk &&
                        window.location.pathname.indexOf('apply.html') > -1
                    ) {
                        if (!isYouxinIos) {
                            title = '  ' // 安卓隐藏标题
                        } else {
                            title = '\t \b \n' // ios 隐藏标题处理ios上的bug
                        }
                    }
                    title && vm.$setTitle(title) // 当title不存在的时候 不设置title
                    if (to.meta.cs) {
                        setTitleBarCSButton()
                    }
                    if (to.meta.message) {
                        setTitleBarMeButton()
                    }

                    // 全局关闭图片预览
                    if (
                        vm.$imgPreview &&
                        typeof vm.$imgPreview.close === 'function'
                    ) {
                        vm.$imgPreview.close()
                    }
                    if (
                        to.meta.closeOnPopstate &&
                        vm.$dialog &&
                        typeof vm.$dialog.close === 'function'
                    ) {
                        vm.$dialog.close()
                    }
                })
            },
            beforeRouteLeave(to, from, next) {
                if (from.meta.cs) {
                    clearTitleBarCSButton()
                }
                next()
            },
            deactivated() {
                if (this.$options.keepalive !== true && !parentIsAlive(this)) {
                    this.$destroy()
                }
            }
        }
    ]
})

let focusFlag = false
if (!/(ipad)|(iphone)/i.test(navigator.userAgent)) {
    let clientHeight = document.body.clientHeight
    let _focusElem = null //输入框焦点
    //利用捕获事件监听输入框等focus动作
    document.body.addEventListener(
        'focus',
        function(e) {
            focusFlag = true
            _focusElem = e.target || e.srcElement
        },
        true
    )
    //因为存在软键盘显示而屏幕大小还没被改变，所以以窗体（屏幕显示）大小改变为准
    window.addEventListener('resize', function() {
        if (_focusElem && document.body.clientHeight < clientHeight) {
            //焦点元素滚动到可视范围的底部(false为底部)
            _focusElem.scrollIntoView(false)
        }
    })
} else {
    // 解决一个很坑的原生浏览器的bug
    document.body.addEventListener(
        'focus',
        function() {
            focusFlag = true
        },
        true
    )
    // 获取失去焦点时 窗口向上移的bug
    document.body.addEventListener(
        'focusout',
        function() {
            focusFlag = false
            setTimeout(() => {
                if (!focusFlag) {
                    document.body.scrollTop = document.body.scrollHeight
                }
            }, 300)
        },
        true
    )
}
