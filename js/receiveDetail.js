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
$(document).ready(function() {
	//获取路由参数
	var _id = GetQueryString("reciveId");
	console.log(_id);
	var getMyInfo = function() {
		var _url = window.url.corporationbyid + "?id=" + _id;
		GetAjax(_url, _header, ".details").done(function(res) {
			var Code = res.State.Code;
			if (Code == 0) {
				var baseInfo = res.Content;
				if (baseInfo != null) {
					/*数据初始化*/
					$("#basic-info-name").html(baseInfo.Name);
					$("#Nature").html(numberToText(baseInfo.Nature,NatureStatus));
					$("#Scale").html(numberToText(baseInfo.Scale,ScaleStatus));
					$("#Address").html(baseInfo.Address);
					$("#Introduction").html(baseInfo.Introduction);
					$("#IconUrl").html('<img class="no-error" onerror="this.src=../img/defaut.png" src=' + (baseInfo.IconUrl ? baseInfo.IconUrl : '../img/defaut.png') + '>');

				}


			}

		}).fail(function() {
			console.log('fail');
		})
	};

	getMyInfo();
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
	},{
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
});