import Vue from 'vue'
import Router from 'vue-router'
import login from '@/view/login/index'
import index from '@/view/index/index'
import lost from '@/view/404/404'

Vue.use(Router)

const routes = [{
  path: '/',
  redirect: '/login',
  meta: {
    title: '登录',
  }
}, {
  path: '/login',
  name: 'login',
  component: login,
  meta: {
    title: '登录',
  }
}, {
    path: '/form',
    component: index,
    children:[{
      path: '/',
      name: 'create',
      component: () => import('@/view/index/create'),
      meta: {
        title: '表单列表',
		keepAlive: true
      }
    }, {
      path: 'trash',
      name: 'trash',
      component: () => import('@/view/index/trash'),
      meta: {
        title: '回收站',
		keepAlive: true
      }
    }]
  }, {
    path: '/form/form-edit',
    name: 'form-edit',
    component: () => import('@/view/form-edit/index'),
    meta: {
      title: '表单设计',
    }
  }, {
    path: '/form/prize-setting',
    name: 'prize-setting',
    component: () => import('@/view/prize/index'),
    meta: {
      title: '抽奖设置',
    }
  }, {
    path: '*',
    name: '404',
    component: lost,
    meta: {
      title: '404',
    }
  }
]

export default new Router({
  mode: 'history',
  routes
})
