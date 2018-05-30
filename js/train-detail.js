window.url = pageConfig.ajaxUrl;
var _accountInfo = window.LS.getItem('accountInfo');
var _token = '';
var _userName = '';
var _header = {};
var loginHtml = "/personal/login.html";
if(_accountInfo) {
	_token = $.parseJSON(_accountInfo).Token;
	_header = {
		'Content-Type': "application/json",
		"Authorization": "Bearer " + _token,
		"Accept": "application/json"
	};
	_userName = $.parseJSON(_accountInfo).LoginName;
}
var favorite_id;

$(document).ready(function() {
	var _url = window.location.href.split("/");
	var strdin = _url[_url.length - 1].split(".")[0];
	strdin = Number(strdin);

	if(_userName != '') {
		getColletionState(strdin);
	}
	$(".share-group .share-btn").on("click", function() {

		$(".share-group .ldlt-shares").toggle();
	});

	$(".share-btn").on("click", function() {
		supplyHiddenBack();
	});

	var dataN = $(".panel-list ul li").length;

	if(dataN === 0) {
		$("#partBtn").addClass("btn-disable");
	}

	/***************************************判断优酷地址是否合法***************************************/
	var fileUrl = "",
		isHasVideo = false;
	var youkuUrl = $(".panel-list ul li").eq(0).attr("data-yukuurl");

	if(youkuUrl == undefined) {
		fileUrl = $(".panel-list ul li").eq(0).attr("data-fileurl");
	} else if(youkuUrl.indexOf("http://player.youku.com/embed/") > -1) {
		isHasVideo = true;
		$(".play-div").addClass("active");
	} else {
		fileUrl = $(".panel-list ul li").eq(0).attr("data-fileurl");
	}

	$(".play-div a").on("click", function() {
		$("#partBtn").trigger("click");
	});
	/******************************************人才培训新增分享点击*************************************************/

	$('.ldlt-shares').on('click', '.share-btns>a>span', function(e) {

		e.stopPropagation();
		$(".share-group .ldlt-shares").hide();
		var _SourceName = $('#trainName').text(),
			_url = window.location.href.split("/"),
			_SourceId = _url[_url.length - 1].split(".")[0],
			_data = {
				"SharedType": 1,
				"SourceId": Number(_SourceId),
				"SourceName": _SourceName
			};
		if(_userName === '' || _userName === null || _userName === 'undefined' || _userName === 'null') {
			return;

		}
		PostAjax(url.shareUrl, JSON.stringify(_data), _header).done(function(res) {
			var _code = res.State.Code,
				_message = res.State.Message;

		}).fail(function() {
			console.log('share fail')
		});

	});
	/******************************************人才培训新增收藏*************************************************/

	$('.collect-btn').on('click', 'i', function(e) {
		e.stopPropagation();
		var timer = null,
			count = 6;
		var _SourceName = $('#trainName').text(),
			_url = window.location.href.split("/"),
			_SourceId = _url[_url.length - 1].split(".")[0],
			_data = {
				"FavoriteType": 1,
				"SourceId": Number(_SourceId),
				"SourceName": _SourceName
			};
		console.log(_data);
		if(_userName === '' || _userName === null || _userName === 'undefined' || _userName === 'null') {
			supplyHiddenBack();

		} else {

			var _Token = {
				"Authorization": "Bearer " + _token
			};
			if(!$(".collect-btn i").hasClass("bg-red")) {

				//点击收藏
				PostAjax(url.favoriteUrl, JSON.stringify(_data), _header, ".trd-part").done(function(res) {
					var _code = res.State.Code,
						_message = res.State.Message;
					if(_code == 0) {
						layerAlert.autoclose("收藏成功");
						//$(".collect-btn i").addClass("bg-red");
						getColletionState(_SourceId);
					}
				}).fail(function() {
					console.log('share fail')
				})

			} else {
				//取消收藏
				deleteCollection(favorite_id, _SourceId);

			}

		}
	})

	/******************************************人才培训新增收藏*************************************************/
	//培训详情切换
	$(".lefts .h4").on("click", "li", function() {
		var n = $(this).index();
		$(this).addClass("active").siblings().removeClass("active");
		$(".lefts .panels .panel").eq(n).show().siblings().hide();
	});

	//
	$(".panels .panel-list").on("mousemove", "li", function() {
		$(this).addClass("active").siblings().removeClass("active");
	}).on("mouseout", "li", function() {
		$(this).removeClass("active");
	});

	//加载更多
	$("#evaluateMore").on("click", function() {
		$(".fixed-div").toggle();
	});

	$(".fixed-box h4 .close").on("click", function() {
		$(".fixed-div").toggle();
	});

	/*********************************立即参加***********************************8*/
	$("#partBtn").on("click", function() {
		if($(this).hasClass("btn-disable")) {
			return;
		}
		if(_userName === '' || _userName === null || _userName === 'undefined' || _userName === 'null') {
			supplyHiddenBack();
			return;
		}
		var baseVideoUrl = "http://player.youku.com/embed/";
		if(!!youkuUrl && youkuUrl.indexOf(baseVideoUrl) > -1) {
			/*var isChrome = window.navigator.userAgent.indexOf("Chrome") !== -1;
			if(isChrome) {
				window.location.href = youkuUrl;
				return;
			}*/
			window.open(youkuUrl, "_blank", 'width=800,height=600,left=100,top=100');
		} else {
			window.location.href = fileUrl;
		}
					
		var _url = window.location.href.split("/");
		var id = _url[_url.length - 1].split(".")[0];
		var trainName = $("#trainName").html();
		var data = {
			TrainId: id,
			TrainName: trainName
		};

		PostAjax(window.url.trainstudyAdd, JSON.stringify(data), _header).done(function(response) {
			var Code = response.State.Code;
			var Message = response.State.Message;
			if(Code === 0) {
				//layerAlert.autoclose("操作成功");
				getStudyCount();
			} else {
				layerAlert.autoclose(Message);
			}
		});
	});
	var _number = $('.number').text();
	var _count = Number(_number.substring(0, _number.indexOf('次')));
	/*********************************统计学习量***********************************8*/
	var getStudyCount = function() {
		GetAjax(window.url.trainstudy, _header).done(function(res) {
			var Code = res.State.Code;
			var Message = res.State.Message;
			if(Code == 0) {
				//获取学习次数
				$("#study-count").html(res.Content.allCount);
				var allCount = _count + 1;
				$('.number').html(allCount + '次');

			} else {
				layerAlert.autoclose(Message);
			}

		}).fail(function() {
			console.log('fail');
		})
	};


});

