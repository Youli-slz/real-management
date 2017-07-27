export const islogin = function (callback){
  $.ajax({
    type: 'get',
    xhrFields: {withCredentials: true},
    // crossDomain: true,
    url: 'http://weixingataoyoujrom.yourjam.cn/index.php?r=user/check',
    success: function(response) {
      // console.log('in')
      // console.log(response)
      callback(response.state)
    },
    error: function(error) {
      console.log(error)
    }
  })

}
