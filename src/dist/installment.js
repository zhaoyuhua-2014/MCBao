
define(function(require, exports, module){
	
	require('jquery');
	var common = require('../dist/common');
	// 命名空间
	var pub = {};
	
	pub.module_id = $('[data-type]').attr('data-type');
    pub.logined = common.isLogin(); // 是否登录
	
    if( pub.logined ){
    	pub.userId = common.user_datafn().cuserInfo.id;
    	pub.source = "userId" + pub.userId;
    	pub.sign = md5( pub.source + "key" + common.secretKeyfn() ).toUpperCase();
    	pub.tokenId = common.tokenIdfn();
    }else{
        //common.jumpLinkPlain( '../index.html' );
    }
    pub.userBasicParam = {
		userId : pub.userId,
		source : pub.source,
		sign : pub.sign,
		tokenId : pub.tokenId
	};
	
	//我的分期
	pub.installment = {
		init:function(){
			pub.installment.installment_rcd_query.init();
			pub.installment.installment_rcd_show.init();
			pub.installment.installment_return_rcd_query.init();
			pub.installment.installment_return_rcd_show.init();
			pub.installment.installment_goto_pay_weixin.init();
		},
		//分期记录列表接口
		installment_rcd_query : {
			init:function(){
				common.ajaxPost($.extend({
					method:'installment_rcd_query',
					pageNo:common.PAGE_INDEX,
					pageSize:common.PAGE_SIZE,
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.installment.installment_rcd_query.apiData( d );
				});
			},
			apiData:function(){
				
			}
		},
		//查看分期记录
		installment_rcd_show : {
			init:function(){
				common.ajaxPost($.extend({
					method:'installment_rcd_show',
					recordId:"1"
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.installment.installment_rcd_show.apiData( d );
				});
			},
			apiData:function(){
				
			}
		},
		//列表展示分期还款记录
		installment_return_rcd_query : {
			init:function(){
				common.ajaxPost($.extend({
					method:'installment_return_rcd_query',
					mrId:"1",
					pageNo:common.PAGE_INDEX,
					pageSize:common.PAGE_SIZE,
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.installment.installment_return_rcd_query.apiData( d );
				});
			},
			apiData:function(){
				
			}
		},
		//分期还款记录展示
		installment_return_rcd_show : {
			init:function(){
				common.ajaxPost($.extend({
					method:'installment_return_rcd_show',
					rcdId:"rcdId",
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.installment.installment_return_rcd_show.apiData( d );
				});
			},
			apiData:function(){
				
			}
		},
		//微信还款
		installment_goto_pay_weixin : {
			init:function(){
				common.ajaxPost($.extend({
					method:'installment_goto_pay_weixin',
					notifyUrl:'123.123',
					installmentReturnRcdId:"1",
					openId:"123456",
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.installment.installment_goto_pay_weixin.apiData( d );
				});
			},
			apiData:function(){
				
			}
		},
		
	}
	
	
	
	//事件处理
	pub.eventHandle = {
		init:function(){
			$(".callback").on("click",function(){
				var n = pub.Back;
    			common.jumpHistryBack(n);
			});
		}
	}
	
	pub.init = function(){
		pub.installment.init();
		pub.eventHandle.init();
	};
	module.exports = pub;
})