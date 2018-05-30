window.url = pageConfig.ajaxUrl;
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
var _iframe = window.parent;
var _PublishBoxCount = _iframe.document.getElementById('PublishBox');
var enter_id = $(_PublishBoxCount).attr("data-id");
enter_id = Number(enter_id);

var enterData = null;
$(document).ready(function() {
	//获取发布箱列表window.url.demandlist
	getMyInfo();
	getReleaseList(window.url.demandlist, $('#myRelease'));

	/*********************************删除需求************************************/
	$('body').on('click', '.deleteBtn', function(e) {
		e.stopPropagation();
		var _Id = $(this).attr('data-str');
		layerAlert.checkone("选择操作", function() {
			DeleteAjax(window.url.deletedemands + '?idstring=' + _Id, _header).done(function(data) {
				if (data.State.Code == 0) {
					layerAlert.autoclose("删除成功");
					getReleaseList(window.url.demandlist, $('#myRelease'));
					getPublishBoxCount(window.url.corporationstatistics, $(_PublishBoxCount));
				} else {
					layerAlert.autoclose("删除失败");
				}
				//获取企业发布箱数
			});
		}, function() {
			return;
		}, "确定", "取消", true, true, "确定要删除吗?");


	});


});

$("#stateSelect").change(function() {
	getReleaseList(window.url.demandlist, $('#myRelease'));
})

$("#releaseSearch").on("click", function() {
		getReleaseList(window.url.demandlist, $('#myRelease'));
	})
	/**
	 * [getReleaseList 获取发布箱列表 ]
	 * @param  {[type]} url [地址]
	 * @param  {[type]} dom [dom元素]
	 * @param  {[type]} text [description]
	 * @return {[type]}      [description]
	 */
function getReleaseList(url, dom) {
	var state = $("#stateSelect").val();
	var seach_value = $("#seach_value").val();
		seach_value=encodeURIComponent(seach_value);
	GetAjax(url + "?length=" + 10 + "&currentPage=" + 1 + "&value=" + seach_value + "&state=" + state, _header, ".release").done(function(res) {
		dom.find('table').html('');
		var _tbody = '',
			_tbody1 = '';
		_tbody = '<tr>' +
			'<th>名称</th>' +
			/*'<th>发布人</th>' +*/
			'<th>状态</th>' +
			'<th>时间</th>' +
			'<th class="text-center">操作</th>' +
			'</tr>';

		if (res.State.Code == 0) {

			var content = res.Content.pagelist;
			var _countNum = res.Content.paginator;
			if (content.length == 0) {
				var str = '';
				str += '<tr><td colspan=5>暂无数据</td></tr>';
				_tbody += str;

				dom.find('table').html(_tbody);
				$('.pagination-container').css('display', 'none');
			} else {
				$('.pagination-container').css('display', 'block');
				$.each(content, function(index, value) {
					var _datatbody = '';
					var button_atr = '';
					if (value.OpenState == 1) {

						button_atr = '<button data-str=' + value.Id + "/" + value.OpenState + ' class="toggle-btn close-text" >关闭</button>';
						value.OpenState = "招聘中";
					} else {

						button_atr = '<button data-str=' + value.Id + "/" + value.OpenState + ' class="toggle-btn open-text" >开启</button>';
						value.OpenState = "已结束";
					}

					switch (value.DemandType) { //1人才    2项目
						case 1:
							//'<button class="deleteBtn" data-str=' + value.Id + '>删除</button>' +
							_datatbody += '<tr>' +
								'<td><span class="fstitle"  title="' + value.Name + '" >' + value.Name + ' </span></td>' +
								/*	'<td>' + "习大大" + '</td>' +*/
								'<td>' + value.OpenState + '</td>' +
								'<td>' + dateFormat(value.CreatedAt, 'yyyy-MM-dd') + '</td>' +
								'<td class="text-center">' +
								button_atr +
								
								'<button class="see-detais" data-str=' + value.Id + '>详情</button>' +
								'</td></tr>';
							break;
						case 2:
							_datatbody += '<tr>' +
								'<td><span class="fstitle"  title="' + value.Name + '" >' + value.Name + '</span></td>' +
								/*'<td>' + "习大大" + '</td>' +*/
								'<td>' + value.OpenState + '</td>' +
								'<td>' + dateFormat(value.CreatedAt, 'yyyy-MM-dd') + '</td>' +
								'<td class="text-center">' +
								button_atr +
								
								'<button class="see-detais" data-str=' + value.Id + '>详情</button>' +
								'</td></tr>';
							break;
						default:
							break;
					}


					_tbody += _datatbody;
				});

				dom.find('table').html(_tbody);
				var pageCount = _countNum.totalPages; //总页数
				var currentPage = _countNum.currentPage; //得到当前页数
				console.log(currentPage, pageCount)
				configOption(currentPage, pageCount, url, seach_value, dom);
			}
		} else {
			$('.fixed-loading').css('display', 'none');
		}

	}).fail(function() {
		console.log('fail');
		$('.fixed-loading').css('display', 'none');
	})
};