/*********************************获取当前源收藏状态***********************************8*/
var getColletionState = function(sidstring) {
	var url = window.url.colectionStates + "?ftype=" + 1 + "&sidstring=" + sidstring
	GetAjax(url, _header, ".trd-part").done(function(res) {
		var Code = res.State.Code;
		var Message = res.State.Message;
		if(Code == 0) {
			if(res.Content.length > 0) {
				$(".collect-btn i").addClass("bg-red");
				favorite_id = res.Content[0].Id;
			} else {
				$(".collect-btn i").removeClass("bg-red");
			}

		} else {
			layerAlert.autoclose(Message);
		}

	}).fail(function() {
		console.log('fail');
	})
};
/*********************************删除收藏***********************************8*/
var deleteCollection = function(delete_id, _SourceId) {
	DeleteAjax(window.url.deletepersonalfavorite + '?id=' + delete_id, _header).done(function(res) {
		var Code = res.State.Code;
		var Message = res.State.Message;
		if(Code == 0) {
			layerAlert.autoclose("取消收藏成功");
			$(".collect-btn i").removeClass("bg-red");
			getColletionState(_SourceId);
		} else {
			layerAlert.autoclose(Message);
		}

	});
}
/*********************************未登录跳转***********************************8*/
function supplyHiddenBack() {
	var timer = null,
		count = 6;
	$('.alertText').html('');
	$(".alertspanTime").html('');
	$('.alertspanText').html('');
	if(_userName === '' || _userName === null || _userName === 'undefined' || _userName === 'null') {
		var _CurrentAddress = window.location.href;
		window.LS.setItem('CurrentAddress', _CurrentAddress);
		window.location = loginHtml;
	}
}

/*********************************输入字数限制***********************************8*/
 function limitEvent(field) {
	var max = 100;
	if(field.value.length > max) {
		field.value = field.value.substring(0, max);
	}
	var num = 100 - field.value.length;
	$(".textword").children('b').text(num);
} 

/********************************评论数据初始化***********************************8*/

function fetchData(url){
	var _p = '';
	$('.evaluate-list').html('');
	if(_userName==''){
		_p = '<p style="margin: 20px 0;">暂无评论！</p>';
		$('.evaluate-list').html(_p);
	}else{

	}
}

/********************************评论数据初始化绑定dom***********************************8*/
function fetchDataDom(data,dom){
	dom.html('');
	var _html = '';
	data.forEach(function(v){
		
	})
}
