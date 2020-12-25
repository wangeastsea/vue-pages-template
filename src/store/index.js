import Vue from 'vue'
import Vuex from 'vuex'
import jsBridge from '@/utils/js-bridge.js'
import LS from '@/utils/local-storage.js'
import { setToken } from '@/utils/http-request/index.js'
import userService from '@/service/user-server.js'
import {
    isYouxinIos,
    isYouxinAndroid,
    isYouxinApp,
    appType,
    appVersion
} from '@/utils/html-utils'
import { getUrlParam } from '@/utils/tools'
Vue.use(Vuex)

export default modules =>
    new Vuex.Store({
        modules,
        state: {
            version: appVersion || '1.0.0', // app 版本号
            user: {}
        },
        mutations: {
            getUserInfoMutation(state, data) {
                state.user = { ...state.user, ...data }
            }
        },
        actions: {
            // 需要登录绑定手机号以及开户
            async openAccountAction({ dispatch, state }) {
                try {
                    await dispatch('loginCommonAction')
                    // 未开户，请先去开户
                    console.log('state.user :', state.user)
                    if (!state.user.openedAccount && !!state.user.userToken) {
                        // 跳转到开户页面
                        if (isYouxinApp) {
                            jsBridge.gotoNativeModule('yxzq_goto://main_trade')
                        } else {
                            window.location.replace(
                                `${window.location.origin}/webapp/open-account/apply.html`
                            )
                        }
                        // 这里要进行错误抛出，进入错误分支，不然，无法阻止逻辑继续执行
                        throw ''
                        // return
                    }
                } catch (e) {
                    throw e
                }
            },
            // 点击需要登录，绑定手机号的时候，且需要初始化数据
            async loginCommonAction(store) {
                try {
                    let data
                    if (!store.getters.isLogin) {
                        // 如果是H5则跳转到登录页面
                        if (isYouxinApp) {
                            data = await jsBridge.callApp('command_user_login')
                            setToken(data.userToken)
                            // 只保留app的token，其他信息从getCurrentUser接口获取，来统一信息
                            data.userToken &&
                                (await store.dispatch('getUserInfoAction'))
                            store.commit('getUserInfoMutation', {
                                userToken: data.userToken,
                                userId: data.userId
                            })
                        } else {
                            let search = window.location.search
                                ? `&${window.location.search.slice(1)}`
                                : ''
                            window.location.replace(
                                window.location.origin +
                                    `/webapp/middle/register.html?callBackUrl=${encodeURIComponent(
                                        window.location.href
                                    )}${search}`
                            )
                        }
                    }
                    // 未绑定手机号且不是机构户
                    if (
                        !store.getters.phoneNumber &&
                        !store.getters.orgEmailLoginFlag
                    ) {
                        data = await jsBridge.callApp(
                            'command_bind_mobile_phone'
                        )
                        setToken(data.userToken)
                        // 只保留app的token，其他信息从getCurrentUser接口获取，来统一信息
                        data.userToken &&
                            (await store.dispatch('getUserInfoAction'))
                        store.commit('getUserInfoMutation', {
                            userToken: data.userToken,
                            userId: data.userId
                        })
                    }
                } catch (e) {
                    throw e
                }
            },
            async getUserInfoAction({ commit }) {
                try {
                    let data = await userService.getCurrentUser()
                    data.userId = data.uuid
                    commit('getUserInfoMutation', data)
                } catch (e) {
                    throw e
                }
            },
            // 页面初始化
            async initAction(store) {
                try {
                    let userToken = LS.get('userToken')
                    if (isYouxinApp) {
                        // 如果是app进入页面的时候获取用户信息
                        let data = await jsBridge.callApp('get_user_info')
                        // 只保留app的token，其他信息从getCurrentUser接口获取，来统一信息
                        setToken(data.userToken)
                        data.userToken &&
                            (await store.dispatch('getUserInfoAction'))
                        LS.put('userToken', data.userToken) // 保存信息到LocalStorage
                        store.commit('getUserInfoMutation', {
                            userToken: data.userToken,
                            userId: data.userId
                        })
                    } else if (
                        getUrlParam('env') === 'PC' &&
                        getUrlParam('userToken')
                    ) {
                        let token = getUrlParam('userToken')
                        LS.put('userToken', token)
                        LS.put('env', getUrlParam('env'))
                        LS.put('isPC', true)
                        setToken(token)
                        store.commit('getUserInfoMutation', {
                            userToken: LS.get('userToken')
                        })
                        token && (await store.dispatch('getUserInfoAction'))
                    } else {
                        store.commit('getUserInfoMutation', {
                            userToken: LS.get('userToken')
                        })
                        userToken && (await store.dispatch('getUserInfoAction'))
                    }
                } catch (e) {
                    // LS.remove('userToken')
                    LS.remove('env')
                    LS.remove('isPC')
                    store.commit('getUserInfoMutation', {
                        phoneNumber: '',
                        userId: '',
                        userToken: '',
                        userName: '',
                        marketBit: ''
                    })
                    throw e
                }
            }
        },
        getters: {
            user: state => state.user,
            phoneNumber: state => state.user.phoneNumber,
            isLogin: state => !!state.user.userToken, // 有token 代表登录了
            isYouxinIos: () => isYouxinIos,
            isYouxinAndroid: () => isYouxinAndroid,
            isYouxinApp: () => isYouxinApp,
            appType: () => appType,
            openedAccount: state => state.user.openedAccount, // 是否已开户 true-已开户 false-未开户
            grayStatusBit: state => state.user.grayStatusBit // 用户灰度信息
        }
    })
