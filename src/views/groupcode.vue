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

  <img :src="imgUrl" />
</div>
</template>
<script>
export default {
  data() {
    return {
      popupFlag: false, //提示弹窗控制位
      popupContent: '', //弹窗内显示的内容
      imgUrl: ''
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
    getGroupCode: function() {
      var self = this
      this.$http.post('http://101.37.86.32:6165/startwx2', {})
      .then((response) => {
        // console.log(response)
        var data = response.data
        if(data.code == 0){
          self.imgUrl = data.data.qrcodeUrl
        }else{
          self.showPop("请求出错，请刷新！")
        }
      },(error) => {
        console.log(error)
      })
    }
  },
  created: function() {
    if(localStorage.type == 1000){
      this.getGroupCode()
    }
  }
}
</script>
<style>
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
</style>
