import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
export default new Router({
    routes: [
        {
            path: '/',
            name: 'index',
            meta: {
                title: 'hello world',
                auth: false
            },
            component: () =>
                import(
                    `@/pages/project-name/single-page/views/hello-world/index.vue`
                )
        }
    ]
})
