window.url = pageConfig.ajaxUrl;
var _accountInfo = window.LS.getItem('accountInfo');
var imgUrl = '';
var _token = '';
var _header = {};
var _currPage = 1;
if(_accountInfo) {
	_token = $.parseJSON(_accountInfo).Token;
	_header = {
		'Content-Type': "application/json",
		"Authorization": "Bearer " + _token,
		"Accept": "application/json"
	};
}

var FollowTypes = [{
	Id: 0,
	Name: "前沿资讯",
	Href: "/news/details/"
}, {
	Id: 1,
	Name: "培训课程",
	Href: "/training/details/"
}, {
	Id: 2,
	Name: "人才",
	Href: "/supplyanddemand/talentsdetail/"
}, {
	Id: 3,
	Name: "企业",
	Href: "/supplyanddemand/corporationdetail/"
}];

var getPathByType = function(type, id) {
	var pathName;
	$.each(FollowTypes, function(index, item) {
		if(item.Id === type) {
			pathName = item.Href;
			return;
		}
	});
	return pathName + id + ".html";
};

var newsHtml = 'leadInfomationDetails/',
	/*前沿资讯*/
	trainHtml = 'trainDetail/'; /*培训课程资讯*/
var _iframe = window.parent;
var _collectCount = _iframe.document.getElementById('sharedCount');
$(document).ready(function() {

	personalfavoriteList(pageConfig.ajaxUrl.personalfollowList, $('#myFollow'));

	/*********************************查看详情收藏************************************/
	$('body').on('click', '.seeDetailBtn', function(e) {
		e.stopPropagation();
		var _Id = $(this).attr('data-str');
		var _type = Number($(this).attr('data-type'));
		GetAjax(pageConfig.ajaxUrl.personalshareDetail + '?id=' + _Id, _header).done(function(data) {
			if(data.State.Code == 0) {
				switch(_type) {
					case 0:
						top.location = newsHtml + _Id + '.html';
						break;
					case 1:
						top.location = trainHtml + _Id + '.html';
						break;
					default:
						break;
				}
			}
		});
	});
});

/**
 * [personalfavoriteList 分页获取我的个人收藏 个人分享]
 * @param  {[type]} url [地址]
 * @param  {[type]} dom [dom元素]
 * @param  {[type]} text [description]
 * @return {[type]}      [description]
 */
function personalfavoriteList(url, dom) {
	GetAjax(url + "?length=" + 9 + "&currentPage=" + 1 + "&value=" + '', _header, "body").done(function(res) {

		/*var _tbody = '',
			_tbody1 = '';
		_tbody = '<tr>' +
			'<th>名称</th>' +
			'<th>类型</th>' +
			'<th>分享时间</th>' +
			'<th class="text-center">操作</th>' +
			'</tr>';
		$('.fixed-loading').css('display', 'block');*/
		if(res.State.Code == 0) {
			/*$('.fixed-loading').css('display', 'none');*/
			var content = res.Content.pagelist;
			var _countNum = res.Content.paginator;
			if(content == null || content.length == 0) {
				/*var str = '';
				str += '<tr><td colspan=4>暂无数据</td></tr>';
				_tbody += str;
				dom.find('table').html(_tbody);
				$('.padin').children('ul').css('display', 'none');*/
				
			} else {
				var _datatbody = '';
				$.each(content, function(index, item) {
					switch (item.FollowType){
						case 3:
							if(item.IconUrl=="/img/defaut.png" || item.IconUrl==null || item.IconUrl==''){
								item.IconUrl="../img/defaut.png";
							}
							break;
						case 2:
						if(item.IconUrl=="/img/zz_39.png" || item.IconUrl==null || item.IconUrl==''){
								item.IconUrl="../img/zz_40.png";
							}
						  	break;
						default:
							break;
					}
					
					if(item.WorkYearsOrScale==null){
						item.WorkYearsOrScale=0;
					}
					if(item.JobTileOrNature==null){
						item.JobTileOrNature="无";
					}
					_datatbody +=
						'<li>' +
						'<a target="_top" href=' + getPathByType(item.FollowType, item.SourceId) + '>' +
						'<div class="imgwidth"><img src=' + item.IconUrl + ' /></div>' +
						'<h3>' + item.SourceName + '</h3>' +
						'<p><span class="fl-right">' + (item.FollowType === 2 ? item.WorkYearsOrScale + '年从业经验' : '规模:' + item.WorkYearsOrScale) + '</span>' + item.JobTileOrNature + '</p>' +
						'</a>' +
						'</li>';
				});
				dom.html(_datatbody);
				var pageCount = _countNum.totalPages; //总页数
				var currentPage = _countNum.currentPage; //得到当前页数
				configOption(currentPage, pageCount, $('#myFollow'));

			}
		} else {
			$('.fixed-loading').css('display', 'none');
		}

	}).fail(function() {
		$('.fixed-loading').css('display', 'none');
		console.log('fail')
	})
};

