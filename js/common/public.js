/*!
 * jQuery-ajaxTransport-XDomainRequest - v1.0.4 - 2015-03-05
 * https://github.com/MoonScript/jQuery-ajaxTransport-XDomainRequest
 * Copyright (c) 2015 Jason Moon (@JSONMOON)
 * Licensed MIT (/blob/master/LICENSE.txt)
 */
(function(factory) {
	if(typeof define === 'function' && define.amd) {
		// AMD. Register as anonymous module.
		define(['jquery'], factory);
	} else if(typeof exports === 'object') {
		// CommonJS
		module.exports = factory(require('jquery'));
	} else {
		// Browser globals.
		factory(jQuery);
	}
}(function($) {

	// Only continue if we're on IE8/IE9 with jQuery 1.5+ (contains the ajaxTransport function)
	if($.support.cors || !$.ajaxTransport || !window.XDomainRequest) {
		return $;
	}

	var httpRegEx = /^(https?:)?\/\//i;
	var getOrPostRegEx = /^get|post$/i;
	var sameSchemeRegEx = new RegExp('^(\/\/|' + location.protocol + ')', 'i');

	// ajaxTransport exists in jQuery 1.5+
	$.ajaxTransport('* text html xml json', function(options, userOptions, jqXHR) {

		// Only continue if the request is: asynchronous, uses GET or POST method, has HTTP or HTTPS protocol, and has the same scheme as the calling page
		if(!options.crossDomain || !options.async || !getOrPostRegEx.test(options.type) || !httpRegEx.test(options.url) || !sameSchemeRegEx.test(options.url)) {
			return;
		}

		var xdr = null;

		return {
			send: function(headers, complete) {
				var postData = '';
				var userType = (userOptions.dataType || '').toLowerCase();

				xdr = new XDomainRequest();
				if(/^\d+$/.test(userOptions.timeout)) {
					xdr.timeout = userOptions.timeout;
				}

				xdr.ontimeout = function() {
					complete(500, 'timeout');
				};

				xdr.onload = function() {
					var allResponseHeaders = 'Content-Length: ' + xdr.responseText.length + '\r\nContent-Type: ' + xdr.contentType;
					var status = {
						code: 200,
						message: 'success'
					};
					var responses = {
						text: xdr.responseText
					};
					try {
						if(userType === 'html' || /text\/html/i.test(xdr.contentType)) {
							responses.html = xdr.responseText;
						} else if(userType === 'json' || (userType !== 'text' && /\/json/i.test(xdr.contentType))) {
							try {
								responses.json = $.parseJSON(xdr.responseText);
							} catch(e) {
								status.code = 500;
								status.message = 'parseerror';
								//throw 'Invalid JSON: ' + xdr.responseText;
							}
						} else if(userType === 'xml' || (userType !== 'text' && /\/xml/i.test(xdr.contentType))) {
							var doc = new ActiveXObject('Microsoft.XMLDOM');
							doc.async = false;
							try {
								doc.loadXML(xdr.responseText);
							} catch(e) {
								doc = undefined;
							}
							if(!doc || !doc.documentElement || doc.getElementsByTagName('parsererror').length) {
								status.code = 500;
								status.message = 'parseerror';
								throw 'Invalid XML: ' + xdr.responseText;
							}
							responses.xml = doc;
						}
					} catch(parseMessage) {
						throw parseMessage;
					} finally {
						complete(status.code, status.message, responses, allResponseHeaders);
					}
				};

				// set an empty handler for 'onprogress' so requests don't get aborted
				xdr.onprogress = function() {};
				xdr.onerror = function() {
					complete(500, 'error', {
						text: xdr.responseText
					});
				};

				if(userOptions.data) {
					postData = ($.type(userOptions.data) === 'string') ? userOptions.data : $.param(userOptions.data);
				}
				xdr.open(options.type, options.url);
				xdr.send(postData);
			},
			abort: function() {
				if(xdr) {
					xdr.abort();
				}
			}
		};
	});

	return $;

}));
//深拷贝函数
function ObjCopy(obj) {
	var tmp_obj;
	if(typeof obj == 'object') {
		if(obj instanceof Array) {
			tmp_obj = [];
		} else {
			tmp_obj = {};
		}
	} else {
		return obj;
	}
	for(var i in obj) {
		if(typeof obj[i] != 'object') {
			tmp_obj[i] = obj[i];
		} else if(obj[i] instanceof Array) {
			tmp_obj[i] = [];
			for(var j in obj[i]) {
				if(typeof obj[i][j] != 'object') {
					tmp_obj[i][j] = obj[i][j];
				} else {
					tmp_obj[i][j] = ObjCopy(obj[i][j]);
				}
			}
		} else {
			tmp_obj[i] = ObjCopy(obj[i]);
		}
	}
	return tmp_obj;
}

