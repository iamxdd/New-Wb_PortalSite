window.url = pageConfig.ajaxUrl;
var _accountInfo = window.LS.getItem('accountInfo');
var imgUrl = '';
var _token='';
var _header={};
if(_accountInfo) {
	 _token = $.parseJSON(_accountInfo).Token;
	 _header = {
		'Content-Type': "application/json",
		"Authorization": "Bearer " + _token,
		"Accept": "application/json"
	};
}
var loginUrl = "../login.html";
$(document).ready(function() {

	 /************************************************原密码失焦***********************************************/
    $('#oldpassword').focus(function(e) {
		e.stopPropagation();
		$('.warning').text('');
	});

	/************************************************新密码失焦***********************************************/
    $('#newpassword').focus(function(e) {
		e.stopPropagation();
		$('.warning').text('');
	});
	/************************************************确认失焦***********************************************/
    $('#surepassword').focus(function(e) {
		e.stopPropagation();
		$('.warning').text('');
	});

	$('body').on('click','#step1',function(e){
		e.stopPropagation();
		var FormFlagPassword = validateFormPassword();
		if (!FormFlagPassword) {
			return;
		}
	    var _oldPassword = $('#oldpassword').val(),
            _newPassword = $('#newpassword').val(),
            _oldpwd = getnewPassword(_oldPassword),
            _newpwd = getnewPassword(_newPassword),
            urlpassword = url.modifypassword+"?oldpwd="+_oldpwd+"&newpwd="+_newpwd,
		    editpassword = {
			  	oldpwd:_oldpwd,
			  	newpwd:_newpwd
			  };
			  	var _Token = {
			"Authorization": "Bearer " + _token
		};
		  PutAjax(urlpassword, JSON.stringify(editpassword), _Token).done(function(res) {

				if(res.State.Code==0){
					layerAlert.autoclose("修改成功");
					top.location=loginUrl;
					window.LS.clear();
				}else if(res.State.Code==2004){
					layerAlert.autoclose("原密码错误");
				}else if(res.State.Code==2020){
					layerAlert.autoclose("新密码与原密码不能相同");
				}else{
					layerAlert.autoclose(res.State.Message);
				}
			}).fail(function() {
				   layerAlert.autoclose(errorArrPassword[6]);
			})

	})
});


/*校验修改密码表单*/
var errorArrPassword = ['请输入原密码','请输入新密码','请输入确认密码',"新密码与确认密码不一致","密码长度必须是6-18位","密码设置不合法","后台报错，请联系管理员"];
function validateFormPassword(){
	var flag = true,
		_oldPassword = $('#oldpassword').val(),
	    _newPassword = $('#newpassword').val(),
	    _surePassword = $('#surepassword').val();
	    

	    if(_oldPassword.replace(/\s/g, "").length == 0){
	    	errorAlert($('#erroldpassword'),errorArrPassword[0]);
	    	flag = false;
			return false;
	    }
	    if(_newPassword.replace(/\s/g, "").length == 0){
	    	errorAlert($('#errnewpassword'),errorArrPassword[1]);
	    	flag = false;
			return false;
	    }
	     if(_surePassword.replace(/\s/g, "").length == 0){
	    	errorAlert($('#errsurepassword'),errorArrPassword[2]);
	    	flag = false;
			return false;
	    }

	    if(_surePassword!==_newPassword){
	    	errorAlert($('#errnewpassword'),errorArrPassword[3]);
	    	flag = false;
			return false;
	    }
	    if(_newPassword.replace(/\s/g, "").length < 6 || _newPassword.replace(/\s/g, "").length > 18){
	    	errorAlert($('#errnewpassword'),errorArrPassword[4]);
	    	flag = false;
			return false;
	    }
       
        return flag;
}