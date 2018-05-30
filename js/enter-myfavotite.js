window.url = pageConfig.ajaxUrl;
var _accountInfo = window.LS.getItem('accountInfo');
var imgUrl = '';
var _token='';
var _header={};
var _currPage = 1;
if(_accountInfo) {
	 _token = $.parseJSON(_accountInfo).Token;
	 _header = {
		'Content-Type': "application/json",
		"Authorization": "Bearer " + _token,
		"Accept": "application/json"
	};
}
var newsHtml = '../leadInfomationDetails/', /*前沿资讯*/
    trainHtml = '../trainDetail/', /*培训课程资讯*/
    talentHtml = '../demandForTalents/', /*人才供需*/
    corporationHtml = '../demandForCompany/';/*企业供需*/
	
	 var _iframe = window.parent;
     var _collectCount =_iframe.document.getElementById('FavoriteCount');
$(document).ready(function() {
	personalfavoriteList(pageConfig.ajaxUrl.personalfavoriteList, $('#mycollect'));

	/*********************************删除收藏************************************/
	$('body').on('click', '.deleteBtn', function(e) {
		e.stopPropagation();
		var _Id = $(this).attr('data-str');
		
		DeleteAjax(pageConfig.ajaxUrl.deletepersonalfavorite + '?id=' + _Id, _header).done(function(data) {
			if(data.State.Code == 0) {
				layerAlert.autoclose("取消收藏成功");
				personalfavoriteList(pageConfig.ajaxUrl.personalfavoriteList, $('#mycollect'));
			}else{
				layerAlert.autoclose("取消收藏失败");
			}

			getpersonalfavoriteCount(url.personalfavoriteCount, $(_collectCount));
		});
		
	});

	/*********************************查看详情收藏************************************/
	$('body').on('click', '.seeDetailBtn', function(e) {
		e.stopPropagation();
		var _Id = $(this).attr('data-str');
		var _type =Number($(this).attr('data-type'));
		GetAjax(pageConfig.ajaxUrl.personalfavoriteDetail + '?id=' + _Id, _header).done(function(data) {
			if(data.State.Code == 0) {
				switch(_type){
					case 0:
					
						top.location = newsHtml+_Id+'.html';
						break;
					case 1:
						top.location = trainHtml+_Id+'.html';
						break;
					case 2:
						top.location = talentHtml+_Id+'.html';
						break;
					case 3:
						top.location = corporationHtml+_Id+'.html';
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
	GetAjax(url + "?length=" + 10 + "&currentPage=" + 1 + "&value=" + '', _header).done(function(res) {
		dom.find('table').html('');
		var _tbody = '',
			_tbody1 = '';
		_tbody = '<tr>' +
			'<th>名称</th>' +
			'<th>类型</th>' +
			'<th>收藏时间</th>' +
			'<th class="text-center">操作</th>' +
			'</tr>';
		$('.fixed-loading').css('display', 'block');
		if(res.State.Code == 0) {
			$('.fixed-loading').css('display', 'none');
			var content = res.Content.pagelist;
			var _countNum = res.Content.paginator;
			if(content.length == 0) {
				var str = '';
				str += '<tr><td colspan=4>暂无数据</td></tr>';
				_tbody += str;
				dom.find('table').html(_tbody);
				$('.padin').children('ul').css('display', 'none');
				$('.pagination-container').css('display', 'none');
			} else {
				$('.pagination-container').css('display', 'block');
				$.each(content, function(index, value) {
					var _datatbody = '';
					_datatbody += '<tr>' +
						'<td class="td-hidden" title="'+value.SourceName+'">' + value.SourceName + '</td>' +
						'<td class="td-hidden">' + getFavoriteType(value.FavoriteType) + '</td>' +
						'<td>' + dateFormat(value.CreatedAt, 'yyyy-MM-dd') + '</td>' +
						'<td class="text-center">' +
						'<button class="btn btn-danger cancel-collect deleteBtn" data-type=' + value.FavoriteType + ' data-str=' + value.Id + '>取消收藏</button>' +
						'<a   href="javascript:;"  target="_top" class="btn btn-default seeDetailBtn" data-type=' + value.FavoriteType + '  data-str=' + value.SourceId + '>查看详情</a>' +
						'</td>' +
						'</tr>';
					_tbody += _datatbody;
				});
				
				dom.find('table').html(_tbody);
				var pageCount = _countNum.totalPages; //总页数
				var currentPage = _countNum.currentPage; //得到当前页数
				configOption(currentPage, pageCount,$('#mycollect'));
			}
		} else {
			$('.fixed-loading').css('display', 'none');
		}

	}).fail(function() {
		console.log('fail');
		$('.fixed-loading').css('display', 'none');
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
function configOption(_currentPage, _pageCount,dom){
	var _tbody1 = '',_datatbody1='';
	var options = {
					bootstrapMajorVersion: 3, //版本
					currentPage: _currentPage, //当前页数
					totalPages: _pageCount, //总页数
					numberOfPages: 5,
					shouldShowPage:true,//是否显示该按钮
                    useBootstrapTooltip: false,
				/*	itemTexts: function(type, page, current) {
						switch(type) {
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
					}, */
					//点击事件，用于通过Ajax来刷新整个list列表
					onPageClicked: function(event, originalEvent, type, page) {
						 if(_currPage==page){ 
		                    return;
		                }
		                 _currPage=page;
						GetAjax(pageConfig.ajaxUrl.personalfavoriteList + "?length=" + 10 + "&currentPage=" + page + "&value=" + '', _header,'.table').done(function(res) {
							_tbody1 = '<tr>' +
								'<th>名称</th>' +
								'<th>类型</th>' +
								'<th>收藏时间</th>' +
								'<th class="text-center">操作</th>'
							'</tr>';

							$.each(res.Content.pagelist, function(index, value) {
								var _datatbody1 = '';
								_datatbody1 += '<tr>' +
									'<td class="td-hidden" title="'+value.SourceName+'">' + value.SourceName + '</td>' +
									'<td class="td-hidden">' + getFavoriteType(value.FavoriteType) + '</td>' +
									'<td>' + dateFormat(value.CreatedAt, 'yyyy-MM-dd') + '</td>' +
									'<td class="text-center">' +
									'<button class="btn btn-danger deleteBtn" data-type=' + value.FavoriteType + ' data-str=' + value.Id + '>删除收藏</button>' +
									'<a  class="btn btn-default seeDetailBtn" target="_top" href="javascript:;" data-type=' + value.FavoriteType + '  data-str=' + value.SourceId + '>查看详情</a>' +
									'</td>' +
									'</tr>';

								_tbody1 += _datatbody1;
							});
							dom.find('table').html(_tbody1);
						});
					}
				};

				$('#pageLimit').bootstrapPaginator(options);
}