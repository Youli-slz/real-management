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

  <div class="content">
    <ul class="nav nav-pills">
      <li role="presentation" v-bind:class="{active:status == 1}" @click="select(1)"><a href="javascript:void(0)">裂变中群</a></li>
      <li role="presentation" v-bind:class="{active:status == 2}" @click="select(2)"><a href="javascript:void(0)">所有可用群{{sum2}}</a></li>
    </ul>
    <br />
    <table class="table table-bordered" v-if="groupList.length">
      <thead>
        <tr>
          <th>群名称</th>
          <th>群二维码</th>
          <th v-if="status == 2">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in groupList">
          <td>{{item.name}}<span style="color: red" v-if="item.robotWx != ''">(正在裂变中)</span></td>
          <td><img :src="item.url" style="width: 100px;height: 115px;" /></td>
          <td v-if="status == 2"><button class="btn btn-success" @click="showConfirm(item.id)">删除</button></td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="nolist" v-if="groupList.length==0">暂无群情况记录!</div>
  <ul class="pager" v-if="groupList.length&&status==2">
    <li @click="pre"><a href="javascript:void(0)">上一页</a></li>
    <li @click="next"><a href="javascript:void(0)">下一页</a></li>
    <span>第<span>{{page+1}}</span>页</span>
    <span>共<span>{{totalpage}}</span>页</span>
  </ul>

</div>
</template>
<script>
export default{
  name: 'querygroup',
  data() {
    return {
      popupFlag: false, //提示弹窗控制位
      popupContent: '', //弹窗内显示的内容
      confirmFlag: false,
      confirmContent: '确认删除该群图片？',
      delId: '',
      status: 1,
      groupList: [],
      sum2: '',
      page: 0,
      totalpage: 0,
      pagesize: 100
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
    showConfirm: function(id){
      this.confirmFlag = true
      this.delId = id
    },
    closeConfirm: function() {
      this.confirmFlag = false
    },
    confirmTrue: function() {
      this.confirmFlag = false
      this.delGroup()
    },
    select: function(value) {
      this.status = value
      this.page = 0
      if(value == 1){
        this.getActiveGroup()
      }else if(value == 2){
        this.getGroupList()
      }
    },
    pre: function() {
      if (this.page > 0) {
        this.page--
          this.getGroupList()
      }
    },
    next: function() {
      if (this.page < this.totalpage - 1) {
        this.page++
          this.getGroupList()
      }
    },
    getActiveGroup: function() {
      var that = this
      this.$http.post('http://101.37.86.32:8818/liebian/get_active_qrcode_url',{type: parseInt(localStorage.type)})
      .then((response) => {
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
    getGroupList: function() {
      var self = this
      this.$http.post('http://101.37.86.32:8818/liebian/get_all_qrcode_url', {
        type: parseInt(localStorage.type),
        offset: self.page * self.pagesize,
        num: self.pagesize
      })
        .then((response) => {
          var data = response.data
          console.log(data)
          if (data.code == 0) {
            var list = data.data.list;
            if (list != null) {
              // console.log(data.data.count)
              self.totalpage = Math.ceil(data.data.count / self.pagesize)
              self.groupList = data.data.list
              self.sum2 = "("+data.data.count+")"
            } else {
              self.groupList = [];
              self.sum2 = ""
            }
          }
        }, (error) => {
          console.log(error)
        })
    },
    delGroup: function(){
      var self = this
      this.$http.post('http://101.37.86.32:8818/liebian/expired_qrcode_url', {id: this.delId})
      .then((response) => {
        var data = response.data
        // console.log(data)
        if(data.code == 0){
          self.showPop("删除成功")
          self.page = 0
          self.getGroupList()
        }else {
          self.showPop("删除失败，请重试")
        }
      }, (error) => {
        console.log(error)
      })
    }
  },
  created: function(){
    this.getActiveGroup()
  }
}
</script>
<style>
.content {
  margin-top: 12px;
}

.nolist {
  text-align: center;
  margin: 30px;
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
