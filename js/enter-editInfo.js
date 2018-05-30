window.url = pageConfig.ajaxUrl;
var _accountInfo = window.LS.getItem('accountInfo');
var _token = '';
var _header = {};
if (_accountInfo) {
	_token = $.parseJSON(_accountInfo).Token;
	_header = {
		'Content-Type': "application/json",
		"Authorization": "Bearer " + _token,
		"Accept": "application/json"
	};
}
var baseInfo = null;
var imgUrl = $("#AvatarUrl").attr("src");
$(document).ready(function() {

	/******************************************获取企业基本信息***************************************/
	GetAjax(window.url.mycorporation, _header, ".ep-container").done(function(res) {
		var Code = res.State.Code;
		if (Code == 0) {
			if (res.Content != null) {
				baseInfo = res.Content;
				if (baseInfo === '' || baseInfo == null) {


				} else {
					//编辑表单初始化
					$("#uploadForm").setForm(baseInfo);
					imgUrl = baseInfo.IconUrl;
					if (baseInfo.Introduction != '') {
						var curl_length = baseInfo.Introduction.length;
						$("#textCount").text(curl_length);
					} else {
						$("#textCount").text("0");
					}

					$("#IconUrl").html('<img class="no-error"  id="AvatarUrl" onerror="this.src=/img/defaut.png" src=' + (baseInfo.IconUrl ? baseInfo.IconUrl : '/img/defaut.png') + '>');
					//$("#IconUrl").html('<img src=' + (baseInfo.IconUrl ? baseInfo.IconUrl : '/temp/zz_29.png') + ' class="imgSrc" >');
				}
			}
		}

	}).fail(function() {
		console.log('fail');
	});

	/******************************************企业中心添加***************************************/
	$(".epb-btns").on("click", ".btn-sure", function(e) {
		e.stopPropagation();
		var _Token = {
			"Authorization": "Bearer " + _token
		};
		var obj = $('#uploadForm').serialize();
		var editParam_josn = $("#uploadForm").serializeJson(obj);
		var _param = {
			"Name": editParam_josn.Name,
			"IconUrl": imgUrl,
			"Nature": Number(editParam_josn.Nature),
			"Scale": Number(editParam_josn.Scale),
			"Address": editParam_josn.Address,
			"Introduction": editParam_josn.Introduction
		};
		//表单验证
		var maxCount = 500;
		var text_init = $("#intro").text();
		var curl_length = $("#intro").val().length;
		
		if (curl_length > maxCount) {
			layerAlert.autoclose("企业介绍不能超过500个字！");
			return;
		}
		
		if (editParam_josn.Addres == '' || editParam_josn.Name == '' || editParam_josn.Introduction == '') {
			layerAlert.autoclose("表单提交不能为空，每项都必填");
			return false;
		}
		if (!(/^[A-Za-z0-9\u4e00-\u9fa5]+$/).test(editParam_josn.Name)) {
			layerAlert.autoclose("名称输入不合法只支持中文或数字或字母");

			return false;
		}
		if (baseInfo == null) {

			PostAjax(window.url.addcorporation, _param, _Token, ".ep-container").done(function(res) {
				var Code = res.State.Code;
				var Message = res.State.Message;
				if (Code == 0) {
					//新增成功
					layerAlert.autoclose("新增成功");
					setTimeout(function() {
						parent.location.href = "/enterprise/index.html";
					}, 1600);
				}
			}).fail(function() {
				console.log('share fail')
			});
			console.log(_param);
		} else {
			//编辑
			_param.Id = baseInfo.Id;

			PutAjax(window.url.updatecorporation, _param, _Token, ".ep-container").done(function(res) {
				var Code = res.State.Code;
				var Message = res.State.Message;
				if (Code == 0) {
					//修改成功
					layerAlert.autoclose("修改成功");
					setTimeout(function() {
					    parent.location.href = "/enterprise/index.html";
					}, 1600);
				}
			}).fail(function() {
				console.log('fail')
			});


		}
	});
	/*********************************************************************************/
	$(".btn-cancel").on("click", function() {
	    parent.location.href = "/enterprise/index.html";
	})
});


/*****************************************企业介绍限制字数***************************************************/

function wordsdDal() {
	var maxCount = 500;
	var text_init = $("#intro").text();
	var curl_length = $("#intro").val().length;
	$("#textCount").text(curl_length);
}

/******************************************上传图片***************************************/
$(".imgUpload").on("click", function() {
	if(navigator.appName == "Microsoft Internet Explorer" && parseInt(navigator.appVersion.split(";")[1].replace(/[ ]/g, "").replace("MSIE", "")) < 10) {
		layerAlert.autoclose('亲,你的IE版本过低，请升级到10以上');
		return false;
	}else{
		$("#fileUpload").trigger("click");
	}
});
//
$("#fileUpload").on("change", function() {
	var _fileUpload = $('#fileUpload').val();

		var formData = new FormData();
		var $this = $(this);
		var file = $this.get(0).files[0];
		formData.append('image', file);
		if(file.name == "") {
			layerAlert.autoclose("请上传图片");
			return false;
		} else {
			if(!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(file.name)) {
				layerAlert.autoclose("图片类型必须是.gif,jpeg,jpg,png中的一种")
				return;
			}
		}
		$.ajax({
			url: window.url.fileUpLoad,
			/*这是处理文件上传的servlet*/
			type: 'POST',
			data: formData,
			dataType: "json",
			async: false,
			cache: false,
			contentType: false,
			processData: false,
			headers: {
				"Authorization": "Bearer " + _token
			},
			success: function(returndata) {
				$("#AvatarUrl").attr("src", returndata.Content[0].Url);
				imgUrl = returndata.Content[0].Url;
			},
			error: function(returndata) {
				layerAlert.autoclose(returndata);
			}
		});
});



/*********************************************************************************/