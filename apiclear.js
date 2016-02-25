/**
 * Created by 我那颗冰冷的新 on 2016/2/25.
 */
/**
 *
 *  apiclear技术文档主页
 *  http://www.apiclear.com
 *
 **/

function SHA1(msg) {

	function rotate_left(n, s) {
		var t4 = (n << s ) | (n >>> (32 - s));
		return t4;
	};

	function lsb_hex(val) {
		var str = "";
		var i;
		var vh;
		var vl;

		for ( i = 0; i <= 6; i += 2) {
			vh = (val >>> (i * 4 + 4)) & 0x0f;
			vl = (val >>> (i * 4)) & 0x0f;
			str += vh.toString(16) + vl.toString(16);
		}
		return str;
	};

	function cvt_hex(val) {
		var str = "";
		var i;
		var v;

		for ( i = 7; i >= 0; i--) {
			v = (val >>> (i * 4)) & 0x0f;
			str += v.toString(16);
		}
		return str;
	};

	function Utf8Encode(string) {
		string = string.replace(/\r\n/g, "\n");
		var utftext = "";

		for (var n = 0; n < string.length; n++) {

			var c = string.charCodeAt(n);

			if (c < 128) {
				utftext += String.fromCharCode(c);
			} else if ((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			} else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}

		return utftext;
	};

	var blockstart;
	var i, j;
	var W = new Array(80);
	var H0 = 0x67452301;
	var H1 = 0xEFCDAB89;
	var H2 = 0x98BADCFE;
	var H3 = 0x10325476;
	var H4 = 0xC3D2E1F0;
	var A, B, C, D, E;
	var temp;

	msg = Utf8Encode(msg);

	var msg_len = msg.length;

	var word_array = new Array();
	for ( i = 0; i < msg_len - 3; i += 4) {
		j = msg.charCodeAt(i) << 24 | msg.charCodeAt(i + 1) << 16 | msg.charCodeAt(i + 2) << 8 | msg.charCodeAt(i + 3);
		word_array.push(j);
	}

	switch (msg_len % 4) {
		case 0:
			i = 0x080000000;
			break;
		case 1:
			i = msg.charCodeAt(msg_len - 1) << 24 | 0x0800000;
			break;

		case 2:
			i = msg.charCodeAt(msg_len - 2) << 24 | msg.charCodeAt(msg_len - 1) << 16 | 0x08000;
			break;

		case 3:
			i = msg.charCodeAt(msg_len - 3) << 24 | msg.charCodeAt(msg_len - 2) << 16 | msg.charCodeAt(msg_len - 1) << 8 | 0x80;
			break;
	}

	word_array.push(i);

	while ((word_array.length % 16) != 14)
	word_array.push(0);

	word_array.push(msg_len >>> 29);
	word_array.push((msg_len << 3) & 0x0ffffffff);

	for ( blockstart = 0; blockstart < word_array.length; blockstart += 16) {

		for ( i = 0; i < 16; i++)
			W[i] = word_array[blockstart + i];
		for ( i = 16; i <= 79; i++)
			W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);

		A = H0;
		B = H1;
		C = H2;
		D = H3;
		E = H4;

		for ( i = 0; i <= 19; i++) {
			temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
			E = D;
			D = C;
			C = rotate_left(B, 30);
			B = A;
			A = temp;
		}

		for ( i = 20; i <= 39; i++) {
			temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
			E = D;
			D = C;
			C = rotate_left(B, 30);
			B = A;
			A = temp;
		}

		for ( i = 40; i <= 59; i++) {
			temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
			E = D;
			D = C;
			C = rotate_left(B, 30);
			B = A;
			A = temp;
		}

		for ( i = 60; i <= 79; i++) {
			temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
			E = D;
			D = C;
			C = rotate_left(B, 30);
			B = A;
			A = temp;
		}

		H0 = (H0 + A) & 0x0ffffffff;
		H1 = (H1 + B) & 0x0ffffffff;
		H2 = (H2 + C) & 0x0ffffffff;
		H3 = (H3 + D) & 0x0ffffffff;
		H4 = (H4 + E) & 0x0ffffffff;

	}

	var temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);

	return temp.toLowerCase();

}

/*
 rest.js
 */'use strict';
