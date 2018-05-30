window.url = pageConfig.ajaxUrl;
var imgTitle = "四川智造人才网";
var _pageLength = 9;
var _currPage = 1;
var GcategoryId = -1,
	Gid = -1;
var _accountInfo = window.LS.getItem('accountInfo');
var _token='';
var _userName = '';
var _header={};
var _indexId = 0;
if(_accountInfo) {
	 _token = $.parseJSON(_accountInfo).Token;
	 _header = {
		'Content-Type': "application/json",
		"Authorization": "Bearer " + _token,
		"Accept": "application/json"
	};
	_userName =  $.parseJSON(_accountInfo).LoginName;
}
var detailshtml = "/training/details/"; 
$(document).ready(function() {

	//人才培训筛选
	$("body").on("click", ".table-sp td.dd span", function() {
		$(this).addClass("active").siblings().removeClass("active");
		var _categoryId = $(this).parents('.trainData').children('tbody').eq(0).find('.active').attr('data-id'),
			_id = $(this).parents('.trainData').children('tbody').eq(1).find('.active').attr('data-id');
		GcategoryId = _categoryId;
		Gid = _id;
		if(_categoryId == -1) {

			fetchData(9, 1, -1, _id);
			return;
		}

		if(_id == -1) {
			fetchData(9, 1, _categoryId, -1);
			return;
		}

		fetchData(9, 1, _categoryId, _id);
	});

	fetchData(9, 1);
	gettopData(url.traincourseUrl + '?length=' + 999 + '&currentPage=' + 1);


	$('.tsl-ul').on("click", "li>a", function(e){
		e.stopPropagation();
		var _id = $(this).attr('data-id');

		window.location = detailshtml + _id + '.html';
	});
});

/**
 * [fetchData 初始化数据]
 * @param  {[type]} url     [description]
 * @param  {[type]} bigData [description]
 * @return {[type]}         [description]
 */
function fetchData(_pageLength, _currPage, _categoryId, _id) {
	var leftbottomdata = [],
		_ulleftbox = '';
	$('.trainDataUl').html('');
	$('.pagination-container').css('display', 'none');
	GetAjax(url.trainlistUrl + '?length=' + _pageLength + '&currentPage=' + _currPage + '&categoryId=' + _categoryId + '&feeType=' + _id, null, ".ts-left").done(function(res) {
		var _code = res.State.Code,
			list = res.Content.pagelist,
			_pageCount = res.Content.paginator.totalPages,
			_currentPage = res.Content.paginator.currentPage;
		if(_code == 0) {
			if(list !== null && list.length > 0) {
				leftbottomdata = list;
				leftbottomdata.forEach(function(v, i) {
					if(v.Thumbnail==null || v.Thumbnail=="img/upload.png" || v.Thumbnail==''){
						v.Thumbnail = "../img/defaut.png";
					}
				});
				leftbottomdata.forEach(function(v, i) {
					_ulleftbox += '<li>' +
						'<a href="javascript:;" data-id='+v.Id+'>' +
						'<div class="videoImg"><img src=' + v.Thumbnail + ' alt="" class="zoom-imgs"></div>' +
						'<h4>' + v.Name + '</h4>' +
						'<span class="fr">' + imgTitle + '</span>' +
						'</a>' +
						'</li>';
				});
				$('.trainDataUl').html(_ulleftbox);
			}
		}

		if(list.length == 0) {
			$('.pagination-container').css('display', 'none');
			return;
		} else {
			$('.pagination-container').css('display', 'block');
		}
		configOption(_currentPage, _pageCount);

	}).fail(function() {

	});
}

function gettopData(url) {
	$('.trainData').html('');
	var types = [{
				name: "类型",
				supplyType: []
			},
			{
				name: "费用",
				supplyType: [{
						Name: "全部",
						Id: -1
					},
					{
						Name: "免费",
						Id: 0
					},
					{
						Name: "付费",
						Id: 1
					}
				]
			}
		],
		_contentsTable = '';
	$('.ulleftbox').html('');
	GetAjax(url).done(function(res) {
		var _code = res.State.Code,
			list = res.Content.pagelist;
		if(_code == 0) {
			if(list !== null && list.length > 0) {
				list.unshift({
					Name: "全部",
					Id: -1
				});
				types[0].supplyType = list;
				types.forEach(function(v, i) {
					_contentsTable += '<tbody><tr>' +
						'<td class="dt">' + v.name + '</td>' +
						'<td class="dd" >';
					v.supplyType.forEach(function(value, index) {
						if(index == 0) {
							_contentsTable += '<span class="active" data-id=' + value.Id + '>' + value.Name + '</span>';
						} else {
							_contentsTable += '<span data-id=' + value.Id + '>' + value.Name + '</span>';
						}
					}); +
					'</td>' +
					'</tr></tbody>';
				});
				$('.trainData').html(_contentsTable);
			}

		}

	}).fail(function() {
		console.log('fail')
	})

}

function configOption(_currentPage, _pageCount) {
    var options = {
            bootstrapMajorVersion:3, //对应的bootstrap版本
            currentPage: _currentPage, //当前页数
            totalPages: _pageCount, //总页数
            numberOfPages: 5,//每页页数
            shouldShowPage:true,//是否显示该按钮
            useBootstrapTooltip: false,
          /*  itemTexts: function (type, page, current) {
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
            onPageClicked: function (event, originalEvent, type, page) {
                if(_currPage==page){ 
                    return;
                }
                 _currPage=page;
                $('.trainDataUl').html('');
                var _ulleftbox1 = '',
                    leftbottomdata1 = [];
                GetAjax(url.trainlistUrl + '?length=' + _pageLength + '&currentPage=' + page + '&categoryId=' + GcategoryId + '&feeType=' + Gid).done(function (data) {
                    var _list = data.Content.pagelist;
                    leftbottomdata1 = _list;
                    leftbottomdata1.forEach(function(v, i) {
					if(v.Thumbnail==null || v.Thumbnail=="img/upload.png"){
						v.Thumbnail = "../img/defaut.png";
					  }
					});
                    leftbottomdata1.forEach(function (v, i) {
                        _ulleftbox1 += '<li>' +
                            '<a href="javascript:;"  data-id='+v.Id+'>' +
                            '<div class="videoImg"><img src=' + v.Thumbnail + ' alt="" class="zoom-imgs"></div>' +
                            '<h4>' + v.Name + '</h4>' +
                            '<span class="fr">' + imgTitle + '</span>' +
                            '</a>' +
                            '</li>';
                    });

                    $('.trainDataUl').html(_ulleftbox1);
                });

            }
        }
        $('#pageLimit').bootstrapPaginator(options);

}