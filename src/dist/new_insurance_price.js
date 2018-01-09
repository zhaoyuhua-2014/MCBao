
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
	pub.options = {};
	
	pub.options.policyData ={
		
	}
	//保单新的报价列表
	pub.policyNewInsurancePrice = {
		init:function(){
			pub.tempCarInfo = JSON.parse(localStorage.getItem("tempCarInfo"));
			pub.policyNewInsurancePrice.insurance_com_query.init();
			pub.policyNewInsurancePrice.insurance_map_query.init();
		},
		insurance_com_query:{
			init: function(o) {
				common.ajaxPost({
					method: 'insurance_com_query',
				}, function(d) {
					d.statusCode == "100000" && pub.policyNewInsurancePrice.insurance_com_query.apiData(d);
					d.statusCode != "100000" && common.prompt(d.statusStr)
				});
			},
			apiData: function(d) {
				var o = d.data,html = '';
				
			}
		},
		insurance_map_query:{
			init: function(o) {
				common.ajaxPost($.extend({
					method: 'insurance_map_query',
				},pub.userBasicParam), function(d) {
					d.statusCode == "100000" && pub.policyNewInsurancePrice.insurance_map_query.apiData(d);
					d.statusCode != "100000" && common.prompt(d.statusStr)
				});
			},
			apiData: function(d) {
				var o = d.data,html = '';
				
			}
		},
		eventHandle : {
			init:function(){
				/*点击选择保险公司*/
				$(".new_insurance_price_box").on("click",".garage_car_item",function(){
					var nood = $(this);
					if (!nood.is(".actived")) {
						$(this).addClass("actived").siblings().removeClass("actived")
					}
				});
				/*确定跳转到询价页面--或者提示人工询价*/
				$(".submit_btn90").on("click",function(){
					window.location.href = "payment.html";
				});
			}
		}
	}
	//分期付款页面--生成分期订单
	pub.payment = {
		init:function(){
			
			 
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
					rebackDate:"23",//每月还款日期
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.payment.order_insurance_submit.apiData( d );
					d.statusCode != "100000" && common.prompt(d.statusStr);
				});
			},
			apiData:function(){
				
			}
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
		if (pub.module_id == "policyNewInsurancePrice"){
    		pub.policyNewInsurancePrice.init()
			pub.policyNewInsurancePrice.eventHandle.init();
    	}else if (pub.module_id == "payment") {
    		pub.payment.init()
			pub.payment.eventHandle.init();
    	} 
		pub.eventHandle.init();
	};
	module.exports = pub;
})