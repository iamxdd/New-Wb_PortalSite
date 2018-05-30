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

var _Token = {
	"Authorization": "Bearer " + _token
};
var Locationlist = [],
	Cityslist = [],
	Provinceslist = [],
	_iframe = window.parent,
	_PublishBoxCount = _iframe.document.getElementById('PublishBox'),
	enter_id = $(_PublishBoxCount).attr("data-id"),
	enter_id = Number(enter_id);
console.log(_PublishBoxCount);
$(document).ready(function() {

	$(".talents-select").show();
	$(".project-select").hide();

	//获取行业列表
	getIndustrylist();
	//获取地址列表
	getLocationlist(true);



	function getLocation_Code(n, array) {
		var _Code = '';
		for (var i = 0; i < array.length; i++) {
			if (array[i].Name == n) {
				_Code = array[i].Code + ",";
				console.log(array[i].Code);
			}
		}

		return _Code;
	}
	/******************************************发布需求添加***************************************/
	$(".epb-btns").on("click", ".btn-sure", function(e) {
		e.stopPropagation();

		var Param_josn = $("#uploadForm").serializeJson();

		var arr_span = $("#industry span");
		var Trade = [];

		if ($("#industry").find("span").length > 0) {
			$("#industry").find("span").each(function(i) {
				if ($(this).hasClass("active")) {
					Trade.push($(this).attr('data-id'))
				}
			})
		}
		Trade = Trade.join(",");
		var City_Code = $("#City").val();
		var _param = {
			"Name": Param_josn.Name,
			"DemandType": Number(Param_josn.DemandType),
			"Trade": Trade,
			"Place": City_Code,
			"Quantity": Param_josn.Quantity,
			"Amount": Param_josn.Amount,
			"Description": Param_josn.Description
		};
		
		/*名称校验*/
		var maxCount = 500;
		var text_init = $("#intro").text();
		var curl_length = $("#intro").val().length;
		var wantName_length=$("#wantName").val().length;
		var NameFlag = NameCheck(Param_josn.Name),
			moneyFlag = moneyCheck(Number(Param_josn.Amount));

		if (City_Code == '' || Param_josn.Name == '' || Param_josn.Description == '' || Trade == '' || Param_josn.Quantity == '' || Param_josn.Amount == '') {

			layerAlert.autoclose("表单提交不能为空，每项都必填");
			return false;
		}
		if (curl_length > maxCount) {
			layerAlert.autoclose("企业介绍不能超过500个字！");
			return;
		}
		if(wantName_length>16){
			layerAlert.autoclose("发布需求的名称不能超过16个字！");
			return;
		}

       if(Param_josn.Amount.length>10){
       		layerAlert.autoclose("金额不能超过10位");

			return false;
       }
		if (!moneyFlag) {
			layerAlert.autoclose("金额不合法,请输入数字或数字加小数点");

			return false;
		}
		switch (Number(Param_josn.DemandType)) {
			case 1:
				//人才
				if (!(/(^[1-9]\d*$)/.test(Number(Param_josn.Quantity)))) {

					layerAlert.autoclose("人才数量只能为正整数");
					return false;
				}
				break;
			case 2:
				if (!(/^\d+(?=\.{0,1}\d+$|$)/.test(Number(Param_josn.Quantity)))) {
					layerAlert.autoclose("项目需求时间不合法,请输入大于0的数字");
					return false;
				}
				break;
			default:
				break;
		}

		if (!NameFlag) {
			layerAlert.autoclose("名称不合法");
			flag = false;
			return false;
		}
		//新增
		PostAjax(window.url.adddemandinfo, _param, _Token).done(function(res) {
			var Code = res.State.Code;
			var Message = res.State.Message;
			if (Code == 0) {
				//新增成功
				layerAlert.autoclose("新增成功！");
				getPublishBoxCount(window.url.corporationstatistics, $(_PublishBoxCount));
				setTimeout(function() {
					parent.location.href = "../enterprise.html";
				}, 1600);
			}
		}).fail(function() {
			layerAlert.autoclose("新增失败！");
		});


	});






	/*********************************************************************************/
});

var moneyCheck = function(val) {
		var flag = true;
		var patternName = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/;
		if (patternName.test(val)) {
			flag = true;
		} else {
			flag = false;
		}
		return flag;
	}
	/*******************************************获取行业列表******************************************/