function copy(obj) {
	if (obj == null || typeof (obj) != 'object')
		return obj;

	var temp = obj.constructor();
	// changed

	for (var key in obj) {
		if (obj.hasOwnProperty(key)) {
			temp[key] = copy(obj[key]);
		}
	}
	return temp;
}

function isType(type) {
	return function(obj) {
		return {}.toString.call(obj) == "[object " + type + "]";
	}
}

var isFunction = isType("Function");

function Resource(appId, appKey, baseurl) {
	var now = Date.now();
	this.appId = appId;
	this.baseurl = baseurl || "https://d.apicloud.com/mcm/api";
	this.appCode = SHA1(appId + "UZ" + appKey + "UZ" + now) + "." + now;
	this.defaultactions = {
		'get' : {
			method : 'GET',
			params : ["_id", "_relation"]
		}, //_relationid 后续支持
		'save' : {
			method : 'POST',
			params : ["_id", "_relation"]
		}, //_relationid 后续支持
		'query' : {
			method : 'GET',
			params : ["filter"]
		},
		'delete' : {
			method : 'DELETE',
			params : ["_id", "_relation"]
		}, //_relationid 后续支持
		'login' : {
			method : "POST",
			params : ["username", "passwordd"]
		},
		'logout' : {
			method : "POST",
			params : ["token"]
		},
		'count' : {
			method : "GET",
			params : ["_id", "_relation", "filter"]
		},
		'exists' : {
			method : "GET",
			params : ["_id"]
		},
		'findOne' : {
			method : 'GET',
			params : ["filter"]
		},
		'verify' : {
			method : "POST",
			params : ["email", "language", "username"],
			alias : "verifyEmail"
		},
		'reset' : {
			method : "POST",
			params : ["id", "email", "language", "username"],
			alias : "resetRequest"
		}
	};
	this.headers = {};
	this.setHeaders("X-APICloud-AppId", this.appId);
	this.setHeaders("X-APICloud-AppKey", this.appCode);
	this.setHeaders("Content-Type", "application/json;");
}

Resource.prototype.setHeaders = function(key, value) {
	this.headers[key] = value;
}
Resource.prototype.upload = function(modelName, isFilter, filepath, params, callback) {
	if ( typeof params == "function") {
		callback = params;
		params = {};
	}
	var url = params["_id"] && params["_relation"] ? ("/" + modelName + "/" + params["_id"] + "/" + params["_relation"]) : "/file";
	var isPut = (!params["_relation"]) && params["_id"];
	var fileUrl = this.baseurl + url + ( isPut ? ("/" + params["_id"]) : "");
	var filename = filepath.substr(filepath.lastIndexOf("/") + 1, filepath.length);
	var ajaxConfig = {
		url : fileUrl,
		method : isPut ? "PUT" : "POST",
		data : {
			values : {
				filename : filename
			},
			files : {
				file : filepath
			}
		}
	}
	ajaxConfig["headers"] = {};
	for (var header in this.headers) {
		ajaxConfig["headers"][header] = this.headers[header];
	}
	api.ajax(ajaxConfig, function(ret, err) {
		if (ret && ret.id && !err) {
			var newobj = {};
			if (isFilter) {
				newobj["id"] = ret["id"];
				newobj["name"] = ret["name"];
				newobj["url"] = ret["url"];
				callback(null, newobj)
			} else {
				callback(null, ret);
			}
		} else {
			callback(ret || err, null)
		}
	});
}

