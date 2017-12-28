
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
	
	pub.options = {}
	
	//我的车库
	//status 0待认证，1车库认证中，2车库已认证()，3车库认证失败；4投保认证中，5投保已认证 ,6投保认证失败
	pub.garage = {
		init : function (){
			require("LayerCss");
			require("LayerJs");//coupon_info_show
			pub.garage.car_info_list.init();
		},
		car_info_list: {
			init:function(){
				common.ajaxPost($.extend({
					method:'car_info_list',
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.garage.car_info_list.apiData( d );
					d.statusCode != "100000" && common.prompt(d.statusStr);
				});
			},
			apiData:function(d){
				var o = d.data,html = '';
				if (o.length == 0) {
					$(".garage_box").html("车库空空如也！").css({"text-align":"center","font-size":"50px","line-height":"80px"});
				}else{
					var status = '',l=o.length,html='';//status 1:表示不需要圆角；2：表示第一个，3：表示最后一个；4：表示中间的
					
					for(var i in o){
						status = getstatus(i);
						//console.log(status)
						html += creatCar(o[i],i,status)
					}
					$(".garage_box").html(html)
				}
				function getstatus (i) {
					var s = '';
					if (l == 1) {
						s = '1'
					}else if(l==2){
						s = parseInt(i)+2;
					}else{
						if (i == '0') {
							s = '2'
						}else if(parseInt(l-1) == i){
							s = '3'
						}else{
							s = '4'
						}
					};
					return s;
				}
				function creatCar(d,i,status){
					console.log(status)
					var str = '';
						str += '<div class="line-wrapper" dataid="'+ d.id +'">'
						str += '	<div class="line-scroll-wrapper clearfloat">'
						str += '		<dl class="line-normal-wrapper garage_car_item clearfloat " status = "'+d.status+'">'
						str += '			<dt class="line-normal-avatar-wrapper"><img src="../carimg/'+d.carBrandKindCode+'.jpg"></dt>'
						str += '			<dd class="line-normal-info-wrapper">'
						str += '				<p>车牌号:'+ d.carNoProvince + d.carNoCity + d.carNo +'</p>'
						str += '				<p>车型:'+ d.carBrandKind +'</p>'
						str += '				<div class="clearfloat">'
					if (d.status == 0) {
						str += '					<p class="float_left">状态: <span class="color_or">认证有礼</span></p>'
						str += '					<p class="float_right color_or">去认证</p>'
					} else if(d.status == 1){
						str += '					<p class="float_left">状态: <span class="color_gr">认证中</span></p>'
						str += '					<p class="float_right color_re"></p>'
					} else if(d.status == 2){
						str += '					<p class="float_left">状态: <span class="color_gr">认证通过</span></p>'
						str += '					<p class="float_right color_re"></p>'
					} else if(d.status == 3){
						str += '					<p class="float_left">状态: <span class="color_gr">认证失败</span></p>'
						str += '					<p class="float_right color_re"></p>'
					} else if(d.status == 4 || d.status == 5 || d.status == 6){
						str += '					<p class="float_left">状态: <span class="color_gr">认证通过</span></p>'
						str += '					<p class="float_right color_re"></p>'
					}
						str += '				</div>'
						str += '			</dd>'
					if(status == '1'){
						str +=''
					}else if(status == "2"){
						str += '			<span class="border_radius bottom_left"></span>'
						str += '			<span class="border_radius bottom_right"></span>'
					}else if(status == "3"){
						str += '			<span class="border_radius top_left"></span>'
						str += '			<span class="border_radius top_right"></span>'
					}else if(status == "4"){
						str += '			<span class="border_radius top_left"></span>'
						str += '			<span class="border_radius top_right"></span>'
						str += '			<span class="border_radius bottom_left"></span>'
						str += '			<span class="border_radius bottom_right"></span>'
					}
						str += '		</dl>'
						str += '		<div class="line-btn-delete"><button>删除</button></div>'
						str += '	</div>'
						str += '</div>'
					
					return str;
				}
				init()
			}
		},
		car_info_delete : {
			init:function(){
				common.ajaxPost($.extend({
					method:'car_info_delete',
					carId:pub.options.carId,
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.garage.car_info_delete.apiData( d );
					d.statusCode != "100000" && common.prompt(d.statusStr);
				});
			},
			apiData:function(d){
				var o = d.data,html = '';
				$(".garage_box .line-wrapper").eq(pub.options.carIndex).remove();
			}
		},
		eventHandle:{
			init:function(){
				/*$(".garage_box").on("click",".garage_car_item dd",function(){
					
					var nood = $(this).parents(".line-wrapper");
					if (!nood.is(".actived")) {
						//nood.addClass("actived").siblings().removeClass("actived");
						//nood.find('.line-normal-info-wrapper .clearfloat .float_right').html("默认");
						//nood.siblings().find('.line-normal-info-wrapper .clearfloat .float_right').html("")
					}
				})*/
				
				$(".garage_box").on("click",".garage_car_item",function(){
					var nood = $(this),
						status = nood.attr("status");
						id = nood.parents(".line-wrapper").attr("dataid")
					
					if (status == 0) {
						common.jumpLinkPlain("../html/car_authentication.html"+"?id="+id)
					} else if(status == 2 || status == 4 || status == 5 || status == 6){
						common.prompt("该车已认证！")
					} else if(status == 1){
						var layerIndex = layer.open({
	    					content: '车辆认证中，请耐心等待。<br/><a href="tel:4008001234">4008001234</a>',
	    					btn: ['确定', '取消'],
	    					yes: function(index){
						    	layer.close(layerIndex)
	    					}
	    				});
					} else if(status == 3){
						var layerIndex = layer.open({
	    					content: '认证未通过可咨询客服解决<br/><a href="tel:4008001234">4008001234</a>',
	    					btn: ['<a href="tel:4008001234" style="display:block;text-align:center">确定</a>', '取消'],
	    					yes: function(index){
						    	layer.close(layerIndex)
	    					}
	    				});
					}
				})
				$(".header_right").on("click",function(){
					common.jumpLinkPlain( "../html/car_info.html" )
				})
				$(".garage_box").on("click",".line-btn-delete",function(e){
					pub.nood = $(this).parents(".line-wrapper");
					pub.options.carId = pub.nood.attr("dataid");
					pub.options.carIndex = pub.nood.index();
					//
					//
    				var layerIndex = layer.open({
    					content: '您确定要删除该车吗？',
    					btn: ['确定', '取消'],
    					yes: function(index){
    						pub.garage.car_info_delete.init();
					    	layer.close(layerIndex)
    					}
    				})
				})
			}
		}
	};
	//存储车信息参数
	pub.car={}
	//添加新车
	pub.addCar = {
		init : function (){
			//require ("Picker");
			//require ("PickerCss");
			/*var car = {
				carBrand:"奥迪",//车品牌名称
				carBrandCode:"01",//车品牌编码
				carBrandKind:"2017豪华版",//车品牌系名称
				carBrandKindCode:"0101",//车品牌系编码
				carNo:"88888",//车牌号
				carNoCity:"A",//车牌城
				市代码
				carNoProvince:"浙",//车牌省简称
				ownerName:"赵玉华",//车主姓名
				carType:"person",//车类型
			};*/
			//暂时方便不用每次都要输入
			var car = localStorage.getItem("car");
			if(car){
				car = JSON.parse(car);
				pub.addCar.htmlInit(car);
			}
			//pub.addCar.carOwnerInit.init();
		},
		htmlInit:function(d){
			var nood = $(".car_info_box");
			console.log(d)
			
			if (d.carType) {
				nood.find("#carTypeValue").val(d.carType);
				if (d.carType == "person") {
					nood.find("#carType").val("个人车");
					nood.find(".carOwner .float_left").html("车主姓名")
					nood.find("#ownerName").removeAttr("disabled").attr("placeholder","请输入车主姓名")
				} else if (d.carType == "com"){
					nood.find("#carType").val("公司车")
					nood.find(".carOwner .float_left").html("公司名称")
					nood.find("#ownerName").removeAttr("disabled").attr("placeholder","请输入公司名称")
				}
				
				if (d.ownerName) {
					nood.find("#ownerName").val(d.ownerName)
				}
				nood.find(".carOwner").show();
			}
			if(d.carNoProvince && d.carNoCity  && d.carNo){//车牌号
				nood.find("#car_number").val(d.carNoProvince + d.carNoCity + d.carNo);
				nood.find("#carNoProvince").val(d.carNoProvince);
				nood.find("#carNoCity").val(d.carNoCity)
				nood.find("#carNo").val(d.carNo)
			}
			if (d.carBrand && d.carBrandKindCode) {//车品牌
				nood.find("#carBrand").val(d.carBrand);
				nood.find("#carBrandCode").val(d.carBrandCode);
			}
			if (d.carBrandKind && d.carBrandKindCode) {//车型号
				nood.find("#carBrandKind").val(d.carBrandKind);
				nood.find("#carBrandKindCode").val(d.carBrandKindCode);
			}
		},
		carOwnerInit:{
    		init:function(){
    			pub.picker2 = new myPicker({
    				cols: ['公司车',"个人车"],
    				title:"请选择车辆所有者",
    				fontSize:18,
    				onOkClick: function (values) {
				    	$("#carType").val(values[0])
				    	var nood = $(".carOwner");
				    	if (values[0] == "个人车") {
				    		$("#carTypeValue").val("person")
				    		nood.find(".float_left").html("车主姓名");
				    		nood.find(".float_right input").attr("placeholder","请输入车主姓名")
				    	} else if (values[0] == "公司车"){
				    		$("#carTypeValue").val("com")
				    		nood.find(".float_left").html("公司名称");
				    		nood.find(".float_right input").attr("placeholder","请输入公司名称")
				    	}
				    	nood.show();
				    	$("#ownerName").removeAttr("disabled");
				    },
				    onSelectItem: function (i, index, value) {
				    	
				    }
				})
    		}
    	},
		car_info_add: {
			init:function(){
				common.ajaxPost($.extend({
					method:'car_info_add',
					pkUser:pub.userId,
					tokenId:pub.tokenId,
				}, pub.car ),function( d ){
					d.statusCode == "100000" && pub.addCar.car_info_add.apiData( d );
					d.statusCode != "100000" && common.prompt(d.statusStr);
				});
			},
			apiData:function(d){
				var o = d.data,html = '';
				localStorage.removeItem("car")
				common.jumpHistryBack();
			}
		},
		eventHandle:{
			init:function(){
				$("#car_brand,#car_model,#carType,#carBrandKind").on("focus",function(){
					$(this).blur();
				});
				$("#carType").on("click",function(){
					pub.picker2.show();
				})
				$("#carBrand").on("click",function(){
					var car_number = $("#car_number").val(),
						ownerName = $("#ownerName").val(),
						carType = $("#carTypeValue").val(),
						carTypeValue = $("#carType").val(),
						carNoProvince = $("#carNoProvince").val(),
						carNoCity = $("#carNoCity").val(),
						carNo = $("#carNo").val();
					carNoProvince = car_number.substr(0,1);
					carNoCity = car_number.substr(1,1);
					carNo = car_number.substr(2,5);
					//保存原始信息
					pub.car = {
						carNo:carNo,//车牌号
						carNoCity:carNoCity,//车牌城市代码
						carNoProvince:carNoProvince,//车牌省简称
						/*ownerName:ownerName,//车主姓名
						carType:carType,//车类型*/
					};
					localStorage.setItem("car",JSON.stringify(pub.car))
					common.jumpLinkPlain( "../html/car_brand.html" )
				})
				$("#car_model").on("click",function(){
					var str = $("#car_brand").val();
					if (!str) {
						common.prompt("请先选择品牌")
					}
				});
				$(".submit_btn90").on("click",function(){
					var car_number = $("#car_number").val(),
						ownerName = $("#ownerName").val(),
						carType = $("#carTypeValue").val(),
						carBrand = $("#carBrand").val(),
						carBrandCode = $("#carBrandCode").val(),
						carBrandKind = $("#carBrandKind").val(),
						carBrandKindCode = $("#carBrandKindCode").val(),
						carNoProvince = $("#carNoProvince").val(),
						carNoCity = $("#carNoCity").val(),
						carNo = $("#carNo").val();
					carNoProvince = car_number.substr(0,1);
					carNoCity = car_number.substr(1,1);
					carNo = car_number.substr(2,5);
					//输入信息验证
					if (car_number == '') {
						common.prompt("请输入车牌号");
						return;
					} else if (car_number.length != 7 || !common.REG_CHINESE.test(carNoProvince) || !common.REG_Letter.test(carNoCity) || !common.REG_Num_Letter.test(carNo) ){
						//toLocaleUpperCase 字母转换为大写的方法
						common.prompt("请输入正确的车牌号");
						return;
					} /*else if( carType == '' ){
						common.prompt("请选择车性质");
						return;
					} else if( carType == 'com' && ownerName == ""){
						common.prompt("请输入公司名称");
						return;
					} else if( carType == 'person' && ownerName == ""){
						common.prompt("请输入车主姓名");
						return;
					} */else if (carBrand == "" || carBrandCode == "") {
						common.prompt("请选择车品牌");
						return;
					} else if(carBrandKind == "" || carBrandKindCode == ""){
						common.prompt("将选择车系列型号");
						return;
					}
					//保存原始信息
					pub.car = {
						carBrand:carBrand,//车品牌名称
						carBrandCode:carBrandCode,//车品牌编码
						carBrandKind:carBrandKind,//车品牌系名称
						carBrandKindCode:carBrandKindCode,//车品牌系编码
						carNo:carNo,//车牌号
						carNoCity:carNoCity,//车牌城市代码
						carNoProvince:carNoProvince,//车牌省简称
						/*ownerName:"赵玉华",//车主姓名
						carType:"01",//车类型*/
					};
					localStorage.setItem("car",JSON.stringify(pub.car));
					pub.addCar.car_info_add.init();
				})
			}
		}
	};
	//汽车品牌选择
	pub.carBrand = {
		init:function(){
			pub.carBrand.brand_hot_query.init();
			pub.carBrand.brand_info_query.init();
		},
		brand_info_query:{
			init:function(){
				common.ajaxPost($.extend({
					method:'brand_info_query',
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.carBrand.brand_info_query.apiData( d );
					d.statusCode != "100000" && common.prompt(d.statusStr);
				});
			},
			apiData:function( d ){
				var o = d.data.brandlist,html = '',l = o.length;
				var arrLetter = [];//暂存一个list的数据-整体创建盒子
				if (l != 0) {
					for (var i=0;i<l; i++) {
						arrLetter.push(o[i]);
						if ((i+1)< l) {
							if (o[i].word != o[(i+1)].word) {
								html += creatBox(arrLetter);
								arrLetter = [];
							}
						}else{
							html += creatBox(arrLetter);
							arrLetter = [];
						}
					}
					$(".car_brand_box .car_brand_list_wrap").html(html);
				} else{
					
				};
				//创建盒子
				function creatBox(arr){
					var html = '<div class="car_brand_list_box">'
						html += 	'<div class="car_brand_list_box_tit"><a name="'+arr[0].word+'">'+arr[0].word+'</a></div>'
						html +=		'<div class="car_brand_list_box_center">'
					for (var i in arr) {
						html += 		'<dl class="car_brand_list_item"  id = "'+arr[i].id+'" code = "'+arr[i].brandCode+'"><dt><img src="'+arr[i].brandLogo+'"/></dt><dd>'+arr[i].brandName+'</dd></dl>'
					}
						html += '	</div>'
						html += '</div>'
					return html;
				}
			}
		},
		brand_hot_query : {
			init:function(){
				common.ajaxPost($.extend({
					method:'brand_hot_query',
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.carBrand.brand_hot_query.apiData( d );
					d.statusCode != "100000" && common.prompt(d.statusStr);
				});
			},
			apiData:function( d ){
				var o = d.data.brandlist,html = '';
				if (o.length != 0) {
					
				} else{
					$(".car_brand_hot_wrap").hide();
					$(".car_brand_hot_box").html("暂无热门品牌")
				}
				$(".car_brand_hot_wrap").hide();
			}
		},
		brand_version_query_level1 : {
			init:function(){
				common.ajaxPost($.extend({
					method:'brand_version_query_level1',
					brandId:pub.options.brandId
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.carBrand.brand_version_query_level1.apiData( d.data.bversionist );
					d.statusCode != "100000" && common.prompt(d.statusStr);
				});
			},
			apiData:function( o ){
				/*样式变化*/
				$("#mask").addClass("actived");
				$("body").css("overflow-y","hidden")
				$(".car_brand_fiexd").animate({
					"left":"120px",
				})
				/*内容初始化*/
				var box = $(".car_brand_fiexd"),
				
					tit = box.find(".car_brand_list_item"),
					
					center = box.find(".car_brand_list_box"),
					html = '';
					
					pub.first_node.data("data",JSON.stringify(o));
					
					tit.find("dt img").attr("src",pub.options.brand.brandLog);
					
					tit.find("dd").html(pub.options.brand.brandName);
				
				if (o.length == 0) {
					 box.find(".car_brand_list_box div").html("<p>暂无数据</p>").css("line-height","100px").css("text-align","center");
				} else{
					for (var i in o) {
						html += '<div class="car_brand_list_box_item">'
						html += '	<div class="car_brand_list_box_tit" id="'+o[i].id+'" data="'+o[i].brandVersionCode+'" index = "'+i+'">'+o[i].brandVersionName+'</div>'
						html += '	<div class="hidden box"></div>'
						html += '</div>'
					}
				}
				center.html(html);
				html = '';
				
			}
		},
		brand_version_query_level2 : {
			init:function(){
				common.ajaxPost($.extend({
					method:'brand_version_query_level2',
					parentId:pub.options.parentId
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.carBrand.brand_version_query_level2.apiData( d.data.bversionist );
					d.statusCode != "100000" && common.prompt(d.statusStr);
				});
			},
			apiData:function( o ){
				/*内容初始化*/
				var box = $(".car_brand_list_box"),
				
					noods = box.find(".car_brand_list_box_item"),
					
					nood = noods.eq(pub.options.index),
					
					center = nood.find(".box"),
					html = '';
				nood.data("data",JSON.stringify(o));
				if (center.is(".hidden")) {
					center.height("0").removeClass("hidden");
					if (o.length == 0) {
						center.html("<p>暂无数据</p>").css("line-height","100px").css("text-align","center");
						center.animate({"height":100+"px"});
					} else{
						for (var i in o) {
							html += '<p class="list_item" data="'+o[i].brandVersionCode+'" id="'+o[i].id+'">'+o[i].brandVersionName+'</p>'
						}
						center.html(html);
						center.animate({"height":100*o.length +"px"});
					}
					nood.siblings().find(".box").not(".hidden").animate({
						"height":"0px",
					},function(){
						$(this).addClass("hidden")
					});
					html = '';
				}
			}
		},
		eventHandle:{
			init:function(){
				//点击热门品牌项
				$(".car_brand_hot_wrap").on("click","dl",function(){
					pub.carBrand.brand_version_query_level1.init();
				})
				$('.car_brand_box .car_brand_list_wrap').on("click",".car_brand_list_item",function(){
					pub.options.brand = {
						brandId : $(this).attr("id"),
						brandCode : $(this).attr("code"),
						brandName : $(this).find("dd").html(),
						brandLog : $(this).find("dt img").attr("src"),
					}
					pub.options.brandId = $(this).attr("id");
					pub.first_node = $(this);
					var data = $(this).data("data");
					if (data) {
						pub.carBrand.brand_version_query_level1.apiData(JSON.parse(data));
					}else{
						pub.carBrand.brand_version_query_level1.init();
					}
				})
				$("#mask").on("click",function(){
					if ($(this).is(".actived")) {
						$(".car_brand_fiexd").animate({
							"left":"750px",
						});
						$("#mask").animate({"background":"rgba(0,0,0,0)"},function(){
							$("#mask").removeClass("actived")
							$("body").css("overflow-y","auto")
						})
					}
				});
				$(".car_brand_list_retrieval").on("click","a",function(){
					var a = $(this).attr("href");
					var l = pub.options.histry;
					if (l.length > 0) {
						if (l[l.length -1] != a) {
							l.push(a);
						}
					}else{
						l.push(a);
					}
					pub.Back = l.length + 1;
				})
				$(".car_brand_fiexd").on("click",".car_brand_list_box_tit",function(){
					pub.options.parentId = $(this).attr("id");
					pub.options.index = $(this).attr("index");
					var data = $(this).parent().data("data");
					if (data) {
						pub.carBrand.brand_version_query_level2.apiData(JSON.parse(data));
					}else{
						pub.carBrand.brand_version_query_level2.init();
					}
				})
				$(".car_brand_fiexd").on("click",".list_item",function(){
					var carBrand = {
						carBrand:pub.options.brand.brandName,//车品牌名称
						carBrandCode:pub.options.brand.brandCode,//车品牌编码
						carBrandKind:$(this).html(),//型号
						carBrandKindCode:$(this).attr("data"),//车品牌系编码
					}
					var car = $.extend({},JSON.parse(localStorage.getItem("car")), carBrand);
					localStorage.setItem("car",JSON.stringify(car))
					common.jumpHistryBack(pub.Back);
				})
			}
		}
	};
	//投保认证选择车辆
	//status 0待认证，1车库认证中，2车库已认证()，3车库认证失败；4投保认证中，5投保已认证 ,6投保认证失败
	pub.selectCar = {
		init:function(){
			require("LayerCss");
			require("LayerJs");//coupon_info_show
			pub.selectCar.car_info_list.init()
		},
		car_info_list: {
			init:function(){
				common.ajaxPost($.extend({
					method:'car_info_list',
				}, pub.userBasicParam ),function( d ){
					d.statusCode == "100000" && pub.selectCar.car_info_list.apiData( d );
					d.statusCode != "100000" && common.prompt(d.statusStr);
				});
			},
			apiData:function(d){
				var o = d.data,html = '';
				if (o.length == 0) {
					$(".garage_box").html("车库空空如也！").css({"text-align":"center","font-size":"50px","line-height":"80px"});
				}else{
					var status = '',l=o.length,html='';//status 1:表示不需要圆角；2：表示第一个，3：表示最后一个；4：表示中间的
					
					for(var i in o){
						status = getstatus(i);
						//console.log(status)
						html += creatCar(o[i],i,status)
					}
					pub.carId = o[0].id;
					pub.carStatus = o[0].status;
					$(".garage_box").html(html)
				}
				function getstatus (i) {
					var s = '';
					if (l == 1) {
						s = '1'
					}else if(l==2){
						s = parseInt(i)+2;
					}else{
						if (i == '0') {
							s = '2'
						}else if(parseInt(l-1) == i){
							s = '3'
						}else{
							s = '4'
						}
					};
					return s;
				}
				function creatCar(d,i,status){
					console.log(status)
					var str = '';
					if (i == 0) {
						str += '		<dl class="line-normal-wrapper garage_car_item actived clearfloat " status = "'+d.status+'" dataid="'+ d.id +'">'
					}else{
						str += '		<dl class="line-normal-wrapper garage_car_item clearfloat " status = "'+d.status+'" dataid="'+ d.id +'">'
					}
						str += '			<dt class="line-normal-avatar-wrapper"><img src="../carimg/'+d.carBrandCode+'.jpg"></dt>'
						str += '			<dd class="line-normal-info-wrapper">'
						str += '				<p>车牌号:'+ d.carNoProvince + d.carNoCity + d.carNo +'</p>'
						str += '				<p>车型:'+ d.carBrandKind +'</p>'
						str += '				<div class="clearfloat">'
					if (d.status == 2) {
						str += '					<p class="float_left">状态: <span class="color_or">认证有礼</span></p>'
						str += '					<p class="float_right color_or">去认证</p>'
					} else if(d.status == 4){
						str += '					<p class="float_left">状态: <span class="color_gr">认证中</span></p>'
						str += '					<p class="float_right color_re"></p>'
					} else if(d.status == 5){
						str += '					<p class="float_left">状态: <span class="color_gr">认证通过</span></p>'
						str += '					<p class="float_right color_re"></p>'
					} else if(d.status == 6){
						str += '					<p class="float_left">状态: <span class="color_gr">认证失败</span></p>'
						str += '					<p class="float_right color_re"></p>'
					} else if(d.status == 0 || d.status == 1 || d.status == 3){
						str += '					<p class="float_left">请先通过车认证</p>'
						str += '					<p class="float_right color_re"></p>'
					}
						str += '				</div>'
						str += '			</dd>'
					if(status == '1'){
						str +=''
					}else if(status == "2"){
						str += '			<span class="border_radius bottom_left"></span>'
						str += '			<span class="border_radius bottom_right"></span>'
					}else if(status == "3"){
						str += '			<span class="border_radius top_left"></span>'
						str += '			<span class="border_radius top_right"></span>'
					}else if(status == "4"){
						str += '			<span class="border_radius top_left"></span>'
						str += '			<span class="border_radius top_right"></span>'
						str += '			<span class="border_radius bottom_left"></span>'
						str += '			<span class="border_radius bottom_right"></span>'
					}
						str += '		</dl>'
					
					return str;
				}
				
			}
		},
		eventHandle : {
			init:function(){
				$(".garage_box").on("click",".garage_car_item",function(){
					var nood = $(this);
					if (!nood.is(".actived")) {
						nood.addClass("actived").siblings().removeClass("actived")	
					}
					pub.carId = nood.attr("dataid");
					pub.carStatus = nood.attr("status");
				})
				$(".submit_btn90").on("click",function(){
					
					if (pub.carStatus == '1' || pub.carStatus == '3' || pub.carStatus == "0") {
						var layerIndex = layer.open({
	    					content: '请先到我的爱车完成车认证',
	    					btn: ['确定', '取消'],
	    					yes: function(index){
	    						common.jumpHistryBack();
						    	layer.close(layerIndex)
	    					}
	    				});
					} else if(pub.carStatus == '2'){
						common.jumpLinkPlain("../html/updata_card.html"+"?id="+pub.carId)
					} else if(pub.carStatus == '4'){
						var layerIndex = layer.open({
	    					content: '车辆认证中，请耐心等待。<br/><a href="tel:4008001234">4008001234</a>',
	    					btn: ['确定', '取消'],
	    					yes: function(index){
						    	layer.close(layerIndex)
	    					}
	    				});
					} else if(pub.carStatus == '5'){
						common.prompt("该车已认证！")
					} else if(pub.carStatus == '6'){
						var layerIndex = layer.open({
	    					content: '认证未通过可咨询客服解决<br/><a href="tel:4008001234">4008001234</a>',
	    					btn: ['<a href="tel:4008001234" style="display:block;text-align:center">确定</a>', '取消'],
	    					yes: function(index){
						    	layer.close(layerIndex)
	    					}
	    				});
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
		if (pub.module_id == "garage"){
    		pub.garage.init()
			pub.garage.eventHandle.init();
    	}else if (pub.module_id == "addCar"){
    		pub.addCar.init()
			pub.addCar.eventHandle.init();
    	}else if (pub.module_id == "carBrand"){
    		pub.carBrand.init()
			pub.carBrand.eventHandle.init();
    	}else if (pub.module_id == "selectCar"){
    		pub.selectCar.init()
			pub.selectCar.eventHandle.init();
    	}
		pub.eventHandle.init();
	};
	
	module.exports = pub;
	
	//左滑出现删除按钮
    function init() {
        // 设定每一行的宽度=屏幕宽度+按钮宽度
        $(".line-scroll-wrapper").width($(".line-wrapper").width() + $(".line-btn-delete").width());
        // 设定常规信息区域宽度=屏幕宽度
        $(".line-normal-wrapper").width($(".line-wrapper").width());
        // 设定文字部分宽度（为了实现文字过长时在末尾显示...）
        //$(".line-normal-msg").width($(".line-normal-wrapper").width() - 280);
        // 获取所有行，对每一行设置监听
        var lines = $(".line-normal-wrapper");
        var len = lines.length;
        var lastX, lastXForMobile;
        // 用于记录被按下的对象
        var pressedObj; // 当前左滑的对象
        var lastLeftObj; // 上一个左滑的对象
        // 用于记录按下的点
        var start;
        // 网页在移动端运行时的监听
        for(var i = 0; i < len; ++i) {
            lines[i].addEventListener('touchstart', function(e) {
                lastXForMobile = e.changedTouches[0].pageX;
                pressedObj = this; // 记录被按下的对象 

                // 记录开始按下时的点
                var touches = event.touches[0];
                start = {
                    x: touches.pageX, // 横坐标
                    y: touches.pageY // 纵坐标
                };
            });
            lines[i].addEventListener('touchmove', function(e) {
                // 计算划动过程中x和y的变化量
                var touches = event.touches[0];
                delta = {
                    x: touches.pageX - start.x,
                    y: touches.pageY - start.y
                };

                // 横向位移大于纵向位移，阻止纵向滚动
                if(Math.abs(delta.x) > Math.abs(delta.y)) {
                    event.preventDefault();
                }
            });
            lines[i].addEventListener('touchend', function(e) {
                if(lastLeftObj && pressedObj != lastLeftObj) { // 点击除当前左滑对象之外的任意其他位置
                    $(lastLeftObj).animate({
                        marginLeft: "0"
                    }, 500); // 右滑
                    lastLeftObj = null; // 清空上一个左滑的对象
                }
                var diffX = e.changedTouches[0].pageX - lastXForMobile;
                if(diffX < -150) {
                    $(pressedObj).animate({
                        marginLeft: "-200px"
                    }, 500); // 左滑
                    lastLeftObj && lastLeftObj != pressedObj &&
                        $(lastLeftObj).animate({
                            marginLeft: "0"
                        }, 500); // 已经左滑状态的按钮右滑
                    lastLeftObj = pressedObj; // 记录上一个左滑的对象
                } else if(diffX > 150) {
                    if(pressedObj == lastLeftObj) {
                        $(pressedObj).animate({
                            marginLeft: "0"
                        }, 500); // 右滑
                        lastLeftObj = null; // 清空上一个左滑的对象
                    }
                }
            });
        }
    }
})