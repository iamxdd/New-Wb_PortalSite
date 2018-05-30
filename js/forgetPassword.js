window.url = pageConfig.ajaxUrl;
var Only_guid = '';
var btype = 3;
var isChecked = false;
var phonenum = '';
var cipherpassword = '';
var restr = '没有收到验证码？ 点击重发';
var timer = null;
var loginHTML = 'login.html';
var AccountType = 0;
var _captchaValidate = true;
$(document).ready(function() {
	Only_guid = guid();
	/*注册第一步提交*/
	$("#regester").on("click", function() {
		
		var _firstRegestvalidateForm = firstRegestvalidateForm(),
			_phone = $('#phone').val(),
			_password = $('#password').val(),
			_spassword = $('#repassword').val(),
			_imgCode = $('.imgCode').val();
		phonenum = _phone;
		//cipherpassword = _password;
		if (!_firstRegestvalidateForm) {
			return;
		}
		/*表单验证*/
		var infoUrl = url.regestImgurl + 'smsauth?phone=' + _phone + '&smsuc=' + Only_guid + '&btype=' + btype;
		if (_captchaValidate == false) {
			layerAlert.autoclose("验证码输入错误！请重新输入");
		} else {
			GetAjax(infoUrl, null, '.rs-boxes').done(function(res) {
				var _code = res.State.Code,
					_Message = res.State.Message;
				if (_code == 0) {
					$(".rs-navs li").eq(1).addClass("active");
					$(".rs-contents .panel").eq(1).show().siblings().hide();

				} else if(_code==304) {
					layerAlert.autoclose(_Message);
				}else{
					layerAlert.autoclose(_Message);
				}

			}).fail(function() {
				errorAlert($('.err_phone'), errArrinfo[6]);
			});
		}



	});

	/*注册第二步提交*/
	$("#step2").on("click", function() {
		var _infomaton = $('#infomaton').val(),
			exchangepassword = getnewPassword(cipherpassword);
		if (_infomaton.replace(/\s/g, "").length == 0) {
			errorAlert($('.infomaton_spassword'), errArrinfo[8]);
			return;
		}
		var secondstepurl = url.regestImgurl + "forgetpassword?smsuc=" + Only_guid + "&smsAuth=" + _infomaton + "&btype=" + btype,
			param = {
				"Name": phonenum,
				"Password": exchangepassword,
				"AccountType": 1
			};
		PutAjax(secondstepurl, JSON.stringify(param)).done(function(res) {
			var _code = res.State.Code,
				_Message = res.State.Message;
			if (_code == 0) {
				$(".rs-navs li").eq(2).addClass("active");
				$(".rs-contents .panel").eq(2).show().siblings().hide();
				setTimeout(function() {
					window.location = loginHTML;
				}, 3000);
			} else {
				errorAlert($('.infomaton_spassword'), _Message);
			}
		}).fail(function() {
			errorAlert($('.infomaton_spassword'), errArrinfo[6]);
		})

	});

	/************************************************手机号码失焦***********************************************/
	$('#phone').focus(function(e) {
		e.stopPropagation();
		$('.warning').text('');
	});
	
	$('#certCode').blur(function(e) {
		e.stopPropagation();
		var _imgCode = $('.imgCode').val();
		captchaValidate(Only_guid, _imgCode, 3);
	});
	/************************************************手机密码失焦***********************************************/
	$('#password').focus(function(e) {
		e.stopPropagation();
		$('.warning').text('');
	});
	/************************************************手机确认密码失焦***********************************************/
	$('#repassword').focus(function(e) {
		e.stopPropagation();
		$('.warning').text('');
	});
	/************************************************验证码失焦***********************************************/
	$('.imgCode').focus(function(e) {
		e.stopPropagation();
		$('.warning').text('');
	});

	/************************************************短信验证码失焦***********************************************/
	$('#infomaton').focus(function(e) {
		e.stopPropagation();
		$('.warning').text('');
	});
	/************************************************图形验证码生成***********************************************/

	var imgUrlInit = url.regestImgurl + 'captcha/file/' + Only_guid + '?btype=' + btype;
	console.log(imgUrlInit);
	$('#span_Code').attr("src", imgUrlInit);

	/************************************************图形验证码刷新***********************************************/
	$('#span_Code').on('click', function(e) {
		e.stopPropagation();
		Only_guid = guid();
		var imgUrl = url.regestImgurl + 'captcha/file/' + Only_guid + '?btype=' + btype;
		$(this).attr("src", imgUrl);
	});


	/************************************************点击重发***********************************************/
	$('.nopass').on('click', 'input', function(e) {
		e.stopPropagation();
		Only_guid = guid();
		$('#rebutton').attr('disabled', true);
		clearInterval(timer); //清除计时器
		var timer = setInterval(function() {
			if (count > 0) {
				count--;
				$('#rebutton').val("剩余时间" + count + "s");
			} else {
				$('#rebutton').val(restr);
				$('#rebutton').attr('disabled', false);
				clearInterval(timer); //清除计时器
			}
		}, 1000);
		info_guid = guid();
		var count = 60;
		var infoUrl = url.regestImgurl + 'smsauth?phone=' + phonenum + '&smsuc=' + Only_guid + '&btype=' + btype;
		GetAjax(infoUrl).done(function(res) {
			console.log(res)

		}).fail(function() {

		});

	});
	/*************************************************密码强度验证*************************************************/
	$('#password').keyup(function() {
		var strongRegex = new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");
		var mediumRegex = new RegExp("^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
		var enoughRegex = new RegExp("(?=.{6,}).*", "g");
		if (($(this).val()).length > 6 || ($(this).val()).length == 6) {
			$("#pwdstrength").show();
			$(this).siblings('#pwdstrength').css('display', 'inline');
			if (false == enoughRegex.test($(this).val())) {
				$(this).siblings('label').children('p').eq(0).removeClass('pw-weak').addClass('pw_gray');
				$(this).siblings('label').children('p').eq(1).removeClass('pw-medium').addClass('pw_gray');
				$(this).siblings('label').children('p').eq(2).removeClass('pw-strong').addClass('pw_gray');
				$(this).siblings('label').children('p').addClass('pw_gray');
				//密码小于六位的时候，密码强度图片都为灰色 
			} else if (strongRegex.test($(this).val())) {
				$(this).siblings('label').children('p').eq(0).removeClass('pw-weak').addClass('pw_gray');
				$(this).siblings('label').children('p').eq(1).removeClass('pw-medium').addClass('pw_gray');
				$(this).siblings('label').children('p').eq(2).addClass('pw-strong').removeClass('pw_gray');
				//密码为八位及以上并且字母数字特殊字符三项都包括,强度最强 
			} else if (mediumRegex.test($(this).val())) {
				$(this).siblings('label').children('p').eq(0).removeClass('pw-weak').addClass('pw_gray');
				$(this).siblings('label').children('p').eq(2).removeClass('pw-strong').addClass('pw_gray');
				$(this).siblings('label').children('p').eq(1).addClass('pw-medium').removeClass('pw_gray');
				//密码为七位及以上并且字母、数字、特殊字符三项中有两项，强度是中等 
			} else {
				$(this).siblings('label').children('p').eq(0).addClass('pw-weak').removeClass('pw_gray');
				$(this).siblings('label').children('p').eq(1).removeClass('pw-medium').addClass('pw_gray');
				$(this).siblings('label').children('p').eq(2).removeClass('pw-strong').addClass('pw_gray');
				//如果密码为6为及以下，就算字母、数字、特殊字符三项都包括，强度也是弱的 
			}
		}
	});

});

/*图形验证码*/
function captchaValidate(captcha_uniqueCode, captcha_captchaCode, captcha_btype) {
	// var imgUrlInit = url.regestImgurl+'captcha/file/'+Only_guid+'?btype='+btype;
	var _url=url.regestImgurl + 'captcha/validate/' + Only_guid + '?captchaCode=' + captcha_captchaCode+"&btype=" + 3;
	GetAjax(_url,null,".rs-boxes").done(function(res) {
		var _code = res.State.Code,
			_Message = res.State.Message;
		if (_code == 0) {
			_captchaValidate = res.Content;
			console.log(typeof(_captchaValidate));
		}

	}).fail(function() {
		layerAlert.autoclose("后台出错");
	});
}
var errArrinfo = ['请输入手机号码', '请输入密码', '请输入确认密码', '请输入图形验证码', '两次密码输入不一致', '手机号码不合法', '后台报错，请联系管理员', '请勾选阅读条款', '请输入短信验证码', '密码长度必须是6-18位', '手机号长度必须为11位'];
/**
 * [firstRegestvalidateForm description]
 * @return {[type]} [注册第一步表单验证]
 */
function firstRegestvalidateForm() {
	var flag = true,
		_phone = $('#phone').val(),
		_password = $('#password').val(),
		_spassword = $('#repassword').val(),
		_imgCode = $('.imgCode').val(),
		_phoneCheck = phoneCheck(_phone);

	if (_phone.replace(/\s/g, "").length == 0) {
		errorAlert($('.err_phone'), errArrinfo[0]);
		flag = false;
		return false;
	}
	if (_phone.replace(/\s/g, "").length != 11) {
		errorAlert($('.err_phone'), errArrinfo[10]);
		flag = false;
		return false;
	}
	if (!_phoneCheck) {
		errorAlert($('.err_phone'), errArrinfo[5]);
		flag = false;
		return false;
	}

	if (_password.replace(/\s/g, "").length == 0) {
		errorAlert($('.err_password'), errArrinfo[1]);
		flag = false;
		return false;
	}
	if (_password.replace(/\s/g, "").length < 6 || _password.replace(/\s/g, "").length > 18) {
		errorAlert($('.err_password'), errArrinfo[9]);
		flag = false;
		return false;
	}

	if (_spassword.replace(/\s/g, "").length == 0) {
		errorAlert($('.err_spassword'), errArrinfo[2]);
		flag = false;
		return false;
	}
	if (_imgCode.replace(/\s/g, "").length == 0) {
		errorAlert($('.err_code'), errArrinfo[3]);
		flag = false;
		return false;
	}
	if (_password !== _spassword) {
		errorAlert($('.err_spassword'), errArrinfo[4]);
		flag = false;
		return false;
	}

	return flag
}