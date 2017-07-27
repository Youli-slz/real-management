<template>
<div>
  <header class="r-head">
    微信公众后台管理系统
    <div class="loginright"><label>{{name}}</label><span @click="loginout()">登出</span></div>
  </header>
  <div class="row procontainer">
    <div class="col-xs-2">
      <div class="rslider">
        <ul>
          <h2>设置</h2>
          <li>
            <router-link to="uploadcode">上传二维码</router-link>
          </li>
          <li>
            <router-link to="querygroup">查询群情况</router-link>
          </li>
          <li v-if="type == 100000">
            <router-link to="groupcode">二维码登录</router-link>
          </li>
          <li v-if="type == 1000">
            <router-link to="oasetting">公众号设置</router-link>
          </li>
          <li v-if="type == 1000">
            <router-link to="channel">裂变配置</router-link>
          </li>
          <li v-if="type == 1000">
            <router-link to="monitorline">监控曲线</router-link>
          </li>
        </ul>
      </div>
    </div>
    <div class="col-xs-10 rcontent">
      <!-- <router-view v-on:namechild="getname"></router-view> -->
      <router-view></router-view>
    </div>
  </div>
</div>
</template>

<script>
require('./assets/css/common.css');
import {
  islogin
} from './assets/js/common'

export default {
  name: 'app',
  data() {
    return {
      name: '',
      type: ''
    }
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': 'getname'
  },
  methods: {
    loginout: function() {
      var self = this;
      this.axios.get("http://weixingataoyoujrom.yourjam.cn/index.php?r=user/loginout").then((response) => {
        if (response.data.state == 1000) {
          self.$router.push('/login?type=' + parseInt(localStorage.type));
          self.name = ""
        }
      }, (response) => {

      })
    },
    getname: function() {
      // console.log('in')
      var self = this;
      self.name = localStorage.type
      this.type = localStorage.type
      // console.log(this.type)
      islogin(function(val) {
        if (val.state == 1000) {
          self.name = localStorage.type;
        }
      })
    },
  },
  created: function() {
    this.type = localStorage.type
  }
}
</script>

<style>
html,
body {
  height: 100%;
  color: #666;
}

#app {
  min-width: 1000px;
}

.r-head {
  padding: 20px;
  background: #42B983;
  color: #fff;
  position: fixed;
  width: 100%;
  z-index: 10;
}

.rslider {
  font-size: 16px;
  height: 100%;
  border-right: 1px solid #eee;
  position: fixed;
  background: #fff;
  z-index: 22;
  overflow-y: scroll;
}

.rslider ul li a {
  display: block;
  line-height: 40px;
  font-size: 14px;
  padding: 0 20px;
  color: #666
}

.rslider ul h2 {
  line-height: 40px;
  background: #f1f2f4;
  color: #444;
  padding: 0 20px;
}

.rcontent {
  padding: 30px;
}

.loginright {
  display: inline-block;
  float: right;
}

.loginright label {
  margin-right: 10px;
}

.loginright span {
  cursor: pointer;
}

.rslider ul li a.router-link-active {
  color: #42B983;
  font-weight: bold;
}

.procontainer {
  padding-top: 56px;
}
</style>
