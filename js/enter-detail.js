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
	var _id = GetQueryString("id");

	var getMyInfo = function() {
		var _url = window.url.demandDetail + "?id=" + _id
		GetAjax(_url, _header, ".details").done(function(res) {
			var Code = res.State.Code;
			if (Code == 0) {
				var baseInfo = res.Content;
				if (baseInfo != null) {
					$("#detais_Name").html(baseInfo.Name);
					$("#PlaceName").html("<span>*</span>工作地点："+baseInfo.PlaceName);
					switch (baseInfo.DemandType){
						case 1:
							$("#DemandType").html("<span>*</span>类型：人才需求");
							$("#Amount").html("<span>*</span>月薪（k）："+baseInfo.Amount);
							$("#Quantity").html("<span>*</span>数量（人）："+baseInfo.Quantity);
							break;
						case 2:
							$("#DemandType").html("<span>*</span>类型：项目需求");
							$("#Amount").html("<span>*</span>金额（w）："+baseInfo.Amount);
							$("#Quantity").html("<span>*</span>工作日（时间）："+baseInfo.Quantity);
							break;
						default:
							break;
					}
					$("#Description").html(baseInfo.Description);
					var TradeNameList = baseInfo.TradeNameList;
					if (TradeNameList != '') {
						TradeNameList = TradeNameList.split(",");
					}
					$.each(TradeNameList, function(index, item) {
						var industry_str = "";
						industry_str += '<span class="active">' + item + "</span>";
						$(".industry").append(industry_str);
					});


				}


			}

		}).fail(function() {
			console.log('fail');
		})
	};

	getMyInfo();
});