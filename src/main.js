// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import vueResource from 'vue-resource'
import axios from 'axios'
import VueAxios from 'vue-axios'
import {
  islogin
} from './assets/js/isLogin'

Vue.use(VueRouter)
Vue.use(vueResource)
Vue.use(VueAxios, axios)

// axios.defaults.baseURL = 'http://weixingataoyoujrom.yourjam.cn'
axios.defaults.withCredentials = true;

var router = new VueRouter({
  mode: 'history',
  routes: [{
    path: '/',
    component: require('./views/uploadcode.vue'),
    auth: true,
    meta: {
      requiresAuth: true
    }
  }, {
    path: '/login',
    component: require('./views/login.vue'),
  }, {
    path: '/uploadcode',
    component: require('./views/uploadcode.vue'),
    auth: true,
    meta: {
      requiresAuth: true
    }
  }, {
    path: '/querygroup',
    component: require('./views/querygroup.vue'),
    auth: true,
    meta: {
      requiresAuth: true
    }
  }, {
    path: '/groupcode',
    component: require('./views/groupcode.vue'),
    auth: true,
    meta: {
      requiresAuth: true
    }
  }, {
    path: '/oasetting',
    component: require('./views/OfficialAccount/oasetting.vue'),
    auth: true,
    meta: {
      requiresAuth: true
    }
  }, {
    path: '/oadetail',
    component: require('./views/OfficialAccount/oadetail.vue'),
    auth: true,
    meta: {
      requiresAuth: true
    }
  }, {
    path: '/channel',
    component: require('./views/robotSetting/channel.vue'),
    auth: true,
    meta: {
      requiresAuth: true
    }
  }, {
    path: '/robot',
    component: require('./views/robotSetting/robot.vue'),
    auth: true,
    meta: {
      requiresAuth: true
    }
  }, {
    path: '/monitorline',
    component: require('./views/monitorline.vue'),
    auth: true,
    meta: {
      requiresAuth: true
    }
  }]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    islogin(function(val) {
      // console.log(val)
      if (val == 1000) {
        next()
      } else {
        next({
          path: '/login?type='+localStorage.type
        });
      }
    })
  } else {
    next() // make sure to always call next()!
  }
})

/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
