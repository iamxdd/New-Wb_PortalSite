window.url = pageConfig.ajaxUrl;
var flag = true;
var _pageLength = 9;
var _currPage = 1;
var gcode = '',
	gbility = 0,
	gflag = -1,
	gplaceCode = '';
var BigName = 'super_admin';
window.url = pageConfig.ajaxUrl;
var _accountInfo = window.LS.getItem('accountInfo');
var _token = '';
var _userName = '';
var _header = {};
var _indexId = 0;
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
var imgUrl = '';
var bigName = 'super_admin';
var indexHref = 'login.html';
var perdetails = "demandForCompany";
var comdetails = "demandForTalents";
var _CurrentAddress = window.LS.getItem('CurrentAddress');
$(document).ready(function() {

	var timer = null,
		count = 6;

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

	/**********************************************供需匹配列表查找****************************************/

	$("body").on("click", "td.dd>span", function(e) {
		//人才供需匹配列表
		//flag为true 全职 flag为false兼职
		e.stopPropagation();
		$(this).addClass("active").siblings().removeClass("active");
		var qflag = null;
		if(flag) {
			var _code = $(this).parents('.contentsTable').children('tbody').eq(0).find('.active').attr('data-code'),
				_flag = Number($(this).parents('.contentsTable').children('tbody').eq(1).find('.active').attr('data-id')),
				_placeCode = $(this).parents('.contentsTable').children('tbody').eq(2).find('.active').attr('data-code'),
				_ability = $(this).parents('.contentsTable').children('tbody').eq(3).find('.active').attr('data-id');
			console.log(_flag)
			if(_code == "undefined" || _code == undefined) {
				_code = '';
			}
			if(_ability == -1) {
				_ability = 0;
			}
			if(_placeCode == "undefined") {
				_placeCode = '';
			}
			gcode = _code;
			gbility = _ability;
			gplaceCode = _placeCode
			gflag = _flag;
			fetchData(url.talentmatchingsupplylist + '?length=' + _pageLength + '&currentPage=' + _currPage + '&code=' + _code + '&flag=' + _flag + '&placeCode=' + _placeCode + '&ability=' + _ability);

		} else {

			//企业供需匹配列表

			var _tradeCode = $(this).parents('.contentsTable').children('tbody').eq(0).find('.active').attr('data-code'),
				_nature = $(this).parents('.contentsTable').children('tbody').eq(1).find('.active').attr('data-id'),
				_placeCode = $(this).parents('.contentsTable').children('tbody').eq(2).find('.active').attr('data-code'),
				_scale = $(this).parents('.contentsTable').children('tbody').eq(3).find('.active').attr('data-id');

			if(_tradeCode == "undefined" || _tradeCode == undefined) {
				_tradeCode = '';
			}
			if(_nature == -1) {
				_nature = '';
			}
			if(_placeCode == "undefined") {
				_placeCode = '';
			}
			if(_scale == -1) {
				_scale = '';
			}
			gcode = _tradeCode;
			gbility = _nature;
			gplaceCode = _placeCode
			gflag = _scale;
			fetchData(url.corporationsupplydemandlist + '?length=' + _pageLength + '&currentPage=' + _currPage + '&tradeCode=' + _tradeCode + '&nature=' + _nature + '&placeCode=' + _placeCode + '&scale=' + _scale);
		}

	});

	fetchData(url.talentmatchingsupplylist + '?length=' + _pageLength + '&currentPage=' + _currPage);
	gettopData(url.industrylist, url.getalllocation);

	/**********************************************供需匹配列表切换****************************************/
	$('.info-h3').on("click", ".changeul li", function() {
		var _index = $(this).index(),
			_indexId = _index,
			gcode = '',
			gbility = 0,
			gflag = -1,
			gplaceCode = '',
			_currPage = 1,
			_pageLength = 9;
		if(_index == 0) {
			flag = true;	
			
			fetchData(url.talentmatchingsupplylist + '?length=' + _pageLength + '&currentPage=' + _currPage);
		} else {
			flag = false;
			fetchData(url.corporationsupplydemandlist + '?length=' + _pageLength + '&currentPage=' + _currPage);
		}
		gettopData(url.industrylist, url.getalllocation);
		$(this).addClass('active');
		$(this).siblings('li').removeClass('active');

	});

	/**********************************************进入到详情页面****************************************/
	$(".spl-list").on("click", "li>a", function(e) {
		e.stopPropagation();
		var _Id = $(this).attr('data-id');

		switch(_indexId) {
			case 0:
				window.location = perdetails + _Id + '.html';
				break;
			case 1:
				window.location = comdetails + _Id + '.html';
				break;
			default:
				break;
		}

	});
});

