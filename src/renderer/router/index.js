import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Main from '_c/main'

export default new Router({
  routes: [
    {
      path: '/',
      name: '_home',
      component: Main,
      children: [
        {
          path: 'local_music',
          name: 'local_music',
          // meta: {
          //   icon: '_qq',
          //   title: 'QQ群'
          // },
          component: require('@/components/local_music').default
        },
        {
          path: 'i_love',
          name: 'i_love',
          component: require('@/components/i_love').default
        },
        {
          path: 'MV',
          name: 'MV',
          component: require('@/components/MV').default
        },
      ]
    },
    {
      path: '/landing-page',
      name: 'landing-page',
      component: require('@/components/LandingPage').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
