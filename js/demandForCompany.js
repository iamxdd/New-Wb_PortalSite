window.url = pageConfig.ajaxUrl;
var _accountInfo = window.LS.getItem('accountInfo');
var _token = '';
var _userName = '';
var _header = {};
var _Cid = 0;
var favorite_id = -1; /*未收藏*/
var collection_id = -1; /*未关注*/
var _AccountType = 0;
if(_accountInfo) {
	_token = $.parseJSON(_accountInfo).Token;
	_header = {
		'Content-Type': "application/json",
		"Authorization": "Bearer " + _token,
		"Accept": "application/json"
	};
	_userName = $.parseJSON(_accountInfo).LoginName;
	_AccountType = $.parseJSON(_accountInfo).AccountType;
}
var loginHtml = "/personal/login.html";
$(document).ready(function() {

	var _url = window.location.href.split("/");
	var Cid = _url[_url.length - 1].split(".")[0];
	 _Cid = Number(Cid);
	_Cid=1380;
	_SourceId = _Cid;


	fetchData(url.corporationbyid+"?id="+_Cid);

    if(_userName!==''){
    	getColletionState(url.colectionStates + "?ftype=" + 3 + "&sidstring=" + _Cid, $(".favorite"), '收藏');
		getColletionState(url.personalfollow + "?ftype=" + 3 + "&sidstring=" + _Cid, $(".attention"), '关注');
    }
	

	/******************************************查看详情*************************************************/
	$('body').on('click', '.see-detais', function(e) {
		e.stopPropagation();
		var that = this;
		$(that).parents('.divPar').siblings('.divPar').children('.liChild').remove();
		$(that).parents('.divPar').siblings('.divPar').removeClass('liactive');
		var _id = $(that).attr('data-id'),
			_div = '';
		if($(that).parents('.divPar').hasClass('liactive')) {
			$(that).parents('.divPar').children('.liChild').remove();
			$(that).parents('.divPar').siblings('.divPar').removeClass('liactive');
			$(that).parents('.divPar').removeClass('liactive');
			$(that).children().addClass("fa-chevron-down").removeClass("fa-chevron-up");
		} else {
			GetAjax(url.demandDetail + '?id=' + _id, _header, $(that).parents('.company-need'))
				.done(function(data) {
					var _code = data.State.Code;
					if(_code === 0 && JSON.stringify(data.Content) !== '{}' && data.Content !== null) {
						_div = '<div class="liChild">' + '任职要求:' + data.Content.Description + '</div>';
						$(that).parent('li').after(_div);
						$(that).parents('.divPar').addClass('liactive');
						$(that).children().addClass("fa-chevron-up").removeClass("fa-chevron-down");
					}
				})
				.fail(function(fail) {
					console.log(fail)
				});

		}

	});

	/******************************************立即投递*************************************************/
	$('body').on('click', '.now-deliver', function(e) {
		e.stopPropagation();
		var that = this;
		var _id = $(that).attr('data-id');
		if(_userName == '') {
			window.location = loginHtml;
			var _CurrentAddress = window.location.href;
			window.LS.setItem('CurrentAddress', _CurrentAddress);
			return;
		}
		GetAjax(url.demanddeliver + '?demandId=' + _id, _header, $(that).parents('.company-need'))
			.done(function(data) {
				var _code = data.State.Code;
				if(_code === 0) {
					layerAlert.autoclose('投递成功');
					$(that).attr('disabled', true);
					$(that).html('已投递');
					$(that).css('background', 'rgb(221, 221, 221)');
					fetchData(url.corporationbyid + "?id=" + _Cid);

				} else {
					layerAlert.autoclose('投递失败');
				}
			})
			.fail(function(fail) {
				ayerAlert.autoclose('后台出错，请联系管理员');
			});
	});

	/******************************************收藏*************************************************/
	$('body').on('click', '.favorite', function(e) {
		e.stopPropagation();
		var that = this;
		var _id = $(that).attr('data-id');
		if(_userName == '') {
			window.location = loginHtml;
			var _CurrentAddress = window.location.href;
			window.LS.setItem('CurrentAddress', _CurrentAddress);
			return;
		}
		var _SourceName = $('.trd-part-right').children('h4').text(),
			_data = {
				"FavoriteType": 3,
				"SourceId": Number(_SourceId),
				"SourceName": _SourceName
			};
		// 取消收藏
		if($(that).hasClass("colletion-done")) {
			deleteCollection(url.deletepersonalfavorite + '?id=' + favorite_id, $(".favorite"), '收藏')
			return;
		}
		//点击收藏
		PostAjax(url.favoriteUrl, JSON.stringify(_data), _header)
			.done(function(data) {
				var _code = data.State.Code;
				if (_code === 0) {
					layerAlert.autoclose('收藏成功');
					getColletionState(url.colectionStates + "?ftype=" + 3 + "&sidstring=" + _Cid, $(".favorite"), '收藏');
				} else {
					layerAlert.autoclose('收藏失败');
				}
			})
			.fail(function(fail) {
				ayerAlert.autoclose('后台出错，请联系管理员');
			});

	});

	/******************************************关注*************************************************/
	$('body').on('click', '.attention', function(e) {
		e.stopPropagation();
		var that = this;
		var _id = $(that).attr('data-id');
		if(_userName == '') {
			window.location = loginHtml;
			var _CurrentAddress = window.location.href;
			window.LS.setItem('CurrentAddress', _CurrentAddress);
			return;
		}
		var _SourceName = $('.trd-part-right').children('h4').text(),
			/*_url = window.location.href.split("/"),
			_SourceId = _url[_url.length - 1].split(".")[0],*/
			_data = {
				"FollowType": 3,
				"SourceId": Number(_SourceId),
				"SourceName": _SourceName
			};
		// 取消关注
		if($(that).hasClass("colletion-done")) {
			deleteCollection(url.deletepersonalfollow + '?id=' + collection_id, $(".attention"), '关注');
			return;
		}
		//点击关注
		PostAjax(url.deletepersonalfollow, JSON.stringify(_data), _header)
			.done(function(data) {
				var _code = data.State.Code;
				if(_code === 0) {;
					//$(that).removeClass("active");
					layerAlert.autoclose('关注成功');
					$(that).html('已关注');
					getColletionState(url.personalfollow + "?ftype=" + 3 + "&sidstring=" + _Cid, $(".attention"), '关注');
				} else {
					layerAlert.autoclose('关注失败');
				}
			})
			.fail(function(fail) {
				ayerAlert.autoclose('后台出错，请联系管理员');
			});

	});


	/**
	 * [deleteCollection description]删除收藏
	 * @param  {[type]} delete_id [description]
	 * @param  {[type]} _SourceId [description]
	 * @return {[type]}           [description]
	 */

	function deleteCollection(url, dom, text) {
		DeleteAjax(url, _header).done(function(res) {
			var Code = res.State.Code;
			var Message = res.State.Message;
			if(Code == 0) {
				layerAlert.autoclose("取消成功");
				dom.html(text);
				if(text == "关注") {
					getColletionState(window.url.personalfollow + "?ftype=" + 3 + "&sidstring=" + _Cid, $(".attention"), '关注');
				} else {
					getColletionState(window.url.colectionStates + "?ftype=" + 3 + "&sidstring=" + _Cid, $(".favorite"), '收藏');
				}

			} else {
				layerAlert.autoclose(Message);

			}

		});
	};
	/*推荐人才or企业*/
	var getTalentRecommend = function(url, dom, type) {
		/*type： 1为人才 2为企业*/
		GetAjax(url).done(function(response) {
			var Code = response.State.Code;
			var Message = response.State.Message;
			if(Code === 0) {
				var talentListHtml = "";
				$.each(response.Content, function(index, item) {
					switch(type) {
						case 1:
							var Tags = item.Tags;
							var TagsHtml = "";
							$.each(Tags, function(n, v) {
								TagsHtml += '<span>' + v.Name + '</span>';
							});
							if(item.AvatarUrl==null || item.AvatarUrl=="/img/zz_39.png"){
								item.AvatarUrl="../img/zz_39.png";
							}
							talentListHtml +=
								'<li class="clearfix">' +
								'<a href="/supplyanddemand/talentsdetail/' + item.Id + '.html" >' +
								'<div class="spr-image">' +
								'<img src=' + item.AvatarUrl + ' />' +
								'</div>' +
								'<div class="spr-text">' +
								'<h4 class="clearfix"><i class="fr">' + (item.WorkingYears ? item.WorkingYears : 0) + '年从业经验</i>' + item.NickName + '</h4>' +
								'<div class="sprt-tags">' + TagsHtml + '</div>' +
								'</div>' +
								'</a>' +
								'</li>';
							break;
						case 2:
							talentListHtml +=
								'<a href="/supplyanddemand/corporationdetail/' + item.Id + '.html">' +
								'<dl>' +
								'<dt title="' + item.Name + '" class="clearfix">' +
								'<i>' + item.NatureName + '</i>' +
								(item.Name.length > 10 ? item.Name.substring(0, 10) + '..' : item.Name) +
								'</dt>' +
								'<dd>规模：' + item.ScaleName +
								'</dl>' +
								'</a>';
							break;
						default:
							break;
					}

				});
				if(!!talentListHtml) {
					dom.html(talentListHtml);
				}
			} else {

			}
		}).error(function(err) {

		});
	};
	getTalentRecommend(window.url.getTalentRecommend, $("#talentList"), 1);
	getTalentRecommend(window.url.getcorporationsRecommend, $("#companyList"), 2);
});

