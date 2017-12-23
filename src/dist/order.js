
define(function(require, exports, module){
	
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
	
	pub.options = {
		status:'',//订单状态订单状态 1：新建； 2：待支付； 3：已支付； 为空时：全部订单
		orderCode:"",//订单编码
	};
	
	
	//订单列表
	pub.orderList = {
		init:function(){
			pub.orderList.orders_manage.init();
		},
		orders_manage:{
			init:function(){
				common.ajaxPost($.extend({
					method:'orders_manage',
					orderStatus:pub.options.status,
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.orderList.orders_manage.apiData( d );
					d.statusCode != "100000" && common.prompt(d.statusStr);
				});
			},
			apiData:function(d){
				
			}
		},
		eventHandle:{
			init:function(){
				var nav = $(".order_nav"), order_list= $(".order_box");
				nav.on("click",'.mall_nav_item',function(){
					var nood = $(this);
					
					nood.addClass("actived").siblings().removeClass("actived");
					pub.options.status = nood.attr("data");
					
					pub.orderList.orders_manage.init();
					
				})
				order_list.on("click",'.order_item',function(){
					common.jumpLinkPlain("../html/order_details.html")
				})
			}
		}
	}
	
	//订单详情
	pub.orderDetails = {
		init:function(){
			
		},
		order_details:{
			init:function(){
				common.ajaxPost($.extend({
					method:'order_details',
					orderCode:pub.options.orderCode,
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.orderDetails.order_details.apiData( d );
					d.statusCode != "100000" && common.prompt(d.statusStr);
				});
			},
			apiData:function(d){
				
			}
		},
		eventHandle:{
			init:function(){
				
			}
		}
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
		if (pub.module_id == "orderList"){
    		pub.orderList.init()
			pub.orderList.eventHandle.init();
    	}else if (pub.module_id == "upLoad_driverLicense"){
    		pub.upLoad_driverLicense.init();
			pub.upLoad_driverLicense.eventHandle.init();
    	}
		pub.eventHandle.init();
	};
	module.exports = pub;
})