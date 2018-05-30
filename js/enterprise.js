/************************************************内容宽度变化的iframe高度自适应*******************************************/
function reinitIframe() {
	var iframe = document.getElementById("rightFrame");
	try {
		var bHeight = iframe.contentWindow.document.body.scrollHeight;
		var dHeight = iframe.contentWindow.document.documentElement.scrollHeight;
		var height = Math.min(bHeight, dHeight);
		var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串  
		var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器  
		var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器  
		var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
		if (isIE) {
			var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
			reIE.test(userAgent);
			var fIEVersion = parseFloat(RegExp["$1"]);
			if (fIEVersion <= 8) {
				iframe.style.height = height;
			} else {
				iframe.height = height;
			}
		} else {
			iframe.height = height;
		}
		/*		console.log(height)*/
	} catch (ex) {}
}

window.setInterval("reinitIframe()", 200);
window.url = pageConfig.ajaxUrl;
/******************************其他*******************************/
var _accountInfo = window.LS.getItem('accountInfo');
var _token = '',
	_userName = "";
var _header = {};
if(_accountInfo) {
	_token = $.parseJSON(_accountInfo).Token;
	_header = {
		'Content-Type': "application/json",
		"Authorization": "Bearer " + _token,
		"Accept": "application/json"
	};
	_userName = $.parseJSON(_accountInfo).LoginName;
}
$(document).ready(function() {
	if(_userName == "") {
		window.location = "login.html";
		return;
	}

    var _enterNavIndex = window.LS.getItem('enterNavIndex');
    var _iframeHTML = '';
    var _iframeArr = ['enterpriseCenter/baseInfo.html','enterpriseCenter/release.html','enterpriseCenter/receive.html','enterpriseCenter/delivery.html','enterpriseCenter/myFollow.html','enterpriseCenter/myFavorite.html','enterpriseCenter/myShare.html','enterpriseCenter/modifyPassword.html'];
    if(_enterNavIndex){
    	_iframeHTML = '';
    	$(".ucl-menus ul>li").removeClass("active");
    	$(".ucl-menus ul>li").eq(0).addClass("active");
    	_iframeHTML = '<iframe name="rightFrame" id="rightFrame" scrolling="no" frameborder="no" class="ucr-bodys" onload="this.height=rightFrame.document.body.scrollHeight" src='+_iframeArr[_enterNavIndex]+'></iframe>';
    	$('.uc-rights').html(_iframeHTML);
    }else{
    	_iframeHTML = '<iframe name="rightFrame" id="rightFrame" scrolling="no" frameborder="no" class="ucr-bodys" onload="this.height=rightFrame.document.body.scrollHeight" src='+_iframeArr[0]+'></iframe>';
    	$('.uc-rights').html(_iframeHTML);
    	$(".ucl-menus ul>li").removeClass("active");
    	$(".ucl-menus ul>li").eq(0).addClass("active");
    }
	//左侧导航菜单切换
	$(".ucl-menus ul").on("click", "li", function() {
		$(this).addClass("active").siblings().removeClass("active");
		var _index = $(this).index();
		window.LS.setItem('enterNavIndex',_index);
	});

	var _accountInfo = window.LS.getItem('accountInfo');
	var imgUrl = '';
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

	/*********************************************************************************/
	var count_id;
	/*获取企业基本信息*/
	var getMyInfo = function() {
		GetAjax(window.url.mycorporation, _header).done(function(res) {
			var Code = res.State.Code;
			if (Code == 0) {
				var baseInfo = res.Content;
				//判断返回的是否为空对象
				if (baseInfo != null) {
					
					if (baseInfo.CertificateState == 3) {
						$("#caret").show();
					} else {
						$("#caret").hide();
					}

					$("#enterpriseName").html(baseInfo.Name);
					$("#Nature").html(numberToText(baseInfo.Nature, NatureStatus));
					$("#Scale").html(numberToText(baseInfo.Scale, ScaleStatus));
					$("#IconUrl").html('<img class="no-error" onerror="this.src=../img/defaut.png" src=' + (baseInfo.IconUrl ? baseInfo.IconUrl : '../img/defaut.png') + '>');
					$("#PublishBox").attr("data-id", baseInfo.Id);
					$("#ReceiveBox").attr("data-id", baseInfo.Id);
					$("#DeliverBox").attr("data-id", baseInfo.Id);
					$('#FollowCount').attr("data-id", baseInfo.Id);
					$('#FavoriteCount').attr("data-id", baseInfo.Id);
					$('#sharedCount').attr("data-id", baseInfo.Id);
					count_id = baseInfo.Id;
					getCorporationstatistics(count_id);
				}
			}

		}).fail(function() {
			console.log('fail');
		})
	};

	getMyInfo();

	function getCorporationstatistics(count_id) {
		var _url = window.url.corporationstatistics + "?id=" + count_id;
		GetAjax(_url, _header).done(function(res) {
			var Code = res.State.Code;
			if (Code == 0) {
				var countInfo = res.Content;

				//判断返回的是否为空对象
				if (countInfo != null) {
					$("#PublishBox").html(countInfo.Publish);
					$("#ReceiveBox").html(countInfo.Receive);
					$("#DeliverBox").html(countInfo.Deliver);
					$('#FollowCount').html(countInfo.Follow);
					$('#FavoriteCount').html(countInfo.Favorite);
					$('#sharedCount').html(countInfo.Share);
				}
			}

		}).fail(function() {
			console.log('fail');
		})
	};
	/*数字转换为对应的文字*/
	var numberToText = function(n, array) {
		var _text;
		for (var i = 0; i < array.length; i++) {
			if (array[i].Id === n) {
				_text = array[i].Name;
			}
		}
		return _text;
	};
	/**
 * [getpersonalfavoriteCount 获取我的收藏数 分享个数]
 * @param  {[type]} url [地址]
 * @param  {[type]} dom [dom元素]
 * @return {[type]}     [description]
 */
function getpersonalfavoriteCount(url, dom, text) {
	GetAjax(url, _header).done(function(res) {
		if(res.State.Code == 0) {
			if(text == undefined) {
				dom.text(res.Content);
			} else {
				dom.text(res.Content[text]);
			}

		}
	}).fail(function() {
		console.log('fail')
	})
};
	//性质
	var NatureStatus = [{
		Id: 0,
		Name: "国有企业"
	}, {
		Id: 1,
		Name: "集体企业"
	}, {
		Id: 2,
		Name: "联营企业"
	}, {
		Id: 3,
		Name: "中外合作企业"
	}, {
		Id: 4,
		Name: "中外合资企业"
	}, {
		Id: 5,
		Name: "外商独资企业"
	}, {
		Id: 6,
		Name: "私营企业"
	}];

	var ScaleStatus = [{
		Id: 1,
		Name: "0-50"
	}, {
		Id: 2,
		Name: "51-99"
	}, {
		Id: 3,
		Name: "100-200"
	}, {
		Id: 4,
		Name: "201-499"
	}, {
		Id: 5,
		Name: "500-999"
	}, {
		Id: 6,
		Name: "1000+"
	}];
});