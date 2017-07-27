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

  <div class="popup" v-show="confirmFlag">
    <div class="popbox">
      <div style="border-bottom: 1px solid #dedede; padding: 15px;">{{confirmContent}}</div>
      <div class="popbox-footer">
        <span class="popbox-btn" @click="confirmTrue">确定</span>
        <span class="popbox-btn" @click="closeConfirm">取消</span>
      </div>
    </div>
  </div>

  <div class="popup" v-show="popupImgFlag" @click="closeLookImg">
    <div class="imgbox">
      <img :src="popupImgUrl" style="width: 100%;" />
    </div>
  </div>

  <div>
    <table class="table table-bordered" v-if="robotlist.length">
      <tr class="head-table">
        <th>机器人ID:</th>
        <td>{{robotlist[0].id}}</td>
        <th>渠道号:</th>
        <td>{{robotlist[0].type}}</td>
      </tr>
    </table>

    <div @click="showAdd" class="btn btn-success" style="margin-left: 80%; margin-bottom: 20px;">添加消息</div>
    <table class="table table-bordered" v-show="addFlag">
      <thead>
        <tr class="thcolor">
          <th style="width: 80px;">设置类型</th>
          <th style="width: 150px;">设置时间间隔(毫秒)</th>
          <th>消息编辑
            <select style="margin-left: 50px; width: 80px; height: 25px;" v-model="mestypesel">
              <option v-for="item in mestypes" :value="item.value">
                {{item.text}}
              </option>
            </select>
            <button @click="addMes" style="margin-left: 20px;" class="btn btn-success">添加</button>
          </th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <select v-model="addtype">
                <option v-for="item in types" :value="item.value">{{item.text}}</option>
            </select>
          </td>
          <td v-if="addtype == 0|| addtype == 1 || addtype == 2"><input class="inputwidth" type="number" v-model="addinterval" /></td>
          <td v-else-if="addtype == 100"><input class="inputwidth" type="number" v-model="addafter" /></td>
          <td v-else></td>
          <td>
            <table style="width: 100%;">
              <tr v-for="mes in addmes">
                <td style="width: 80px;">
                  <div>
                    {{mes.msgType | mesname}}
                  </div>
                  <button @click="delMes(mes, addmes)" class="btn btn-danger">删除</button>
                </td>
                <td v-if="mes.msgType == 'text'">
                  <textarea class="mestext" v-model="mes.msg"></textarea>
                </td>
                <td v-if="mes.msgType == 'img'" style="padding-left: 20px;">
                  <span class="imgspan" v-for="mesimg in mes.msg" @mouseover="imgHover(mesimg)" @mouseout="imgHover('')">
                    <img :src="mesimg" style="width: 100px;" />
                    <div v-show="mesimg == imghover">
                      <div @click="lookImg(mesimg)">查看</div>
                      <div @click="delImg(mesimg, mes.msg)">删除</div>
                    </div>
                  </span>
                  <div class="am-form-group am-form-file" id="btnwrapadd">
                    <label type="button" class="btn btn-success" @click='updataImg(mes.msg)'>
                        <i class="glyphicon glyphicon-open-file"></i> 添加图片
                        <input type="file" id="qrcode_urladd" class="hide" />
                    </label>
                  </div>
                </td>
              </tr>
            </table>
          </td>
          <td><button class="btn btn-success" @click="addMesSetting()">确定</button></td>
        </tr>
      </tbody>
    </table>
    <table class="table table-bordered" v-if="robotlist.length">
      <thead>
        <tr class="thcolor">
          <th style="width: 80px;">设置类型</th>
          <th style="width: 150px;">设置时间间隔(秒)</th>
          <th>消息编辑</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in robotlist">
          <td>{{item.settingType | typename}}</td>
          <td v-if="item.settingType == 0|| item.settingType == 1 || item.settingType == 2"><input class="inputwidth" type="number" v-model="item.interval" /></td>
          <td v-else-if="item.settingType == 100"><input class="inputwidth" type="number" v-model="item.after" /></td>
          <td v-else></td>
          <td>
            <tr>
              <td style="padding: 0 20px; font-size: 16px; color: #428bca;">消息添加</td>
              <td>
                <select style="margin-left: 50px; width: 80px; height: 25px;" v-model="mestypelist[item.id]">
                  <option v-for="item in mestypes" :value="item.value">
                    {{item.text}}
                  </option>
                </select>
                <button @click="addUpdataMes(item)" style="margin: 0 30px;" class="btn btn-success">添加</button>
              </td>
            </tr>
            <table style="width: 100%; margin-top: 20px;">
              <tr v-for="mes in item.msg">
                <td style="width: 80px;">
                  <div>
                    {{mes.msgType | mesname}}
                  </div>
                  <button @click="delMes(mes, item.msg)" class="btn btn-danger">删除</button>
                </td>
                <td v-if="mes.msgType == 'text'">
                  <textarea class="mestext" v-model="mes.msg"></textarea>
                </td>
                <td v-if="mes.msgType == 'img'" style="padding-left: 20px;">
                  <span class="imgspan" v-for="mesimg in mes.msg" @mouseover="imgHover(mesimg)" @mouseout="imgHover('')">
                    <img :src="mesimg" style="width: 100px;" />
                    <div v-show="mesimg == imghover">
                      <div @click="lookImg(mesimg)">查看</div>
                      <div @click="delImg(mesimg,mes.msg)">删除</div>
                    </div>
                  </span>
                  <div class="am-form-group am-form-file" :id="'btnwrap'+item.id">
                    <label type="button" class="btn btn-success" @click='updataImg(mes.msg)'>
                        <i class="glyphicon glyphicon-open-file"></i> 添加图片
                        <input type="file" :id="'qrcode_url'+item.id" class="hide" />
                    </label>
                  </div>
                </td>
              </tr>
            </table>
          </td>
          <td><button class="btn btn-success" @click="showConfirm(item)">更新</button></td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="nolist" v-if="robotlist.length==0">暂无数据记录!</div>
