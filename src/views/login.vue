<template>
<div>
  <div class="popup" v-show="popupFlag">
    <div class="popbox">
      <div style="border-bottom: 1px solid #dedede; padding: 15px;">{{popupContent}}</div>
      <div class="popbox-footer">
        <span class="popbox-btn" style="font-weight: bold;" @click="closePop()">确定</span>
      </div>
    </div>
  </div>
  <div class="login">
    <div>
      <div class="form-group">
        <label for="exampleInputEmail1">用户名</label>
        <input type="text" class="form-control" placeholder="用户名" v-model="name" required>
      </div>
      <div class="form-group">
        <label for="exampleInputPassword1">密码</label>
        <input type="password" class="form-control" placeholder="密码" @keyup.enter="getlogin" v-model="password" required>
      </div>
      <button type="submit" class="btn btn-default" @click="getlogin">登录</button>
    </div>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      popupFlag: false,
      popupContent: '',
      name: "",
      password: ""
    }
  },
  methods: {
    showPop: function(text) { //操作确认弹窗
      this.popupContent = text;
      this.popupFlag = true;
    },
    closePop: function() {
      this.popupFlag = false;
    },
    getlogin: function() {
      // this.getEl()
      if (this.name && this.password) {
        this.login(this.name, this.password)
      } else {
        this.showPop("用户名或密码必须填写")
      }
    },
    login: function(name,psd) {
      var _data = {
        userName: name,
        userPass: psd
      };
      var self = this;
      this.axios.post("http://weixingataoyoujrom.yourjam.cn/index.php?r=user/login", _data)
      .then((response) => {
        console.log(response.data)
        if (response.data.state == 1000) {
          // self.$emit('namechild', self.name);
          this.getEl()
          self.$router.push('/uploadcode');
        }else{
          this.showPop("用户名或密码错误")
        }
      }, (error) => {
        console.log(error)
      })
    },
    getEl: function() {
      var url = location.search;
      if (url.indexOf('?') != -1) {
        var urlItem = new Object()
        var str = url.substr(1);
        var items = str.split('&')
        for(var i = 0; i < items.length; i++){
          urlItem[items[i].split('=')[0]] = items[i].split('=')[1]
        }
        localStorage.type = urlItem.type
        // localStorage.name = urlItem.userName
        // localStorage.psd = urlItem.userPass
        // console.log("type="+localStorage.type)
        // console.log(localStorage.name)
        // console.log(localStorage.psd)
      }
    },
  },
  created: function(){
    // if((localStorage.name != 'undefined') && (localStorage.psd != 'undefined')){
    //   this.login(localStorage.name, localStorage.psd)
    // }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.login {
  width: 400px;
}

label {
  margin-bottom: 10px;
}

/*弹窗样式*/

.popup {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(20, 20, 20, 0.6);
  overflow-x: hidden;
  z-index: 99999999;
}

.popbox {
  width: 540px;
  background: #fff;
  text-align: center;
  position: absolute;
  top: 460px;
  left: 50%;
  margin-left: -270px;
}

.popbox-footer{
  height: 44px;
  overflow: hidden;
  display: table;
  width: 100%;
  border-collapse: collapse;
}

.popbox-btn{
  display: table-cell!important;
  padding: 0 5px;
  height: 44px;
  -webkit-box-sizing: border-box!important;
  box-sizing: border-box!important;
  font-size: 16px;
  line-height: 44px;
  text-align: center;
  color: #0e90d2;
  display: block;
  word-wrap: normal;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  cursor: pointer;
  border-right: 1px solid #dedede;
}

.popbox-btn:nth-last-child(1){
  border-right: none;
}

.toastbox {
  width: 120px;
  background: rgb(100, 100, 100);
  text-align: center;
  position: absolute;
  top: 420px;
  left: 50%;
  margin-left: -60px;
  padding: 10px;
  font-size: 18px;
  color: #fff;
}

@media screen and (max-width: 640px) {
  .popbox {
    width: 270px;
    background: #fff;
    text-align: center;
    position: absolute;
    top: 400px;
    left: 50%;
    margin-left: -135px;
  }
}
</style>