Resource.prototype.Factory = function(modelName) {
	var self = this;
	var route = new Route(modelName, self.baseurl);
	var actions = copy(this.defaultactions);
	var resourceFactory = new Object();
	Object.keys(actions).forEach(function(name) {
		if (modelName != "user" && ["login", "logout", "verify", "reset"].indexOf(name) != -1) {
			return;
		}
		resourceFactory[name] = function(a1, a2, a3) {
			var action = copy(actions[name]);
			var params = {}, data, callback;
			var hasBody = /^(POST|PUT|PATCH)$/i.test(action.method);
			switch (arguments.length) {
				case 3:
					params = a1;
					data = a2;
					callback = a3;
					break;
				case 2:
					if (hasBody)
						data = a1;
					else
						params = a1;
					callback = a2;
					break;
				case 1:
					if (isFunction(a1))
						callback = a1;
					else if (hasBody)
						data = a1;
					else
						params = a1;
					break;
				case 0:
					break;
				default:
					throw new Error("参数最多为3个");
			}
			if (hasBody) {
				var fileCount = 0;
				Object.keys(data).forEach(function(key) {
					var item = data[key];
					if (item && item.isFile) {
						var isFilter = true;
						if (modelName == "file" || item.isFileClass) {
							isFilter = false;
						}
						fileCount++;
						self.upload(modelName, isFilter, item.path, params, function(err, returnData) {
							if (err) {
								return callback(null, err);
							} else {
								if (!isFilter)
									return callback(returnData, null);
								data[key] = returnData;
								fileCount--;
								if (fileCount == 0) {
									next();
								}
							}
						})
					}
				});
				if (fileCount == 0) {
					next();
				}
			} else {
				next();
			}
			function next() {
				var httpConfig = {};
				httpConfig["headers"] = {};
				for (var header in self.headers) {
					httpConfig["headers"][header] = self.headers[header];
				}
				if (name === "logout" && !httpConfig["headers"]["authorization"]) {
					return callback({
						status : 0,
						msg : "未设置authorization参数,无法注销!"
					}, null);
				}
				if (hasBody) {
					httpConfig.data = {
						body : JSON.stringify(data)
					};
				}

				if (params && (name == "save") && params["_id"] && (!params["_relation"]) && (!params["_relationid"])) {
					action.method = "PUT";
				}
				if (params && (name == "save") && params["_id"] && params["_relation"] && params["_relationid"]) {
					action.method = "PUT";
				}
				for (var key in action) {
					if (key != 'params' && key != "alias") {
						httpConfig[key] = copy(action[key]);
					}
				}

				var curparams = {};
				action.params = action.params || [];
				for (var k = 0, len = action.params.length; k < len; k++) {
					var tempkey = action.params[k];
					if (params[tempkey]) {
						curparams[tempkey] = copy(params[tempkey]);
					}
				}
				if (["login", "logout", "count", "exists", "verify", "reset", "findOne"].indexOf(name) != -1) {
					curparams["_custom"] = action.alias || name;
				}
				route.setUrlParams(httpConfig, curparams);
				console.log(httpConfig.method + "\t" + httpConfig.url);
				api.ajax(httpConfig, function(ret, err) {
					return callback(ret, err);
				})
			}

		};
	});
	return resourceFactory;
};

function Route(template, baseurl) {
	this.template = template;
	this.baseurl = baseurl;
}

Route.prototype = {
	setUrlParams : function(config, params) {
		var url = "/:_class/:_id/:_relation/:_custom/:_relationid";
		url = url.replace(":_class", this.template);
		var parArr = [];
		Object.keys(params).forEach(function(ckey) {
			if (ckey.charAt(0) == '_') {
				url = url.replace(":" + ckey, params[ckey]);
				delete params[ckey];
			} else {
				if (ckey == "filter") {
					parArr.push(ckey + "=" + JSON.stringify(params[ckey]));
				}
			}
		});
		url = url.replace(/:[^/]+/ig, '/');
		if (parArr.length > 0) {
			url += ("?" + parArr.join("&"));
		}
		url = url.replace(/\/+/g, '/');
		config.url = this.baseurl + url;
	}
};




/**********************************************
 *异步请求参数使用
 * 使用的时候需要把项目对应的appid和appkey换成自己项目对应的参数
 * @param {Object} method 需要用GET方法还是POST方法
 * @param {Object} posturl 所需要请求的网址
 * @param {Object} jsontext 请求网址的时候需要传入的参数数据
 * @param {Object} callBack 回调参数
 */
function post(method, posturl, jsontext, callBack) {
	var appid = "11111";
	var appk = "22222";
	var bodyt = "";
	if (jsontext != "") {
		bodyt = $api.strToJson(jsontext);
	}
	var now = Date.now();
	var appKey = SHA1(appid + "UZ" + appk + "UZ" + now) + "." + now;
	api.ajax({
		"url" : posturl,
		"method" : method,
		"datatype" : "json",
		"timeout" : 60,
		"cache" : false,
		"returnAll" : false,
		"headers" : {
			"ContentType" : "application/json",
			"Access-Control-Allow-Origin" : "https://d.apicloud.com",
			"X-APICloud-AppId" : appid,
			"X-APICloud-AppKey" : appKey
		},
		"data" : bodyt
	}, function(ret, err) {
		callBack(ret, err);
	});
}
/**
 * 点击打开确定取消弹窗 
 * 返回值为点击按钮的序号  1...
 */
