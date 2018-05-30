var loginHtml = "login.html";
var _token = '';
var _userName = '';
var _header = {};
var _AccountType = 0;
var LS;
(function(w, localStorage) { //封装LS，对外提供接口
	var f = function() {
		return null;
	};
	w.LS = localStorage ? {
		setItem: function(key, value) {
			//fixed iPhone/iPad 'QUOTA_EXCEEDED_ERR' bug
			if(this.getItem(key) !== undefined)
				this.removeItem(key);
			localStorage.setItem(key, value);
		},
		//查询不存在的key时，有的浏览器返回null，这里统一返回undefined
		getItem: function(key) {
			var v = localStorage.getItem(key);
			return v === null ? undefined : v;
		},
		removeItem: function(key) {
			localStorage.removeItem(key);
		},
		clear: function() {
			localStorage.clear();
		},
		each: function(callback) {
			var list = this.obj(),
				fn = callback || function() {},
				key;
			for(key in list)
				if(fn.call(this, key, this.getItem(key)) === false)
					break;
		},
		obj: function() {
			var list = {},
				i = 0,
				n, key;
			if(localStorage.isVirtualObject) {
				list = localStorage.key(-1);
			} else {
				n = localStorage.length;
				for(; i < n; i++) {
					key = localStorage.key(i);
					list[key] = this.get(key);
				}
			}
			return list;
		}
	} : {
		set: f,
		get: f,
		remove: f,
		clear: f,
		each: f,
		obj: f
	}; //如果都不支持则所有方法返回null
})(window, LS || window.localStorage); //这里优先使用自定义的LS

var _accountInfo = window.LS.getItem('accountInfo');
if(_accountInfo) {
	_AccountType = $.parseJSON(_accountInfo).AccountType;
	_userName = $.parseJSON(_accountInfo).LoginName;
}
var pesionHtml = "user.html",
	companyHtml = "enterprise.html";
