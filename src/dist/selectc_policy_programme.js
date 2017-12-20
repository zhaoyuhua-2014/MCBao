
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
	
	//选择投保方案页面
	pub.selectcPolicy = {
		init:function(){
			require("swiper");
			require("swiperCSS");
			
			
		},
		eventHandle : {
			init:function(){
				/*跳转修改保单*/
				$(".selectc_policy_swiper_wrap").on("click",".edit",function(){
					window.location.href = "edit_policy_programme.html"
				});
				/*确定跳转到询价页面*/
				$(".submit_btn90").on("click",function(){
					
					common.jumpLinkPlain("../html/new_insurance_price.html")
				})
				var banner = new Swiper(".selectc_policy_box",{
					autoHeight: true, //高度随内容变化
					pagination : '.swiper-pagination',
				})
			}
		}
	}
	//修改投保方案页面
	pub.editPolicy = {
		init:function(){
			require("Picker");
			require("PickerCss");
			pub.editPolicy.selectInit();
		},
		selectInit : function(){
			var arr = ['投保',"不投保"];
			//交强险
			"Compulsory_Traffic_Accident_Liability_Insurance"
			pub.editPolicy.picker1 = new myPicker({
				cols: arr,
				title:"请选择交强险",
				fontSize:18,
				onOkClick: function (values) {},
			})
			//车船税
			"vehicle_and_vessel_tax"
			pub.editPolicy.picker2 = new myPicker({
				cols: ['代缴',"不代缴"],
				title:"请选择车船税",
				fontSize:18,
				onOkClick: function (values) {},
			})
			//机动车损失险
			"motor_vehicle_loss_insurance"
			pub.editPolicy.picker3 = new myPicker({
				cols: arr,
				title:"请选择机动车损失险",
				fontSize:18,
				onOkClick: function (values) {},
			})
			//第三方责任险
			"Third_party_liability_insurance"
			pub.editPolicy.picker4 = new myPicker({
				cols: ['1万','2万','5万','10万','20万','50万','100万','150万','200万','300万','500万'],
				title:"请选择第三方责任险",
				fontSize:18,
				onOkClick: function (values) {},
			})
			//司机责任险
			"Driver_liability_insurance"
			pub.editPolicy.picker5 = new myPicker({
				cols: ['1万','2万','5万','10万','20万','50万','100万'],
				title:"请选择司机责任险",
				fontSize:18,
				onOkClick: function (values) {},
			})
			//乘客责任险
			"Passenger_liability_insurance"
			pub.editPolicy.picker6 = new myPicker({
				cols: ['1万','2万','5万','10万','20万','50万'],
				title:"请选择乘客责任险",
				fontSize:18,
				onOkClick: function (values) {},
			})
			//强盗险
			"Robber_risk_insurance"
			pub.editPolicy.picker7 = new myPicker({
				cols: arr,
				title:"请选择强盗险",
				fontSize:18,
				onOkClick: function (values) {},
			})
			//涉水险
			"Wading_insurance"
			pub.editPolicy.picker8 = new myPicker({
				cols: arr,
				title:"请选择强盗险",
				fontSize:18,
				onOkClick: function (values) {},
			})
			//人身意外伤害险
			"Personal_accident_injury_insurance"
			pub.editPolicy.picker9 = new myPicker({
				cols: arr,
				title:"请选择人身意外伤害险",
				fontSize:18,
				onOkClick: function (values) {},
			})
			//驾乘险
			"Driving_risk_insurance"
			pub.editPolicy.picker10 = new myPicker({
				cols: arr,
				title:"请选择驾乘险",
				fontSize:18,
				onOkClick: function (values) {},
			})
		},
		eventHandle : {
			init:function(){
				//不计免赔选择事件
				console.log("1")
				$(".edit_policy_programme_box_item").on("click",".edit_policy_programme_item .center",function(){
					var nood = $(this);
					if (nood.is(".actived")) {
						nood.removeClass("actived")
					}else{
						nood.addClass("actived");
					}
				});
				
				//交强险
				"Compulsory_Traffic_Accident_Liability_Insurance"
				$(".edit_policy_programme_box_item").on("click",".Compulsory_Traffic_Accident_Liability_Insurance .right.icon",function(){
					var nood = $(this);
					pub.editPolicy.picker1.show();
				});
				//车船税
				"vehicle_and_vessel_tax"
				$(".edit_policy_programme_box_item").on("click",".vehicle_and_vessel_tax .right.icon",function(){
					var nood = $(this);
					pub.editPolicy.picker2.show();
				});
				//机动车损失险
				"motor_vehicle_loss_insurance"
				$(".edit_policy_programme_box_item").on("click",".motor_vehicle_loss_insurance .right.icon",function(){
					var nood = $(this);
					pub.editPolicy.picker3.show();
				});
				//第三方责任险
				"Third_party_liability_insurance"
				$(".edit_policy_programme_box_item").on("click",".Third_party_liability_insurance .right.icon",function(){
					var nood = $(this);
					pub.editPolicy.picker4.show();
				});
				//司机责任险
				"Driver_liability_insurance"
				$(".edit_policy_programme_box_item").on("click",".Driver_liability_insurance .right.icon",function(){
					var nood = $(this);
					pub.editPolicy.picker5.show();
				});
				//乘客责任险
				"Passenger_liability_insurance"
				$(".edit_policy_programme_box_item").on("click",".Passenger_liability_insurance .right.icon",function(){
					var nood = $(this);
					pub.editPolicy.picker6.show();
				});
				//强盗险
				"Robber_risk_insurance"
				$(".edit_policy_programme_box_item").on("click",".Robber_risk_insurance .right.icon",function(){
					var nood = $(this);
					pub.editPolicy.picker7.show();
				});
				//涉水险
				"Wading_insurance"
				$(".edit_policy_programme_box_item").on("click",".Wading_insurance .right.icon",function(){
					var nood = $(this);
					pub.editPolicy.picker8.show();
				});
				//人身意外伤害险
				"Personal_accident_injury_insurance"
				$(".edit_policy_programme_box_item").on("click",".Personal_accident_injury_insurance .right.icon",function(){
					var nood = $(this);
					pub.editPolicy.picker9.show();
				});
				//驾乘险
				"Driving_risk_insurance"
				$(".edit_policy_programme_box_item").on("click",".Driving_risk_insurance .right.icon",function(){
					var nood = $(this);
					pub.editPolicy.picker10.show();
				});
				
				$(".submit_btn90").on("click",function(){
					var options = {
						
					}
					common.jumpLinkPlain("../html/new_insurance_price.html")
				})
			}
		}
	}
	//保单新的报价列表
	pub.policyNewInsurancePrice = {
		init:function(){
			
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
		if (pub.module_id == "selectcPolicy") {
    		pub.selectcPolicy.init()
			pub.selectcPolicy.eventHandle.init();
    	}else if (pub.module_id == "editPolicy"){
    		pub.editPolicy.init()
			pub.editPolicy.eventHandle.init();
    	}else if (pub.module_id == "policyNewInsurancePrice"){
    		pub.policyNewInsurancePrice.init()
			pub.policyNewInsurancePrice.eventHandle.init();
    	}
		pub.eventHandle.init();
	};
	module.exports = pub;
})