/**
 * [fetchData description] 初始化数据
 * @param  {[type]} url [description]
 * @return {[type]}     [description]
 */
function fetchData(url) {
	$('.trd-part-left').children('img').attr('src', '');
	$('.trd-part-right').children('h4').text('');
	$('.company-introduce').children('span').eq(0).text('');
	$('.company-introduce').children('.margin-left').eq(0).next('span').text('');
	$('.company-introduce').children('.margin-left').eq(1).next('span').text('');
	$('.company-introduce-content').children('p').text('');
	$('.company-need').children('ul').html('');
	$('.identify-span').css('display', 'none');
	GetAjax(url, _header, ".sp-lefts")
		.done(function(data) {
			var _code = data.State.Code,
				list = [],
				topContent = {},
				_ul = '';
			if(_code === 0 && data.Content !== null) {
				topContent["Name"] = data.Content["Name"];
				topContent["IconUrl"] = data.Content["IconUrl"];
				topContent["Nature"] = data.Content["Nature"];
				topContent["ScaleName"] = data.Content["ScaleName"];
				topContent["Address"] = data.Content["Address"];
				topContent["Introduction"] = data.Content["Introduction"];
				topContent["Id"] = data.Content["Id"];
				topContent["NatureName"] = data.Content["NatureName"];
				topContent["CertificateState"] = data.Content["CertificateState"];
				$('.trd-part-left').children('img').attr('src', topContent.IconUrl);
				$('.trd-part-right').children('h4').text(topContent.Name);
				$('.company-introduce').children('.margin-left').eq(0).next('span').text(topContent.ScaleName);
				$('.company-introduce').children('.margin-left').eq(1).next('span').text(topContent.Address);
				$('.company-introduce-content').children('p').attr("title",topContent.Introduction);
				$('.company-introduce-content').children('p').text("企业介绍: "+topContent.Introduction);
				$('.company-introduce').children('span').eq(0).text(topContent.NatureName);
				if(topContent["CertificateState"] === 3) {
					$('.identify-span').css('display', 'inline-block');
				} else {
					$('.identify-span').css('display', 'none');
				}
				if(data.Content.DemandInfos && data.Content.DemandInfos.length > 0) {
					list = data.Content.DemandInfos;
					list.forEach(function(v) {
						var DeliverState_str = '';
						if((_AccountType == 1 && v.DemandType == 1) || (_AccountType == 2 && v.DemandType == 2)) {
							if(v.DeliverState == false) {
								//未投递
								DeliverState_str = '<button class="now-deliver" data-id=' + v.Id + '>立即投递</button>';
							} else {
								//已投递
								DeliverState_str = '<button class="done-deliver" data-id=' + v.Id + '>已投递</button>';
							}

						}
						if((_AccountType == 1 && v.DemandType == 2) || (_AccountType == 2 && v.DemandType == 1) || _AccountType == 0 || _AccountType == null) {
							DeliverState_str = ''
						}

						_ul += '<div class="divPar"><li>' +
							'<span class="program-name" title="'+ v.Name+'">' + v.Name + '</span>' +
							'<span>' + getjob(v.DemandType, v.Quantity) + '</span>' +
							'<span><b class="number">' + getMoney(v.DemandType, v.Amount) + '</b></span>' +
							'<button class="see-detais" data-id=' + v.Id + '>查看详情 <i class="fa fa-chevron-down"></i></button>' +
							DeliverState_str +
							'</div></li>';

						/*	if (v.DeliverState == false) {
								//未投递
								DeliverState_str = '<button class="now-deliver" data-id=' + v.Id + '>立即投递</button>';
							} else {
								//已投递
								DeliverState_str = '<button class="done-deliver" data-id=' + v.Id + '>已投递</button>';
							}
							_ul += '<div class="divPar"><li>' +
								'<span class="program-name">' + v.Name + '</span>' +
								'<span>' + getjob(v.DemandType, v.Quantity) + '</span>' +
								'<span><b class="number">' + getMoney(v.DemandType, v.Amount) + '</b></span>' +
								'<button class="see-detais" data-id=' + v.Id + '>查看详情 <i class="fa fa-chevron-down"></i></button>' +
								DeliverState_str +
								'</div></li>';*/
					});

					$('.company-need').children('ul').html(_ul);
				}
			} else {

			}
		})
		.fail(function(fail) {
			console.log(fail)
		});
}