/**
 * 去除数组重复
 * [getArray description]
 * @param  {[type]} arr [description]
 * @return {[type]}     [description]
 */
function getArray(arr) {
	var hash = {};
	var len = arr.length;
	var result = [];

	for(var i = 0; i < len; i++) {
		if(!hash[arr[i]]) {
			hash[arr[i]] = true;
			result.push(arr[i]);
		}
	}
	return result;
}

function PostAjax(url, param, header, className) {
	var headers = (header === undefined ? {
		'Content-Type': 'application/json;charset=UTF-8'
	} : header);
	var ajaxObj = $.ajax({
		url: url,
		type: 'post',
		data: param,
		datatype: 'jsonp',
		jsonp: 'callback',
		headers: headers,
		beforeSend: function() {
			if(className) {
				var loadHtml =
					'<div class="common-loading">' +
					'<div class="img"></div>' +
					'</div>';
				var fixDiv = $(className);
				fixDiv.css("position", "relative");
				fixDiv.append(loadHtml);
			}

		},
		complete: function() {
			if(className) {
				var fixDiv = $(className);
				fixDiv.children(".common-loading").remove();
			}
		}
	});
	return ajaxObj;
};

function PutAjax(url, param, header, className) {
	var headers = (header === undefined ? {
		'Content-Type': 'application/json;charset=UTF-8'
	} : header);
	var ajaxObj = $.ajax({
		url: url,
		type: 'PUT',
		datatype: 'jsonp',
		jsonp: 'callback',
		data: param,
		headers: headers,
		beforeSend: function() {
			if(className) {
				var loadHtml =
					'<div class="common-loading">' +
					'<div class="img"></div>' +
					'</div>';
				var fixDiv = $(className);
				fixDiv.css("position", "relative");
				fixDiv.append(loadHtml);
			}

		},
		complete: function() {
			if(className) {
				var fixDiv = $(className);
				fixDiv.children(".common-loading").remove();
			}
		}
	});
	return ajaxObj;
};

function DeleteAjax(url, header) {
	var headers = (header === undefined ? {
		'Content-Type': 'application/json;charset=UTF-8'
	} : header);
	var ajaxObj = $.ajax({
		url: url,
		type: 'DELETE',
		datatype: 'jsonp',
		jsonp: 'callback',
		headers: headers
	});
	return ajaxObj;
};

