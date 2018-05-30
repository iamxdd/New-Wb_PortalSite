window.url = pageConfig.ajaxUrl;
var _accountInfo = window.LS.getItem('accountInfo');
var _token = '';
var _userName = '';
var _header = {};
if (_accountInfo) {
	_token = $.parseJSON(_accountInfo).Token;
	_header = {
		'Content-Type': "application/json",
		"Authorization": "Bearer " + _token,
		"Accept": "application/json"
	};
	_userName = $.parseJSON(_accountInfo).LoginName;
}
$(document).ready(function() {

	/*$(".share-btns a span").addClass("no-click");
	if (_userName != '') {
		$(".share-btns a span").removeClass("no-click");
	}*/
	/*绑定选定的标签*/
	var tagListN = $(".ldrp-tags ul li").length;
	var tagid = GetQueryString("tagid");
	for (var i = 0; i < tagListN; i++) {
		var $this = $(".ldrp-tags ul li").eq(i);
		if (tagid === $this.attr("data-agid")) {
			$this.addClass("active");
		}
	}

//	/*详情未登录跳转登录*/
//	$(".infomation_details").on("click", function(e) {
//		if (_userName === '' || _userName === null || _userName === 'undefined' || _userName === 'null') {
//			supplyHiddenBack();
//		}
//	});

//	/*前沿资讯未登录跳转*/
//	$(".ldlt-shares").on("click", function(e) {
//		e.stopPropagation();
//		supplyHiddenBack();
//	});

	/******************************************前沿资讯新增分享点击*************************************************/

	$('.ldlt-shares').on('click', '.share-btns>a>span', function(e) {
		e.stopPropagation();

		var _SourceName = $(this).parents('.ldlt-tags').siblings('h4').text(),
			_Ids = $(this).parents('.ldlt-tags').siblings('h4').children('a').attr('href').split('/'),
			_SourceId = _Ids[_Ids.length - 1].split('.'),
			_data = {
				"SharedType": 0,
				"SourceId": Number(_SourceId[0]),
				"SourceName": _SourceName,
			};
		var _Token = {
			"Authorization": "Bearer " + _token
		};
		if (!_accountInfo) return;

		PostAjax(url.shareUrl, JSON.stringify(_data), _header).done(function(res) {
			var _code = res.State.Code,
				_message = res.State.Message;
		}).fail(function() {
			console.log('share fail')
		})

	});

	/******************************************前沿资讯新增分享点击*************************************************/

	$('.ld-cleft').on('click', '.share-btns>a>span', function(e) {
		e.stopPropagation();
		var _SourceName = $(this).parents('.leader-infomation-tags').siblings('h4').text(),
			_Ids = window.location.href.split('/'),
			_SourceId = _Ids[_Ids.length - 1].split('.'),
			_data = {
				"SharedType": 0,
				"SourceId": Number(_SourceId[0]),
				"SourceName": _SourceName,
			};

		var _Token = {
			"Authorization": "Bearer " + _token
		};
		if (!_accountInfo) return;

		PostAjax(url.shareUrl, JSON.stringify(_data), _Token).done(function(res) {
			var _code = res.State.Code,
				_message = res.State.Message;
		}).fail(function() {
			console.log('share fail')
		})

	});

	/*标签选中状态*/

	/*$(".ldrp-tags ul").on("click", "li", function() {
		$(this).toggleClass("active");
	});*/

});
/*********************************未登录跳转***********************************8*/
function supplyHiddenBack() {
	var timer = null,
		count = 6;
	$('.alertText').html('');
	$(".alertspanTime").html('');
	$('.alertspanText').html('');
	if (_userName === '' || _userName === null || _userName === 'undefined' || _userName === 'null') {
		$('.supplyHiddenBack').css('display', 'block');
		$('.alertText').html('亲,您还未登录');
		clearInterval(timer); //清除计时器
		var timer = setInterval(function() {
			if (count > 0) {
				count--;
				$(".alertspanTime").html(count + "s");
				$('.alertspanText').html('后跳转到登录页面');
			} else {
				clearInterval(timer); //清除计时器
				window.location = "login.html";
			}
		}, 1000);
	}
}