/**
 * [fetchData 人才供需初始化数据]
 * @param  {[type]} url     [description]
 * @param  {[type]} bigData [description]
 * @return {[type]}         [description]
 */
function fetchData(urls) {
	var leftbottomdata = [],
		_ulleftbox = '';
		$('.pagination-container').css('display', 'none');
	$('.ulleftbox').html('');
	GetAjax(urls, _header, '.spl-list').done(function(res) {
		var _code = res.State.Code,
			list = res.Content.pagelist,
			_pageCount = res.Content.paginator.totalPages,
			_currentPage = res.Content.paginator.currentPage;
		if(_code == 0) {
			if(list !== null && list.length > 0) {
				leftbottomdata = list;
				initData(leftbottomdata, _indexId);
			}
		}
		if(list.length == 0) {
			$('.pagination-container').css('display', 'none');
			return;
		} else {
			$('.pagination-container').css('display', 'block');
		}

		var pageCount = _pageCount; //总页数
		var currentPage = _currentPage; //得到当前页数
		configOption(_currentPage, _pageCount);

	}).fail(function(fail) {
		console.log(fail)
	});
}

function gettopData(url, url1) {
	$('.contentsTable').html('');
	if(_indexId == 0) {
		var types = [{
				name: "期望行业",
				supplyType: []
			},
			{
				name: "工作性质",
				supplyType: [{
						Name: "全部",
						Id: -1
					},
					{
						Name: "全职",
						Id: 0
					},
					{
						Name: "兼职",
						Id: 1
					},
					{
						Name: "实习",
						Id: 2
					}
				]
			},
			{
				name: "工作地点",
				supplyType: []
			},
			{
				name: "能    力",
				supplyType: [{
						Name: "全部",
						Id: -1
					},
					{
						Name: "一星",
						Id: 1
					},
					{
						Name: "二星",
						Id: 2
					},
					{
						Name: "三星",
						Id: 3
					},
					{
						Name: "四星",
						Id: 4
					},
					{
						Name: "五星",
						Id: 5
					}
				]
			}
		];
	} else {
		var types = [{
				name: "行业",
				supplyType: []
			},
			{
				name: "工作性质",
				supplyType: [{
						Name: "全部",
						Id: -1
					},
					{
						Name: "国有企业",
						Id: 0
					},
					{
						Name: "集体企业",
						Id: 1
					},
					{
						Name: "联营企业",
						Id: 2
					},
					{
						Name: "中外合作企业",
						Id: 3
					},
					{
						Name: "中外合资企业",
						Id: 4
					},
					{
						Name: "外商独资企业",
						Id: 5
					},
					{
						Name: "私营企业",
						Id: 6
					}
				]
			},
			{
				name: "工作地点",
				supplyType: []
			},
			{
				name: "规模",
				supplyType: [{
						Name: "全部",
						Id: -1
					},
					{
						Name: "0-50",
						Id: 1
					},
					{
						Name: "51-99",
						Id: 2
					},
					{
						Name: "100-200",
						Id: 3
					},
					{
						Name: "201-499",
						Id: 4
					},
					{
						Name: "500-999",
						Id: 5
					},
					{
						Name: "1000+",
						Id: 6
					}
				]
			}
		];
	}

	var _contentsTable = '';
	$('.ulleftbox').html('');
	GetAjax(url, _header).done(function(res) {
		var _code = res.State.Code,
			list = res.Content;
		if(_code == 0) {
			if(list !== null && list.length > 0) {
				list.unshift({
					Name: "全部",
					Id: -1
				});
				types[0].supplyType = list;
			}
			GetAjax(url1).done(function(res) {
				var _code1 = res.State.Code,
					list1 = res.Content,
					ZeroCode = "",
					provinceList = [];
				if(_code1 == 0) {
					if(list1 !== null && list1.length > 0) {

						$.each(list1, function(index, item) {
							if(!item.ParentCode) {
								ZeroCode = item.Code;
								return;
							}
						});

						$.each(list1, function(index, item) {
							if(item.ParentCode === ZeroCode) {
								provinceList.push(item);
							}
						});
						provinceList.unshift({
							Name: "全部",
							Id: -1
						});
						types[2].supplyType = provinceList;
						types.forEach(function(v, i) {
							_contentsTable += '<tbody><tr>' +
								'<td class="dt">' + v.name + '</td>' +
								'<td class="dd" >';
							v.supplyType.forEach(function(value, index) {
								if(index == 0) {
									_contentsTable += '<span class="active"  data-id=' + value.Id + ' data-code=' + value.Code + '>' + value.Name + '</span>';
								} else if(i == 1 || i == 3) {
									_contentsTable += '<span  data-id=' + value.Id + '>' + value.Name + '</span>';
								} else {
									_contentsTable += '<span  data-id=' + value.Id + ' data-code=' + value.Code + '>' + value.Name + '</span>';
								}
							}); +
							'</td>' +
							'</tr></tbody>';
						});
						$('.contentsTable').html(_contentsTable);
					}
				}

			}).fail(function() {
				console.log('fail')
			})
		}

	}).fail(function() {
		console.log('fail')
	});

}

