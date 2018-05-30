window.url = pageConfig.ajaxUrl;
var timer = null;
var info_guid = '';
var indexHTML = 'index.html';
var _CurrentAddress = window.LS.getItem('CurrentAddress');
$(document).ready(function() {
	$("#registerForm").on("click", "li", function() {
		$(this).addClass("active").siblings().removeClass("active");
		var n = $(this).index();
		$('#phone_error').text('');
		$('#phone_focus').text('');
		$("#password_error").text('');
		$('#useName_error').text('');
		$(".panel").eq(n).show().siblings(".panel").hide();
	});

	/************************************************账号登录***********************************************/

	var userNameLogin = function() {
		var FormFlag = AccountloginvalidateForm();
		if(!FormFlag) {
			return;
		}
		var _url = url.regestImgurl + 'login',
			_userName = $('#userName').val(),
			_password = $('#password').val(),
			_changepassword = getnewPassword(_password),
			param = {
				Name: _userName,
				Password: _changepassword
			};
		// loginSend(_url, JSON.stringify(param));
		messSend(_url, JSON.stringify(param), $('.infoFo'), $('#useName_error'))
	};

	$('#registerForm').on('click', '.infoFo', userNameLogin);

	/************************************************短信登录***********************************************/

	var messageLogin = function() {
		var FormFlag = PhoneloginvalidateForm();
		if(!FormFlag) {
			return;
		}
		var _phoneNumber = $('#phoneNumber').val(),
			_VerificationCode = $('#VerificationCode').val()
		_url = url.regestImgurl + 'smslogin?loginName=' + _phoneNumber + '&smsuc=' + info_guid + "&smsAuth=" + _VerificationCode + "&btype=" + 1,
			param = {
				loginName: _phoneNumber,
				smsuc: info_guid,
				smsAuth: _VerificationCode,
				btype: 1
			};
		messSend(_url, JSON.stringify(param), $('.messInfo'), $('#codeerror'))
	};

	$('#registerForm').on('click', '.messInfo', messageLogin);

	/*回车登录*/
	$(document).on("keydown", function() {
		var index = 0;
		if($("#registerForm li").eq(1).hasClass("active")) {
			index = 1;
		}
		if(event.keyCode == 13) {
			switch(index) {
				case 0:
					userNameLogin();
					break;
				case 1:
					messageLogin();
					break;
				default:
					break;
			}
		}

	});

	/************************************************账号登录名失焦***********************************************/
	$('#userName').focus(function(e) {
		e.stopPropagation();
		$(this).siblings('.error').text('');
		$(this).siblings('.focus').text('');
	});

	/************************************************账号密码失焦***********************************************/
	$('#password').focus(function(e) {
		e.stopPropagation();
		$(this).siblings('.error').text('');
		$(this).siblings('.focus').text('');
	});
	/************************************************手机号登录名失焦***********************************************/
	$('#phoneNumber').focus(function(e) {
		e.stopPropagation();
		$(this).siblings('.error').text('');
		$(this).siblings('.focus').text('');
	});

	/************************************************短信验证密码失焦***********************************************/
	$('#VerificationCode').focus(function(e) {
		e.stopPropagation();
		$(this).siblings('.error').text('');
		$(this).siblings('.focus').text('');
	});
	/************************************************点击7天自动登陆***********************************************/
	$(".AccountLogin").on('click', '.labelcheck', function(e) {
		e.stopPropagation();
		var _loginUserName = $('#userName').val(),
			_loginPassword = $('#password').val();
		if($(this).children('.input-checkbox').hasClass('active')) {
			$(this).children('.input-checkbox').removeClass('active').addClass('check');
			Cookies.remove('sevenDay');
			Cookies.remove('loginUserName');
			Cookies.remove('loginPassword');
		} else {
			$(this).children('.input-checkbox').removeClass('check').addClass('active');
			if(_loginUserName.replace(/\s/g, "").length == 0 || _loginPassword.replace(/\s/g, "").length == 0)
				return;
			Cookies.set('sevenDay', 'true', {
				expires: 7
			});
			Cookies.set('loginUserName', _loginUserName, {
				expires: 7
			});
			Cookies.set('loginPassword', _loginPassword, {
				expires: 7
			});
		}
	});

	/************************************************检测7天自动登陆***********************************************/
	var _sevenFlag = Cookies.get('sevenDay'),
		_loginPassword = Cookies.get('loginPassword'),
		_loginUserName = Cookies.get('loginUserName');
	if(_sevenFlag == undefined) {
		$('#userName').val('');
		$('#password').val('');
		$('.input-checkbox').addClass('check').removeClass('active');
	} else {
		$('#userName').val(_loginUserName);
		$('#password').val(_loginPassword);
		$('.input-checkbox').removeClass('check').addClass('active');
	}

	/************************************************短信验证码***********************************************/
	$('.inputcommon').on('click', '#getCode', function(e) {
		e.stopPropagation();
		var _phoneNumber = $('#phoneNumber').val(),
			phoneChecks = phoneCheck(_phoneNumber);
		if(_phoneNumber.replace(/\s/g, "").length == 0) {
			errorAlert($('#phone_focus'), errorPhoneArr[0]);
			return;
		}
		if(!phoneChecks) {
			errorAlert($('#phone_error'), errorPhoneArr[2]);
			return;
		}

		$("#getCode").prop('disabled', true);
		clearInterval(timer); //清除计时器
		var timer = setInterval(function() {
			if(count > 0) {
				count--;
				$("#getCode").val("剩余时间" + count + "s");
				$('#codeerror').text('');
			} else {
				$('#codeerror').text('');
				$("#getCode").val("发送短信");
				$("#getCode").prop('disabled', false);
				clearInterval(timer); //清除计时器
			}
		}, 1000);

		info_guid = guid();
		var count = 60;
		var _phoneNumber = $("#phoneNumber").val();
		var phoneChecks = phoneCheck($("#phoneNumber").val());
		var nextCheckInfourl = url.regestImgurl + 'smsauth?phone=' + _phoneNumber + '&smsuc=' + info_guid + '&btype=' + 1;
		GetAjax(nextCheckInfourl).done(function(res) {
			var _code = res.State.Code,
				_Message = res.State.Message;
			if(_code !== 0) {
				errorAlert($('#codeerror'), _Message);
				clearInterval(timer);
			}
		}).fail(function() {
			errorAlert($('#codeerror'), errorPhoneArr[4]);

		});
	});
});
//对手机号码验证
var phoneCheck = function(val) {
	var flag = true;
	var pattern = /^1[3|4|5|8][0-9]\d{4,8}$/;
	if(pattern.test(val)) {
		flag = true;
	} else {
		flag = false;
	}
	return flag;
}
/**
 * [AccountloginvalidateForm description]账号登录表单验证
 */
