
define(function(require, exports, module){
	
	var common = require('../dist/common');
	
	// 命名空间
	var pub = {};
	
	pub.module_id = $('[data-type]').attr('data-type');
    pub.logined = common.isLogin(); // 是否登录
    
	pub.local_websiteNode = common.websiteNode.getItem();//本地存储的websiteNode
	
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
		evaluation : JSON.parse(localStorage.getItem("evaluation")),
		imgUrlObj : JSON.parse(localStorage.getItem("imgUrlObj")),
	};
	
	pub.options.websiteNode = pub.local_websiteNode ? pub.local_websiteNode : common.WebsiteNode;
	//信用评估页面
	pub.creditEvaluation = {
		
		init : function(){
			require('LAreaData');
			require ("Picker");
			require ("PickerCss");
			pub.creditEvaluation.dataInit();
			pub.creditEvaluation.dataInit1();
			pub.creditEvaluation.BuyCarTime();
			//s数据的缓存显示
			var imgUrl = common.imgUrlObj.getItem();
			//console.log(imgUrl)
			
			if (imgUrl) {
				imgUrl = JSON.parse(imgUrl);
				if (imgUrl.user_a) {
					$(".user_a").attr("src",imgUrl.user_a)
				}
				if (imgUrl.user_b) {
					$(".user_b").attr("src",imgUrl.user_b)
				}
				if (imgUrl.partner_a) {
					$(".partner_a").attr("src",imgUrl.partner_a)
				}
				if (imgUrl.partner_b) {
					$(".partner_b").attr("src",imgUrl.partner_b)
				}
			}
			
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
    			c = pub.creditEvaluation.getIndex(m)
    		}else{
    			d = pub.creditEvaluation.getValue(c);
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
			    title: "请选择提车城市",
			    onOkClick: function (values) {
			    	$("#putCarCityValue").val(values);
					$("#putCarCity").val(pub.creditEvaluation.getText(values))
					
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
    	dataInit1:function(m){
    		//c表示索引的数组,d表述code的数组
    		var c = [0,0,0],d = m;
    		//城市数据
    		var data = LAreaData;
    		if(m){
    			c = pub.creditEvaluation.getIndex(m)
    		}else{
    			d = pub.creditEvaluation.getValue(c);
    		}
    		//省市县的index
    		var indexArr = [0,0,0];
    		//省市县文字
    		//var textArr = [];
    		
    		pub.picker2 = new myPicker({
			    cols: [{
			    	options:data,
			    	labelKey: 'name',
			        valueKey: 'code',
			    },{
			    	options:data[c[0]].cities,
			    	labelKey: 'name',
			        valueKey: 'code',
			    }],
			    title: "请选择上牌城市",
			    onOkClick: function (values) {
			    	$("#carBrandCityValue").val(values);
			        $("#carBrandCity").val(pub.creditEvaluation.getText(values))
			       
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
    	BuyCarTime:function(){
    		var year = [];
			var today = new Date();
			var year_n = today.getFullYear();
			for (var i = (year_n); i <= (year_n + 5); i++) {
			    year.push(i);
			}
			var month = [];
			for (var i = 1; i <= 12; i++) {
			    month.push(i);
			}
			var days = [];
			for (var i = today.getDate() ; i <= getCountDays() ; i++) {
				days.push(i)
			}
			pub.picker8 = new myPicker({
			    cols: [{
			        options: year,
			        suffix: "年",
			    }, {
			        options: month,
			        suffix: "月",
			    }, {
			        options: days,
			        suffix: "日",
			    },],
			    title:'请选择提车日期',
			    onOkClick: function (values) {
			    	var str = values[0] + "年" + values[1] + "月" + values[2] + "日";
			        $('#buycarDate').val(str);
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
			            	for (var i = today.getMonth() + 1; i <= 12; i++) {
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
			            	for (var i = today.getDate(); i <= curDate.getDate(); i++) {
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
			function getCountDays() {
		        var curDate = new Date();
		        /* 获取当前月份 */
		        var curMonth = curDate.getMonth();
		       /*  生成实际的月份: 由于curMonth会比实际月份小1, 故需加1 */
		       curDate.setMonth(curMonth + 1);
		       /* 将日期设置为0, 这里为什么要这样设置, 我不知道原因, 这是从网上学来的 */
		       curDate.setDate(0);
		       /* 返回当月的天数 */
		       return curDate.getDate();
			}
			//例如,  获取当前月份(现在是3月)的总天数: 
			//getCountDays()       // 返回31
    	},
		idcard_img_upload : {
			init:function(){
				
				common.ajaxPost($.extend({
					method:'idcard_img_upload',
					goodsId:"1"
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.creditEvaluation.idcard_img_upload.apiData( d );
				});
				
			},
			apiData:function( d ){
				
			}
		},
		credit_assess_rcd_add : {
			init:function(){
				common.ajaxPost($.extend({
					method:'credit_assess_rcd_add',/*
					belongUser : pub.userId,
					ownerFidPicUrl:'https://imgsa.baidu.com/exp/w=480/sign=c0e51c2574c6a7efb926a92ecdf8afe9/a9d3fd1f4134970a17baa9d597cad1c8a6865d7a.jpg',//自己身份证正面图片URL
					ownerBidPicUrl:'https://imgsa.baidu.com/exp/w=480/sign=c0e51c2574c6a7efb926a92ecdf8afe9/a9d3fd1f4134970a17baa9d597cad1c8a6865d7a.jpg',//自己身份证反面图片URL
					isSingle : '1',//是否单身
					spouseFidPicUrl : 'https://imgsa.baidu.com/exp/w=480/sign=c0e51c2574c6a7efb926a92ecdf8afe9/a9d3fd1f4134970a17baa9d597cad1c8a6865d7a.jpg',//夫妻身份证正面图片URL
					spouseBidPicUrl : 'https://imgsa.baidu.com/exp/w=480/sign=c0e51c2574c6a7efb926a92ecdf8afe9/a9d3fd1f4134970a17baa9d597cad1c8a6865d7a.jpg',//夫妻身份证反面图片URL
					
					buycarDate:'123',
					buycarCity:'浙江省，杭州市',//买车城市
					regcar_city:'浙江省，杭州市',
					carGoodId:'1',//车id
					carPrice:'100',//车price
					carDeposit:'123',
					brandName:'123',*/
					websiteNode:pub.options.websiteNode,
				}, pub.userBasicParam , pub.options.evaluation),function( d ){
					d.statusCode == "100000" && pub.creditEvaluation.credit_assess_rcd_add.apiData( d );
				});
				
			},
			apiData:function( d ){
				$(".alert_msg").removeClass("hidden");
				common.imgUrlObj.removeItem();
				localStorage.removeItem("evaluation");
			}
		},
		eventHandle : {
			init:function(){
				$(".radio_marry").on("click","span",function(){
					$(this).addClass("actived").siblings().removeClass("actived");
					$("input[name='marry']").val($(this).index())
					if ($(this).index()== 0) {
						!$(".updata_card_info.margin100").is(".hidden") && $(".updata_card_info.margin100").addClass("hidden")
					}else if ($(this).index()== 1) {
						$(".updata_card_info.margin100").is(".hidden") && $(".updata_card_info.margin100").removeClass("hidden")
					}
				});
				$("#putCarCity,#carBrandCity,#buycarDate").on("focus",function(){
					$(this).blur();
				})
				$("#buycarDate").on("click",function(){
					pub.picker8.show();
				})
				
				$("#putCarCity").on("click",function(){
					pub.picker1.show();
				})
				$("#carBrandCity").on("click",function(){
					pub.picker2.show();
				})
				
				$(".updata_card_info input").on("change",function(){
					require("imgUpload");
					//nood 自己 noodparent 父元素 
					var nodes = $(this);
					//imgType 的值11,12,21,22 
					//11,12表述自己的身份证正反面
					//21,22表述配偶的身份证正反面
					var imgObj = {
						"11":"user_a",
						"12":"user_b",
						"21":"partner_a",
						"22":"partner_b",
					};
					var imgType = nodes.attr("data");
					
					var tar = this,
					files = tar.files,
					file = files[0];
					if( !file ) return;
					var options = {
						"method":"idcard_img_upload",
			        	"userId" : pub.userId,
			        	"imgType":imgType,
			        	"tokenId":pub.tokenId,
					}
					var callBack = function(d){
						console.log(JSON.stringify(d))
						if( d.statusCode == "100000" ){
							nodes.parent().find("img").attr("src",d.data);
							/*将ImgUrl存储到本地*/
							var imgUrl = common.imgUrlObj.getItem(),o = {},r={};
							
							if (imgType == 11) {
								o = {"user_a":d.data}
							} else if (imgType == 12){
								o = {"user_b":d.data}
							} else if (imgType == 21){
								o = {"partner_a":d.data}
							} else if (imgType == 22){
								o = {"partner_b":d.data}
							}
							
							if (imgUrl) {
								r = $.extend({},JSON.parse(imgUrl),o);
							}else{
								r = o;
							}
							common.imgUrlObj.setItem(JSON.stringify(r));
						}else{
							common.prompt( d.statusCode );
						}
					}
					imgupload.init(files,common.API,options,callBack)
				})
				$(".submit_btn90").on("click",function(){
					var obj = {
						
						isSingle : $("input[name='marry']").val(),//是否单身
						
						buycarDate:$("#buycarDate").val(),//买车日期
						buycarCity:$("#putCarCity").val(),//提车城市
						regcar_city:$("#carBrandCity").val(),//上牌城市
						
						belongUser : pub.userId,
					};
					//输入信息验证
					if (!obj.buycarDate) {
						common.prompt("请选择提车日期");
						return;
					}else if(!obj.buycarCity){
						common.prompt("请选择期望提车城市");
						return;
					}else if(!obj.regcar_city){
						common.prompt("请输入期望上牌地");
						return;
					}
					pub.options.imgUrlObj = JSON.parse(localStorage.getItem("imgUrlObj"))
					
					if (!pub.options.imgUrlObj) {
						common.prompt("请上传身份证信息");
						return;
					}else if(!pub.options.imgUrlObj.user_a){
						common.prompt("请上传身份证正面信息");
						return;
					}else if(!pub.options.imgUrlObj.user_b){
						common.prompt("请上传身份证反面信息");
						return;
					}else if (obj.isSingle == '1'){
						if(!pub.options.imgUrlObj.partner_a){
							common.prompt("请上传伴侣身份证正面信息");
							return;
						}else if(!pub.options.imgUrlObj.partner_b){
							common.prompt("请上传伴侣身份证反面信息");
							return;
						}
					}
					
					if (obj.isSingle == '0') {
						obj.ownerFidPicUrl = pub.options.imgUrlObj.user_a;//自己身份证正面图片URL
						obj.ownerBidPicUrl = pub.options.imgUrlObj.user_b;//自己身份证反面图片URL
						obj.spouseFidPicUrl = '';//夫妻身份证正面图片URL
						obj.spouseBidPicUrl = '';//夫妻身份证反面图片URL
					}else if(obj.isSingle == "1"){
						obj.ownerFidPicUrl = pub.options.imgUrlObj.user_a;//自己身份证正面图片URL
						obj.ownerBidPicUrl = pub.options.imgUrlObj.user_b;//自己身份证反面图片URL
						obj.spouseFidPicUrl = pub.options.imgUrlObj.partner_a;//夫妻身份证正面图片URL
						obj.spouseBidPicUrl = pub.options.imgUrlObj.partner_b;//夫妻身份证反面图片URL
					}
					pub.options.evaluation = $.extend({},obj, pub.options.evaluation);
					
					console.log(pub.options.evaluation);
					
					pub.creditEvaluation.credit_assess_rcd_add.init();
				})
				$(".alert_msg").on("click",".submit_btn90,.alert_del",function(){
					common.jumpLinkPlain("../index.html")
				});
			}
		}
	}
	
	//车辆认证
	pub.upLoad_driverLicense = {
		init:function(){
			pub.options.carId = common.getUrlParam("id");
			pub.upLoad_driverLicense.car_info_show.init();
			
		},
		car_info_show : {
			init:function(){
				common.ajaxPost($.extend({
					method:'car_info_show',
					carId:pub.options.carId,
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.upLoad_driverLicense.car_info_show.apiData( d );
					d.statusCode != "100000" && common.prompt(d.statusStr);
				});
			},
			apiData:function(d){
				
			}
		},
		car_info_update : {
			init:function(){
				common.ajaxPost($.extend({
					method:'car_info_update',
					carId:pub.options.carId,
					bdriverPicUrl:pub.options.bdriverPicUrl,
					fdriverPicUrl:pub.options.fdriverPicUrl,
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.upLoad_driverLicense.car_info_update.apiData( d );
					d.statusCode != "100000" && common.prompt(d.statusStr);
				});
			},
			apiData:function(d){
				
				common.jumpHistryBack();
			}
		},
		eventHandle : {
			init:function(){
				$(".updata_card_info input").on("change",function(){
					require("imgUpload");
					//nood 自己 noodparent 父元素 
					var nodes = $(this);
					//imgType 的值11,12,21,22 
					//11,12表述自己的身份证正反面
					//21,22表述配偶的身份证正反面
					var imgObj = {
						"01":"user_drive_a",
						"02":"user_drive_b",
					};
					var imgType = nodes.attr("data");
					
					var tar = this,
					files = tar.files,
					file = files[0];
					if( !file ) return;
					var options = {
						"method":"idcard_img_upload",
			        	"userId" : pub.userId,
			        	"imgType":imgType,
			        	"tokenId":pub.tokenId,
					}
					var callBack = function(d){
						if( d.statusCode == "100000" ){
							nodes.parent().find("img").attr("src",d.data);
							/*将ImgUrl存储到本地*/
							/*var imgUrl = common.imgUrlObj.getItem(),o = {},r={};
							
							if (imgType == 11) {
								o = {"user_a":d.data}
							} else if (imgType == 12){
								o = {"user_b":d.data}
							} else if (imgType == 21){
								o = {"partner_a":d.data}
							} else if (imgType == 22){
								o = {"partner_b":d.data}
							} else if (imgType == 01){
								o = {"user_drive_a":d.data}
							} else if (imgType == 02){
								o = {"user_drive_b":d.data}
							}
							
							if (imgUrl) {
								r = $.extend({},JSON.parse(imgUrl),o);
							}else{
								r = o;
							}
							console.log(r)
							common.imgUrlObj.setItem(JSON.stringify(r));*/
						}else{
							common.prompt( d.statusCode );
						}
					}
					imgupload.init(files,common.API,options,callBack)
				})
				//点击提交
				$(".submit_btn90").on("click",function(){
					if ($(".user_drive_a").attr("src").indexOf("http:") < 0) {
						common.prompt("请上传驾驶证正面图片")
					} else if($(".user_drive_b").attr("src").indexOf("http:") < 0){
						common.prompt("请上传驾驶证反面图片")
					}else{
						pub.options.bdriverPicUrl = $(".user_drive_a").attr("src");
						pub.options.fdriverPicUrl = $(".user_drive_b").attr("src");
						pub.upLoad_driverLicense.car_info_update.init();
					}
				})
			}
		}
	};
	//投保认证个人身份证信息或者公司营业执照
	pub.updataCard = {
		init:function(){
			pub.options.carId = common.getUrlParam("id");
			pub.upLoad_driverLicense.car_info_show.init();
		},
		car_info_show : {
			init:function(){
				common.ajaxPost($.extend({
					method:'car_info_show',
					carId:pub.options.carId,
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.updataCard.car_info_show.apiData( d );
					d.statusCode != "100000" && common.prompt(d.statusStr);
				});
			},
			apiData:function(d){
				
			}
		},
		car_info_update : {
			init:function(){
				common.ajaxPost($.extend({
					method:'car_info_update',
					carId:pub.options.carId,
				}, pub.userBasicParam ,pub.options.carUpdate),function( d ){
					d.statusCode == "100000" && pub.updataCard.car_info_update.apiData( d );
					d.statusCode != "100000" && common.prompt(d.statusStr);
				});
			},
			apiData:function(d){
				common.jumpHistryBack();
			}
		},
		eventHandle:{
			init:function(){
				$(".radio_marry").on("click","span",function(){
					$(this).addClass("actived").siblings().removeClass("actived");
					$("input[name='marry']").val($(this).attr("data"))
					if ($(this).attr("data")== "person") {
						//$(".list_item.person").show();
						//$(".list_item.com").hide();
						$(".person").show();
						$(".com").hide();
					}else if ($(this).attr("data")== "com") {
						//$(".list_item.person").hide();
						//$(".list_item.com").show();
						$(".person").hide();
						$(".com").show();
					}
				});
				$(".updata_card_info input").on("change",function(){
					require("imgUpload");
					//nood 自己 noodparent 父元素 
					var nodes = $(this);
					//imgType 的值11,12,21,22 
					//11,12表述自己的身份证正反面
					//21,22表述配偶的身份证正反面
					
					var imgType = nodes.attr("data");
					
					var tar = this,
					files = tar.files,
					file = files[0];
					if( !file ) return;
					var options = {
						"method":"idcard_img_upload",
			        	"userId" : pub.userId,
			        	"imgType":imgType,
			        	"tokenId":pub.tokenId,
					}
					var callBack = function(d){
						if( d.statusCode == "100000" ){
							nodes.parent().find("img").attr("src",d.data);
						}else{
							common.prompt( d.statusCode );
						}
					}
					imgupload.init(files,common.API,options,callBack)
				})
				
				$(".submit_btn90").on("click",function(){
					var ownerType = $("input[name='marry']").val(),bidPicUrl = "",fidPicUrl = "",
						ownerName = $("input.ownerName").val();
					if (ownerType == "person") {
						bidPicUrl = $(".person.updata_card_info .user_a").attr("src");
						fidPicUrl = $(".person.updata_card_info .user_b").attr("src");
						
						if(ownerName == ''){
							common.prompt("请输入车主姓名");
						} else if (bidPicUrl.indexOf("http:") < 0) {
							common.prompt("请上传身份证正面图片")
							return;
						} else if(fidPicUrl.indexOf("http:") < 0){
							common.prompt("请上传身份证反面图片");
							return;
						}else{
							pub.options.carUpdate = {
								ownerType : ownerType,
								ownerName : ownerName,
								bidPicUrl : bidPicUrl,
								fidPicUrl : fidPicUrl,
							};
							pub.updataCard.car_info_update.init();
						}
					} else if(ownerType == "com"){
						bidPicUrl = $(".com.updata_card_info .user_a").attr("src");
						if(ownerName == ''){
							common.prompt("请输入公司名称");
							return;
						} else if (bidPicUrl.indexOf("http:") < 0) {
							common.prompt("请上传公司营业执照");
							return;
						} else{
							pub.options.carUpdate = {
								ownerType : ownerType,
								ownerName : ownerName,
								bidPicUrl : bidPicUrl,
							};
							pub.updataCard.car_info_update.init();
						}
					}
				})
			}
		}
	}
	//信用评估列表页面
	pub.evaluationList = {
		init:function(){
			pub.loading = $(".click_load");
			pub.loading.hide();
			pub.evaluationList.credit_assess_rcd_query.init();
		},
		credit_assess_rcd_query : {
			init:function(){
				common.ajaxPost($.extend({
					method:'credit_assess_rcd_query',
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.evaluationList.credit_assess_rcd_query.apiData( d );
					d.statusCode != "100000" && common.prompt(d.statusStr);
				});
			},
			apiData:function(d){
				var o = d.data,html = '';
				//private Integer assessStatus;//评估结果，0 标识：待评估，-1标识：不通过，1标识：通过
				//console.log(JSON.stringify(d));
				if (o.length == 0) {
					$(".evaluationList_center").html("暂无信用评估信息").css("line-height","100px").css("text-align","center").css("font-size","30px");
				} else{
					for (var i in o) {
						html+='<dl class="evaluation_item clearfloat" data="'+o[i].id+'" status = "'+o[i].assessStatus+'">'
						html+='	<dt class="float_left"><img src="'+o[i].goodsInfo.goodsLogo+'"></dt>'
						html+='	<dd class="float_left">'+o[i].goodsInfo.goodsName+'</dd>'
						if (o[i].assessStatus == 0) {
							html+='	<dd class="float_right color_or">信用审核中</dd>'
						} else if (o[i].assessStatus == -1){
							html+='	<dd class="float_right color_re">信用审核未通过</dd>'
						} else if (o[i].assessStatus == 1){
							html+='	<dd class="float_right color_gr">信用审核已通过</dd>'
						}
						html+='</dl>'
					}
					$(".evaluationList_center").html(html);
				}
			}
		},
		
		eventHandle:{
			init:function(){
				$(".evaluationList_box").on("click",".evaluation_item",function(){
					require("LayerCss");
					require("LayerJs");
					var nood = $(this),
						id = nood.attr("data"),
						status = nood.attr("status");
					if (status == -1) {
						var layerIndex = layer.open({
	    					content: '认证未通过可咨询客服解决<br/><a href="tel:4008001234">4008001234</a>',
	    					btn: ['<a href="tel:4008001234" style="display:block;text-align:center">确定</a>', '取消'],
	    					yes: function(index){
						    	layer.close(layerIndex)
	    					}
	    				});
					}else if(status == 0){
						var layerIndex = layer.open({
	    					content: '信用评估正在审核中？<br/>请耐心等待...',
	    					btn: ['确定'],
	    					yes: function(index){
						    	layer.close(layerIndex)
	    					}
	    				})
					}else if(status == 1){
						common.jumpLinkPlain("../html/car_evaluation_details.html"+"?id="+id)
					}
				})
			}
		}
	}
	//工单详情页面
	pub.evaluationDetails = {
		init:function(){
			require ("Picker");
			require ("PickerCss");
			pub.evaluationDetails.preSignTime();
			pub.options.evaluationId = common.getUrlParam("id");
			pub.evaluationDetails.newcar_workorder_show.init();
		},
		preSignTime:function(){
			var year = [];
			var today = new Date();
			var year_n = today.getFullYear();
			for (var i = year_n; i <= (year_n + 5); i++) {
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
			    title:'请选择提车日期',
			    onOkClick: function (values) {
			    	var str = values[0] + "年" + values[1] + "月" + values[2] + "日";
			        $('#SignTime').val(str);
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
			            	for (var i = today.getMonth() + 1; i <= 12; i++) {
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
			            	for (var i = today.getDate(); i <= curDate.getDate(); i++) {
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
		},
		newcar_workorder_show : {
			init:function(){
				common.ajaxPost($.extend({
					method:'newcar_workorder_show',
					creditId:pub.options.evaluationId,
					tokenId:pub.tokenId,
				}, {}),function( d ){
					d.statusCode == "100000" && pub.evaluationDetails.newcar_workorder_show.apiData( d );
					d.statusCode != "100000" && common.prompt(d.statusStr);
				});
			},
			apiData:function(d){
				var o = d.data,html = '';
				pub.options.workId = o.id;
				/** 选车 0; 支付定金 *= 1;签订购车合同  = 2; 提车 = 3; 完成  4;作废  = -1;*/
				var noods = $(".evaluationDetails_box .evaluationDetails_box_item");
				noods.eq(0).find("dl dd .dd_top").html(o.goodsName);
				noods.eq(0).find("dl dd .dd_bottom span").html("￥"+o.mcbPrice);
				noods.eq(1).find("dl dd .dd_top span").html("￥"+o.earnestDeposit);
				noods.eq(1).find(".btn_wrap button").attr("data",o.linkOrderCode);
				if (o.status == 0) {
					
				}else if (o.status == 1) {
					noods.eq(2).find("#SignTime").removeAttr("disabled");
					noods.eq(2).find(".btn_wrap").removeClass("hidden");
				}else if (o.status == 2) {
					noods.eq(2).addClass("actived");
					noods.eq(2).find("#SignTime").val(o.preSignTime);
				}else if (o.status == 3) {
					noods.eq(2).addClass("actived");
					noods.eq(3).addClass("actived");
					noods.eq(3).find("dl dd .dd_top").html(' '+o.buyTime );
				}else if (o.status == 4) {
					noods.eq(2).addClass("actived");
					noods.eq(3).addClass("actived");
					noods.eq(4).addClass("actived");
				}else if (o.status == -1) {
					
				}
						
			}
		},
		newcar_workorder_update : {
			init:function(){
				common.ajaxPost($.extend({
					method:'newcar_workorder_update',
					workId:pub.options.workId,
					preSignTime: pub.options.preSignTime,
					tokenId:pub.tokenId,
				}, {}),function( d ){
					d.statusCode == "100000" && pub.evaluationDetails.newcar_workorder_update.apiData( d );
					d.statusCode != "100000" && common.prompt(d.statusStr);
				});
			},
			apiData:function(d){
				var o = d.data,html = '';
				console.log(d)
			}
		},
		eventHandle:{
			init:function(){
				$("#SignTime").on("focus",function(){
					$(this).blur();
				})
				$("#SignTime").on("click",function(){
					pub.picker8.show();
				});
				$("#SignTimeBtn").on("click",function(){
					var preSignTime = $("SignTime").val();
					if (preSignTime == "") {
						common.prompt("请选择签约日期");
						return;
					}
					pub.options.preSignTime = preSignTime;
					pub.evaluationDetails.newcar_workorder_update.init();
				});
				$("#toPay").on("click",function(){
					common.jumpLinkPlain("../html/line_payment.html"+"?orderCode="+ $(this).attr("data"));
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
		if (pub.module_id == "creditEvaluation"){
    		pub.creditEvaluation.init()
			pub.creditEvaluation.eventHandle.init();
    	}else if (pub.module_id == "upLoad_driverLicense"){
    		pub.upLoad_driverLicense.init();
			pub.upLoad_driverLicense.eventHandle.init();
    	}else if (pub.module_id == "updataCard"){
    		pub.updataCard.init();
			pub.updataCard.eventHandle.init();
    	}else if (pub.module_id == "evaluationList"){
    		pub.evaluationList.init();
			pub.evaluationList.eventHandle.init();
    	}else if (pub.module_id == "evaluationDetails"){
    		pub.evaluationDetails.init();
			pub.evaluationDetails.eventHandle.init();
    	};
		pub.eventHandle.init()
	};
	module.exports = pub;
})