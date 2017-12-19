
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
			//pub.installment.installment_rcd_show.init();
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
			apiData:function( d ){
				var o = d.data,html = "";
				if (o.length == 0) {
					
				}else{
					for (var i in o) {
						
					}
				}
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
			apiData:function( d ){
				require("LayerCss");
				require("LayerJs");
				$(".stages_boxs").addClass("hidden");
				$(".stages_payment").removeClass("hidden");
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
					rcdId:"1",
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
		eventHandle : {
			init:function(){
				$(".pay_box").css("bottom", -$(".pay_box").height())
				$(".stages_list_box").on("click",".garage_car_item",function(){
					var nood = $(this);
					if (!nood.is(".actived")) {
						nood.addClass("actived").siblings().removeClass("actived");
					}
					$("#foot").attr("data",nood.attr("dataId"))
				});
				$("#foot").on("click",".submit_btn90",function(){
					var nood = $(this).parent();
					var id = nood.attr("data");
					pub.installment.installment_rcd_show.init();
					
				});
				
				//点击还款按钮弹出选择支付的方式
				$(".stages_payment").on("click",".submit_btn90",function(){
					$("#mask").addClass("actived");
					$(".pay_box").removeClass("hidden").animate({"bottom":"0px"})
				})
				$(".pay_box").on("click",".payment_submit",function(){
					var nood = $(this).parent();
					if (!nood.is(".hidden")) {
						//调用支付函数
						console.log("调用支付函数")
					}
				})
				//点击遮罩隐藏
				$("#mask").on("click",function(){
					var nood = $(this);
					if (nood.is(".actived")) {
						$(".pay_box").animate({
							'bottom': -$(".pay_box").height()
						},function(){
							$(".pay_box").addClass("hidden");
							$("#mask").removeClass("actived");
						})
					}
				})
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
		//设置高度
		var 
		wh = document.documentElement.clientHeight,
		emH = $(".empty").height(),
		emptyH = $('.empty').height() + $('.submit_btn90').height();
		$('.stages_boxs').height( wh - emH - 20 );
		$(".stages_list_box").height(wh -emptyH - 20)
		
		pub.installment.init();
		pub.installment.eventHandle.init();
		pub.eventHandle.init();
	};
	module.exports = pub;
})