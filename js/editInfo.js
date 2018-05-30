window.url = pageConfig.ajaxUrl;

var layerAlert = window.parent.layerAlert ? window.parent.layerAlert : layerAlert;
var _accountInfo = window.LS.getItem('accountInfo');

var _token = '';
var _userName = '';
var _header = {};
if(_accountInfo) {
	_token = $.parseJSON(_accountInfo).Token;
	_header = {
		'Content-Type': "application/json",
		"Authorization": "Bearer " + _token,
		"Accept": "application/json"
	};
	_userName = $.parseJSON(_accountInfo).LoginName;
}

var postHeader = {
	"Authorization": "Bearer " + _token
};
var userHtml = '../user.html';
var TagsList = [],
	Industrylist = [],
	Locationlist = [];
var _iframe = window.parent;
var fixedDiv = _iframe.document.getElementById('fixedDiv');
var openContent = _iframe.document.getElementById('openContent');

$(document).ready(function() {
	if(_userName == '') {
		window.location = "login.html";
	}
	/*获取工作地点****城市*/
	var getCityslist = function(code, getBaseInfo, cityCode) {
		var cityList = [];
		$.each(Locationlist, function(index, item) {
			if(item.ParentCode === code) {
				cityList.push(item);
			}
		});
		var CityHtml = "";
		$.each(cityList, function(index, item) {
			CityHtml += '<option value=' + item.Code + '>' + item.Name + '</option>';
		});
		$("#City").html(CityHtml);
		if(cityCode) {
			$("#City").val(cityCode);
		}
	};

	$("#Province").on("change", function() {
		var value = $(this).val();
		getCityslist(value);
	});

	/*获取工作地点****所有*/
	var getLocationlist = function(getBaseInfo, getChildren) {
		GetAjax(window.url.getalllocation, _header, ".sp-lefts").done(function(res) {
			if(res.State.Code == 0) {
				Locationlist = res.Content;
				var ZeroCode = "",
					provinceList = [];
				$.each(Locationlist, function(index, item) {
					if(!item.ParentCode) {
						ZeroCode = item.Code;
						return;
					}
				});

				$.each(Locationlist, function(index, item) {
					if(item.ParentCode === ZeroCode) {
						provinceList.push(item);
					}
				});
				var LocationlistN = provinceList.length;
				var LocationHtml = "";
				$.each(provinceList, function(index, item) {
					if(index === 0) {
						LocationHtml += '<option selected=selected"" value=' + item.Code + '>' + item.Name + '</option>';
					} else {
						LocationHtml += '<option value=' + item.Code + '>' + item.Name + '</option>';
					}

				});
				$("#Province").html(LocationHtml);
				if(getBaseInfo) {
					getMyInfo();
				}
				if(getChildren) {
					var code = Locationlist[0].Code;
					getCityslist(code);
				}
			} else {
				layerAlert.autoclose(res.State.Message);
			}
		}).fail(function() {
			console.log('fail');
		})
	};

	//获取行业列表
	var getIndustrylist = function(getBaseInfo) {
		GetAjax(window.url.industrylist, _header, ".sp-lefts").done(function(res) {
			if(res.State.Code == 0) {
				Industrylist = res.Content;
				var exceptndustryHtml = "";
				if(Industrylist.length > 0) {
					for(var i = 0; i < Industrylist.length; i++) {
						exceptndustryHtml += "<span data-industryCode=" + Industrylist[i].Code + ">" + Industrylist[i].Name + "</span>";
					}
				} else {
					exceptndustryHtml = "<p>暂无数据</p>"
				}
				$("#exceptndustry,#myIndustry").html(exceptndustryHtml);
				getLocationlist(getBaseInfo);
			} else {
				layerAlert.autoclose(res.State.Message);
			}
		}).fail(function() {
			console.log('fail');
		})
	};

	//获取标签列表
	var getTagsList = function(getBaseInfo) {
		GetAjax(window.url.alltalengtags, _header, ".sp-lefts").done(function(res) {
			if(res.State.Code == 0) {
				TagsList = res.Content;
				var personalTagsHtml = "";
				if(TagsList.length > 0) {
					for(var i = 0; i < TagsList.length; i++) {
						personalTagsHtml += "<span data-id=" + TagsList[i].Id + ">" + TagsList[i].Tag + "</span>";
					}
				} else {
					personalTagsHtml = "<p>暂无数据</p>";
				}
				$("#personalTags").html(personalTagsHtml);
				getIndustrylist(getBaseInfo);
			} else {
				layerAlert.autoclose(res.State.Message);
			}
		}).fail(function() {
			console.log('fail');
		})
	};

	getTagsList(true);

	var baseInfo = {};

	/*绑定一级省份*/
	var bindProvince = function(cityCode) {
		var provinceCode = "";
		$.each(Locationlist, function(index, item) {
			if(item.Code === cityCode) {
				provinceCode = item.ParentCode;
				return;
			}
		});
		if(!!provinceCode) {
			$("#Province").val(provinceCode);
			getCityslist(provinceCode, null, cityCode);
		}

	};

	/*绑定基本信息*/
	/*获取我的个人信息*/
	var getMyInfo = function() {
		GetAjax(window.url.mytrainBaseUrl, _header, ".sp-lefts").done(function(res) {
			if(res.State.Code == 0) {
				baseInfo = res.Content;
				if(!baseInfo) {
					getLocationlist(null, true);
					return;
				}
				baseInfo.Birthday = dateFormat(baseInfo.Birthday, 'yyyy-MM-dd');
				$("#mainEditInfo").setForm(baseInfo);

				/*个人标签*/
				var Tags = baseInfo.Tags ? baseInfo.Tags : [];
				$("#personalTags span").each(function(index, item) {
					var id = $(item).attr("data-id");
					console.log(id);
					$.each(Tags, function(n, v) {
						if(v.Id + "" === id) {
							$(item).addClass("active");
						}
					});

				});

				/*工作经历*/
				var WorkExperiences = baseInfo.WorkExperiences;
				var WorkExperiencesHtml = "";
				if(WorkExperiences.length > 0) {
					for(var i = 0; i < WorkExperiences.length; i++) {
						var item = WorkExperiences[i];
						WorkExperiencesHtml +=
							'<div class="workexperience-item">' +
							'<input type="hidden" value=' + item.Id + ' />' +
							'<table class="table  pers-table">' +
							'<tr>' +
							'<td colspan="2">' +
							'<div class="form-label-cell">' +
							'<span>*</span>公司名称' +
							'</div>' +
							'<input type="text" class="form-control long-control" name="CompanyName1" id="" value=' + item.CompanyName + ' required="required" />' +
							(i !== 0 ? '<button class="btn btn-delete">删除</button>' : '') +
							'</td>' +
							'</tr>' +
							'<tr>' +
							'<td>' +
							'<div class="form-label-cell">' +
							'<span>*</span>工作职位' +
							'</div>' +
							'<input type="text" class="form-control" name="" id="" value=' + item.JobTitle + ' required="required" />' +
							'</td>' +
							'<td>' +
							'<div class="form-label-cell">' +
							'<span>*</span>工作时间' +
							'</div>' +
							'<input type="text" class="form-control form-date" name="" id="" value=' + dateFormat(item.WorkStart, 'yyyy-MM-dd') + ' required="required" />' +
							' - ' +
							'<input type="text" class="form-control form-date" name="" id="" value=' +dateFormat(item.WorkEnd, 'yyyy-MM-dd')  + ' required="required" />' +
							'</td>' +
							'</tr>' +
							'<tr>' +
							'<td colspan="2">' +
							'<div class="form-label-cell">' +
							'<span>*</span>工作描述' +
							'</div>' +
							'<textarea name="" class="form-control long-control textarea" maxlength="500">' + item.JobDescription + '</textarea>' +
							'</td>' +
							'</tr>' +
							'</table>' +
							'</div>';
					}
				} else {
					WorkExperiencesHtml = "<p>暂无工作经历</p>";
				}
				$("#WorkExperiences").html(WorkExperiencesHtml);
				setTimeout(function() {
					$(".workexperience-item .form-date").datetimepicker({
						language: 'zh-CN',
						weekStart: 1,
						minView: "month",
						todayBtn: 1,
						autoclose: 1,
						todayHighlight: 1,
						startView: 2,
						forceParse: 0,
						format: "yyyy-mm-dd",
						showMeridian: 1,
						endDate: new Date()
					}).on("click", function(ev) {
						$(".workexperience-item .form-date").datetimepicker();
					});
				}, 100);

				/*所属行业*/
				var Industries = baseInfo.Industries;
				$("#myIndustry span").each(function(index, item) {
					$.each(Industries, function(n, v) {
						if(v.IndustryCode === $(item).attr("data-industrycode")) {
							$(item).addClass("active");
							return;
						}
					});
				});

				/*个人成就*/
				var AchievementsList = baseInfo.Achievements ? baseInfo.Achievements.split("，") : [];
				var AchievementsHtml = "";
				if(AchievementsList.length > 0) {
					for(var i = 0; i < AchievementsList.length; i++) {
						AchievementsHtml += "<span><i></i>" + AchievementsList[i] + "</span>";
					}
				} else {
					AchievementsHtml = "<p>暂无成就!</p>";
				}
				$("#achievemenDivs").html(AchievementsHtml);

				/*个人头像*/
				$("#AvatarUrl").attr("src", baseInfo.AvatarUrl ? baseInfo.AvatarUrl : "../img/zz_39.png");

				/*期望工作*/
				var ExpectedJob = baseInfo.ExpectedJob;
				var ExpectedJobN = ExpectedJob.length;
				if(ExpectedJobN > 0) {
					$('#exceptndustry').attr("data-id", ExpectedJob[0].Id);
					$("#EnterpriseNature").val(ExpectedJob[0].EnterpriseNature);
					for(var i = 0; i < ExpectedJobN; i++) {
						var ExpectedJobI = ExpectedJob[i];
						$('#exceptndustry span').each(function(index, item) {
							if($(item).attr("data-industrycode") === ExpectedJobI.IndustryCode) {
								$(item).addClass("active");
							}
						});
					}
					var ExpectedWorkingPlaceCode = ExpectedJob[0].ExpectedWorkingPlaceCode;
					bindProvince(ExpectedWorkingPlaceCode);
					$("#WorkingNature").val(ExpectedJob[0].WorkingNature ? ExpectedJob[0].WorkingNature : 0);
				}

				/*绑定城市*/

			} else {
				layerAlert.autoclose(res.State.Message);
			}
		}).fail(function() {
			layerAlert.autoclose("获取信息失败！");
		})
	};

	/********************************************增加成就********************************************/

	$("#addAchievmenBtn").on("click", function() {
		var n = $("#achievemenDivs span").length;

		/*if(n >= 5) {
			return;
		}*/
		var addAchievmenValue = $("#addAchievmenValue").val();
		var hasOwer = false;
		for(var i = 0; i < n; i++) {
			if($("#achievemenDivs span").eq(i).html().substring(7, $("#achievemenDivs span").eq(i).html().length) === addAchievmenValue) {
				hasOwer = true;
				break;
			}
		}

		if(addAchievmenValue) {
			if(hasOwer) {
				layerAlert.autoclose("已经有这个成就了，无需重复添加!");
				return;
			}
			var addItem = "<span><i></i>" + addAchievmenValue + "</span>";
			$("#achievemenDivs").append(addItem);
			$("#addAchievmenValue").val("");
			if($("#achievemenDivs p").length > 0) {
				$("#achievemenDivs p").remove();
			}
		} else {
			return;
		}
	});

	/******************************************标签选中取消***************************************/
	$(".talent-tag").on("click", "span", function() {
		if($(this).hasClass("active")) {
			$(this).toggleClass("active");
		} else {
			if($(".talent-tag span.active").length >= 3) {
				layerAlert.autoclose("最多选择3个标签!");
				return;
			} else {
				$(this).toggleClass("active");
			}
		}

	});

	/******************************************标签选中取消***************************************/
	$(".industry-tag").on("click", "span", function() {
		if($(this).hasClass("active")) {
			$(this).toggleClass("active");
		} else {
			if($(".industry-tag span.active").length >= 3) {
				layerAlert.autoclose("最多选择3个行业!");

				return;
			} else {
				$(this).toggleClass("active");
			}
		}

	});

	/******************************************期望行业选中取消***************************************/
	$(".wanner-jobs .wanner-tags").on("click", "span", function() {
		if($(this).hasClass("active")) {
			$(this).toggleClass("active");
		} else {
			if($(".wanner-tags span.active").length >= 3) {
				layerAlert.autoclose("最多选择3个行业!");
				return;
			} else {
				$(this).toggleClass("active");
			}
		}

	});

	/******************************************工作经历增加***************************************/
	$('.person-ion').on("click", ".btn-add-experience", function(e) {
		e.stopPropagation();
		var _experienceitem = '';
		_experienceitem =
			'<div class="workexperience-item">' +
			'<input type="hidden" value="" />' +
			' <table class="table  pers-table">' +
			' <tr>' +
			' <td colspan="2">' +
			' <div class="form-label-cell">' +
			' <span>*</span>公司名称' +
			' </div>' +
			' <input type="text" class="form-control long-control" name="" id="" value="" /><button class="btn btn-delete">删除</button>' +
			' </td>' +
			' </tr>' +
			' <tr>' +
			' <td>' +
			' <div class="form-label-cell">' +
			'  <span>*</span>工作职位' +
			' </div>' +
			' <input type="text" class="form-control" name="" id="" value="" />' +
			' </td>' +
			' <td>' +
			' <div class="form-label-cell">' +
			' <span>*</span>工作时间' +
			' </div>' +
			' <input type="text" class="form-control form-date" name="" id="" value="" required="required" />' +
			' - ' +
			' <input type="text" class="form-control form-date" name="" id="" value="" required="required" />' +
			' </td>' +
			' </tr>' +
			' <tr>' +
			' <td colspan="2">' +
			' <div class="form-label-cell">' +
			' <span>*</span>工作描述' +
			' </div>' +
			' <textarea name="" class="form-control long-control textarea"  required="required"></textarea>' +
			' </td>' +
			' </tr>' +
			' </table>' +
			' </div>';
		$(".person-experience").append(_experienceitem);

		setTimeout(function() {
			$(".workexperience-item .form-date").datetimepicker({
				language: 'zh-CN',
				weekStart: 1,
				minView: "month",
				todayBtn: 1,
				autoclose: 1,
				todayHighlight: 1,
				startView: 2,
				forceParse: 0,
				format: "yyyy-mm-dd",
				showMeridian: 1,
				endDate: new Date()
			}).on("click", function(ev) {
				$(".workexperience-item .form-date").datetimepicker();
			});
		}, 100);

	});

	/******************************************工作经历删除***************************************/
	$('body').on("click", ".workexperience-item .btn-delete", function(e) {
		e.stopPropagation();
		$(this).parents('.workexperience-item').remove();
	});

	/******************************************获得成就增加***************************************/
	$('.person-ion').on("click", ".btn-add-sucess", function(e) {
		$(".achievemen-content .add-panels").toggle();
	});

	/******************************************获得成就删除***************************************/

	$('.achievemen-item').on('click', 'i', function(e) {
		e.stopPropagation();
		$(this).parent('span').remove();
		var n = $("#achievemenDivs span").length;
		if(n === 0) {
			$("#achievemenDivs").html("<p>暂无成就!</p>");
		}
	});

	/******************************************上传图片***************************************/
	$(".imgUpload,#AvatarUrl").on("click", function() {
		if(navigator.appName == "Microsoft Internet Explorer" && parseInt(navigator.appVersion.split(";")[1].replace(/[ ]/g, "").replace("MSIE", "")) < 10) {
			layerAlert.autoclose('亲,你的IE版本过低，请升级到10以上');
			return false;
		}else{
			$("#fileUpload").trigger("click");
		}
	});

	/*增加个人标签*/

	$("#addTags").on("click", function() {
		$(".personal-tags .add-panels").toggle();
	});

	$(".add-panels").on("click", ".btn-cancel", function() {
		$(this).parent().toggle();
	});
	//
	$("#fileUpload").on("change", function() {
		var _fileUpload = $('#fileUpload').val();

		var formData = new FormData();
		var $this = $(this);
		var file = $this.get(0).files[0];
		formData.append('image', file);
		if(file.name == "") {
			layerAlert.autoclose("请上传图片");
			return false;
		} else {
			if(!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(file.name)) {
				layerAlert.autoclose("图片类型必须是.gif,jpeg,jpg,png中的一种")
				return;
			}
		}
		$.ajax({
			url: window.url.fileUpLoad,
			/*这是处理文件上传的servlet*/
			type: 'POST',
			data: formData,
			dataType: "json",
			async: false,
			cache: false,
			contentType: false,
			processData: false,
			headers: {
				"Authorization": "Bearer " + _token
			},
			success: function(returndata) {
				$("#AvatarUrl").attr("src", returndata.Content[0].Url);
			},
			error: function(returndata) {
				layerAlert.autoclose(returndata);
			}
		});
	});

	//判断表单必填项是否为空

	var isFormNull = function(jqueryObj) {
		var formEle = jqueryObj.find("input[required],select[required],textarea[required],input[type=radio],input[type=checkbox]");
		var isNUll = false;
		formEle.each(function(index, item) {
			var $this = $(item);
			if(!$this.val()) {
				isNUll = true;
			}
		});

		return isNUll;
	};

	//保存提交编辑信息
	$("#submitInfo").on("click", function() {

		if(isFormNull($("#mainEditInfo"))) {
			layerAlert.autoclose("您还有必填项未填写!");
			return;
		}
		var FormFlag = firstRegestvalidateForm();
		if(!FormFlag) {
			return;
		}
		var expiercienceFlag = timExiperienceFlag();
		if(expiercienceFlag) {
			return;
		}
		var data = $("#mainEditInfo").serializeJson();
		/*人才标签*/
		var tagN = $("#personalTags span.active").length;
		data.Tags = [];
		for(var i = 0; i < tagN; i++) {
			data.Tags.push({
				Tag: $("#personalTags span.active").eq(i).html(),
				Id: $("#personalTags span.active").eq(i).attr("data-id")

			});
		}

		/*所属行业*/
		data.Industries = [];
		$("#myIndustry span.active").each(function(index, item) {
			data.Industries.push({
				IndustryCode: $(item).attr("data-industrycode"),
				IndustryName: item.innerHTML
			});
		});

		/*工作经历*/
		data.WorkExperiences = [];
		var WorkExperiencesN = $("#WorkExperiences .workexperience-item").length;
		for(var j = 0; j < WorkExperiencesN; j++) {
			var cell = $("#WorkExperiences .workexperience-item").eq(j);
			data.WorkExperiences.push({
				"Id": cell.find("input").eq(0).val(),
				"CompanyName": cell.find("input").eq(1).val(),
				"JobTitle": cell.find("input").eq(2).val(),
				"WorkStart": cell.find("input").eq(3).val(),
				"WorkEnd": cell.find("input").eq(4).val(),
				"JobDescription": cell.find("textarea").eq(0).val()
			});
		}
		/*期望工作*/
		data.ExpectedJob = [];
		var ExpectedJobN = $("#exceptndustry span.active").length;
		if(ExpectedJobN === 0) {
			layerAlert.autoclose("请至少选择一个期望工作行业");
			return;
		}
		for(var k = 0; k < ExpectedJobN; k++) {
			var ExpectedJobI = $("#exceptndustry span.active").eq(k);
			data.ExpectedJob.push({
				Id: null,
				EnterpriseNature: $("#EnterpriseNature").val(),
				ExpectedWorkingPlaceCode: $("#City").val(),
				IndustryCode: ExpectedJobI.attr("data-industryCode"),
				WorkingNature: $("#WorkingNature").val()
			});
		}
		/*获得成就*/
		data.Achievements = "";
		var Achievements = "";
		var AchievementsN = $("#achievemenDivs span").length;
		for(var l = 0; l < AchievementsN; l++) {
			var AchievementsItem = $("#achievemenDivs span").eq(l);
			Achievements += AchievementsItem.html().substring(7, AchievementsItem.html().length) + "，"
		}
		data.Achievements = Achievements.substring(0, Achievements.length - 1);
		/*头像*/
		data.AvatarUrl = $("#AvatarUrl").attr("src");
		if(data.AvatarUrl == "") {
			return false;
		} else {
			if(!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(data.AvatarUrl)) {
				layerAlert.autoclose("图片类型必须是.gif,jpeg,jpg,png中的一种")
				return;
			}
		}
		if(data.StaffState == "0") {
			layerAlert.autoclose("请选择在职状态");
			return;
		}

		if(data.PoliticsState == "0") {
			layerAlert.autoclose("请选择政治面貌");
			return;
		}

		/*console.log(data);*/
		if(data.Id) {
			PutAjax(window.url.trainBaseUrl, data, postHeader, ".sp-lefts").done(function(response) {
				if(response.State.Code === 0) {
					layerAlert.autoclose("修改成功！");
					setTimeout(function() {
						parent.location.href = userHtml;
					}, 1600);

				} else {
					layerAlert.autoclose(response.State.Message);
				}
			}).fail(function() {
				layerAlert.autoclose("修改信息失败！");
			});
		} else {
			delete data.Id;
			PostAjax(window.url.trainBaseUrl, data, postHeader, ".sp-lefts").done(function(response) {
				if(response.State.Code === 0) {
					layerAlert.autoclose("新增成功！");
					setTimeout(function() {
						parent.location.href = userHtml;
					}, 1600);

				} else {
					layerAlert.autoclose(response.State.Message);
				}
			}).fail(function() {
				layerAlert.autoclose("新增信息失败！");
			});
		}

	});

	//取消编辑
	$("#cancelInfo").on("click", function() {
		parent.location.href = userHtml;
	});

});