/**
 * [getFavoriteType description]
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
function getFavoriteType(id) {
	var value = '';
	if(id == 0) {
		value = '前沿资讯';
	} else if(id == 1) {
		value = '课程';
	} else if(id == 2) {
		value = '人才';
	} else if(id == 3) {
		value = '企业';
	}
	return value;
}

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

/**
 * [configOption description] 分页
 * @param  {[type]} _currentPage [description]
 * @param  {[type]} _pageCount   [description]
 * @return {[type]}              [description]
 */
function configOption(_currentPage, _pageCount, dom) {
	var _tbody1 = '',
		_datatbody1 = '';
	var options = {
		bootstrapMajorVersion: 3, //版本
		currentPage: _currentPage, //当前页数
		totalPages: _pageCount, //总页数
		numberOfPages: 5,
		shouldShowPage: true, //是否显示该按钮
		useBootstrapTooltip: false,
		/*    itemTexts: function (type, page, current) {
		        switch (type) {
		            case "first":
		                return "首页";
		            case "prev":
		                return "上一页";
		            case "next":
		                return "下一页";
		            case "last":
		                return "末页";
		            case "page":
		                return page;
		        }
		    },*/
		//点击事件，用于通过Ajax来刷新整个list列表
		onPageClicked: function(event, originalEvent, type, page) {
			if(_currPage == page) {
				return;
			}
			_currPage = page;
			GetAjax(pageConfig.ajaxUrl.personalfollowList + "?length=" + 9 + "&currentPage=" + page + "&value=" + '', _header, '.table').done(function(res) {
				var _datatbody1 = '';
				$.each(res.Content.pagelist, function(index, item) {
					switch (item.FollowType){
						case 3:
							if(item.IconUrl=="/img/defaut.png" || item.IconUrl==null || item.IconUrl==''){
								item.IconUrl="../img/defaut.png";
							}
							break;
						case 2:
						if(item.IconUrl=="/img/zz_39.png" || item.IconUrl==null || item.IconUrl==''){
								item.IconUrl="../img/zz_40.png";
							}
						  	break;
						default:
							break;
					}
					
					if(item.WorkYearsOrScale==null){
						item.WorkYearsOrScale=0;
					}
					if(item.JobTileOrNature==null){
						item.JobTileOrNature="无";
					}
					_datatbody1 +=
						'<li>' +
						'<a target="_top" href=' + getPathByType(item.FollowType, item.SourceId) + '>' +
						'<div class="imgwidth"><img src=' + item.IconUrl + ' /></div>' +
						'<h3>' + item.SourceName + '</h3>' +
						'<p><span class="fl-right">' + (item.FollowType === 2 ? item.WorkYearsOrScale + '年从业经验' : '规模:' + item.WorkYearsOrScale) + '</span>' + item.JobTileOrNature + '</p>' +
						'</a>' +
						'</li>';
				});
				dom.html(_datatbody1);
			});
		}
	};

	$('#pageLimit').bootstrapPaginator(options);
}