<template>
<div>
  <table class="xtable">
    <tr>
      <th>名称</th>
      <td>{{oaData.nick_name}}</td>
    </tr>
    <tr>
      <th>头像</th>
      <td><img :src="oaData.head_img" style="width: 100px;height: 100px;" /></td>
    </tr>
    <tr>
      <th>usertype</th>
      <td>
        {{oaData.userType}}
        <span style="margin-left: 30px; color: #428bca;">重设置：</span><input type="number" style="width: 60px;" v-model="userType">
      </td>
    </tr>
    <tr>
      <th>二维码</th>
      <td><img :src="oaData.qrcode_url" style="width: 100px;height: 100px;" /></td>
    </tr>
    <tr>
      <th>主体</th>
      <td>{{oaData.principal_name}}</td>
    </tr>
    <tr>
      <th>
        今日新增粉丝数
      </th>
      <td>{{oaData.todaySubscribe}}</td>
    </tr>
    <tr>
      <th>回复文案</th>
      <td>
        <span v-if="replyTextSel">{{replyShow}}</span>
        <textarea v-else style="width: 100%; height: 50px; resize: none;" v-model="replayEdit" />
      </td>
    </tr>
    <tr>
      <th style="color: #428bca">回复文案设置</th>
      <td>
        <select v-model="replyTextSel">
          <option v-for="item in replyText" :value="item.ReplayId">{{item.mark}}</option>
        </select>
        <button style="margin-left: 20px;" class="btn btn-success" @click="cancelReply">取消回复</button>
      </td>
    </tr>
    <tr>
      <th style="color: #428bca">底部菜单设置</th>
      <td>
        <select v-model="menusel">
          <option v-for="item in menuType" :value="item.value">{{item.text}}</option>
        </select>
        <table class="menuTable">
          <tr v-if="menusel != 0">
            <th>菜单一</th>
            <td>
              <span>菜单名:</span>
              <input type="text" v-model="name1" />
            </td>
          </tr>
          <tr v-if="menusel == 2">
            <th rowspan="2">菜单二</th>
            <td>
              <span>菜单名:</span>
              <input type="text" v-model="name2" />
            </td>
          </tr>
          <tr v-if="menusel == 2">
            <td>
              <span>跳转链接:</span>
              <input type="text" v-model="url" />
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
  <div class="oa-btn">
    <div @click="setting">保存设置</div>
  </div>

  <div class="popup" v-show="popupFlag">
    <div class="popbox">
      <div style="border-bottom: 1px solid #dedede; padding: 15px;">{{popupContent}}</div>
      <div class="popbox-footer">
        <span class="popbox-btn" style="font-weight: bold;" @click="closePop()">确定</span>
      </div>
    </div>
  </div>

  <div class="popup" v-show="confirmFlag">
    <div class="popbox">
      <div style="border-bottom: 1px solid #dedede; padding: 15px;">{{confirmContent}}</div>
      <div class="popbox-footer">
        <span class="popbox-btn" @click="confirmTrue">确定</span>
        <span class="popbox-btn" @click="closeConfirm">取消</span>
      </div>
    </div>
  </div>
