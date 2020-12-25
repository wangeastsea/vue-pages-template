<template lang="pug">
    #app
        keep-alive
            router-view
</template>

<script>
import jsBridge from '@/utils/js-bridge.js'
export default {
    watch: {
        // 状态变化一定伴随路由变化
        $route: {
            handler: 'initGlobalCallBack',
            immediate: true
        }
    },
    methods: {
        closeClickHandler() {
            jsBridge.callApp('command_close_webview')
        },
        initGlobalCallBack() {
            window.h5ClosePage = () => {
                this.closeClickHandler()
                return true
            }
            window.h5HistoryBack = () => {
                return this.backClickHandler()
            }
        },
        backClickHandler() {
            if (this.$route.name === 'result') {
                this.closeClickHandler()
                return true
            }
            return false
        }
    }
}
</script>

<style lang="scss">
@import '~@/assets/styles/global.scss';
@import '~@/assets/styles/common.scss';
@import '~@/assets/styles/vant-reset.scss';
</style>