/**
 * [gettext description] 工作日转换
 * @param  {[type]} id    [description]
 * @param  {[type]} value [description]
 * @return {[type]}       [description]
 */
function getjob(id, value) {
	var text = '';
	if(id == 1) {
		text = value + '名 ';
	} else {
		text = value + '个工作日 ';
	}
	return text;
}

/**
 * [gettext description] 金额转换
 * @param  {[type]} id    [description]
 * @param  {[type]} value [description]
 * @return {[type]}       [description]
 */
function getMoney(id, value) {
	var text = '';
	if (id == 1) {
		text = '月薪' + value + 'k';
	} else {
		text = '项目金额' + value + 'w';
	}
	return text;
}

/**
 * [getColletionState description] 获取当前源收藏状态
 * @param  {[type]} sidstring [description]
 * @return {[type]}           [description]
 */

function getColletionState(url, dom, text) {
	GetAjax(url, _header).done(function(res) {
		var Code = res.State.Code;
		var Message = res.State.Message;
		if(Code == 0) {
			if(res.Content.length > 0) {
				if(text == "收藏") {
					favorite_id = res.Content[0].Id;
				} else {
					collection_id = res.Content[0].Id;
				}

				dom.addClass("colletion-done");
				dom.html('已' + text);
				//dom.css('background', 'rgb(221, 221, 221)');
			} else {

				dom.removeClass("colletion-done");
				dom.html(text);
			}
		} else {
			layerAlert.autoclose(Message);
		}

	}).fail(function() {
		console.log('fail');
	})
};