function showmakesure(titletext, msgtext, callBack){
	api.confirm({
	    title: 'testtitle',
	    msg: 'testmsg',
	    buttons: ['确定', '取消']
	},function( ret, err ){
	    if( ret ){
	         callBack(ret.buttonIndex);
	    }else{
	         alert( JSON.stringify( err ) );
	    }
	});
}


/**
 * progresstitle : 缓冲框的题目
 * progresstext : 缓冲框的内容
 * 打开缓冲框 
 */
function showprogress(progresstitle, progresstext){
	api.showProgress({
	    style: 'default',
	    animationType: 'fade',
	    title: progresstitle,
	    text: progresstext,
	    modal: true
	});
}
/**
 * 隐藏缓冲框 顺便用在下拉刷新上面
 * 这样的画 隐藏下拉刷新框也是可以用这个方法的
 * 
 */
function hideprogress(){
	api.hideProgress();	
	api.refreshHeaderLoadDone();
}

/**
 * 将从数据库上面获取到的时间转换为正常时间
 * 传入参数objDate "2015-12-02T08:23:10.572Z"
 * 传入参数objFormat "yyyy-MM-dd HH:mm:ss"
 * 传出参数 2015--12-.......
 */
function getTime(objDate, objFormat) {

	var b = new Date(objDate);
	Date.prototype.format = function(format)//author: meizz
	{
		var o = {
			"M+" : this.getMonth() + 1, //month
			"d+" : this.getDate(), //day
			"h+" : this.getHours(), //hour
			"m+" : this.getMinutes(), //minute
			"s+" : this.getSeconds(), //second
			"q+" : Math.floor((this.getMonth() + 3) / 3), //quarter
			"S" : this.getMilliseconds() //millisecond
		}
		if (/(y+)/.test(format))
			format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (var k in o)
		if (new RegExp("(" + k + ")").test(format))
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
		return format;
	}
	return b.format(objFormat);
}

/**
 * 发布时间格式化
 * [dateDiff 算时间差]
 * 入参：
 * @param  {[type=Number]} hisTime [历史时间戳，必传]
 * @param  {[type=Number]} nowTime [当前时间戳，不传将获取当前时间戳]
 * 出参：
 * @return {[string]}         [string]
 *
 *    date： 2015-05-22
 */
function otherTime(hisTime, nowTime) {

	/**
	 * [dateDiff 算时间差]
	 * @param  {[type=Number]} hisTime [历史时间戳，必传]
	 * @param  {[type=Number]} nowTime [当前时间戳，不传将获取当前时间戳]
	 * @return {[string]}         [string]
	 */

	var now = nowTime ? nowTime : new Date().getTime(), diffValue = now - hisTime, result = '', minute = 1000 * 60, hour = minute * 60, day = hour * 24, halfamonth = day * 15, month = day * 30, year = month * 12, _year = diffValue / year, _month = diffValue / month, _week = diffValue / (7 * day), _day = diffValue / day, _hour = diffValue / hour, _min = diffValue / minute;

	if (_year >= 1)
		result = parseInt(_year) + "年前";
	else if (_month >= 1)
		result = parseInt(_month) + "个月前";
	else if (_week >= 1)
		result = parseInt(_week) + "周前";
	else if (_day >= 1)
		result = parseInt(_day) + "天前";
	else if (_hour >= 1)
		result = parseInt(_hour) + "个小时前";
	else if (_min >= 1)
		result = parseInt(_min) + "分钟前";
	else
		result = "刚刚";
	return result;

}

/**
 * 入参 数组 例如[1,2,3]
 * 出参 字符串  "1,2,3"
 */
function changeType(lableupdate) {
	var len = lableupdate.length;
	if (len == 0) {
		return 0;
	} else {
		var len = lableupdate.length;
		var picurl = '';
		for (var a = 0; a < len; a++) {
			if (a == (len - 1)) {
				picurl = picurl + lableupdate[a];
			} else {
				picurl = picurl + lableupdate[a] + '&';
			}
		}
		return picurl;
	}
}

/**
 *
 * 与楼上方法相反
 *
 */
function changeArray(temppic) {
	var tempArr = "";

	if (temppic != null) {
		if (temppic.length > 0) {
			tempArr = temppic.split("&");
		} else {
			tempArr = "";
		}
	}
	return tempArr;
}

/*自定义通用方法*/

