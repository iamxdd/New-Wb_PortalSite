$(document).ready(function() {
	window.url = pageConfig.ajaxUrl;
	var _accountInfo = window.LS.getItem('accountInfo');
	var _token = '',
		_userName = "",
		_header = {};
	if (_accountInfo) {
		_token = $.parseJSON(_accountInfo).Token;
		_header = {
			'Content-Type': "application/json",
			"Authorization": "Bearer " + _token,
			"Accept": "application/json"
		};
		_userName = $.parseJSON(_accountInfo).LoginName;
	}
	var enterData = null;

	/*获取企业基本信息*/
	var getMyInfo = function() {
		GetAjax(window.url.mycorporation, _header, ".basicinfo-bg").done(function(res) {
			var Code = res.State.Code;
			if (Code == 0) {
				var baseInfo = res.Content;

				//判断返回的是否为空对象
				if (baseInfo != null) {
					enterData = baseInfo;
					var CertificateState = '';
					if (baseInfo.CertificateState == 3) {
						CertificateState = '<span>' + baseInfo.Name + '</span><div class="caret-basic-new"></div>';
					}

					$("#basic-info-name").html(CertificateState);
					$("#Nature").html(numberToText(baseInfo.Nature, NatureStatus));
					$("#Scale").html(numberToText(baseInfo.Scale, ScaleStatus));
					$("#Address").html(baseInfo.Address);
					$("#Introduction").attr("title", baseInfo.Introduction);
					$("#Introduction").html("企业介绍: " + baseInfo.Introduction);
					$("#IconUrl").html('<img class="no-error" onerror="this.src=../img/defaut.png" src=' + (baseInfo.IconUrl ? baseInfo.IconUrl : '../img/defaut.png') + '>');

				}

			}

		}).fail(function() {
			console.log('fail');
		})
	};

	getMyInfo();

	//获取需求列表
	getDemandList(window.url.demandlist, $("#myDemandList"));

	/*数字转换为对应的文字*/
	var numberToText = function(n, array) {
		var _text;
		for (var i = 0; i < array.length; i++) {
			if (array[i].Id === n) {
				_text = array[i].Name;
			}
		}
		return _text;
	};
	//性质
	var NatureStatus = [{
		Id: 0,
		Name: "国有企业"
	}, {
		Id: 1,
		Name: "集体企业"
	}, {
		Id: 2,
		Name: "联营企业"
	}, {
		Id: 3,
		Name: "中外合作企业"
	}, {
		Id: 4,
		Name: "中外合资企业"
	}, {
		Id: 5,
		Name: "外商独资企业"
	}, {
		Id: 6,
		Name: "私营企业"
	}];

	var ScaleStatus = [{
		Id: 1,
		Name: "0-50"
	}, {
		Id: 2,
		Name: "51-99"
	}, {
		Id: 3,
		Name: "100-200"
	}, {
		Id: 4,
		Name: "201-499"
	}, {
		Id: 5,
		Name: "500-999"
	}, {
		Id: 6,
		Name: "1000+"
	}];

	/*企业基本信息查看详情*/
	$("body").on("click", ".see-details-btn", function(e) {
		var data_str = $(this).attr("data-str");
		$(this).parents('tr').siblings('tr').find('.see-details-btn').removeClass('fa-chevron-up').addClass('fa-chevron-down');
		//$(this).parents('tr').siblings('tr').find('.see-details-btn').html("查看详情");
		$(this).parents("tr").siblings('.trlist').remove();
		if ($(this).hasClass('fa-chevron-down')) {
			//$(this).html("收起");
			$(this).removeClass("fa-chevron-down").addClass("fa-chevron-up");
			var str =
				'<tr class="trlist">' +
				'<td colspan="5">' +
				'<p><b>任职要求</b>：' + data_str + '</p>' +
				'</td>' +
				'</tr>';
			$(this).parent().parent("tr").after(str);
		} else {
			//$(this).html("查看详情");
			$(this).removeClass("fa-chevron-up").addClass("fa-chevron-down");
			$(this).parent().parent("tr").siblings('.trlist').remove();
		}

	});

	/*********************************************************************************/
	/**
	 * [personalfavoriteList 分页获取需求列表]
	 * @param  {[type]} url [地址]
	 * @param  {[type]} dom [dom元素]
	 * @param  {[type]} text [description]
	 * @return {[type]}      [description]
	 */
	function getDemandList(url, dom) {

		GetAjax(url + "?length=" + 10 + "&currentPage=" + 1 + "&value=" + '', _header).done(function(res) {
			dom.find('table').html('');
			var _tbody = '',
				_tbody1 = '';
			if (res.State.Code == 0) {
				var content = res.Content.pagelist;
				var _countNum = res.Content.paginator;
				if (content.length == 0) {
					var _tr = '';
					_tr += '<tr><td colspan=4>暂无数据</td></tr>';
					_tbody += _tr;
					dom.find('table').html(_tbody);
				} else {
					$.each(content, function(index, value) {
						var _tr = '';
						switch (value.DemandType) { //1 人才需求

							case 1:
								_tr += '<tr><td><span class="fstitle">' + value.Name + ' </span></td>' +
									'<td>' + value.Quantity + '名</td>' +
									'<td>月薪<i>' + value.Amount + 'K</i></td>' +
									'<td class="text-center"><button data-str="' + value.Description + '" class="fa fa-chevron-down see-details-btn">查看详情</button>' +
									'</td></tr>';
								break;
							case 2:
								_tr += '<tr><td><span class="fstitle">' + value.Name + ' </span></td>' +
									'<td>工作日' + value.Quantity + '</td>' +
									'<td>项目金额<i>' + value.Amount + 'W</i></td>' +
									'<td class="text-center"><button data-str="' + value.Description + '" class="fa fa-chevron-down see-details-btn">查看详情</button>' +
									'</td></tr>';
								break;
							default:
								break;
						}

						_tbody += _tr;
					});

					dom.find('table').html(_tbody);
					var pageCount = _countNum.totalPages; //总页数
					var currentPage = _countNum.currentPage; //得到当前页数
					configOption(currentPage, pageCount, url,dom);
				}
			} else {
				$('.fixed-loading').css('display', 'none');
			}

		}).fail(function() {
			console.log('fail');
			$('.fixed-loading').css('display', 'none');
		})
	};

	/*跳转*/
	function configOption(currentPage, pageCount, url,dom) {

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
				GetAjax(url + "?length=" + 10 + "&currentPage=" + page + "&value=" + '', _header).done(function(res) {
					var _tbody='';
					$.each(res.Content.pagelist, function(index, value) {
						var _tr = '';
						
						switch (value.DemandType) { //1 人才需求

							case 1:
								_tr += '<tr><td><span class="fstitle">' + value.Name + ' </span></td>' +
									'<td>' + value.Quantity + '名</td>' +
									'<td>月薪<i>' + value.Amount + 'K</i></td>' +
									'<td class="text-center"><button data-str="' + value.Description + '" class="fa fa-chevron-down see-details-btn">查看详情</button>' +
									'</td></tr>';
								break;
							case 2:
								_tr += '<tr><td><span class="fstitle">' + value.Name + ' </span></td>' +
									'<td>工作日' + value.Quantity + '</td>' +
									'<td>项目金额<i>' + value.Amount + 'W</i></td>' +
									'<td class="text-center"><button data-str="' + value.Description + '" class="fa fa-chevron-down see-details-btn">查看详情</button>' +
									'</td></tr>';
								break;
							default:
								break;
						}

						_tbody += _tr;

					});
					dom.find('table').html(_tbody);
				});
			}
		};

		$('#pageLimit').bootstrapPaginator(options);
	}
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
})