function GetAjax(url, header, className) {
	var headers = (header === undefined ? {
		'Content-Type': 'application/json;charset=UTF-8'
	} : header);
	var str = "?",
		_str = "&";
	if(navigator.appName == "Microsoft Internet Explorer" && parseInt(navigator.appVersion.split(";")[1].replace(/[ ]/g, "").replace("MSIE", "")) < 10) {
		var _accountInfo = window.LS.getItem('accountInfo');
		var _token = '';
		if(_accountInfo) {
			_token = $.parseJSON(_accountInfo).Token;
			if(url.indexOf("?") > -1) {
				if(url.substring(url.length - 1, url.length) === "=") {
					var n = url.lastIndexOf("&");
					url = url.substring(0, n) + "&token=" + _token;
				} else {
					url += "&token=" + _token;
				}

			} else {
				url += "?token=" + _token;
			}

		}
	};
	
	var ajaxObj = $.ajax({
		url: url,
		type: 'GET',
		datatype: 'jsonp',
		jsonp: 'callback',
		async: true, //异步还是同步
		headers: headers,
		beforeSend: function() {
			if(className) {
				var loadHtml =
					'<div class="common-loading">' +
					'<div class="img"></div>' +
					'</div>';
				var fixDiv = $(className);
				fixDiv.css("position", "relative");
				fixDiv.append(loadHtml);
			}

		},
		complete: function() {
			if(className) {
				var fixDiv = $(className);
				fixDiv.children(".common-loading").remove();
			}
		}

	});
	return ajaxObj;
};

function GetThreeArr(arr, count) {
	var result = [];
	for(var i = 0; i < arr.length; i += count) {
		result.push(arr.slice(i, i + count));
	}

	return result;
};

//对手机号码验证
function phoneCheck(val) {
	var flag = true;
	var pattern = /^1[3|4|5|8][0-9]\d{4,8}$/;
	// var patternTwo = /^0\d{2,3}-?\d{7,8}$/;
	if(pattern.test(val)) {
		flag = true;
	} else {
		flag = false;
	}
	return flag;
}

/*页面跳转*/
var linkFun = function(URLS) {
	window.location.href = URLS + ".html";
}

//检验名称
function NameCheck(val) {
	var flag = true;
	var patternName = /^[\u4E00-\u9FA5a-zA-Z0-9_]{1,16}$/;
	if(patternName.test(val)) {
		flag = true;
	} else {
		flag = false;
	}
	return flag;
}
//检验金额
var moneyCheck = function(val) {
	var flag = true;
	var patternName = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/;
	if(patternName.test(val)) {
		flag = true;
	} else {
		flag = false;
	}
	return flag;
}

function isNumber(value) {
	var patrn = /^[0-9]*$/;
	if(patrn.exec(value) == null || value == "") {
		return false
	} else {
		return true
	}
}
//对手机号码验证
function phoneNumCheck(val) {
	var flag = true;
	var pattern = /^1[3|4|5|8][0-9]\d{4,8}$/;
	var patternTwo = /^(0\\d{2}-\\d{8}(-\\d{1,4})?)|(0\\d{3}-\\d{7,8}(-\\d{1,4})?)$/;
	if(pattern.test(val) || patternTwo.test(val)) {
		flag = true;
	} else {
		flag = false;
	}
	return flag;
}

//对邮箱验证
function mailCheck(val) {
	var flag = true;
	var pattern = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
	if(pattern.test(val)) {
		flag = true;
	} else {
		flag = false;
	}
	return flag;
}

/**
 *[errorAlert]警告出现
 */
function errorAlert(dom, text) {
	dom.text(text);
}

/**
 * [getnewDay description]
 * @return {[type]} [description] 生成日期
 */
function getnewDay(Day, flag) {
	var tody = new Date(Day);
	var year = tody.getFullYear();
	var month = tody.getMonth() + 1;
	var day = tody.getDate();
	var hour = tody.getHours();
	var min = tody.getMinutes();
	var newDay = (flag == true ? (year + "-" + zero(month) + "-" + zero(day) + ' ' + zero(hour) + ':' + zero(min)) : (year + "-" + zero(month) + "-" + zero(day)));
	return newDay;
}
/**
 * [zero description]
 * @param  {[type]} value [description]
 * @return {[type]}       [description]
 */
function zero(value) {
	var _value = '';
	if(value > 9) {
		_value = value
	} else {
		_value = '0' + value;
	}
	return _value
}
/**
 * [getnewPassword description]
 * @param  {[type]} password [description]
 * @return {[type]}          [description] 得到新的转换后的密码
 */
