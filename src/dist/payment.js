
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
	
	pub.options = {
		
	}
	//付款页面
	pub.payment = {
		init:function(){
			
		},
		
		eventHandle : {
			init:function(){
				/*点击选择分期方式*/
				$(".pay_item_boxs").on("click",".pay_way_item",function(){
					var nood = $(this);
					if (!nood.is(".actived")) {
						$(this).addClass("actived").siblings().removeClass("actived")
					}
				})
				$(".car_staging_box_agreement .icon").on("click",function(){
					if ($(this).is(".actived")) {
						$(this).removeClass("actived");
					}else{
						 $(this).addClass("actived");
					}
				});
				/*点击确定到在线支付页面*/
				$(".submit_btn90").on("click",function(){
					window.location.href = "line_payment.html";
				});
				
			},
		}
	}
	//在线支付
	pub.linePayment = {
		init:function(){
			pub.openId = common.openId.getItem();
			pub.options.orderCode = common.getUrlParam("orderCode");
			pub.options.orderData = JSON.parse(localStorage.getItem("orderData"));
			pub.linePayment.order_details.init();
			
			//pub.linePayment.order_insurance_submit.init();
		},
		order_details:{
			init:function(){
				common.ajaxPost($.extend({
					method:'order_details',
					orderCode:pub.options.orderCode,
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.linePayment.order_details.apiData( d );
					d.statusCode != "100000" && common.prompt(d.statusStr);
				});
			},
			apiData:function(d){
				var o = d.data.orderInfo,c = d.data.couponlist;
				pub.options.orderInfo = o;
				pub.options.couponlist = c;
				pub.options.pageType = o.orderType;
				pub.linePayment.htmlInit();
			}
		},
		htmlInit:function(){
			if (pub.options.pageType == 4) {
				var o = pub.options.orderInfo,c = pub.options.couponlist,d = o.details[0],
					nood = $(".carDeposit.line_pay_top");
				
				nood.find(".line_pay_ .line_pay_item").eq(0).find(".color_9e").html(o.orderCode);
				nood.find(".line_pay_ .line_pay_item").eq(1).find(".color_9e").html(o.realPayMoney);
				
				nood.find('.lin_pay_packet .float_right.icon').html(c.length + "张可用");
				
				nood.find(".line_pay_subtotal .float_right .color_e82b21").html((o.realPayMoney ? "￥"+ o.realPayMoney : ""))
				
			}
		},
		goto_pay_weixin : {
			init:function(){
				common.ajaxPost($.extend({
					method:"goto_pay_weixin",
					orderCode:pub.options.orderCode,
					couponId:pub.couponId,
					notifyUrl:common.API,
					openId:pub.openId,
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.linePayment.goto_pay_weixin.apiData( d );
					d.statusCode != "100000" && common.prompt(d.statusStr);
				});
			},
			apiData:function(data){
			
				//获取PrepayId
				//调用微信支付JSAPI
				var result = data.data;
				var prepayId = result.prepayId;
				var nonceStr = result.nonceStr;
				var timeStamp = result.timeStamp;
				var packages = result.package;//"prepay_id="+prepayId;
				var paySign = result.paySign;
				var appId = result.appId;
				var signType = result.signType;
				var configSign = result.configSign;
				var timestamp = result.timestamp;
				var noncestr = result.noncestr;						
			   	wx.config({
				    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
				    appId: appId, // 必填，公众号的唯一标识
				    timestamp:timestamp, // 必填，生成签名的时间戳
				    nonceStr: noncestr, // 必填，生成签名的随机串
				    signature: configSign,// 必填，签名，见附录1
				    jsApiList: ["chooseWXPay"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
				});
			    wx.ready(function(){
			    	wx.chooseWXPay({
			    	    timestamp: timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
			    	    nonceStr: nonceStr, // 支付签名随机串，不长于 32 位
			    	    package: packages, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
			    	    signType: signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
			    	    paySign: paySign, // 支付签名
			    	    success: function (res) {
			    	        //支付成功后的回调函数
			    	        common.jumpLinkPlain("../html/pay_result.html?type="+pub.options.pageType)
							
			    	    },
			    	    cancel:function(res){  
					        common.prompt("取消支付");
					    }  
			    	})
			    });
			}
		},
		order_insurance_submit:{
			init:function(){
				common.ajaxPost($.extend({
					method:'order_insurance_submit',
					websiteNode:"3301",//站点编号
					goodsMoney:"8000",//物品金额
					postCost:"666",//运费
					commercialPremium:"2000",//商业保险金额
					strongPremium:"2000",//交强险金额
					personalAccidentPremium:"2000",//个人险金额
					totalPremium:"8000",//保险总金额
					isGuohu:"1",//是否一年内过户
					guohuDate:"2017-10-01",//过户时间
					commercialInsuranceCompany:"TPY",//商业保险公司简称
					insuranceTypeOne:"one",//保险明细内容1
					insuranceTypeTwenty:"twenty",//保险明细内容20
					
					isFenqi:"1",//是否分期
					fenqiCount:"10",//分期期数
					eachRebackMoney:"800",//每期还款金额
					loanMoney:"0",//贷款金额
					rebackDate:"23",//每月返款日期
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.myPolicy.insurance_bill_show.apiData( d );
					d.statusCode != "100000" && common.prompt(d.statusStr);
				});
			},
			apiData:function(){
				
			}
		},
		
		eventHandle : {
			init:function(){
				$(".submit_btn90").on("click",function(){
					pub.couponId = $(".lin_pay_packet").attr("data") || "";
					if (pub.options.pageType == 4) {
						pub.linePayment.goto_pay_weixin.init();
					}
				})
				$(".lin_pay_packet").on("click",".float_right.icon",function(){
					common.jumpLinkPlain("../html/red_packet.html")
				})
			}
		}
	}
	//支付结果
	pub.payResult = {
		init:function(){
			pub.type = common.getUrlParam("type");
			pub.payResult.htmlInit.init(1);
			/*var status = prompt("输入对应的状态？\n 0表示支付失败;\n 1表示支付成功");
				if (status != 0 && status != 1) {
					alert("status is error")
				}else{
					
				}*/
		},
		htmlInit:{
			init:function(d){
				var arrTitle = ["支付失败","支付成功"];
				var arrUrl = "../html/my.html";
				var arrStatus = ["fail","success"]
				var arrInfoText = ["联系官方客服：<a href=''>400-4576-8888</a>","*根据保险公司规定您还未上传身份证及行驶证正副本，信息仅用于投保，我们将严格为你保密。<a href=''>继续完善信息</a>"]
				var nood = $(".pay_result_box");
				$(".header_title").html(arrTitle[d]);
				nood.addClass(arrStatus[d]).end().find(".pay_result_txt").html(arrTitle[d]).end().find(".pay_result_info").html(arrInfoText[d]);
			}
		},
		eventHandle : {
			init:function(){
				$(".right_text").on("click",function(){
					common.jumpLinkPlain("../html/my.html")
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
		if (pub.module_id == "payment") {
    		pub.payment.init()
			pub.payment.eventHandle.init();
    	}else if (pub.module_id == "linePayment"){
    		pub.linePayment.init()
			pub.linePayment.eventHandle.init();
    	}else if (pub.module_id == "payResult"){
    		pub.payResult.init()
			pub.payResult.eventHandle.init();
    	}
		pub.eventHandle.init();
	};
	module.exports = pub;
})