function getIndustrylist() {

	GetAjax(window.url.industrylist, _header, ".uploadForm").done(function(res) {
		var Code = res.State.Code;
		if (Code == 0) {
			if (JSON.stringify(res.Content) != "{}" || res.Content != null) {
				var Content = res.Content;
				var industry_span = '';
				/*Content.forEach(function(v, i) {
					industry_span = '<span name="Trade" data-id="'+${v.Code}+'">'+${v.Name}+'</span>';
					$('#industry').append(industry_span);
				});*/
				for(var i=0;i<Content.length;i++){
					var v = Content[i];
					industry_span = '<span name="Trade" data-id="'+v.Code+'">'+v.Name+'</span>';
					$('#industry').append(industry_span);
				}
			}
		}

	}).fail(function() {
		console.log('fail');
	});

}

/***********************************取消**********************************************/
$(".btn-cancel").on("click", function() {
	parent.location.href = "../enterprise.html";
})

/******************************************选择类型事件***************************************/
$('#publishSelect').change(function() {
	var publish_option = $(this).children('option:selected').val(); //这就是selected的值
	console.log(typeof(publish_option));
	switch (publish_option) {
		case "1":
			//选择的是人才
			$(".talents-select").show();
			$(".project-select").hide();
			break;
		case "2":
			//选择的是项目
			$(".project-select").show();
			$(".talents-select").hide();
			break;
		default:
			break;
	}
});

/******************************************标签选中取消***************************************/
$("#industry").on("click", "span", function() {
	if ($(this).hasClass("active")) {
		$(this).toggleClass("active");
	} else {
		if ($(".form-group-tags span.active").length >= 3) {
			layerAlert.autoclose("最多选择3个行业!");
			return;
		} else {
			$(this).toggleClass("active");
		}
	}

});

/******************************************行业工作选择***************************************/
//$(".form-group-tags").on("click", "span", function() {
//	var isActive = false;
//	if ($(this).hasClass("active")) {
//		isActive = true;
//	}
//	var n = $(".form-group-tags .active").length;
//	if (n >= 3 && !isActive) {
//		layerAlert.autoclose("行业最多只能选择三个");
//		return;
//	} else {
//		$(this).toggleClass("active");
//	}
//
//});
/******************************************获取工作地点 城市***************************************/
var getCityslist = function(code) {
	var cityHtml = '';
	$.each(Provinceslist, function(index, item) {
		if (item.ParentCode == code) {
			cityHtml += '<option value=' + item.Code + '>' + item.Name + '</option>';
		}

	});
	$("#City").html(cityHtml);
};

$("#Province").on("change", function() {
	var value = $(this).val();
	getCityslist(value);
});


/******************************************工作地点 省级 ***************************************/
var getLocationlist = function(getChildren) {
	GetAjax(window.url.getalllocation, _header, ".sp-lefts").done(function(res) {
		var Code = res.State.Code;
		var Message = res.State.Message;
		if (res.State.Code == 0) {
			if (res.Content.length > 0) {

				Provinceslist = res.Content;
				var _parentCode;
				var ProvincesHtml = "";

				$.each(Provinceslist, function(index, item) {
					if (item.ParentCode == '') {
						_parentCode = item.Code;
					}

				});
				$.each(Provinceslist, function(index, item) {
					if (item.ParentCode == _parentCode) {
						ProvincesHtml += '<option value=' + item.Code + '>' + item.Name + '</option>';
					}

				});
				$("#Province").html(ProvincesHtml);

				//页面初始化
				if (getChildren) {
					var code = Provinceslist[1].Code;
					getCityslist(code);
				}
			}

		} else {
			layerAlert.autoclose()
		}
	}).fail(function() {
		console.log('fail');
	})
};

/**
 * [getpersonalfavoriteCount 获取我的收藏数 分享个数]
 * @param  {[type]} url [地址]
 * @param  {[type]} dom [dom元素]
 * @return {[type]}     [description]
 */
function getPublishBoxCount(url, dom, text) {
	var _url = url + "?id=" + enter_id;
	GetAjax(_url, _header).done(function(res) {
		if (res.State.Code == 0) {
			if (text == undefined) {
				dom.text(res.Content.Publish);
			} else {
				dom.text(res.Content[text]);
			}

		}
	}).fail(function() {
		console.log('fail')
	})
};

/*****************************************企业介绍限制字数***************************************************/

function wordsdDal() {
	var maxCount = 500;
	var text_init = $("#intro").text();
	var curl_length = $("#intro").val().length;
	$("#textCount").text(curl_length);
}