function getnewPassword(password) {
	var base = new Base64();
	var newpassword = '';
	var _password = password + ' ' + getnewDay();
	/*先转成base64*/

	var _newpassword = base.encode(_password);
	newpassword = _newpassword.replace(/([a-z]*)(.*?)([A-Z]*)/g, function(m, m1, m2, m3) {
		return m1.toUpperCase() + m2 + m3.toLowerCase();
	});
	return newpassword;
}

/**
 * [guid description]
 * @return {[type]} [description] 唯一码生成
 */
function guid() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random() * 16 | 0,
			v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}

/**
 * [passwordFlag 匹配一个有英文和数字组成的长度为6～18的字符串,必须包含至少一个字母和一个数字]
 * @param  {[type]} val [description]
 * @return {[type]}     [description]
 */
function passwordFlag(val) {
	var pattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,18}$/;
	var flag = true;
	if(pattern.test(val)) {
		flag = true;
	} else {
		flag = false;
	}
	return flag;
}

/********************************************兼容IE7 8 时间****************************************/
function dateFormat(dateString, format) {
	if(!dateString) return "";

	var time = new Date($.trim(dateString.replace(/-/g, '/').replace(/T|Z/g, ' ')));
	var o = {
		"M+": time.getMonth() + 1, //月份
		"d+": time.getDate(), //日
		"h+": time.getHours(), //小时
		"m+": time.getMinutes(), //分
		"s+": time.getSeconds(), //秒
		"q+": Math.floor((time.getMonth() + 3) / 3), //季度
		"S": time.getMilliseconds() //毫秒
	};
	if(/(y+)/.test(format)) format = format.replace(RegExp.$1, (time.getFullYear() + "").substr(4 - RegExp.$1.length));
	for(var k in o)
		if(new RegExp("(" + k + ")").test(format)) format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return format;
}

/********************************************兼容IE7 8 ****************************************/
if(typeof Array.prototype.forEach != 'function') {
	Array.prototype.forEach = function(callback) {
		for(var i = 0; i < this.length; i++) {
			callback.apply(this, [this[i], i, this]);
		}
	};
}

/*********************************************兼容处理*********************************************/

if(!window.JSON) {
	window.JSON = {
		parse: function(jsonStr) {
			return eval('(' + jsonStr + ')');
		},
		stringify: function(jsonObj) {
			var result = '',
				curVal;
			if(jsonObj === null) {
				return String(jsonObj);
			}
			switch(typeof jsonObj) {
				case 'number':
				case 'boolean':
					return String(jsonObj);
				case 'string':
					return '"' + jsonObj + '"';
				case 'undefined':
				case 'function':
					return undefined;
			}

			switch(Object.prototype.toString.call(jsonObj)) {
				case '[object Array]':
					result += '[';
					for(var i = 0, len = jsonObj.length; i < len; i++) {
						curVal = JSON.stringify(jsonObj[i]);
						result += (curVal === undefined ? null : curVal) + ",";
					}
					if(result !== '[') {
						result = result.slice(0, -1);
					}
					result += ']';
					return result;
				case '[object Date]':
					return '"' + (jsonObj.toJSON ? jsonObj.toJSON() : jsonObj.toString()) + '"';
				case '[object RegExp]':
					return "{}";
				case '[object Object]':
					result += '{';
					for(i in jsonObj) {
						if(jsonObj.hasOwnProperty(i)) {
							curVal = JSON.stringify(jsonObj[i]);
							if(curVal !== undefined) {
								result += '"' + i + '":' + curVal + ',';
							}
						}
					}
					if(result !== '{') {
						result = result.slice(0, -1);
					}
					result += '}';
					return result;

				case '[object String]':
					return '"' + jsonObj.toString() + '"';
				case '[object Number]':
				case '[object Boolean]':
					return jsonObj.toString();
			}
		}
	};
}

// /*********************************************兼容IE7 8  localStorage*********************************************/