$(document).ready(function() {

	/*默认搜索框显示*/
	var searchKeyWord = window.LS.getItem("searchKeyWord");
	$(".my_shinput input").val(searchKeyWord ? searchKeyWord : "");
	var searchType = window.LS.getItem("searchType");

	if(searchType) {
		$(".my_shselect .default-value").attr("data-value", searchType);
		var searchLength = $(".my_shselect .submenu dd").length;
		for(var i = 0; i < searchLength; i++) {
			var $this = $(".my_shselect .submenu dd").eq(i);
			if($this.attr("data-value") === searchType) {
				$(".my_shselect .default-value").html($this.html());
			}
		}
	} else {
		$(".my_shselect .default-value").attr("1");
		$(".my_shselect .default-value").html("前沿资讯");
	}

	/*图片错误处理*/
	$("body").find("img:not('.no-error')").on("error", function() {
		$(this).attr("src", "img/zz_40.png");
	});

	/*搜索*/
	$(".my_shbutton button").on("click", keywordfun);

	function keywordfun() {
		var type = $(".my_shselect .default-value").attr("data-value");
		var keyword = $(".my_shinput input").val();
		keyword = encodeURIComponent(keyword);
		window.LS.setItem("searchKeyWord", keyword);
		window.LS.setItem("searchType", type);
		switch(type) {
			case "1":
				hrefUrl = "/news/index.html?value=" + keyword;
				break;
			case "2":
				hrefUrl = "/training/index.html?value=" + keyword;
				break;
			case "3":
				hrefUrl = "/announcement/index.html?atype=1&value=" + keyword;
				break;
			case "4":
				hrefUrl = "/announcement/index.html?atype=2&value=" + keyword;
				break;
			default:
				hrefUrl = "/news/index.html?value=" + keyword;
				break;
		}
		window.location = hrefUrl;
	}
	$("#applyCertNum").on("keydown", function() {

		if(event.keyCode == 13) {
			keywordfun();
		}
	})

	if($('.ld-cleft').children('ul').text().replace(/\s/g, "").length == 0) {
		var text = '<img src="/imgdata.png">';
		$('.ld-cleft').children('ul').html(text);
	}
	var _accountInfo = window.LS.getItem('accountInfo');
	var CurrentAddressHref = 'login.html';

	/*导航栏样式变换*/
	var nowHref = (window.location.href).split('/');
	var data = ['index.html', 'leadInfomation.html', 'publicInfo.html', 'train.html', 'supplyAandDemandMatching.html', 'Review.html', 'bigData.html', 'AboutUs.html', 'Online.html'];
	var count = -1;
	$.each(data, function(i, v) {
		if(v === nowHref[nowHref.length - 1]) {
			count = i
		}
	});
	if(count !== -1) {
		$('.my_nav ul li').eq(count).addClass('active').siblings().removeClass("active");
	}

	//顶部滑动显示子菜单
	$(".top-right-navs").on("mouseover", ".has-submenu", function() {
		if(_accountInfo == null || _accountInfo == undefined || _accountInfo == '') {
			$(this).children(".submenu").hide();
		} else {
			$(this).children(".submenu").show();
		}
	}).on("mouseout", ".has-submenu", function() {
		$(this).children(".submenu").hide();
	});

	//全局设置
	$("html").on("click", function(e) {
		if(!/default-value/.test(e.target.className)) {
			$(".my_shselect .submenu").hide();
		}
	});

	//模拟下拉选择框
	$(".my_shselect .default-value").on("click", function() {
		$(this).siblings(".submenu").toggle();
	});

	//选择切换操作
	$(".my_shselect .submenu dd").on("click", function() {
		var defaultEle = $(".my_shselect .default-value");
		var selectValue = $(this).attr("data-value");
		defaultEle.attr("data-value", selectValue);
		defaultEle.html($(this).html());
		$(this).parent().hide();
	});

	/*导航栏滑动显示子菜单*/
	$(".my_nav li.has-child").on("mouseover", function() {
		$(this).children(".menu").show();
	}).on("mouseout", function() {
		$(this).children(".menu").hide();
	});

	if(_accountInfo == null || _accountInfo == undefined || _accountInfo == '') {
		$('.top-logins-lists').children('li').eq(0).children("a").eq(1).html('请登录');
		$("#personCenter").removeClass("has-submenu");

	} else {
		var LoginName = $.parseJSON(_accountInfo).LoginName,
			NickName = $.parseJSON(_accountInfo).NickName;
		if(NickName !== null) {
			if(_AccountType === 1) {
				$('.top-logins-lists').children('li').eq(0).html('<a href=' + pesionHtml + '>' + NickName + ' </a> 欢迎您!');
			} else if(_AccountType === 2) {
				$('.top-logins-lists').children('li').eq(0).html('<a href=' + companyHtml + '>' + NickName + ' </a> 欢迎您!');
			} else {
				$('.top-logins-lists').children('li').eq(0).html('<a href="#">' + NickName + ' </a> 欢迎您!');
			}
		} else {
			if(_AccountType === 1) {
				$('.top-logins-lists').children('li').eq(0).html('<a href=' + pesionHtml + '>' + LoginName + ' </a> 欢迎您!');
			} else if(_AccountType === 2) {
				$('.top-logins-lists').children('li').eq(0).html('<a href=' + companyHtml + '>' + LoginName + ' </a> 欢迎您!');
			} else {
				$('.top-logins-lists').children('li').eq(0).html('<a href="#">' + LoginName + ' </a> 欢迎您!');
			}
		}
		$("#personCenter").addClass("has-submenu");
	}

	/*******************************************记录登录****************************************/
	$('.top-logins-lists').on('click', '.pleaselogin>a.login-btn', function(e) {
		e.stopPropagation();
		var _CurrentAddress = window.location.href;
		window.LS.clear();
		window.LS.setItem('CurrentAddress', _CurrentAddress);
		window.location = loginHtml;
	});
	/*******************************************未登录是点击个人中心，跳转到登录页面*****************************************/
	$("#personCenter").on("click", function() {
		if(_accountInfo == null || _accountInfo == undefined || _accountInfo == '') {
			window.location = loginHtml;

		}
	});

	/*******************************************退出登录*****************************************/
	$('.submenu').on('click', '.ExitLogin', function(e) {
		e.stopPropagation();
		var _CurrentAddress = window.location.href;
		window.LS.clear();
	});

	$('.my_nav_content').on('click', '.has-child>a', function(e) {
		e.stopPropagation();
		window.LS.removeItem('type');
	});
	/*******************************************点击跳转到其他页面*****************************************/
	$('.my_nav').on('click', 'li', function(e) {
		e.stopPropagation();
		var _index = $(this).index();
		console.log(_index)
		var _CurrentAddress = window.location.href;
		window.LS.setItem('CurrentAddress', _CurrentAddress);
		if(_index == 6) {
			var timer = null,
				count = 6;
			var _accountInfo = window.LS.getItem('accountInfo');
			var _userName = "";
			if(_accountInfo) {
				_userName = $.parseJSON(_accountInfo).LoginName;
			}
			var bigName = 'super_admin';
			var indexHref = '/personal/login.html';
			var _CurrentAddress = window.LS.getItem('CurrentAddress');

			if(_userName == "") {
				layerAlert.autoclose('登录后才能访问此页面');
				setTimeout(function() {
					window.location = indexHref;
				}, 1100);

			} else if(_userName !== bigName) {
				layerAlert.autoclose('亲,您没有权限访问此页面');

			} else {
				var isChrome = window.navigator.userAgent.indexOf("Chrome") !== -1;
				var agent = navigator.userAgent.toLowerCase(),
					opera = window.opera,
					browser = {
						//检测当前浏览器是否为IE 
						ie: /(msie\s|trident.*rv:)([\w.]+)/.test(agent),

						//检测当前浏览器是否为Opera 
						opera: (!!opera && opera.version),

						//检测当前浏览器是否是webkit内核的浏览器 
						webkit: (agent.indexOf(' applewebkit/') > -1),

						//检测当前浏览器是否是运行在mac平台下 
						mac: (agent.indexOf('macintosh') > -1),

						//检测当前浏览器是否处于“怪异模式”下 
						quirks: (document.compatMode == 'BackCompat')
					};
				//检测当前浏览器是否为Chrome, 如果是，则返回Chrome的大版本号 
				if(/chrome\/(\d+\.\d)/i.test(agent)) {
					browser.chrome = +RegExp['\x241'];
				}
				if(!isChrome && browser.chrome < 56) {
					layerAlert.autoclose('亲,需要下载谷歌浏览器才能访问此页面');
					setTimeout(function() {
						window.open('http://rj.baidu.com/soft/detail/14744.html?ald');
					}, 1100);
				} else {
					window.LS.setItem('datatype', 0);
					window.open('/personal/bigdata.html');
				}
			}
		}
	});

	/*******************************************大数据跳转到各自页面**************************/
	$('.has-child').on('click', '.dataMenu>a', function(e) {
		e.stopPropagation();
		var _index = $(this).index();
		var bigName = 'super_admin';
		var indexHref = '/personal/login.html';
		var _CurrentAddress = window.LS.getItem('CurrentAddress');

		if(_userName == "") {
			layerAlert.autoclose('登录后才能访问此页面');
			setTimeout(function() {
				window.location = indexHref;
			}, 1100);

		} else if(_userName !== bigName) {
			layerAlert.autoclose('亲,您没有权限访问此页面');

		} else {
			var isChrome = window.navigator.userAgent.indexOf("Chrome") !== -1;
			var agent = navigator.userAgent.toLowerCase(),
				opera = window.opera,
				browser = {
					//检测当前浏览器是否为IE 
					ie: /(msie\s|trident.*rv:)([\w.]+)/.test(agent),

					//检测当前浏览器是否为Opera 
					opera: (!!opera && opera.version),

					//检测当前浏览器是否是webkit内核的浏览器 
					webkit: (agent.indexOf(' applewebkit/') > -1),

					//检测当前浏览器是否是运行在mac平台下 
					mac: (agent.indexOf('macintosh') > -1),

					//检测当前浏览器是否处于“怪异模式”下 
					quirks: (document.compatMode == 'BackCompat')
				};
			//检测当前浏览器是否为Chrome, 如果是，则返回Chrome的大版本号 
			if(/chrome\/(\d+\.\d)/i.test(agent)) {
				browser.chrome = +RegExp['\x241'];
			}
			if(!isChrome && browser.chrome < 56) {
				layerAlert.autoclose('亲,需要下载谷歌浏览器才能访问此页面');
				setTimeout(function() {
					window.open('http://rj.baidu.com/soft/detail/14744.html?ald');
				}, 1100);
			} else {
				window.LS.setItem('datatype', _index);
				window.open('/personal/bigdata.html');
			}
		}

	});

	/*******************************************点击跳转到个人中心  企业中心**************************/
	$('#personCenter').on('click', '.persionSelected', function(e) {
		e.stopPropagation();
		if(_AccountType === 1) {
			window.location = pesionHtml;
		} else if(_AccountType === 2) {
			window.location = companyHtml;
		}
	});

	/*******************************************显示个人中心  企业中心**************************/
	if(_AccountType === 1) {
		$('#personCenter').children('span').text('个人中心');
		$('.persionSelected').children('a').text('个人中心');
		$('#personCenter').children('span').attr('title', '个人中心');
	} else if(_AccountType === 2) {
		$('#personCenter').children('span').text('企业中心');
		$('.persionSelected').children('a').text('企业中心');
		$('#personCenter').children('span').attr('title', '企业中心');
	} else if(_AccountType === 0) {
		$('#personCenter').children('span').text('退出登录');
		$('#personCenter').removeClass('has-submenu')
		// $('.persionSelected').hide();
	}
	if(_userName == '') {
		$('#personCenter').children('span').text('');
		$('#personCenter').removeClass('has-submenu')
	}

	/*******************************************super_admin退出登录**************************/
	$('#personCenter').on('click', 'span', function(e) {
		e.stopPropagation();
		if(_AccountType == 0 || !_AccountType) {
			window.location = loginHtml;
			window.LS.clear();
		}
	});
});

