import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/common/Home.vue'

import FirstPage from '@/components/pages/FirstPage.vue' //首页
//农作物监测
import Monitor from '@/components/pages/Monitor.vue'
//农作物
import Field from '@/components/pages/Farm/Field.vue' //农田管理
import Crops from '@/components/pages/Farm/Crops.vue' //农作物信息管理
//订单管理
import Order from '@/components/pages/Order.vue' //定单管理
import Login from '@/components/common/Login.vue'//登录
import Ai from "@/components/pages/Ai.vue"; //在线咨询

// 在VueRouter上配置路由跳转，在router中的index.js中加上以下代码，注意加在use之前
const routerPush = Router.prototype.push;
Router.prototype.push = function (location) {
  return routerPush.call(this, location).catch(err => { })
};

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home', //主路由
      component: Home,
      redirect: 'FirstPage', //设置打开的默认页面
      children: [  //嵌套的子路由
        {
          path: '/FirstPage',
          name: 'firstPage',
          component: FirstPage
        }, {
          path: '/Field',
          name: 'field',
          component: Field
        }, {
          path: '/Crops',
          name: 'crops',
          component: Crops
        },
        {
          path: '/Order',
          name: 'order',
          component: Order
        },
        {
          path: '/Ai',
          name: 'ai',
          component: Ai
        },
        {
          path: '/Monitor',
          name: 'monitor',
          component: Monitor
        }
      ]
    }, {
      path: '/Login',
      name: 'login',//主路由
      component: Login,
    }
  ]
})