var errorArr = ['请输入登录名', '请输入密码', '用户名或密码错误', '后台报错，请联系管理员'];

function AccountloginvalidateForm() {
	var flag = true,
		_userName = $('#userName').val(),
		_password = $('#password').val();
	if(_userName.replace(/\s/g, "").length == 0) {
		errorAlert($('#useName_focus'), errorArr[0]);
		flag = false;
		return false;
	}

	if(_password.replace(/\s/g, "").length == 0) {
		errorAlert($('#password_focus'), errorArr[1]);
		flag = false;
		return false;
	}

	return flag;
}

/**
 * [AccountloginvalidateForm description]短信登录表单验证
 */
var errorPhoneArr = ['请输入手机号码', '请输入验证码', '手机号码输入错误', '验证码输入错误', '后台报错，请联系管理员'];

function PhoneloginvalidateForm() {
	var flag = true,
		_phoneNumber = $('#phoneNumber').val(),
		_VerificationCode = $('#VerificationCode').val();
	if(_phoneNumber.replace(/\s/g, "").length == 0) {
		errorAlert($('#phone_focus'), errorPhoneArr[0]);
		flag = false;
		return false;
	}

	if(_VerificationCode.replace(/\s/g, "").length == 0) {
		errorAlert($('#codeerror_focus'), errorPhoneArr[1]);
		flag = false;
		return false;
	}

	return flag;
}

/**
 * [messSend description]
 * @param  {[type]} infoUrl  [description]
 * @param  {[type]} param    [description]
 * @param  {[type]} userName [description]
 * @return {[type]}          [用户名登录 短信登录发送请求]
 */
function messSend(url, param, domage, domcrr) {
	PostAjax(url, param, undefined, "#registerForm").done(function(res) {
		var code = res.State.Code,
			Message = res.State.Message,
			Content = res.Content;
		if(code === 0) {
			window.LS.setItem('accountInfo', JSON.stringify(Content));
			if(_CurrentAddress == null || _CurrentAddress == undefined || _CurrentAddress == '') {
				layerAlert.autoclose("登录成功!");
				setTimeout(function() {
					window.location = indexHTML;
				}, 1000);

			} else {
				layerAlert.autoclose("登录成功!");
				setTimeout(function() {
					window.location = _CurrentAddress;
				}, 1000);
			}
		} else {
			errorAlert(domcrr, Message);
		}
	}).fail(function() {
		errorAlert(domcrr, errorArr[3]);
	});
}