/**
 * [configOption description] 分页
 * @param  {[type]} _currentPage [description]
 * @param  {[type]} _pageCount   [description]
 * @return {[type]}              [description]
 */

function configOption(_currentPage, _pageCount) {

	var options = {
		bootstrapMajorVersion: 3, //版本
		currentPage: _currentPage, //当前页数
		totalPages: _pageCount, //总页数
		numberOfPages: 5,
		shouldShowPage: true, //是否显示该按钮
		useBootstrapTooltip: false,
		//点击事件，用于通过Ajax来刷新整个list列表
		onPageClicked: function(event, originalEvent, type, page) {
			if(_currPage == page) {
				return;
			}
			_currPage = page;
			if(_indexId == 0) {
				var purl = url.talentmatchingsupplylist + '?length=' + _pageLength + '&currentPage=' + page + '&code=' + gcode + '&flag=' + gflag + '&placeCode=' + gplaceCode + '&ability=' + gbility;
			} else if(_indexId == 1) {
				var purl = url.corporationsupplydemandlist + '?length=' + _pageLength + '&currentPage=' + page + '&tradeCode=' + gcode + '&nature=' + gflag + '&placeCode=' + gplaceCode + '&scale=' + gbility;
			}

			GetAjax(purl).done(function(data) {
				var _list = data.Content.pagelist;
				if(_list !== null) {
					leftbottomdata1 = _list;
					initData(leftbottomdata1, _indexId);
				}
			});

		}
	}

	$('#pageLimit').bootstrapPaginator(options);
}

/**
 * [initData description] 列表数据
 * @param  {[type]} data [description]
 * @param  {[type]} id   [description]
 * @return {[type]}      [description]
 */
function initData(data, id) {
	$('.ulleftbox').html('');
	var _ulleftbox1 = '';
	var date = new Date();

	switch(id) {
		case 0:
			
			$.each(data, function(i, v) {
				if(v.AvatarUrl == null || 　v.AvatarUrl == "/img/zz_39.png") {
					v.AvatarUrl = "../img/zz_39.png";
				}
			});
			$.each(data, function(i, v) {
				_ulleftbox1 += 
					'<li>' +
					'<a  href="javascript:;" data-id=' + v.Id + '>' +
					'<div class="spl-image"><img src=' + v.AvatarUrl + ' alt="" class="zoom-imgs"></div>' +
					'<h4>' + v.JobTitle + '</h4>' +
					'<p class="clearfix"><span class="fr">' + (v.WorkingYears === 0 ? '无从业经验' : Number(v.WorkingYears) + '年从业经验') + '</span>' + v.RealName + ' </p>' +
					'</a>' +
					'</li>';
			});

			$('.ulleftbox').html(_ulleftbox1);
			break;
		case 1:
		   data.forEach(function(v, i) {
				if(v.IconUrl==null ||　v.IconUrl=="/img/defaut.png"){
					v.IconUrl = "../img/defaut.png";
				}
			});
			data.forEach(function(v, i) {
				_ulleftbox1 += '<li>' +
					'<a href="javascript:;" data-id=' + v.Id + '>' +
					'<div class="spl-image"><img src=' + v.IconUrl + ' alt="" class="zoom-imgs"></div>' +
					'<h4>' + v.Name + '</h4>' +
					'<p class="clearfix"><span class="fr">' + v.ScaleName + '</span>' + v.NatureName + ' </p>' +
					'</a>' +
					'</li>';
			});
			$('.ulleftbox').html(_ulleftbox1);
			break;
		default:
			break;
	}
}