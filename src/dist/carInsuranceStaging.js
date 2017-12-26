
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
	
	
	pub.carInsuranceStaging = {
		init:function(){
			require('LAreaData');
			require ("Picker");
			require("swiper");
			require("swiperCSS");
			var carInfo = localStorage.getItem("carInfo_1");
			
			if (carInfo) {
				carInfo = JSON.parse(carInfo);
				
				pub.carInsuranceStaging.htmlInit(carInfo)
			}
			pub.carInsuranceStaging.dataInit();//投保城市初始化
			pub.carInsuranceStaging.carOwnerInit.init();//车所有者初始化
			pub.carInsuranceStaging.timeInit.init();//时间初始化
			pub.carInsuranceStaging.cityShortInit.init();//车牌选择和号码初始化
		
			pub.carInsuranceStaging.ads_show.init();
		},
		htmlInit:function(d){
			var nood = $(".car_staging_box");
			console.log(d.car_person)
			if (d.selectAddress && d.addValue) {//投保城市信息
				nood.find("#selectAddress").val(d.selectAddress).end;
				nood.find("#addValue").val(d.addValue);
			}
			if(d.car_person){//车主姓名
				nood.find("#car_person").val(d.car_person);
			}
			if(d.car_province){//车牌号省
				nood.find(".car_province").html(d.car_province).attr("data",d.car_province);
			}
			if(d.car_Letter){//车牌号字母
				nood.find(".car_Letter").html(d.car_Letter).attr("data",d.car_Letter);
			}
			if(d.car_NO){//车牌号
				nood.find(".car_number").val(d.car_NO)
			}
			if(d.is_Transfer){//是否过户车
				nood.find(".transfer_car .float_right").addClass("actived");
				nood.find("#example8").val(d.transfer_time)
				nood.find(".transfer_time").show();
			};
			
		},
		getIndex:function(d){
    		//初始化数据
    		var n = [],m = 0;
    		var data = LAreaData;
    		return recursion(data);
    	 	function recursion(data){
    			if (data instanceof Array) {
    				for(var i in data){
    					if (data[i].code == d[m]) {
    						n[m] = i;
    						m+=1;
    						recursion(data[i].cities)
    					}
    				}
    				return n;
    			}
    		};
    	},
    	getValue:function(d){
    		//初始化数据
    		var n = [],m = 0;
    		var data = LAreaData;
    		n[0] = data[d[0]].code;
    		n[1] = data[d[0]].cities[d[1]].code;
    		n[2] = data[d[0]].cities[d[1]].cities[d[2]].code;
    		return n;
    	},
    	getText:function(d){
    		//初始化数据
    		var n = [],m = 0;
    		var data = LAreaData;
    		
    		return recursion(data);
    	 	function recursion(data){
    			if (data instanceof Array) {
    				for(var i in data){
    					if (data[i].code == d[m]) {
    						n[m] = data[i].name;
    						m+=1;
    						
    						recursion(data[i].cities)
    					}
    				}
    				return n;
    			}
    		};
    	},
    	dataInit:function(m){
    		//c表示索引的数组,d表述code的数组
    		var c = [0,0,0],d = m;
    		//城市数据
    		var data = LAreaData;
    		if(m){
    			c = pub.carInsuranceStaging.getIndex(m)
    		}else{
    			d = pub.carInsuranceStaging.getValue(c);
    		}
    		//省市县的index
    		var indexArr = [0,0,0];
    		//省市县文字
    		//var textArr = [];
    		
    		pub.picker1 = new myPicker({
			    cols: [{
			    	options:data,
			    	labelKey: 'name',
			        valueKey: 'code',
			    },{
			    	options:data[c[0]].cities,
			    	labelKey: 'name',
			        valueKey: 'code',
			    }],
			    title: "请选择地址",
			    onOkClick: function (values) {
			        $("#addValue").val(values);
			        $("#selectAddress").val(pub.carInsuranceStaging.getText(values));
			    },
			    fontSize:18,
			    setValues: d,//LAreaData[0].name,LAreaData[0].cities[0].name,LAreaData[0].cities[0].cities[0].name
			    onSelectItem: function (i, index, value) {
					indexArr[i] = index;
					var f = data[indexArr[0]];
					if(i == 0){
			      		this.setOptions(1, f.cities);
			      		this.setOptions(2, f.cities[0].cities);
			      	}
			      	if (i == 1) {
			      		this.setOptions(2, f.cities[indexArr[1]].cities);
			      	}
			    }
			});
    	},
    	carOwnerInit:{
    		init:function(){
    			pub.picker2 = new myPicker({
    				cols: ['公司',"个人"],
    				title:"请选择车辆所有者",
    				fontSize:18,
    				onOkClick: function (values) {
				    	$("#carOwner").val(values[0])
				    	//console.log(this.Symbol());
				    	//var arr = pub.picker2.getOptions(0)
				    	console.log();
				    	var nood = $("[data-index]");
				    	console.log(nood)
				    	if (values[0] == "个人") {
				    		nood.eq(0).show().end().eq(1).hide();
				    	} else if (values[0] == "公司"){
				    		nood.eq(1).show().end().eq(0).hide();
				    	}
				    },
				    onSelectItem: function (i, index, value) {
				    	
				    }/*
				    cols: ['java', 'c#', 'JavaScript', 'php', 'Python'],
				    title: "请选择你喜欢的编程语言",
				    onOkClick: function (values) {
				        document.querySelector('#example1').textContent = (values[0]);
				    },*/
				})
    		}
    	},
    	timeInit:{
    		init:function(){
    			var year = [];
				var today = new Date();
				var year_n = today.getFullYear();
				for (var i = 2000; i <= year_n; i++) {
				    year.push(i);
				}
				var month = [];
				for (var i = 1; i <= 12; i++) {
				    month.push(i);
				}
				pub.picker8 = new myPicker({
				    cols: [{
				        options: year,
				        suffix: "年",
				    }, {
				        options: month,
				        suffix: "月",
				    }, {
				        options: [],
				        suffix: "日",
				    },],
				    title:'请选择过户日期',
				    onOkClick: function (values) {
				    	var str = values[0] + "年" + values[1] + "月" + values[2] + "日";
				        $('#example8').val(str)
				    },
				    setValues: [today.getFullYear(), today.getMonth() + 1, today.getDate()],
				    onSelectItem: function (i, index, value) {
				        if (i != 2) {
				            var year = this.getValue(0);
				            var month = this.getValue(1);
							
				            if (year == null || month == null)
				                return
				
				            var curDate = new Date();
				            curDate.setYear(year);
				            
				            if (year == today.getFullYear()) {
				            	var months = [];
				            	for (var i = 1; i <= today.getMonth() + 1; i++) {
					                months.push(i);
					            };
					            this.setOptions(1, months);
				            }else{
				            	var months = [];
				            	for (var i = 1; i <= 12; i++) {
								    months.push(i);
								}
				            	this.setOptions(1, months);
				            }
				            curDate.setMonth(month);
				            curDate.setDate(0);
				
				            var day = [];
				            if (year == today.getFullYear() && month == today.getMonth()+1) {
				            	for (var i = 1; i <= today.getDate(); i++) {
					                day.push(i);
					            }
				            }else{
				            	for (var i = 1; i <= curDate.getDate(); i++) {
					                day.push(i);
					            }
				            }
				            this.setOptions(2, day);
				        }
				    }
				});
    		}
    	},
    	cityShortInit:{
    		init:function(){
    			var arr = ["京","津","冀","晋","蒙","辽","吉","黑","沪","苏","浙","皖","闽","赣","鲁","豫","鄂","湘","粤","桂","琼","渝","川","贵","云","藏","陕","甘","青","宁","新"]
				//console.log(arr.length);
				var arr1 = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]
				//console.log(arr1.length);
    			pub.picker3 = new myPicker({
    				cols: arr,
				    title: "请选择",
				    onOkClick: function (values) {
				        $(".car_province").html(values[0]).attr("data",values[0])
				    },
    			});
    			pub.picker4 = new myPicker({
				    cols: arr1,
				    title: "请选择",
				    onOkClick: function (values) {
				        $(".car_Letter").html(values[0]).attr("data",values[0]);
				    },
				})
    		}
    	},//app_insurance  车险分期
    	ads_show: {
			init:function(){
				common.ajaxPost($.extend({
					method:'ads_show',
					websiteNode:common.WebsiteNode,
					adPositions:"app_insurance",//app_home-app_goods-app_insurance-车险分期
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.carInsuranceStaging.ads_show.apiData( d );
					d.statusCode != "100000" && common.prompt(d.statusStr);
				});
			},
			apiData:function(d){
				var o = d.data,html = '';
				for (var i in o) {
					html += '<div class="swiper-slide"><img src="'+o[i].adPic+'"/></div>'
				}
				$(".banner_wrap .index_banner .swiper-wrapper").html(html);
				var swiper = new Swiper (".index_banner", {
				    direction: 'horizontal',
				    loop: true,
				    autoplay:5000,
				});
			}
		},
    	eventHandle:{
    		init:function(){
    			
    			$(".transfer_car .float_right").on("click",function(){
					if ($(this).is(".actived")) {
						$(this).removeClass("actived");
						$(".transfer_time").hide(500);
					}else{
					 	$(this).addClass("actived");
					 	$(".transfer_time").show(500);
					}
				})
				$(".car_staging_box_agreement .icon").on("click",function(){
					if ($(this).is(".actived")) {
						$(this).removeClass("actived");
						$(".submit_btn90").addClass("submit_isnot")
					}else{
						 $(this).addClass("actived");
						 $(".submit_btn90").removeClass("submit_isnot")
					}
				});
				$("#selectAddress").on("click",function(e){
					pub.picker1.show();
				});
				$("#carOwner").on("click",function(){
					pub.picker2.show();
				})
				$("#example8").on("click",function(e){
					pub.picker8.show();
				});
				
				$("#selectAddress,#example8,#carOwner").on("focus",function(){
					$(this).blur();
				});
				$(".car_province").on("click",function(){
					pub.picker3.show();
				})
				$(".car_Letter").on("click",function(){
					pub.picker4.show();
				})
				/*$(".car_class_box").on("click",".car_class_item",function(){
					var nood = $(this);
					if (!nood.is(".actived")) {
						nood.addClass("actived").siblings().removeClass("actived");
					}
				})*/
				$(".submit_btn90").on("click",function(){
					if($(this).is(".submit_isnot")){
						return;
					}
					var selectAddress = $("#selectAddress").val(),//投保城市
						addValue = $("#addValue").val(),//投保城市的code
						car_person = $("#car_person").val(),//车主姓名
						car_province = $(".car_province").attr("data"),//车牌号省简称
						car_Letter = $(".car_Letter").attr("data"),//车前面的字母
						car_NO = $(".car_number").val(),//车后面五位
						is_Transfer = $(".transfer_car .float_right").is(".actived"),//是否是过户车
						transfer_time = $("#example8").val();//注册时间
					//数据验证
					if (addValue == "") {
						common.prompt("请选择投保城市");
						return;
					}else if(car_person == ""){
						common.prompt("请输入车主姓名");
						return;
					}else if(car_province == ""){
						common.prompt("请选择车省简称");
						return;
					}else if(car_Letter == ""){
						common.prompt("请选择车省简称字母");
						return;
					}else if(car_NO == ""){
						common.prompt("请输入车牌号");
						return;
					}else if(car_NO.length != 5){
						common.prompt("请正确的车牌号");
						return;
					}else if(!common.REG_Num_Letter.test(car_NO)){
						common.prompt("请正确的车牌号");
						return;
					}else if(is_Transfer == true){
						if (transfer_time == "") {
							common.prompt("请选择过户时间");
							return;
						}
					};
					
					
					//保存原始数据
					var carInfo = {
						selectAddress : selectAddress,//投保城市
						addValue : addValue,//投保城市的code
						car_person : car_person,//车主姓名
						car_province : car_province,//车牌号省简称
						car_Letter : car_Letter,//车前面的字母
						car_NO : car_NO,//车后面五位
						is_Transfer :is_Transfer,//是否是过户车
						transfer_time : transfer_time,//注册时间
					};
					//本地保存数据
					localStorage.setItem("carInfo_1",JSON.stringify(carInfo));
					var options = {
						
					}
					window.location.href = "car_info1.html"
				})
				
    		}
    	}
	}
	//车辆信息
	pub.carInfo1 = {
		init:function(){
			require ("Picker");
			require("PickerCss")
			pub.carInsuranceStaging.timeInit.init();
			var carInfo = localStorage.getItem("carInfo_1");
			var carInfo2 = localStorage.getItem("carInfo_2");
			var result = {}
			if (carInfo && carInfo2) {
				carInfo = JSON.parse(carInfo);
				carInfo2 = JSON.parse(carInfo2);
				result = $.extend({},carInfo, carInfo2);
				pub.carInfo1.htmlInit(result)
			}else if (carInfo){
				carInfo = JSON.parse(carInfo);
				result = carInfo;
				pub.carInfo1.htmlInit(result)
			}else if (carInfo2){
				carInfo2 = JSON.parse(carInfo2);
				result = carInfo2;
				pub.carInfo1.htmlInit(result)
			}
		},
		htmlInit:function(d){
			var nood = $(".car_info_box");
			console.log(d)
			if(d.car_person){//车主姓名
				nood.find("#car_person").val(d.car_person).attr("disabled","disabled");
			}
			if(d.car_person_number){//车主身份证号
				nood.find("#car_person_number").val(d.car_person_number);
			}
			if(d.car_province && d.car_Letter  && d.car_NO){//车牌号
				nood.find("#car_number").val(d.car_province + d.car_Letter + d.car_NO);
			}
			if (d.car_brand && d.carBrandCode) {//车品牌型号
				nood.find("#car_brand").val(d.car_brand);
				nood.find("#carBrandCode").val(d.carBrandCode);
			}
			if (d.car_Identification_code ) {//17位识别码
				nood.find("#car_Identification_code").val(d.car_Identification_code);
			}
			if (d.car_engine_number) {//车发动机号
				nood.find("#car_engine_number").val(d.car_engine_number);
			}
			if (d.car_regsiter_time) {//车注册时间
				nood.find(".car_regsiter_time").val(d.car_regsiter_time);
			}
		},
		eventHandle : {
			init : function(){
				//节点缓存
				var nood_mask = $("#mask"),
					nood_alert_box = $(".alert_car_img_box"),
					nood_car_msg = $(".car_info_msg .float_right");
				$("#example8").on("click",function(e){
					pub.picker8.show();
				});
				$(".submit_btn90").on("click",function(){
					var car_person = $("#car_person").val(),
						car_person_number = $("#car_person_number").val(),
						car_number = $("#car_number").val(),
						car_brand = $("#car_brand").val(),
						carBrandCode ="1" ,//$("#carBrandCode").val()
						car_Identification_code = $("#car_Identification_code").val(),
						car_engine_number = $("#car_engine_number").val(),
						car_regsiter_time =$(".car_regsiter_time").val();
					if(car_person == ""){
						common.prompt("请输入车主姓名");
						return;
					}else if(car_person_number == ''){
						common.prompt("请输入身份证号");
						return;
					}else if(!common.ID_CARD_REG.test(car_person_number)){
						common.prompt("请输入正确的身份证号");
						return;
					}else if(carBrandCode == ''){
						common.prompt("请选择车品牌型号");
						return;
					}else if(car_Identification_code.length != 17 ){
						common.prompt("请输入17位的车辆识别码");
						return;
					}else if (!common.REG_Num_Letter.test(car_Identification_code)){
						common.prompt("请输入正确的车辆识别码");
						return;
					}else if(car_engine_number == '' || !common.REG_Num_Letter.test(car_engine_number)){
						common.prompt("请输入正确的发动机号");
						return;
					}else if(car_regsiter_time == ''){
						common.prompt("请选择注册时间");
						return;
					}
					//保存一份原始数据；
					var carInfo2 = {
						car_person : car_person,//车主姓名
						car_person_number : car_person_number,//车主身份证号码
						car_number : car_number,//车牌号
						car_brand : car_brand,//车品牌型号
						carBrandCode : carBrandCode,//车品牌型号编码
						car_Identification_code : car_Identification_code,//车识别码
						car_engine_number : car_engine_number,//车发动机号
						car_regsiter_time : car_regsiter_time,//车注册日期
					}
					//本地保存数据
					localStorage.setItem("carInfo_2",JSON.stringify(carInfo2));
					
					var options1 = {
						"carNo"	: "",//车牌号，后5位
						"carNoCity"	: "", //车牌号，代表城市的字母
						"carNoProvince"	: "",// 车牌号，省份简称
					};
					var options2 = {
						"carId" : "",//如果是数据库已有的车，则直接传carId就可以了，其他车信息不用传。如果不是数据库的车，则carId=null，其他车信息全部都要传值
						
						"carBrandCode" : "", //汽车品牌代码
						"carBrand" : "",// 品牌名称
						"carBrandKind" : "",// 车型名称
						"carBrandKindCode" : "",// 车型代码
						
						"carType" : "",// 车类型
						
						"carVin" : "",// 车架号
						"engineNo" : "",// 发动机号
					}
					
					window.location.href = "selectc_policy_programme.html"
				});
				/*提示事件*/
				nood_car_msg.on("click",function(){
					nood_mask.addClass("actived");
					nood_alert_box.show()
				});
				nood_alert_box.on("click","span.color_re",function(){
					nood_mask.removeClass("actived");
					nood_alert_box.hide()
				})
				nood_mask.on("click",function(){
					nood_mask.removeClass("actived");
					nood_alert_box.hide()
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
		if (pub.module_id == "carInsuranceStaging"){
    		pub.carInsuranceStaging.init();
			pub.carInsuranceStaging.eventHandle.init();
    	}else if(pub.module_id == "carInfo1"){
    		pub.carInfo1.init();
    		pub.carInfo1.eventHandle.init();
    	}
		pub.eventHandle.init();
	};
	module.exports = pub;
})