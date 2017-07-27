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

  <div>
    <div @click="showAdd" class="btn btn-success" style="margin-left: 80%; margin-bottom: 20px;">添加渠道</div>
    <table class="table table-bordered" v-show="addFlag">
      <thead>
        <tr>
          <th>渠道号</th>
          <th>同时开几路</th>
          <th style="display: none">机器人</th>
          <th>描述</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <input type="number" v-model="addType" placeholder="不能重复" required="required" />
          </td>
          <td>
            <input type="number" v-model="addNum" />
          </td>
          <td>
            <textarea style="resize: none; width: 100%;" v-model="addDesc" />
          </td>
          <td>
            <button @click="addGroup" class="btn btn-success">确定</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div>
    <table class="table table-bordered" v-if="groupList.length">
      <thead>
        <tr>
          <th>渠道号</th>
          <th>同时开几路</th>
          <th style="display: none">机器人</th>
          <th>描述</th>
          <th>渠道群配置</th>
          <th>机器人配置</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in groupList">
          <td>{{item.type}}</td>
          <td><input type="number" v-model="item.groupNum" /></td>
          <td style="display: none">{{item.robotHost}}</td>
          <td><textarea style="resize: none; width: 100%;" v-model="item.desc" /></td>
          <td><button class="btn btn-success" @click="showConfirm(item)">更新</button></td>
          <td><button class="btn btn-success" @click="jumpTo(item.type)">设置</button></td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="nolist" v-if="groupList.length==0">暂无数据记录!</div>

</div>
</template>
<script>
export default {
  data() {
    return {
      popupFlag: false, //提示弹窗控制位
      popupContent: '', //弹窗内显示的内容
      confirmFlag: false,
      confirmContent: '确认更新渠道群配置？',
      addFlag: false,
      groupList: [],
      groupItem: {},
      addType: '',
      addNum: '',
      addDesc: '',
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
      this.updataGroup()
    },
    showAdd: function() {
      this.addFlag = true
    },
    getGroupList: function() {
      var that = this
      this.$http.post('http://101.37.86.32:8818/liebian/get_type_group_setting_list')
      .then( response => {
        var data = response.data
        // console.log(data)
        if(data.code == 0){
          if(data.data != null){
            that.groupList = data.data
          }else {
            that.groupList = []
          }
        }
      }, (error) => {
        console.log(error)
      })
    },
    updataGroup: function() {
      var self = this;
      this.$http.post('http://101.37.86.32:8818/liebian/update_type_group_setting',this.groupItem)
      .then( response => {
        var data = response.data
        console.log(data)
        if(data.code == 0){
          self.showPop('更新成功')
          self.getGroupList()
        }else {
          self.showPop('更新失败')
        }
      })
    },
    addGroup: function() {
      var self = this
      if(this.addType != ""){
        this.$http.post('http://101.37.86.32:8818/liebian/create_group_setting', {
          type: this.addType,
          groupNum: this.addNum || 1,
          desc: this.addDesc
        })
        .then( response => {
          var data = response.data
          console.log(data)
          if(data.code == 0){
            self.showPop("添加成功")
            self.addFlag = false
            self.getGroupList()
          }else {
            self.showPop("添加失败(渠道号不能重复)")
          }
        }, error => {
          console.log(error)
        })
      }else {
        self.showPop("渠道号必须填写")
      }
    },
    jumpTo: function(type) {
      this.$router.push('/robot')
      localStorage.robottype = type
    }
  },
  created: function() {
    this.getGroupList()
  }
}
</script>
<style>

</style>
