<template>
<div>
  <div style="border-bottom: 1px solid #ccc; padding-bottom: 10px;">
    <span style="font-size: 18px;">type选择：</span>
    <select v-model="typesel" style="width: 80px;">
      <option v-for="item in types" :value="item">{{item}}</option>
    </select>
    <span @click="getBfData" class="btn btn-success" style="margin-left: 50px; margin-right: 300px;">加入昨日数据对比</span>
    <span @click="refreshData" class="btn btn-default" style="color: #fff; background: #428bca">刷新</span>
  </div>

  <div style="position: relative;">
    <div id="main" style="width: 100%; height:600px;"></div>
    <div style="position: absolute; top: 200px; left: 45%;" v-if="!nowdata.length">
      暂无数据记录！
    </div>
  </div>
</div>
</template>
<script>
export default {
  data() {
    return {
      types: [],
      typesel: '',
      startTime: '',
      endTime: '',
      nowdata: [],
      bfdata: [],
      statue: 1,
      refresh: false,
    }
  },
  watch: {
    typesel: function(value) {
      this.getNowData()
    }
  },
  methods: {
    getTypes: function() {
      var self = this
      this.$http.post('http://101.37.86.32:8818/liebian/get_type_group_setting_list')
        .then(response => {
          var data = response.data
          // console.log(data)
          if (data.code == 0) {
            if (data.data != null) {
              for (var i = 0; i < data.data.length; i++) {
                if (data.data[i].type != 1000)
                  self.types.push(data.data[i].type)
              }
              self.typesel = 7
            } else {
              self.types = []
            }
          }
        }, (error) => {
          console.log(error)
        })
    },
    refreshData: function() {
      if(this.state == 1){
        this.refresh = false
      }else if(this.statue == 2){
        this.refresh = true
        this.statue = 1
      }
      this.getNowData()
    },
    getNowData: function() {
      this.startTime = parseInt(new Date(new Date().setHours(0, 0, 0, 0)) / 1000);
      this.endTime = parseInt(new Date().getTime() / 1000);
      this.statue = 1
      this.getLineData()
      // var notime = new Date(this.endTime * 1000)
      // console.log(notime)
    },
    getBfData: function() {
      this.startTime = parseInt(new Date(new Date().setHours(0, 0, 0, 0)) / 1000 - 86400);
      this.endTime = parseInt(new Date(new Date().setHours(0, 0, 0, 0)) / 1000 - 1);
      this.statue = 2
      this.getLineData()
      // var notime = new Date(this.startTime * 1000)
      // console.log(notime)
    },
    getLineData: function() {
      var self = this
      this.$http.post('http://101.37.86.32:8818/liebian/get_group_monitor', {
          "type": this.typesel,
          "startTime": this.startTime,
          "endTime": this.endTime
        })
        .then(response => {
          var data = response.data
          // console.log(data)
          if (data.code == 0) {
            if (self.statue == 1) {
              self.nowdata = data.data == null ? [] : data.data
              // console.log(self.nowdata)
              if(self.refresh){
                self.statue = 2;
                self.refresh = false;
                self.getBfData()
              }
            } else if (self.statue == 2) {
              self.bfdata = data.data
            }
          }
          this.echarts()
        }, error => {
          console.log(error)
        })
    },
    getTime: function(t) {
      var date = new Date(t * 1000)
      var h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
      var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
      return h + m;
    },
    getXY: function(data) {
      var self = this
      var newdata = {
        x: [],
        y: []
      }
      if (data != null) {
        for (var i = 0; i < data.length; i++) {
          newdata.x.push(self.getTime(data[i].timePoint))
          newdata.y.push(data[i].groupNum)
        }
      }
      // console.log(newdata)
      return newdata
    },
    echarts: function() {
      var myChart = echarts.init(document.getElementById('main'));
      var nowxy = this.getXY(this.nowdata)
      // 指定图表的配置项和数据
      if(this.statue == 1){
        var option = {
          title: {
            text: '数据监控曲线'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['今日数据']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: nowxy.x
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            name: '今日数据',
            type: 'line',
            // stack: '总量',
            data: nowxy.y
          }]
        };
      }else if(this.statue == 2){
        // console.log("statue2")
        var bfxy = this.getXY(this.bfdata)
        // console.log(bfxy)
        var option = {
          title: {
            text: '数据监控曲线'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['今日数据', '昨日数据']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: bfxy.x
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            name: '今日数据',
            type: 'line',
            // stack: '总量',
            data: nowxy.y
          }, {
            name: '昨日数据',
            type: 'line',
            // stack: '总量',
            data: bfxy.y
          }]
        };
      }

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    }
  },
  created: function() {
    this.getTypes()
  }
}
</script>
<style>

</style>
