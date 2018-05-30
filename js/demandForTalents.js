var _accountInfo = window.LS.getItem('accountInfo');
var _token = '';
var _userName = '';
var _header = {};
var _Cid = 0;
var favorite_id = -1; /*未收藏*/
var collection_id = -1; /*未关注*/
if(_accountInfo) {
	_token = $.parseJSON(_accountInfo).Token;
	_header = {
		'Content-Type': "application/json",
		"Authorization": "Bearer " + _token,
		"Accept": "application/json"
	};
	_userName = $.parseJSON(_accountInfo).LoginName;
}
var loginHtml = "/personal/login.html";
$(document).ready(function() {
	window.url = pageConfig.ajaxUrl;
	var _accountInfo = window.LS.getItem('accountInfo');
	var _token = '';
	var _header = {};
	if(_accountInfo) {
		_token = $.parseJSON(_accountInfo).Token;
		_header = {
			'Content-Type': "application/json",
			"Authorization": "Bearer " + _token,
			"Accept": "application/json"
		};
	}
	var _url = window.location.href.split("/");
	var Id = _url[_url.length - 1].split(".")[0];
	Id = Number(Id);
	var favorite_id;
	var attention_id;
	$("#CertificateState").hide();
	/*获取人才供需详情*/
	var getTalentInfo = function() {
		var url = window.url.gertalentbyid + "?id=" + Id;
		GetAjax(url, _header, ".sp-lefts").done(function(res) {
			var Code = res.State.Code;
			if(Code == 0) {
				var baseInfo = res.Content;

				//判断返回的是否为空对象
				if(baseInfo != null) {
					$("#talent-img").html('<img src=' + (baseInfo.AvatarUrl ? baseInfo.AvatarUrl : 'img/zz_39.png') + '>');
					$("#talent-name").html(baseInfo.RealName);
					$("#StaffState").html(numberToText(baseInfo.StaffState, StaffState));
					$("#Gender").html(numberToText(baseInfo.Gender, Genders));
					$("#Age").html(Math.floor((new Date() - new Date(baseInfo.Birthday)) / (3600 * 24 * 365 * 1000)));
					$("#Phone").html(baseInfo.Phone);
					$("#Email").html(baseInfo.Email);
					$("#GraduatedFrom").html(baseInfo.GraduatedFrom);
					$("#Profession").html(baseInfo.Profession);
					$("#Address").html(baseInfo.Address);

					//认证状态
					if(baseInfo.CertificateState==2){
						$("#CertificateState").show();
					}
					/*identify-done 已认证  identify-doing 认证中 identify-no 未认证*/
					//$("#CertificateState").html(baseInfo.CertificateState);

					if(baseInfo.Tags && baseInfo.Tags.length > 0) {
						var TagsHtml = "";
						for(var i = 0; i < baseInfo.Tags.length; i++) {
							TagsHtml += "<span>" + baseInfo.Tags[i].Tag + "</span>";
						}
						$("#Tags").html(TagsHtml);
					} else {
						$("#Tags").html("<p>暂无数据!</p>");
					}

					$("#Description").html("<p>" + (baseInfo.Description ? baseInfo.Description : "暂无数据") + "</p>");

					if(baseInfo.WorkExperiences && baseInfo.WorkExperiences.length > 0) {
						var WorkExperiencesHtml = "";
						for(var i = 0; i < baseInfo.WorkExperiences.length; i++) {
							var we = baseInfo.WorkExperiences[i];
							if(we.JobDescription == null || we.JobDescription == '') {
								we.JobDescription = '';
							}
							WorkExperiencesHtml +=
								'<div class="workexperience-item">' +
								'<span>' + we.CompanyName + '</span> ' +
								'<span>' + new Date(we.WorkStart).Format("yyyy-MM-dd") + '-' + new Date(we.WorkEnd).Format("yyyy-MM-dd") + "</span>" +
								'<div>' + we.JobTitle + ' </div>' +
								'<div class="workexperience-content">' + we.JobDescription + '</div>' +
								'</div>';
						}

						$("#WorkExperiences").html(WorkExperiencesHtml);
					} else {
						$("#WorkExperiences").html('<div class="workexperience-item">暂无数据!</p>');
					}

					if(baseInfo.Achievements && baseInfo.Achievements != '') {
						//获得成就
						$("#Achievements").html('<div class="achievemen-item">' + baseInfo.Achievements + '</div>');
					} else {
						$("#Achievements").html('<div class="achievemen-item">暂无数据</div>');
					}

					/*************************************************************************************/
					if(_userName!==''){
						getColletionState(Id);
						getAttentionState(Id);
					}
					
				}

			}

		}).fail(function() {
			console.log('fail');
		})
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

	getTalentInfo();
	/*********************************点击收藏***********************************8*/
	$("body").on("click", ".collection", function() {
		var _SourceName = $("#talent-name").text();
		var _data = {
			"FavoriteType": 2,
			"SourceId": Id,
			"SourceName": _SourceName
		};
		if(_userName == '') {
			window.location = loginHtml;
			var _CurrentAddress = window.location.href;
			window.LS.setItem('CurrentAddress', _CurrentAddress);
			return;
		}
		//判断是否收藏
		if($(this).hasClass("colletion-done")) {
			//已收藏--取消收藏
			deleteCollection(favorite_id, Id);
		} else {
			//未收藏
			//点击收藏
			PostAjax(url.favoriteUrl, JSON.stringify(_data), _header, ".sp-lefts").done(function(res) {
				var _code = res.State.Code,
					_message = res.State.Message;
				if(_code == 0) {

					layerAlert.autoclose("收藏成功");
					getColletionState(Id);
				} else {
					layerAlert.autoclose("收藏失败");
				}
			}).fail(function() {
				console.log('share fail')
			})
		}

	});

	/*********************************点击关注***********************************8*/
	$("body").on("click", ".attention", function() {
		var _SourceName = $("#talent-name").text();
		var _data = {
			"FollowType": 2,
			"SourceId": Id,
			"SourceName": _SourceName
		};
		if(_userName == '') {
			window.location = loginHtml;
			var _CurrentAddress = window.location.href;
			window.LS.setItem('CurrentAddress', _CurrentAddress);
			return;
		}
		//关注
		if($(this).hasClass("colletion-done")) {
			//已关注-取消关注

			deleteAttention(attention_id, Id);
		} else {
			//未收藏
			//点击收藏
			PostAjax(url.attention, JSON.stringify(_data), _header, ".sp-lefts").done(function(res) {
				var _code = res.State.Code,
					_message = res.State.Message;
				if(_code == 0) {

					layerAlert.autoclose("关注成功");
					getAttentionState(Id);
				} else {
					layerAlert.autoclose("关注失败");
				}
			}).fail(function() {
				console.log('share fail')
			})
		}

	});

	/*********************************获取当前人才源收藏状态***********************************8*/
	var getColletionState = function(sidstring) {
		var url = window.url.colectionStates + "?ftype=" + 2 + "&sidstring=" + sidstring
		GetAjax(url, _header).done(function(res) {
			var Code = res.State.Code;
			var Message = res.State.Message;
			if(Code == 0) {
				if(res.Content.length > 0) {
					//以及收藏了
					$(".collection").html("已收藏").addClass("colletion-done");
					favorite_id = res.Content[0].Id;
				} else {
					//未收藏
					$(".collection").removeClass("colletion-done");
					$(".collection").html("收藏");
				}

			} else {
				layerAlert.autoclose(Message);
			}

		}).fail(function() {
			console.log('fail');
		})
	};
	/*********************************获取当前人才源关注状态***********************************8*/
	var getAttentionState = function(sidstring) {
		var url = window.url.attentionState + "?ftype=" + 2 + "&sidstring=" + sidstring
		GetAjax(url, _header).done(function(res) {
			var Code = res.State.Code;
			var Message = res.State.Message;
			if(Code == 0) {
				if(res.Content.length > 0) {
					//以及收藏了
					$(".attention").html("已关注").addClass("colletion-done");
					attention_id = res.Content[0].Id;
				} else {
					//未收藏
					$(".attention").removeClass("colletion-done");
					$(".attention").html("关注");
				}

			} else {
				layerAlert.autoclose(Message);
			}

		}).fail(function() {
			console.log('fail');
		})
	};

	/*********************************删除收藏***********************************8*/
	var deleteCollection = function(favorite_id, Id) {
		DeleteAjax(window.url.deletepersonalfavorite + '?id=' + favorite_id, _header).done(function(res) {
			var Code = res.State.Code;
			var Message = res.State.Message;
			if(Code == 0) {
				layerAlert.autoclose("取消收藏成功");
				getColletionState(Id);
			} else {
				layerAlert.autoclose(Message);
			}

		});
	}
	/*********************************************************************************/
	/*********************************取消关注***********************************8*/
	var deleteAttention = function(favorite_id, Id) {
		DeleteAjax(window.url.deleteattention + '?id=' + attention_id, _header).done(function(res) {
			var Code = res.State.Code;
			var Message = res.State.Message;
			if(Code == 0) {
				layerAlert.autoclose("取消关注成功");
				getAttentionState(Id);
			} else {
				layerAlert.autoclose(Message);
			}

		});
	}
	/*********************************************************************************/
})
var Genders = [{
	Id: 0,
	Name: "未知"
}, {
	Id: 1,
	Name: "男"
}, {
	Id: 2,
	Name: "女"
}];

/*数字转换为对应的文字*/
var numberToText = function(n, array) {
	var _text;
	for(var i = 0; i < array.length; i++) {
		if(array[i].Id === n) {
			_text = array[i].Name;
		}
	}
	return _text;
};
//在职状态
var StaffState = [{
	Id: 0,
	Name: "在职"
}, {
	Id: 1,
	Name: "未知"
}, {
	Id: 3,
	Name: "离职"
}, {
	Id: 2,
	Name: "准备换工作"
}];

function getUrlParam(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	var r = window.location.search.substr(1).match(reg); //匹配目标参数
	if(r != null) return unescape(r[2]);
	return null; //返回参数值
}