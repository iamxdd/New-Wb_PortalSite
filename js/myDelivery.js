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
var _myDeliveryCount = _iframe.document.getElementById('DeliverBox');

console.log(_myDeliveryCount);
$(document).ready(function() {
	//获取投递箱window.url.demandlist
	getDeliveryList(window.url.deliverinfolist, $('#mydelivery'));

	/*********************************投递箱删除************************************/
	$('body').on('click', '.deleteBtn', function(e) {
		e.stopPropagation();
		var _Id = $(this).attr('data-str');
		layerAlert.checkone("选择操作", function() {
			DeleteAjax(window.url.deletemydeliver + '?deliverId=' + _Id, _header).done(function(data) {
				if (data.State.Code == 0) {
					layerAlert.autoclose("删除成功");
					getDeliveryList(window.url.deliverinfolist, $('#mydelivery'));
					
				} else {
					layerAlert.autoclose("删除失败");
				}
				//获取企业发布箱数
				getpersonalfavoriteCount(pageConfig.ajaxUrl.delivercount, $(_myDeliveryCount));
			});
		}, function() {
			return;
		}, "确定", "取消", true, true, "确定要删除吗?");
	});


});

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

$("#deliverSearch").on("click", function() {
		getDeliveryList(window.url.deliverinfolist, $('#mydelivery'));
	})
	/**
	 * [getReleaseList 获取投递箱列表 ]
	 * @param  {[type]} url [地址]
	 * @param  {[type]} dom [dom元素]
	 * @param  {[type]} text [description]
	 * @return {[type]}      [description]
	 */
function getDeliveryList(url, dom) {
	var state = $("#stateSelect").val();
	var seach_value = $("#seach_value").val();
		seach_value=encodeURIComponent(seach_value);
	GetAjax(url + "?length=" + 10 + "&currentPage=" + 1 + "&value=" + seach_value, _header, ".release").done(function(res) {
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
				console.log(_tbody)
				dom.find('table').html(_tbody);
			} else {
				$.each(content, function(index, value) {
					var _datatbody = '';

					_datatbody += '<tr>' +
						'<td><span class="fstitle">' + value.DemandInfoName + ' </span></td>' +
						'<td>' + value.DeliverName + '</td>' +
						'<td>' + dateFormat(value.CreatedAt, 'yyyy-MM-dd') + '</td>' +
						'<td class="text-center">' +
						'<button class="deleteBtn" data-str=' + value.Id + '>删除</button>' +
						'<button class="see-detais" data-str=' + value.DemandInfoId + '>详情</button>' +
						'</td></tr>';


					_tbody += _datatbody;
				});

				dom.find('table').html(_tbody);
				var pageCount = _countNum.totalPages; //总页数
				var currentPage = _countNum.currentPage; //得到当前页数
				configOption(currentPage, pageCount, url, seach_value, state, dom);
			}
		} else {
			$('.fixed-loading').css('display', 'none');
		}

	}).fail(function() {
		console.log('fail');
		$('.fixed-loading').css('display', 'none');
	})
};

function configOption(currentPage, pageCount, url, seach_value, state, dom) {
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

			GetAjax(url + "?length=" + 10 + "&currentPage=" + page + "&value=" + seach_value + "&state=" + state, _header).done(function(res) {
				_tbody1 = '<tr>' +
					'<th>名称</th>' +
					'<th>投递人</th>' +
					'<th>时间</th>' +
					'<th class="text-center">操作</th>' +
					'</tr>';
				$.each(res.Content.pagelist, function(index, value) {
					var _datatbody = '';
					_datatbody += '<tr>' +
						'<td><span class="fstitle">' + value.DemandInfoName + '</span></td>' +
						'<td>' + value.DeliverName + '</td>' +
						'<td>' + dateFormat(value.CreatedAt, 'yyyy-MM-dd') + '</td>' +
						'<td class="text-center">' +
						'<button class="deleteBtn" data-str=' + value.Id + '>删除</button>' +
						'<button class="see-detais" data-str=' + value.DemandInfoId + '>详情</button>' +
						'</td></tr>';
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
	data_str = Number(data_str);
	window.location = "deliveryDetail.html" + "?id=" + data_str;
});


function getBoxCount(url, dom, text) {
	var _url = window.url.corporationstatistics + "?id=" + enter_id;
	GetAjax(_url, _header).done(function(res) {
		if (res.State.Code == 0) {
			if (text == undefined) {
				dom.text(res.Content.Deliver);
			} else {
				dom.text(res.Content[text]);
			}

		}
	}).fail(function() {
		console.log('fail')
	})
};