/**参数说明：
 * 根据长度截取先使用字符串，超长部分追加…
 * str 对象字符串
 * len 目标字节长度
 * 返回值： 处理结果字符串
 */
function cutString(str, len) {
	//length属性读出来的汉字长度为1
	if (str.length * 2 <= len) {
		return str;
	}
	var strlen = 0;
	var s = "";
	for (var i = 0; i < str.length; i++) {
		s = s + str.charAt(i);
		if (str.charCodeAt(i) > 128) {
			strlen = strlen + 2;
			if (strlen >= len) {
				return s.substring(0, s.length - 1) + "...";
			}
		} else {
			strlen = strlen + 1;
			if (strlen >= len) {
				return s.substring(0, s.length - 2) + "...";
			}
		}
	}
	return s;
}

/**
 *
 *   生成六位随机数
 *
 *
 * */
function MathRand() {
	var Num = "";
	for (var i = 0; i < 6; i++) {
		Num += Math.floor(Math.random() * 10);
	}
	return Num;
}

/**
 * 删除某个布局
 * 将某个div或者li等等在其母布局中清空
 * 传入参数：该布局在整体布局中的id
 */
function delxml(htmlid){
	var eventdel = document.getElementById(htmlid);
    if (eventdel != null) {
        eventdel.parentNode.removeChild(eventdel);
    }
}

/**
 * 获取当前时间  并将当前时间转换为时间戳
 * 适合苹果浏览器和其他浏览器
 */
function get_today_millisecond(){
	//一天等于多少毫秒
	var onedaymillons = 86400000;
	//获取当前时间的年月日
	var myDate = new Date();
	var year_order = myDate.getFullYear();
	var month_order = myDate.getMonth();
	var day_order = myDate.getDate();
	
	var now_ymdtime = year_order + "-" + (parseInt(month_order) + 1) + "-" + day_order;
	//把当前日期转换为时间戳
	now_ymdtime = now_ymdtime.replace(/-/g,'/');
	var timestamp1 = Date.parse(new Date(now_ymdtime));
	//获取当前是周几
	var weekday = myDate.getDay();
	return timestamp1;
}


/**
 * 判断某些时间是否在某个时间段之内
 * 时间格式为09:00或者22:00等
 */

var time_range = function(beginTime, endTime, nowTime) {


	var strb = beginTime.split(":");
	if (strb.length != 2) {
		return false;
	}

	var stre = endTime.split(":");
	if (stre.length != 2) {
		return false;
	}

	var strn = nowTime.split(":");
	if (stre.length != 2) {
		return false;
	}
	var b = new Date();
	var e = new Date();
	var n = new Date();

	b.setHours(strb[0]);
	b.setMinutes(strb[1]);
	e.setHours(stre[0]);
	e.setMinutes(stre[1]);
	n.setHours(strn[0]);
	n.setMinutes(strn[1]);

	if (n.getTime() - b.getTime() > 0 && n.getTime() - e.getTime() < 0) {
		return true;
	} else {
		return false;
	}
}
/**
 * 连续按两次返回键之后推出程序
 * 入参：你的应用的名称 时间为4秒连续点击则退出应用
 */
var isfinisha = false;
var closewidgeta = null;
function exitApp(appname){
    api.addEventListener({
        name: 'keyback'
    }, function(ret, err){
    
    	if(isfinisha){
	        api.closeWidget({
		        silent:true
		    });
    	}else{
    		add_baceground_time();
	        api.toast({
	            msg: '再按一次返回键退出'+appname,
	            duration:2000,
	            location: 'bottom'
	        });
	        isfinisha = true;
    	}
    });
}

function add_baceground_time(){
	closewidgeta = setTimeout("settimeout_addtime()",4000);
}

function settimeout_addtime(){
	isfinisha = false;
	clearTimeout(closewidgeta);
}

/*****
 *检验是不是手机号 
 */
function isphone(inputString) {
    var partten = /^1[3,4,5,7,8]\d{9}$/;
    if (partten.test(inputString)) {
        return true;
    } else {
        return false;
    }
}

function t(msg, posttion){

	if(posttion == '上'){
		posttion = 'top';
	}else if(posttion == '中'){
		posttion = 'middle';
	}else if(posttion == '下'){
		posttion = 'bottom';
	}

	api.toast({
	    msg: msg,
	    duration: 2000,
	    location: posttion
	});
}