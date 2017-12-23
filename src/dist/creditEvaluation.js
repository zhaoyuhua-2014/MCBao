
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
		
	}
	//信用评估页面
	pub.creditEvaluation = {
		
		init : function(){
			require('LAreaData');
			require ("Picker");
			require ("PickerCss");
			pub.creditEvaluation.dataInit();
			pub.creditEvaluation.dataInit1();
			//s数据的缓存显示
			var imgUrl = common.imgUrlObj.getItem();
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
					method:'credit_assess_rcd_add',
					belongUser : '123',
					ownerFidPicUrl:'https://imgsa.baidu.com/exp/w=480/sign=c0e51c2574c6a7efb926a92ecdf8afe9/a9d3fd1f4134970a17baa9d597cad1c8a6865d7a.jpg',//自己身份证正面图片URL
					ownerBidPicUrl:'https://imgsa.baidu.com/exp/w=480/sign=c0e51c2574c6a7efb926a92ecdf8afe9/a9d3fd1f4134970a17baa9d597cad1c8a6865d7a.jpg',//自己身份证反面图片URL
					isSingle : '0',//是否单身
					spouseFidPicUrl : 'https://imgsa.baidu.com/exp/w=480/sign=c0e51c2574c6a7efb926a92ecdf8afe9/a9d3fd1f4134970a17baa9d597cad1c8a6865d7a.jpg',//夫妻身份证正面图片URL
					spouseBidPicUrl : 'https://imgsa.baidu.com/exp/w=480/sign=c0e51c2574c6a7efb926a92ecdf8afe9/a9d3fd1f4134970a17baa9d597cad1c8a6865d7a.jpg',//夫妻身份证反面图片URL
					buycarDate:'123',
					buycarCity:'3301',//买车城市
					regcar_city:'0012',
					carGoodId:'1',//车id
					carPrice:'100',//车price
					carDeposit:'123',
					carDownPay:'123',
					carLoan:'123',
					brandName:'123',
					websiteNode:common.WebsiteNode,
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.creditEvaluation.credit_assess_rcd_add.apiData( d );
				});
				
			},
			apiData:function( d ){
				$(".alert_msg").removeClass("hidden");
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
				$("#putCarCity,#carBrandCity").on("focus",function(){
					$(this).blur();
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
							console.log(r)
							common.imgUrlObj.setItem(JSON.stringify(r));
						}else{
							common.prompt( d.statusCode );
						}
					}
					imgupload.init(files,common.API,options,callBack)
				})
				$(".submit_btn90").on("click",function(){
					
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
			//s数据的缓存显示
			var imgUrl = common.imgUrlObj.getItem();
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
				if (imgUrl.user_drive_a) {
					$(".user_drive_a").attr("src",imgUrl.user_drive_a)
				}
				if (imgUrl.user_drive_b) {
					$(".user_drive_b").attr("src",imgUrl.user_drive_b)
				}
			}
		},
		car_renzhegn : {
			init:function(){
				common.prompt("缺少车辆认证接口")
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
							var imgUrl = common.imgUrlObj.getItem(),o = {},r={};
							
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
							common.imgUrlObj.setItem(JSON.stringify(r));
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
						pub.upLoad_driverLicense.car_renzhegn.init();
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
		if (pub.module_id == "creditEvaluation"){
    		pub.creditEvaluation.init()
			pub.creditEvaluation.eventHandle.init();
    	}else if (pub.module_id == "upLoad_driverLicense"){
    		pub.upLoad_driverLicense.init();
			pub.upLoad_driverLicense.eventHandle.init();
    	}
		pub.eventHandle.init()
	};
	module.exports = pub;
})