/*公用方法*/

/*数字转换为对应的文字*/
var numberToText = function(n, array) {
	var _text;
	for(var i = 0; i < array.length; i++) {
		if(array[i].Id === n) {
			_text = array[i].Name;
		}
	}
	if(!_text) {
		_text = "暂无";
	}
	return _text;
};

/*日期格式化方法*/
Date.prototype.Format = function(fmt) { //author: meizz   
	var o = {
		"M+": this.getMonth() + 1, //月份   
		"d+": this.getDate(), //日   
		"H+": this.getHours(), //小时   
		"m+": this.getMinutes(), //分   
		"s+": this.getSeconds(), //秒   
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度   
		"S": this.getMilliseconds() //毫秒   
	};
	if(/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for(var k in o)
		if(new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}

/******************************************获取url指定参数*/
function GetQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r != null) return unescape(r[2]);
	return null;
}

/*******************************************弹框*****************************************/
var area = ['360px', 'auto'], //设置弹出框大小
	btn = ['确定', '取消'], //设置弹出框按钮组
	shift = 5,
	shadeClose = false; //点击遮罩关闭层
var layerAlert = {

	error: function(text, title) {
		var def_title = '出错啦！';
		title = title ? title : def_title;
		layer.open({
			title: title,
			shadeClose: shadeClose,
			area: area,
			btn: btn,
			btnAlign: 'c',
			content: text,
			icon: 2,
			shift: shift
		});
	},

	iframe: function(title, url) {
		var def_title = '弹出窗口';
		title = title ? title : def_title;
		layer.open({
			type: 2,
			title: title,
			maxmin: true,
			shadeClose: false, //点击遮罩关闭层
			area: ['100%', '100%'],
			content: url
		});
	},

	autoclose: function(text, title, time) {
		var def_title = '提示！';
		title = title ? title : def_title;
		time = time ? time : 1000;
		if(arguments.length === 1) {
			layer.alert(text);
		} else {
			layer.open({
				title: title,
				shadeClose: shadeClose,
				area: area,
				btn: btn,
				btnAlign: 'c',
				content: text,
				icon: 0,
				shift: shift
			});
		}
		setTimeout(function(index, layero) {
			layer.closeAll();
		}, time);
	},
	success: function(text, title) {
		var def_title = '成功啦！';
		title = title ? title : def_title;
		layer.open({
			title: title,
			shadeClose: shadeClose,
			area: ['360px', 'auto'],
			btn: btn,
			btnAlign: 'c',
			content: text,
			icon: 1,
			shift: shift
		});
	},
	info: function(text, title) {
		var def_title = '提示！';
		title = title ? title : def_title;
		layer.open({
			title: title,
			shadeClose: shadeClose,
			area: area,
			btn: btn,
			btnAlign: 'c',
			content: text,
			icon: 0,
			shift: shift
		});
	},

	confirm: function(text, todo, title) {
		var def_title = '提示：';
		title = title ? title : def_title;
		layer.open({
			title: title,
			shadeClose: shadeClose,
			area: area,
			btn: btn,
			btnAlign: 'c',
			content: text,
			icon: 0,
			shift: shift,
			yes: function(index, layero) {
				if(todo) todo();
				layer.close(index);
			}
		});
	},

	checkone: function() {
		/*==========================================*/
		/*arguments=[title,function1,function2,btn1Text,btn2Text,btn1ClickedClose,btn1ClickedClose,text];
		* title:窗口显示标题
		* function1：回调函数1
		* function2：回调函数2
		* btn1Text:按钮1文本
		* btn2Text:按钮2文本
		* btn1ClickedClose:回调函数1执行完成是否关闭窗口
		* btn2ClickedClose:回调函数2执行完成是否关闭窗口
		* text:窗口显示内容
		/*==========================================*/
		var def_title = '提示:';
		var def_text = '请选择要执行的操作';
		var title = arguments[0] ? arguments[0] : def_title;
		var _btn = arguments[3] && arguments[4] ? [arguments[3], arguments[4]] : btn;
		var text = arguments[7] ? arguments[7] : def_text;
		if(typeof arguments[0] == "function" && typeof arguments[1] == "function") {
			var btn1ClickedClose = arguments[4],
				btn2ClickedClose = arguments[5];
			title = def_title;
			_btn = arguments[2] && arguments[3] ? [arguments[2], arguments[3]] : btn;
			var fun1 = arguments[0],
				fun2 = arguments[1];
			layer.open({
				title: title,
				shadeClose: shadeClose,
				area: area,
				btn: _btn,
				btnAlign: 'c',
				content: text,
				icon: 0,
				shift: shift,
				btn1: function(index, layero) {
					fun1();
					if(btn1ClickedClose) layer.close(index);
				},
				btn2: function(index, layero) {
					fun2();
					if(!btn2ClickedClose) return false;
				}
			});
		} else {
			var fun1 = arguments[1],
				fun2 = arguments[2],
				btn1ClickedClose = arguments[5],
				btn2ClickedClose = arguments[6];
			layer.open({
				title: title,
				shadeClose: shadeClose,
				area: area,
				btn: _btn,
				btnAlign: 'c',
				content: text,
				icon: 0,
				shift: shift,
				btn1: function(index, layero) {
					if(fun1) fun1();
					if(btn1ClickedClose) layer.close(index);
				},
				btn2: function(index, layero) {
					if(fun2) fun2();
					if(!btn2ClickedClose) return false;
				}
			});
		}

	}
};