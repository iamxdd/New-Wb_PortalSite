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
var _iframe = window.parent,
	_ReceiveBoxCount = _iframe.document.getElementById('ReceiveBox'),
	enter_id = $(_ReceiveBoxCount).attr("data-id"),
	enter_id = Number(enter_id);
var enterData = null;
$(document).ready(function() {
	//获取接收箱列表
	getReceiveList(window.url.deliverreceivelist, $('#myreceive'));
		/*获取企业基本信息*/
	var getMyInfo = function() {
		GetAjax(window.url.mycorporation, _header).done(function(res) {
			var Code = res.State.Code;
			if (Code == 0) {
				var baseInfo = res.Content;
				if(baseInfo!=null){
					enterData=baseInfo;
				}else{
					enterData=null;
				}
				
			}

		}).fail(function() {
			console.log('fail');
		})
	};

	getMyInfo();
	/*********************************删除需求************************************/
	$('body').on('click', '.deleteBtn', function(e) {
		e.stopPropagation();
		var _Id = $(this).attr('data-str');
	layerAlert.checkone("选择操作", function() {
		DeleteAjax(window.url.deletemyreceivedeliver + '?deliverId=' + _Id, _header).done(function(data) {
			if (data.State.Code == 0) {
				layerAlert.autoclose("删除成功");
				getReceiveList(window.url.deliverreceivelist, $('#myreceive'));
				getBoxCount(window.url.corporationstatistics, $(_ReceiveBoxCount));

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

$("#readState").change(function() {
	getReceiveList(window.url.deliverreceivelist, $('#myreceive'));
})

$("#receive-search").on("click", function() {
		getReceiveList(window.url.deliverreceivelist, $('#myreceive'));
	})
	/**
	 * [getReleaseList 获取接收箱 ]
	 * @param  {[type]} url [地址]
	 * @param  {[type]} dom [dom元素]
	 * @param  {[type]} text [description]
	 * @return {[type]}      [description]
	 */
function getReceiveList(url, dom) {
	var readState = $("#readState").val();
	var seach_value = $("#seach_value").val();
		seach_value=encodeURIComponent(seach_value);
	GetAjax(url + "?length=" + 10 + "&currentPage=" + 1 + "&value=" + seach_value + "&readState=" + readState, _header, ".release").done(function(res) {
		dom.find('table').html('');
		var _tbody = '',
			_tbody1 = '';
		_tbody = '<tr>' +
			'<th>名称</th>' +
			'<th>投递人</th>' +
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
				return;
			} else {
				$('.pagination-container').css('display', 'block');
				$.each(content, function(index, value) {
					var _datatbody = '';
					var button_atr = '';

					switch (value.DemandType) { //1人才    2项目

						case 1:
							var read_str = '';
							if (value.ReadState == 2) {
								//未读
								read_str = '<td><span class="fstitle done-read">' + value.DemandInfoName + '</span></td>';
							} else {
								//已读
								read_str = '<td><span class="fstitle">' + value.DemandInfoName + '</span></td>';
							}
							// '<button class="deleteBtn" data-str=' + value.Id + '>删除</button>' +
							_datatbody += '<tr>' +
								read_str +
								'<td>' + value.DeliverName + '</td>' +
								'<td>' + dateFormat(value.CreatedAt, 'yyyy-MM-dd') + '</td>' +
								'<td class="text-center">' +
								'<button class="deleteBtn" data-str=' + value.Id + '>删除</button>' +
								'<button class="see-detais" data-str=' + value.DeliverId + "," + value.DemandType + '>详情</button>' +
								'</td></tr>';
							break;
						case 2:
							var read_str = '';
							if (value.ReadState == 2) {
								//未读
								read_str = '<td><span class="fstitle done-read">' + value.DemandInfoName + '</span></td>';
							} else {
								//已读
								read_str = '<td><span class="fstitle">' + value.DemandInfoName + '</span></td>';
							}
							_datatbody += '<tr>' +
								read_str +
								'<td>' + value.DeliverName + '</td>' +
								'<td>' + dateFormat(value.CreatedAt, 'yyyy-MM-dd') + '</td>' +
								'<td class="text-center">' +
								'<button class="deleteBtn" data-str=' + value.Id + '>删除</button>' +
								'<button class="see-detais" data-str=' + value.DeliverId + "," + value.DemandType + '>详情</button>' +
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
				/*调ajax*/
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
			GetAjax(url + "?length=" + 10 + "&currentPage=" + page + "&value=" + seach_value + "&readState=" +  $("#readState").val(), _header).done(function(res) {
				_tbody1 = '<tr>' +
					'<th>名称</th>' +
					'<th>投递人</th>' +
					'<th>时间</th>' +
					'<th class="text-center">操作</th>' +
					'</tr>';
				$.each(res.Content.pagelist, function(index, value) {
					var _datatbody = '';

					switch (value.DemandType) { //1人才    2项目

						case 1:
							var read_str = '';
							if (value.ReadState == 2) {
								//未读
								read_str = '<td><span class="fstitle done-read">' + value.DemandInfoName + '</span></td>';
							} else {
								//已读
								read_str = '<td><span class="fstitle">' + value.DemandInfoName + '</span></td>';
							}
							_datatbody += '<tr>' +
								read_str +
								'<td>' + value.DeliverName + '</td>' +
								'<td>' + dateFormat(value.CreatedAt, 'yyyy-MM-dd') + '</td>' +
								'<td class="text-center">' +
								'<button class="deleteBtn" data-str=' + value.Id + '>删除</button>' +
								'<button class="see-detais" data-str=' + value.DeliverId + "," + value.DemandType + '>详情</button>' +
								'</td></tr>';
							break;
						case 2:
							var read_str = '';
							if (value.ReadState == 2) {
								//未读
								read_str = '<td><span class="fstitle done-read">' + value.DemandInfoName + '</span></td>';
							} else {
								//已读
								read_str = '<td><span class="fstitle">' + value.DemandInfoName + '</span></td>';
							}
							_datatbody += '<tr>' +
								read_str +
								'<td>' + value.DeliverName + '</td>' +
								'<td>' + dateFormat(value.CreatedAt, 'yyyy-MM-dd') + '</td>' +
								'<td class="text-center">' +
								'<button class="deleteBtn" data-str=' + value.Id + '>删除</button>' +
								'<button class="see-detais" data-str=' + value.DeliverId + "," + value.DemandType + '>详情</button>' +
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
}
/**
 * 查看详情
 */
$("body").on("click", ".see-detais", function() {
	var data_str = $(this).attr('data-str');
	data_str = data_str.split(",");
	var id = data_str[0];
	var data_DemandType = Number(data_str[1]);
	switch (data_DemandType) {
		case 1:
			//人才
			window.location = "receviewDetaisBaseInfo.html" + "?reciveId=" + id;
			break;
		case 2:
			// 企业
			window.location = "receiveDetail.html" + "?reciveId=" + id;
			break;
		default:
			break;
	}
});
//设置所有为已读
$("body").on("click", ".setread-btn", function() {

	if (enterData == null) {
		layerAlert.autoclose("请完善企业基本信息");
		setTimeout(function() {
			window.location.href = "../enterpriseCenter/editInfo.html";
		}, 1600);
	} else {
		GetAjax(window.url.deliversetallreadstate, _header).done(function(res) {
			if (res.State.Code == 0) {
				layerAlert.autoclose("设置成功");
				getReceiveList(window.url.deliverreceivelist, $('#myreceive'));
				getBoxCount(window.url.corporationstatistics, $(_ReceiveBoxCount));
			}
		}).fail(function() {
			console.log('fail')
		})
	}


});
/**
 * [getpersonalfavoriteCount 获取我的收藏数 分享个数]
 * @param  {[type]} url [地址]
 * @param  {[type]} dom [dom元素]
 * @return {[type]}     [description]
 */
function getBoxCount(url, dom, text) {
	var _url = url + "?id=" + enter_id;
	GetAjax(_url, _header).done(function(res) {
		if (res.State.Code == 0) {
			if (text == undefined) {
				dom.text(res.Content.Receive);
			} else {
				dom.text(res.Content[text]);
			}

		}
	}).fail(function() {
		console.log('fail')
	})
};