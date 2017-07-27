export const islogin = function (callback) {
	var is = false;
	var xhr = function () {
		if (window.XMLHttpRequest) {
			return new XMLHttpRequest();
		} else {
			return new ActiveObject('Micrsorf.XMLHttp');
		}
	}();

	xhr.onreadystatechange = function () {
		if(xhr.readyState != 4){
			return false;
		}
		if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
			var data = JSON.parse(xhr.responseText);
			console.log(data)
			callback(data)
//			if (data.state == 1000) {
//				is = true;
//				callback(data);
//			}
		} else {
			console.log('error:' + xhr.status);
		}
	}
	xhr.open('get', 'http://jianshenweixin.yourjam.cn/index.php?r=user/check', true);
	xhr.withCredentials = true;
	xhr.send(null);
}
