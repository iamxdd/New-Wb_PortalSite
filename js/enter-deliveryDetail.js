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
	var _id = GetQueryString("id");
	/*获取企业基本信息*/
	var getMyInfo = function() {
		var _url = window.url.delivercorporation + "?demandInfoId=" + _id;
		GetAjax(_url, _header, ".basicinfo-bg").done(function(res) {
			var Code = res.State.Code;
			if(Code == 0) {
				var baseInfo = res.Content;

				//判断返回的是否为空对象
				if(baseInfo != null) {
					
					$("#Nature").html(numberToText(baseInfo.Nature, NatureStatus));
					$("#Scale").html(numberToText(baseInfo.Scale, ScaleStatus));
					$("#Address").html(baseInfo.Address);
					$("#Introduction").html("介绍: " + baseInfo.Introduction);
					$("#IconUrl").html('<img class="no-error" onerror="this.src=../img/defaut.png" src=' + (baseInfo.IconUrl ? baseInfo.IconUrl : '../img/defaut.png') + '>');
					if(baseInfo.CertificateState==3){
						$("#basic-info-name").html('<span>'+baseInfo.Name+'</span><div class="caret-basic-new"></div>');
					}else{
						$("#basic-info-name").html("<span>"+baseInfo.Name+"</span>");
					}
					$("#basic-info-name span").attr("title",baseInfo.Name);
					/*绑定企业需求*/
					var _ul = '';
					var list = [];
					if(baseInfo.DemandInfos && baseInfo.DemandInfos.length > 0) {
						list = baseInfo.DemandInfos;
						list.forEach(function(v) {
							_ul += '<div class="divPar"><li>' +
								'<span class="program-name" title="' + v.Name +'" >'+v.Name+ '</span>' +
								'<span>' + getjob(v.DemandType, v.Quantity) + '</span>' +
								'<span><b class="number">' + getMoney(v.DemandType, v.Amount) + '</b></span>' +
								'<button class="see-detais" data-Description=' + v.Description + '>查看详情<i class="fa fa-chevron-down"></i></button>' +
								/*'<button class="now-deliver" data-id=' + v.Id + '>立即投递</button>' +*/
								'</div></li>';
						});
						$('.company-need').children('ul').html(_ul);
					}

				}

			}

		}).fail(function() {
			console.log('fail');
		})
	};

	getMyInfo();
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
		if(id == 1) {
			text = '月薪' + value + 'k';
		} else {
			text = '项目金额' + value + 'w';
		}
		return text;
	}
	/******************************************查看详情*************************************************/
	$('body').on('click', '.see-detais', function(e) {
		e.stopPropagation();
		var data_Description = $(this).attr("data-Description");
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
			_div = '<div class="liChild">' + '任职要求:' + data_Description + '</div>';
			$(that).parent('li').after(_div);
			$(that).parents('.divPar').addClass('liactive');
			$(that).children().addClass("fa-chevron-up").removeClass("fa-chevron-down");

		}

	});

	/******************************************点击其他地方，详情收起*************************************************/
	$("html").on("click", function(e) {
		if(!/see-detais/.test(e.target.className)) {
			$(".liChild").remove();
		}
	});

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

	/*$("body").on("click", ".see-details-btn", function(e) {
		if ($(this).hasClass('fa-chevron-down')) {

			$(this).html("查看详情");
			$(this).removeClass("fa-chevron-down").addClass("fa-chevron-up");

			var str =`<tr>
								<td class="enter-prise-require">
									<h4 class="fstitle">任职要求:</h4>
									<p>1.负责参与需求的挖掘; 2.负责 java 程序开发, 测试,维护;</p>
								</td>
							</tr>`;
			$(this).parent().parent("tr").after(str);
		} else {
			$(this).html("收起");
			$(this).removeClass("fa-chevron-up").addClass("fa-chevron-down");
			$(this).parent().parent("tr").next("tr").remove();
		}

	});*/

	/*********************************************************************************/

})