</div>
</template>
<script>
export default {
  data() {
    return {
      popupFlag: false, //提示弹窗控制位
      popupContent: '', //弹窗内显示的内容
      confirmFlag: false,
      confirmContent: '确认更新机器人消息配置？',
      addFlag: false,
      types: [{
        value: 0,
        text: '入群必读'
      }, {
        value: 1,
        text: '截图上报'
      }, {
        value: 2,
        text: '定时发送',
      }, {
        value: 100,
        text: '满群多少秒后发送',
      }, {
        value: 200,
        text: '满群后截图上报',
      }],
      addtype: 0,
      addinterval: 10,
      addafter: 0,
      mestypesel: 'text',
      mestypes: [{
        value: 'text',
        text: '文本'
      }, {
        value: 'img',
        text: '图片'
      }],
      addmes: [],
      addImgUrls: [],
      popupImgFlag: false,
      popupImgUrl: '',
      robotlist: {},
      mestypelist: {},
      robotItem: {},
      uptoken: '',
      imgUrls: [],
      imghover: 'img'
    }
  },
  watch: {
    addinterval: function(value) {
      if(value < 10){
        this.addinterval = 10
        this.showPop("请设置10秒以上")
      }
    },
    addafter: function(value) {
      if(value < 0){
        this.addafter = 0
      }
    }
  },
  filters: {
    typename: function(value) {
      var text;
      switch (value) {
        case 0:
          text = '入群必读';
          break;
        case 1:
          text = '截图上报';
          break;
        case 2:
          text = '定时发送';
          break;
        case 100:
          text = '满群多少秒后发送';
          break;
        case 200:
          text = '满群后截图上报';
          break;
      }
      return text
    },
    mesname: function(value) {
      if (value == 'text') {
        return "文本"
      } else if (value == "img") {
        return "图片"
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
    showConfirm: function(item) {
      this.confirmFlag = true
      // console.log(item)
      this.robotItem = JSON.parse(JSON.stringify(item))
    },
    closeConfirm: function() {
      this.confirmFlag = false
    },
    confirmTrue: function() {
      this.confirmFlag = false
      // this.updateRobot()
      this.updateRobot()
    },
    showAdd: function() {
      this.addFlag = true
    },
    addMes: function() {
      var imgFlag = true
      for(var i = 0; i < this.addmes.length; i++){
        if(this.addmes[i].msgType === 'img'){
          imgFlag = false
          break
        }
      }
      if(imgFlag && this.mestypesel == 'img'){
        var item = {
          msgType: this.mestypesel,
          msg: []
        }
        this.addmes.push(item)
        setTimeout( () => {
          this.upload('add')
        }, 200)
      }else if(this.mestypesel == 'text') {
        var item = {
          msgType: this.mestypesel,
          msg: ''
        }
        this.addmes.push(item)
      }

    },
    delMes: function(mes, item) {
      var index = item.indexOf(mes)
      if (index > -1) {
        item.splice(index, 1)
      }
    },
    addMesSetting: function() {
      var addmes = JSON.parse(JSON.stringify(this.addmes))
      for(var i = 0; i < addmes.length; i++){
        if(addmes[i].msgType === 'img'){
          addmes[i].msg = addmes[i].msg.join('|||')
        }
      }
      // console.log(addmes)
      var item = {
        type: parseInt(localStorage.robottype),
        settingType: this.addtype || 0,
        msg: addmes,
        interval: this.addinterval || 0,
        after: this.addafter
      }
      // console.log(item)

      this.$http.post('http://101.37.86.32:8818/liebian/create_robot_msg_setting', item)
      .then( response => {
        var data = response.data
        console.log(data)
        if(data.code == 0){
          this.showPop('添加成功')
          this.getRobot()
          this.addmes = []
          this.addFlag = false
        }else {
          this.showPop('添加失败')
        }
      })
    },
    lookImg: function(url) {
      this.popupImgFlag = true
      this.popupImgUrl = url
    },
    closeLookImg: function() {
      this.popupImgFlag = false
    },
    imgHover: function(url) {
      // console.log('in')
      this.imghover = url
    },
    getRobot: function() {
      var self = this
      this.$http.post('http://101.37.86.32:8818/liebian/get_type_msg_setting', {
          type: parseInt(localStorage.robottype)
        })
        .then(response => {
          var data = response.data
          console.log(data)
          if (data.code == 0) {
            if (data.data != null) {
              self.robotlist = data.data
              for (var i = 0; i < self.robotlist.length; i++) {
                self.robotlist[i].msg = eval(self.robotlist[i].msg)
                self.mestypelist[self.robotlist[i].id] = 'text'
                for (var j = 0; j < self.robotlist[i].msg.length; j++) {
                  if (self.robotlist[i].msg[j].msgType == 'img') {
                    self.robotlist[i].msg[j].msg = self.robotlist[i].msg[j].msg.split("|||")
                    // console.log(self.robotlist[i].msg[j].msg)
                  }
                }
              }
              self.getuptoken();
            } else {
              self.robotlist = []
            }
          }
        }, (error) => {
          console.log(error)
        })
    },
    addUpdataMes: function(item) {
      var imgFlag = true
      for(var i = 0; i < item.msg.length; i++){
        if(item.msg[i].msgType === 'img'){
          imgFlag = false
          break
        }
      }
      if(imgFlag && this.mestypelist[item.id] == 'img'){
        var additem = {
          msgType: this.mestypelist[item.id],
          msg: []
        }
        item.msg.push(additem)
        setTimeout( () => {
          this.upload(item.id)
        }, 200)
      }else if(this.mestypelist[item.id] == 'text') {
        var additem = {
          msgType: this.mestypelist[item.id],
          msg: ''
        }
        item.msg.push(additem)
      }
    },
    delImg: function(url, item) {
      // console.log(item)
      var index = item.indexOf(url)
      if (index > -1) {
        item.splice(index, 1)
      }
    },
    dateFormat: function() {
      console.log("before")
      console.log(this.robotItem.msg)
      for (var i = 0; i < this.robotItem.msg.length; i++) {
        if (this.robotItem.msg[i].msgType == 'img') {
          // this.robotItem.msg[i].msg = this.robotItem.msg[i].msg.concat(this.imgUrls)
          this.robotItem.msg[i].msg = this.robotItem.msg[i].msg.join('|||')
        }
      }
      this.robotItem.msg = JSON.stringify(this.robotItem.msg)
      // console.log(this.robotItem)
    },
    updataImg: function(item) {
      console.log(item)
      this.imgUrls = item
    },
    updateRobot: function() {
      this.dateFormat()
      var self = this
      this.$http.post('http://101.37.86.32:8818/liebian/update_type_msg_setting', this.robotItem)
        .then(response => {
          var data = response.data
          console.log(data)
          if (data.code == 0) {
            self.showPop("更新成功")
            self.getRobot()
            self.imgUrls = []
          } else {
            self.showPop("更新失败")
          }
        }, error => {
          console.log(error)
        })
    },
    upload: function(id) {
      // console.log(id)
      // var id = document.getElementById('btnwrap'+id)
      // console.log(id)
      var self = this;

      var uploader = Qiniu.uploader({
        runtimes: 'html5,flash,html4', //上传模式,依次退化
        browse_button: 'qrcode_url'+id, //上传选择的点选按钮，**必需**
        uptoken: this.uptoken,
        //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
        // uptoken : '<Your upload token>',
        //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
        // unique_names: true,
        // 默认 false，key为文件名。若开启该选项，SDK会为每个文件自动生成key（文件名）
        save_key: true,
        // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK在前端将不对key进行任何处理
        domain: 'http://oe3slowqt.bkt.clouddn.com/',
        //bucket 域名，下载资源时用到，**必需**
        container: 'btnwrap'+id, //上传区域DOM ID，默认是browser_button的父元素，
        max_file_size: '5mb', //最大文件体积限制
        flash_swf_url: 'qiniu/Moxie.swf', //引入flash,相对路径
        max_retries: 3, //上传失败最大重试次数
        dragdrop: true, //开启可拖曳上传
        drop_element: 'container', //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
        chunk_size: '4mb', //分块上传时，每片的体积
        auto_start: true, //选择文件后自动上传，若关闭需要自己绑定事件触发上传
        filters: {
          mime_types: [{
              title: "Image files",
              extensions: "jpg,png"
            } // 限定flv后缀上传格式上传
          ]
        },
        multi_selection: false,
        init: {
          'FileUploaded': function(up, file, info) {
            var domain = up.getOption('domain');
            var res = JSON.parse(info);
            var urlImg = 'http://oe3slowqt.bkt.clouddn.com/' + res.key;
            console.log(urlImg);
            self.imgUrls.push(urlImg);
          },
          'Error': function(up, err, errTip) {
            //上传出错时，处理相关的事情
            alert("上传出错，请刷新重新上传")
          }
        }
      });
    },
    getuptoken: function() {
      var self = this;
      this.axios.get('http://tym.taoyumin.cn/index.php?r=search/token')
        .then((response) => {
          var data = JSON.parse(response.data);
          // console.log(data)
          if (data.state == 1000) {
            self.uptoken = data.data;
            // self.upload();
            for (var i = 0; i < self.robotlist.length; i++) {
              self.upload(self.robotlist[i].id)
            }
          } else if (data.state == 1001) {
            self.showPop(data.message);
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
  },
  created: function() {
    this.getRobot();
  }
}
</script>
<style>
.thcolor {
  color: #428bca;
}

.head-table th {
  width: 8%;
  text-align: center;
  padding: 10px;
}

.head-table td {
  width: 42%;
  padding: 10px;
}

.inputwidth {
  width: 80px;
}

.mestext {
  width: 100%;
  min-width: 500px;
  min-height: 120px;
  resize: none;
  font-size: 13px;
}

.imgspan {
  margin-right: 20px;
  position: relative;
  display: inline-block;
}

.imgspan>div {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(120, 120, 120, 0.5);
}

.imgspan>div>div {
  display: inline-block;
  padding: 2px 6px;
  color: #fff;
  border-radius: 3px;
  cursor: pointer;
}

.imgspan>div>div:nth-child(1) {
  background: #449d44;
}

.imgspan>div>div:nth-child(2) {
  background: red;
  margin-left: 15px;
}

.imgbox {
  width: 500px;
  margin: 0 auto;
  margin-top: 100px;
}
</style>