</div>
</template>
<script>
export default {
  data() {
    return {
      popupFlag: false, //提示弹窗控制位
      popupContent: '', //弹窗内显示的内容
      confirmFlag: false,
      confirmContent: '',
      oaData: {},
      replyShow: '',
      replyTextSel: '',
      replyText: [],
      replayEdit: '',
      menusel: '',
      menuType: [{
        text: '未设置底部菜单',
        value: 0
      }, {
        text: '设置一个底部菜单',
        value: 1
      }, {
        text: '设置两个底部菜单',
        value: 2
      }],
      name1: '',
      name2: '',
      url: '',
      userType: '',
    }
  },
  watch: {
    replyTextSel: function(value) {
      console.log(value)
      if (value != '') {
        this.replyShow = this.replyText[value - 1].str
      }
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
    showConfirm: function(item){
      this.confirmFlag = true
      // console.log(item)
      this.groupItem = item
    },
    closeConfirm: function() {
      this.confirmFlag = false
    },
    confirmTrue: function() {
      this.confirmFlag = false
      return true
    },
    getOADetail: function() {
      var self = this
      this.axios.post('http://weixingataoyoujrom.yourjam.cn/index.php?r=tokenfix/gettokeninf', {
          appid: localStorage.oaId
        })
        .then((response) => {
          var data = response.data
          console.log(data)
          if (data.state == 1000) {
            self.oaData = data.data
            // console.log(self.oaDate.authorizer_appid)
            // self.replyShow = data.data.replay
            self.menusel = data.data.state
            if (data.data.state == 1) {
              self.name1 = data.data.Menu.selfmenu_info.button[0].name
            } else if (data.data.state == 2) {
              self.name1 = data.data.Menu.selfmenu_info.button[0].name
              self.name2 = data.data.Menu.selfmenu_info.button[1].name
              self.url = data.data.Menu.selfmenu_info.button[1].url
            }
          }else {
            self.showPop(data.message)
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    delReply: function() {

    },
    cancelReply: function() {
      this.axios.post('http://jianshenweixin.yourjam.cn/index.php?r=tokenfix/delreply', {
        appid: localStorage.oaId
      })
      .then((response) => {
        var data = response.data
        console.log(data)
        if(data.state == 1000){
          this.showPop("取消成功")
          this.getReplylist()
        }else {
          this.showPop(data.message)
        }
      })
      .catch((error) => {
        console.log(error)
      })
    },
    getReplylist: function() {
      this.axios.post('http://jianshenweixin.yourjam.cn/index.php?r=tokenfix/getreplylist', {
          appid: localStorage.oaId
        })
      .then((response) => {
        var data = response.data
        console.log(data)
        if(data.state == 1000){
          console.log("in")
          this.replyText = data.data.list
          this.replyTextSel = data.data.ReplayId
          var edit = {
            ReplayId: '',
            mark: '自定义',
            str: ''
          }
          if(data.data.ReplayId == ''){
            edit.str = data.data.str
            this.replayEdit = data.data.str
          }
          console.log(edit)
          this.replyText.push(edit)
          // this.replyShow = data.data.str
        }else {
          this.showPop(data.message)
        }

      })
      .catch((error) => {
        console.log(error)
      })
    },
    setting: function() {
      var self = this
      if(this.menusel == 1){
        var menu = {
          "button": [{
              "type": "click",
              "name": this.name1,
              "key": "click"
            }
          ]
        }
      }else if( this.menusel == 2){
        var menu = {
          "button": [{
              "type": "click",
              "name": this.name1,
              "key": "click"
            },
            {
              "type": "view",
              "name": this.name2,
              "url": this.url
            }
          ]
        }
      }
      // console.log(self.oaData)
    this.axios.post('http://weixingataoyoujrom.yourjam.cn/index.php?r=tokenfix/settoken', {
      appid: self.oaData.authorizer_appid,
      userType: self.userType,
      ReplayId: self.replyTextSel,
      ReplayText: self.replayEdit,
      Menu: menu
    })
    .then((response) => {
      var data = response.data
      console.log(data)
      if(data.state == 1000) {
        self.showPop("设置成功")
        this.getOADetail()
        this.getReplylist()
      }else {
        self.showPop("设置失败")
      }
    })
    .catch((error) => {
      console.log(error)
    })
  }
},
created: function() {
  this.getOADetail()
  this.getReplylist()
}
}
</script>
<style>
.xtable {
  width: 100%;
  border: 2px solid #ddd;
}

.xtable th,
td {
  border: 1px solid #ddd;
  padding: 15px;
}

.xtable th {
  width: 20%;
  font-size: 16px;
}

.xtable select {
  height: 30px;
  width: 160px;
}

.oa-btn {
  padding: 22px;
  text-align: center;
}

.oa-btn>div {
  display: inline-block;
  border: 1px solid #428bca;
  border-radius: 3px;
  background: #428bca;
  padding: 6px;
  color: #fff;
  cursor: pointer;
}

.menuTable {
  margin-top: 10px;
  width: 100%;
}

.menuTable th,
td {
  padding: 5px;
}

.menuTable input {
  width: 75%;
}
</style>
