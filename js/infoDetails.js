window.url = pageConfig.ajaxUrl;
var _accountInfo = window.LS.getItem('accountInfo');
var publicInfHtml = 'publicInfo.html';
var _token='';
var _header={};
if(_accountInfo) {
   _token = $.parseJSON(_accountInfo).Token;
   _header = {
    'Content-Type': "application/json",
    "Authorization": "Bearer " + _token,
    "Accept": "application/json"
  };
}
$(document).ready(function() {
        var _type = Number(window.LS.getItem('typeDetail'));
         if(_type==0){
            $('#publicInfodetails').text('政策文件');  
         }else if(_type==1){
            $('#publicInfodetails').text('通知公告');
         } 


        /******************************************前沿资讯新增分享点击*************************************************/


        $('.ld-cleft').on('click','.share-btns>a>span',function(e){
             e.stopPropagation();
            var  _SourceName = $(this).parents('.leader-infomation-tags').siblings('h4').text(),
                 _Ids = window.location.href.split('/'),
                 _SourceId = _Ids[_Ids.length-1].split('.'),
             _data = {
               "SharedType": 0,
               "SourceId":Number(_SourceId[0]),
               "SourceName": _SourceName,
            };
            if(!_accountInfo) return;

            PostAjax(url.shareUrl,_data,_Token).done(function(res){
              var _code = res.State.Code,
                 _message = res.State.Message;
            }).fail(function(){
              console.log('share fail')
            })
          
        });

        $('.ld-bodys').on('click','#publicInfodetails',function(e){
              e.stopPropagation();
              var _type = Number(window.LS.getItem('typeDetail'));
              window.LS.setItem('type',_type+1);
              window.location = publicInfHtml;
        });
 
});