
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
			pub.carInsuranceStaging.dataInit();
			pub.carInsuranceStaging.carOwnerInit.init();
			pub.carInsuranceStaging.timeInit.init();
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
			        $("#addValue").val(values)
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
    	eventHandle:{
    		init:function(){
    			$(".transfer_car .float_right").on("click",function(){
					if ($(this).is(".actived")) {
						$(this).removeClass("actived");
						$(".transfer_time").hide();
					}else{
					 	$(this).addClass("actived");
					 	$(".transfer_time").show();
					}
				})
				$(".car_staging_box_agreement .icon").on("click",function(){
					if ($(this).is(".actived")) {
						$(this).removeClass("actived");
					}else{
						 $(this).addClass("actived");
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
				})
				$(".car_class_box").on("click",".car_class_item",function(){
					var nood = $(this);
					if (!nood.is(".actived")) {
						nood.addClass("actived").siblings().removeClass("actived");
					}
				})
				$(".submit_btn90").on("click",function(){
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
		},
		eventHandle : {
			init : function(){
				$("#example8").on("click",function(e){
					pub.picker8.show();
				});
				$(".submit_btn90").on("click",function(){
					window.location.href = "selectc_policy_programme.html"
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