/******************************************出生日期时间插件  ***************************************/

$("#birthDate").datetimepicker({
	language: 'zh-CN',
	weekStart: 1,
	minView: "month",
	todayBtn: 1,
	autoclose: 1,
	todayHighlight: 1,
	startView: 2,
	forceParse: 0,
	format: "yyyy-mm-dd",
	showMeridian: 1,
	endDate: new Date()
}).on("click", function(ev) {
	$("#birthDate").datetimepicker();
});
setTimeout(function() {
	$(".workexperience-item .form-date").datetimepicker({
		language: 'zh-CN',
		weekStart: 1,
		minView: "month",
		todayBtn: 1,
		autoclose: 1,
		todayHighlight: 1,
		startView: 2,
		forceParse: 0,
		format: "yyyy-mm-dd",
		showMeridian: 1,
		endDate: new Date()
	}).on("click", function(ev) {
		$(".workexperience-item .form-date").datetimepicker();
	});
}, 100);

var errArrinfo = ['电话号码不合法!', '邮箱不合法!', '工作时间开始时间不能大于结束时间!', '下一个工作经历的时间不能大于上一个工作经历的结束时间'];
/**
 * [firstRegestvalidateForm description]
 * @return {[type]} [表单验证]上衣
 */
function firstRegestvalidateForm() {
	var flag = true,
		_phoneCheck = phoneNumCheck($("input[name='Phone']").val()),
		_mailCheck = mailCheck($("input[name='Email']").val());

	if(!_phoneCheck) {
		layerAlert.autoclose(errArrinfo[0]);
		flag = false;
	}
	if(!_mailCheck) {
		layerAlert.autoclose(errArrinfo[1]);
		flag = false;
	}
	return flag
}

/**
 * [timExiperienceFlag description] 工作时间开始时间不能大于结束时间
 * @return {[type]} [description]
 */
function timExiperienceFlag() {
	var flag = false,
		date = [];
	var WorkExperiencesN = $("#WorkExperiences .workexperience-item").length;
	for(var j = 0; j < WorkExperiencesN; j++) {
		var cell = $("#WorkExperiences .workexperience-item").eq(j);
		date.push({
			"WorkStart": cell.find("input").eq(3).val(),
			"WorkEnd": cell.find("input").eq(4).val()
		});
	}

	date.forEach(function(v) {
		if((Number(new Date(v['WorkStart']).getTime() / 1000) - Number(new Date(v['WorkEnd']).getTime() / 1000)) > 0) {
			layerAlert.autoclose(errArrinfo[2]);
			flag = true;
		}
	});

	for(var i = 0; i < date.length - 1; i++) {
		if((Number(new Date(date[i]['WorkEnd']).getTime() / 1000) - Number(new Date(date[i + 1]['WorkStart']).getTime() / 1000)) < 0) {
			layerAlert.autoclose(errArrinfo[3]);
			flag = true;
		}
	}

	return flag
}

/*弹框*/