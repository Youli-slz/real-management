<template>
<div>
  <div>
    <table class="table table-bordered" v-if="groupList.length">
      <thead>
        <tr>
          <th>名称</th>
          <th>头像</th>
          <th>usertype</th>
          <th>二维码</th>
          <th>账号主体</th>
          <th>新增粉丝</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in groupList">
          <td>{{item.nick_name}}</span></td>
          <td><img :src="item.head_img" style="width: 100px;height: 100px;" /></td>
          <td>{{item.userType}}</td>
          <td><img :src="item.qrcode_url" style="width: 100px;height: 100px;" /></td>
          <td>{{item.principal_name}}</td>
          <td>{{item.todaySubscribe}}</td>
          <td><button class="btn btn-success" @click="jumpTo(item.authorizer_appid)">详情</button></td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="nolist" v-if="groupList.length==0">暂无公众号记录!</div>
  <ul class="pager" v-if="groupList.length">
    <li @click="pre"><a href="javascript:void(0)">上一页</a></li>
    <li @click="next"><a href="javascript:void(0)">下一页</a></li>
    <span>第<span>{{page}}</span>页</span>
    <span>共<span>{{totalpage}}</span>页</span>
  </ul>
</div>
</template>
<script>
export default {
  data() {
    return {
      groupList: [],
      page: 1,
      totalpage: 0,
      pagesize: 20
    }
  },
  methods: {
    pre: function() {
      if (this.page > 1) {
        this.page--
          this.getGroupList()
      }
    },
    next: function() {
      if (this.page < this.totalpage) {
        this.page++
          this.getGroupList()
      }
    },
    getGroupList: function() {
      var self = this
      this.axios.post('http://weixingataoyoujrom.yourjam.cn/index.php?r=tokenfix/gettokenlist', {
        page: this.page
      })
      .then((response) => {
        var data = response.data
        // console.log(data)
        if(data.state == 1000){
          self.groupList = data.data.list
          self.totalpage = data.data.totalPage
        }else {
          self.showPop(data.message)
          self.groupList = []
        }
      })
    },
    jumpTo: function(id) {
      localStorage.oaId = id
      this.$router.push('oadetail')
    }
  },
  created: function() {
    if(localStorage.type == 1000){
      this.getGroupList()
    }

  }
}
</script>
<style>

</style>
