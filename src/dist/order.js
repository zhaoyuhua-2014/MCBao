
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
		pageNo:common.PAGE_INDEX,
		pageSize:common.PAGE_SIZE,
		isEnd:'',
		orderStatus:["已作废","","待支付","已支付","已发货","已完成"],
	};
	
	
	//订单列表
	pub.orderList = {
		init:function(){
			pub.loading = $(".click_load");
			pub.orderList.orders_manage.init();
		},
		orders_manage:{//orders_page_manage-orders_manage2-orders_manage
			init:function(){
				common.ajaxPost($.extend({
					method:'orders_page_manage',
					orderStatus:pub.options.status,
					pageNo:pub.options.pageNo,
					pageSize:pub.options.pageSize,
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.orderList.orders_manage.apiData( d );
					d.statusCode != "100000" && common.prompt(d.statusStr);
				});
			},
			apiData:function(d){
				var d = d.data,o = d.objects,html = '';
				pub.options.isEnd = d.isLast;
				if (pub.options.pageNo == 1) {
					$(".order_box").html('');
				}
				var nood = $(".order_box");
				if (o.length == '0') {
					pub.loading.hide();
					nood.html("暂无订单数据！").css("line-height","100px").css("text-align","center").css("font-size","30px");
				}else{
					nood.removeAttr("style");
					for (var i in o) {
						html +='<div class="order_item" data="'+o[i].orderCode+'" orderType = "'+o[i].orderType+'">'
						html +='	<div class="order_item_top">'
						html +='		<span class="float_left">订单编号：'+o[i].orderCode+'</span>'
						if (o[i].orderStatus == "1") {
							html +='		<span class="float_right order_status color_or">未支付</span>'
						} else if (o[i].orderStatus == "2"){
							html +='		<span class="float_right order_status color_re">已支付</span>'
						} else if (o[i].orderStatus == "3"){
							html +='		<span class="float_right order_status">已发货</span>'
						} else if (o[i].orderStatus == "4"){
							html +='		<span class="float_right order_status">已完成</span>'
						} else if (o[i].orderStatus == "-1"){
							html +='		<span class="float_right order_status">已作废</span>'
						}
						html +='	</div>'
						html +='	<div class="order_item_bottom">'
						html +='		<div class="oreder_item_b_left"><img src = "'+o[i].orderLogo+'" /></div>'
						html +='		<div class="oreder_item_b_center">'
						html +='			<div class="order_item_title">'+o[i].customName+'</div>'
						html +='			<div class="order_item_money">￥'+o[i].shouldPayMoney+'</div>'
						html +='		</div>'
						html +='		<div class="oreder_item_b_right">'+o[i].createTime+'</div>'
						html +='	</div>'
						html +='</div>'
					}
					nood.html(html);
					if( pub.options.isEnd ){
						pub.loading.show().html("没有更多数据了！");
					}else{
						pub.loading.show().html("点击加载更多！");
					};
				}
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
					//orderType 保险订单=1 ，油卡订单=2， ETC订单=3， 新车订单=4
					var nood =$(this),
					orderCode = nood.attr("data"),
					orderType = nood.attr("orderType");
					if (orderType == 1) {
						common.jumpLinkPlain("../html/policy_details.html"+"?orderCode="+orderCode)
					} else if(orderType == 2){
						
					} else if(orderType == 3){
						
					} else if(orderType == 4){
						common.jumpLinkPlain("../html/order_details.html"+"?orderCode="+orderCode)
					}
				});
				//点击加载更多
				pub.loading.on("click",".click_load",function(){
					
					/*e.stopPropagation()*/
					if (!pub.options.isEnd) {
						pub.options.pageNo ++;
						pub.orderList.orders_manage.init();
					}else{
						pub.loading.show().html("没有更多数据了！");
					}
				})
			}
		}
	}
	
	//车订单详情
	pub.orderDetails = {
		init:function(){
			pub.options.orderCode = common.getUrlParam("orderCode");
			pub.orderDetails.order_details.init();
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
				var o = d.data.orderInfo,c = d.data.couponlist,html='';
				pub.options.orderData = d.data;
				pub.options.orderType = o.orderType;//orderType 保险订单=1 ，油卡订单=2， ETC订单=3， 新车订单=4
													//由于订单类型不同，订单内容也不相同，订单业务快照数据不同。同步设计不同的订单快照数据表。
				//pub.options.orderStatus = o.orderStatus//		/**	新建--待配货 1*/
														//	public static Integer NEW = 1;
															/**	已付款--待发货 2*/
														//	public static Integer PAID  = 2;
														//	/**	已发货--待签收 3*/
														//	public static Integer DELIVERY = 3;
															/**	已完成--交易成功 4*/
														//	public static Integer SUCCESS = 4;
															/**	作废 -1*/
														//	public static Integer CANCEL = -1;
				
				//给据不同订单的类型创建不同的订单详情页面
				if(pub.options.orderType == '1'){
					pub.orderDetails.order_details.car_order(d);
				} else if(pub.options.orderType == '2'){
					
				} else if(pub.options.orderType == '3'){
					
				} else if(pub.options.orderType == '4'){
					pub.orderDetails.order_details.car_order(d);
				}
				/*给据不同的订单状态判断显示按钮*/
				var nood = $(".payment_submit"),
					btn = nood.find(".submit_btn90");
				if (o.orderStatus == '1') {
					btn.html("立即支付").addClass("pay");
				} else if(o.orderStatus == '2' || o.orderStatus == '3' || o.orderStatus == '4' ){
					nood.addClass("hidden");
				} else if(o.orderStatus == '-1'){
					btn.html("删除").addClass("del");
				}
				
				
			},
			car_order:function(d){
				var o = d.data.orderInfo,c = d.data.couponlist,html='',good = o.details[0];
				
				var nood = $(".order_details_box"),
					noodTop = nood.find(".order_item"),
					noodCenter = nood.find(".policy_details_box_center");
				
				noodTop.find(".order_item_top .float_left").html("订单编号："+o.orderCode);
				noodTop.find(".order_item_top .order_status").html(pub.options.orderStatus[(parseInt(o.orderStatus) + 1)])
				
				noodTop.find(".order_item_bottom .oreder_item_b_left img").attr("src",good.goodsLogo);
				noodTop.find(".order_item_bottom .oreder_item_b_center .order_item_title").html(good.goodsName +"(定金)");
				noodTop.find(".order_item_bottom .oreder_item_b_center .order_item_money").html(o.realPayMoney);
				noodTop.find(".order_item_bottom .oreder_item_b_right").html(o.createTime);
				
				noodCenter.find(".car_staging_box_c_item").eq(0).find('.float_right').html(o.createTime)
				noodCenter.find(".car_staging_box_c_item").eq(1).find('.float_right').html(o.customName)
				noodCenter.find(".car_staging_box_c_item").eq(2).find('.float_right').html(o.receiveAddress)
				
				
				
			},
			
		},
		order_cancel:{
			init:function(){
				common.ajaxPost($.extend({
					method:'order_cancel',
					orderCode:pub.options.orderCode,
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.orderDetails.order_cancel.apiData( d );
					d.statusCode != "100000" && common.prompt(d.statusStr);
				});
			},
			apiData:function(d){
				
			}
		},
		order_del:{
			init:function(){
				common.ajaxPost($.extend({
					method:'order_del',
					orderCode:pub.options.orderCode,
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.orderDetails.order_del.apiData( d );
					d.statusCode != "100000" && common.prompt(d.statusStr);
				});
			},
			apiData:function(d){
				
			}
		},
		eventHandle:{
			init:function(){
				$(".submit_btn90").on("click",function(){
					var nood = $(this),
						pay = nood.is(".pay"),
						del = nood.is(".del");
					
					if (pay) {
						localStorage.setItem("orderData",JSON.stringify(pub.options.orderData))
						common.jumpLinkPlain("../html/line_payment.html"+"?orderType="+ pub.options.orderType);
					}else if(del){
						
						
					}
					
					
				})
			}
		}
	}
	//保单订单
	pub.policyDetails = {
		init:function(){
			
		},
		order_details:{
			init:function(){
				common.ajaxPost($.extend({
					method:'order_details',
					orderCode:pub.options.orderCode,
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.policyDetails.order_details.apiData( d );
					d.statusCode != "100000" && common.prompt(d.statusStr);
				});
			},
			apiData:function(d){
				console.log(d);
				var o = d.data.orderInfo,c = d.data.couponlist,html='';
				pub.options.orderData = d.data;
				pub.options.orderType = o.orderType;//orderType 保险订单=1 ，油卡订单=2， ETC订单=3， 新车订单=4
													//由于订单类型不同，订单内容也不相同，订单业务快照数据不同。同步设计不同的订单快照数据表。
				//pub.options.orderStatus = o.orderStatus//		/**	新建--待配货 1*/
															/**	已付款--待发货 2*/
														//	/**	已发货--待签收 3*/
															/**	已完成--交易成功 4*/
															/**	作废 -1*/
				
				//给据不同订单的类型创建不同的订单详情页面
				if(pub.options.orderType == '1'){
					//pub.policyDetails.order_details.car_order(d);
				} else if(pub.options.orderType == '2'){
					
				} else if(pub.options.orderType == '3'){
					
				} else if(pub.options.orderType == '4'){
					//pub.policyDetails.order_details.car_order(d);
				}
				/*给据不同的订单状态判断显示按钮*/
				var nood = $(".payment_submit"),
					btn = nood.find(".submit_btn90");
				if (o.orderStatus == '1') {
					btn.html("立即支付").addClass("pay");
				} else if(o.orderStatus == '2' || o.orderStatus == '3' || o.orderStatus == '4' ){
					nood.addClass("hidden");
				} else if(o.orderStatus == '-1'){
					btn.html("删除").addClass("del");
				}
				
				
			},
		},
		eventHandle : {
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
    	}else if (pub.module_id == "orderDetails"){
    		pub.orderDetails.init();
			pub.orderDetails.eventHandle.init();
    	}
		pub.eventHandle.init();
	};
	module.exports = pub;
})