function configOption(currentPage, pageCount, url, seach_value, dom) {
	var options = {
		bootstrapMajorVersion: 3, //版本
		currentPage: currentPage, //当前页数
		totalPages: pageCount, //总页数
		numberOfPages: 5,
		shouldShowPage: true, //是否显示该按钮
		useBootstrapTooltip: false,
		//点击事件，用于通过Ajax来刷新整个list列表
		onPageClicked: function(event, originalEvent, type, page) {
			if (currentPage == page) {
				return;
			}
			currentPage = page;
			GetAjax(url + "?length=" + 10 + "&currentPage=" + page + "&value=" + seach_value + "&state=" + $("#stateSelect").val(), _header).done(function(res) {
				_tbody1 = '<tr>' +
					'<th>名称</th>' +
					/*'<th>发布人</th>' +*/
					'<th>状态</th>' +
					'<th>时间</th>' +
					'<th class="text-center">操作</th>' +
					'</tr>';
				$.each(res.Content.pagelist, function(index, value) {
					var _datatbody = '';
					var button_atr = '';
					if (value.OpenState == 1) {

						button_atr = '<button data-str=' + value.Id + "/" + value.OpenState + ' class="toggle-btn" >关闭</button>';
						value.OpenState = "招聘中";
					} else {

						button_atr = '<button data-str=' + value.Id + "/" + value.OpenState + ' class="toggle-btn" >开启</button>';
						value.OpenState = "已结束";
					}

					switch (value.DemandType) { //1人才    2项目
						case 1:

							_datatbody += '<tr>' +
								'<td><span class="fstitle"  title="' + value.Name + '" >' + value.Name + ' </span></td>' +
								/*	'<td>' + "习大大" + '</td>' +*/
								'<td>' + value.OpenState + '</td>' +
								'<td>' + dateFormat(value.CreatedAt, 'yyyy-MM-dd') + '</td>' +
								'<td class="text-center">' +
								button_atr +
								
								'<button class="see-detais" data-str=' + value.Id + '>详情</button>' +
								'</td></tr>';
							break;
						case 2:
							_datatbody += '<tr>' +
								'<td><span class="fstitle"  title="' + value.Name + '" >' + value.Name + '</span></td>' +
								/*'<td>' + "习大大" + '</td>' +*/
								'<td>' + value.OpenState + '</td>' +
								'<td>' + dateFormat(value.CreatedAt, 'yyyy-MM-dd') + '</td>' +
								'<td class="text-center">' +
								button_atr +
								
								'<button class="see-detais" data-str=' + value.Id + '>详情</button>' +
								'</td></tr>';
							break;
						default:
							break;
					}


					_tbody1 += _datatbody;
				});
				dom.find('table').html(_tbody1);
			});
		}
	};

	$('#pageLimit').bootstrapPaginator(options);
};
/**
 * 查看详情
 */
$("body").on("click", ".see-detais", function() {
	var data_str = $(this).attr('data-str');
	window.location = "releaseDetail.html" + "?id=" + data_str;
});

/**
 *  开启和关闭
 */
$('body').on('click', '.toggle-btn', function(e) {
	var data_str = $(this).attr('data-str');
	data_str = data_str.split("/");
	var _Id = Number(data_str[0]);
	var openState = Number(data_str[1]);
	var message = '';
	switch (openState) {
		case 1:
			//开启
			openState = 2;
			message = "关闭";
			break;
		case 2:
			//开启
			openState = 1;
			message = "开启";
		default:
			break;
	}
	var _param = {
		"Id": _Id,
		"State": openState
	};
	PutAjax(window.url.releaseOpenstate, JSON.stringify(_param), _header, ".uc-rights").done(function(res) {
		var Code = res.State.Code;
		var Message = res.State.Message;
		if (Code == 0) {
			//修改成功
			layerAlert.autoclose(message + "成功");
			setTimeout(function() {
				getReleaseList(window.url.demandlist, $('#myRelease'));
				getPublishBoxCount(window.url.corporationstatistics, $(_PublishBoxCount));
			}, 1600);
		}
	}).fail(function() {
		console.log('fail')
	});


});
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

/**
 * 发布的条件必须先晚上企业信息
 */
$("body").on("click", ".release-btn-info", function() {

	if (enterData != null) {
		//以及完善企业信息
		window.location.href = "../enterpriseCenter/yourwant.html";
	} else {
		layerAlert.autoclose("请完善企业基本信息");
		setTimeout(function() {
			window.location.href = "../enterpriseCenter/editInfo.html";
		}, 1600);
	}
});



/*获取企业基本信息*/
var getMyInfo = function() {

	GetAjax(window.url.mycorporation, _header, ".release").done(function(res) {
		var Code = res.State.Code;
		if (Code == 0) {
			if (res.Content != null || res.Content != '') {
				enterData = res.Content;
			} else {
				enterData = null;
			}
		}

	}).fail(function() {
		console.log('fail');
	})
};