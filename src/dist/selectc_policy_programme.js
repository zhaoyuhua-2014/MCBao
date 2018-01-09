
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
	//险种推荐方案
	/*
	 基础款（默认但可修改）
	交强险                           投保
	车船税                           投保 
	商业险：
	第三者责任险     不计免赔        50万
	意外伤害险          
	人生意外伤害险                  不投保
	驾乘险                          不投保
	
	热销款（默认但可修改）
	交强险                                      投保
	车船税                                      投保
	商业险：
	机动车损失险               不计免赔         投保
	第三者责任险（100万）      不计免赔        投保
	司机责任险（1万）          不计免赔        投保
	乘客责任险（1万）          不计免赔        投保
	意外伤害险          
	人生意外伤害险（100万）                    投保
	驾乘险                                     不投保
	
	高端款（默认但可修改）
	交强险                                     投保
	车船税                                     投保      
	商业险：
	机动车损失险            不计免赔     
	第三者责任险（150万）  不计免赔
	司机责任险（5万）      不计免赔
	乘客责任险（5万）      不计免赔 
	盗抢险                                    不投保
	涉水险                                    不投保
	玻璃险                                    不投保
	划痕险                                    不投保
	自燃损失险                                不投保
	指定专修厂险                              不投保
	意外伤害险          
	人生意外伤害险（100万）                  投保
	驾乘险（100万）                          投保
	
	豪华无忧款（默认但可修改）
	交强险                                    投保
	车船税                                    投保      
	商业险：
	机动车损失险                不计免赔     
	第三者责任险（150万）      不计免赔
	司机责任险（10万）         不计免赔
	乘客责任险（10万）         不计免赔 
	盗抢险                                  不投保
	涉水险                                  不投保
	玻璃险                                  不投保
	划痕险                                  不投保
	自燃损失险                              不投保
	指定专修厂险                            不投保
	意外伤害险          
	人生意外伤害险（100万）                 投保
	驾乘险（100万）                         投保
	----------------------------------------------------------------------
	险种保额明细
	交强险  投保/不投保
	车船税
	
	机动车损失险  投保/不投保
	第三者责任险  5万  10万  15万  20万  30万  50万  100万  150万  200万 不投保
	司机责任险种  1万  2万  3万  4万  5万  10万  15万  20万  不投保
	乘客责任险种  1万  2万  3万  4万  5万  10万  15万  20万  不投保
	盗抢险   投保/不投保
	涉水险   投保/不投保
	玻璃险   国产/进口/不投保
	划痕险   5千  1万  2万
	自燃损失险   投保/不投保
	指定专修厂险   投保/不投保
	人身意外伤害险   整理中
	驾乘险           在整理
	 * */
	pub.options.policyData ={
		data:{
			"JQX-JQX" : {
				name:"交强险",
				code:"JQX-JQX",
				arr:["投保","不投保"],
				isForce:true,//是否投保
				isBjmp:null,//不计免赔
				type:"",//所属类型
				value:"投保",//所选的值
			},
			"CCS-CCS":{
				name:"车船税",
				code:"CCS-CCS",
				arr:["投保","不投保"],
				isForce:true,//是否投保
				isBjmp:null,//不计免赔
				type:"",//所属类型
				value:"投保",//所选的值
			},
			"SYX-JDCSSX":{
				name:"机动车损失险",
				code:"SYX-JDCSSX",
				arr:["投保","不投保"],
				isForce:false,//是否投保boolean
				isBjmp:true,//不计免赔boolean
				type:"",
				value:"不投保"
			},
			"SYX-DSZZRX":{
				name:"第三者责任险",
				code:"SYX-DSZZRX",
				arr:["5万","10万","15万","20万","30万","50万","100万","150万","200万","不投保"],
				isForce:false,//是否投保boolean
				isBjmp:true,//不计免赔boolean
				type:"",
				value:"不投保"
			},
			"SYX-SJZRX":{
				name:"司机责任险",
				code:"SYX-SJZRX",
				arr:["1万","2万","3万","4万","5万","10万","15万","20万","不投保"],
				isForce:false,//是否投保boolean
				isBjmp:true,//不计免赔boolean
				type:"",
				value:"不投保"
			},
			"SYX-CKZRX":{
				name:"乘客责任险",
				code:"SYX-CKZRX",
				arr:["1万","2万","3万","4万","5万","10万","15万","20万","不投保"],
				isForce:false,//是否投保boolean
				isBjmp:true,//不计免赔boolean
				type:"",
				value:"不投保"
			},
			"SYX-DQX":{
				name:"盗抢险",
				code:"SYX-DQX",
				arr:["投保","不投保"],
				isForce:false,//是否投保boolean
				isBjmp:null,//不计免赔boolean
				type:"",
				value:"不投保"
			},
			"SYX-SSX":{
				name:"涉水险",
				code:"SYX-SSX",
				arr:["投保","不投保"],
				isForce:false,//是否投保boolean
				isBjmp:null,//不计免赔boolean
				type:"",
				value:"不投保"
			},
			"SYX-BLX":{
				name:"玻璃险",
				code:"SYX-BLX",
				arr:["国产","进口","不投保"],
				isForce:false,//是否投保boolean
				isBjmp:null,//不计免赔boolean
				type:"",
				value:"不投保"
			},
			"SYX-HHX":{
				name:"划痕险",
				code:"SYX-HHX",
				arr:["5千","1万","2万","不投保"],
				isForce:false,//是否投保boolean
				isBjmp:null,//不计免赔boolean
				type:"",
				value:"不投保"
			},
			"SYX-ZRSSX":{
				name:"自燃损失险",
				code:"SYX-ZRSSX",
				arr:["投保","不投保"],
				isForce:false,//是否投保boolean
				isBjmp:null,//不计免赔boolean
				type:"",
				value:"不投保"
			},
			"SYX-ZDZXCX":{
				name:"指定专修厂险",
				code:"SYX-ZDZXCX",
				arr:["投保","不投保"],
				isForce:false,//是否投保boolean
				isBjmp:null,//不计免赔boolean
				type:"",
				value:"不投保"
			},
			"YWX-RSYYSHX":{
				name:"人身意外伤害险",
				code:"YWX-RSYYSHX",
				arr:["投保","不投保"],
				isForce:false,//是否投保boolean
				isBjmp:null,//不计免赔boolean
				type:"",
				value:"不投保"
			},
			"YWX-JCX":{
				name:"驾乘险",
				code:"YWX-JCX",
				arr:["投保","不投保"],
				isForce:false,//是否投保boolean
				isBjmp:null,//不计免赔boolean
				type:"",
				value:"不投保"
			}
		},//1：基础款2：热销款3：高端款4：豪华无忧款
		list:[{
			title:"基础款",
			code:"1",
			topArr:[{
				name:"交强险",//
				code:"JQX-JQX",//
				isForce:true,//是否投保
				isBjmp:null,//不计免赔
				type:"",//所属类型
				value:"投保",//所选的值
			},{
				name:"车船税",
				code:"CCS-CCS",
				isForce:true,//是否投保
				isBjmp:null,//不计免赔
				type:"",
				value:"投保",
			}],
			SYX_Insurance:[{
				name:"第三者责任险",
				code:"SYX-DSZZRX",
				isForce:true,//是否投保boolean
				isBjmp:true,//不计免赔boolean
				type:"",
				value:"50万"
			}],
			YWX_Insurance:[{
				name:"人生意外伤害险",
				code:"YWX-RSYYSHX",
				isForce:false,//是否投保boolean
				isBjmp:null,//不计免赔 boolean
				type:"",
				value:"不投保"
			},{
				name:"驾乘险",
				code:"YWX-JCX",
				isForce:false,//是否投保boolean
				isBjmp:null,//不计免赔
				type:"",
				value:"不投保"
			}]
		},{
			title:"热销款",
			code:"2",
			topArr:[{
				name:"交强险",//
				code:"JQX-JQX",//
				isForce:true,//是否投保
				isBjmp:null,//不计免赔
				type:"",//所属类型
				value:"投保",//所选的值
			},{
				name:"车船税",
				code:"CCS-CCS",
				isForce:true,//是否投保
				isBjmp:null,//不计免赔
				type:"",
				value:"投保",
			}],
			SYX_Insurance:[{
				name:"机动车损失险",
				code:"SYX-JDCSSX",
				isForce:true,//是否投保boolean
				isBjmp:true,//不计免赔boolean
				type:"",
				value:"投保"
			},{
				name:"第三者责任险",
				code:"SYX-DSZZRX",
				isForce:true,//是否投保boolean
				isBjmp:true,//不计免赔boolean
				type:"",
				value:"50万"
			},{
				name:"司机责任险",
				code:"SYX-SJZRX",
				isForce:true,//是否投保boolean
				isBjmp:true,//不计免赔boolean
				type:"",
				value:"1万"
			},{
				name:"乘客责任险",
				code:"SYX-CKZRX",
				isForce:true,//是否投保boolean
				isBjmp:true,//不计免赔boolean
				type:"",
				value:"1万"
			}],
			YWX_Insurance:[{
				name:"人身意外伤害险",
				code:"YWX-RSYYSHX",
				isForce:false,//是否投保boolean
				isBjmp:null,//不计免赔 boolean
				type:"",
				value:"100万"
			},{
				name:"驾乘险",
				code:"YWX-JCX",
				isForce:false,//是否投保boolean
				isBjmp:null,//不计免赔
				type:"",
				value:"不投保"
			}]
		},{
			title:"高端款",
			code:"3",
			topArr:[{
				name:"交强险",//
				code:"JQX-JQX",//
				isForce:true,//是否投保
				isBjmp:null,//不计免赔
				type:"",//所属类型
				value:"投保",//所选的值
			},{
				name:"车船税",
				code:"CCS-CCS",
				isForce:true,//是否投保
				isBjmp:null,//不计免赔
				type:"",
				value:"投保",
			}],
			SYX_Insurance:[{
				name:"机动车损失险",
				code:"SYX-JDCSSX",
				isForce:true,//是否投保boolean
				isBjmp:true,//不计免赔boolean
				type:"",
				value:"投保"
			},{
				name:"第三者责任险",
				code:"SYX-DSZZRX",
				isForce:true,//是否投保boolean
				isBjmp:true,//不计免赔boolean
				type:"",
				value:"150万"
			},{
				name:"司机责任险",
				code:"SYX-SJZRX",
				isForce:true,//是否投保boolean
				isBjmp:true,//不计免赔boolean
				type:"",
				value:"5万"
			},{
				name:"乘客责任险",
				code:"SYX-CKZRX",
				isForce:true,//是否投保boolean
				isBjmp:true,//不计免赔boolean
				type:"",
				value:"5万"
			},{
				name:"盗抢险",
				code:"SYX-DQX",
				isForce:true,//是否投保boolean
				isBjmp:null,//不计免赔boolean
				type:"",
				value:"投保"
			},{
				name:"涉水险",
				code:"SYX-SSX",
				isForce:true,//是否投保boolean
				isBjmp:null,//不计免赔boolean
				type:"",
				value:"投保"
			},{
				name:"玻璃险",
				code:"SYX-BLX",
				isForce:true,//是否投保boolean
				isBjmp:null,//不计免赔boolean
				type:"",
				value:"国产"
			},{
				name:"划痕险",
				code:"SYX-HHX",
				isForce:true,//是否投保boolean
				isBjmp:null,//不计免赔boolean
				type:"",
				value:"1万"
			},{
				name:"自燃损失险",
				code:"SYX-ZRSSX",
				isForce:true,//是否投保boolean
				isBjmp:null,//不计免赔boolean
				type:"",
				value:"投保"
			},{
				name:"指定专修厂险",
				code:"SYX-ZDZXCX",
				isForce:true,//是否投保boolean
				isBjmp:null,//不计免赔boolean
				type:"",
				value:"投保"
			}],
			YWX_Insurance:[{
				name:"人身意外伤害险",
				code:"YWX-RSYYSHX",
				isForce:true,//是否投保boolean
				isBjmp:null,//不计免赔 boolean
				type:"",
				value:"100万"
			},{
				name:"驾乘险",
				code:"YWX-JCX",
				isForce:true,//是否投保boolean
				isBjmp:null,//不计免赔
				type:"",
				value:"100万"
			}]
		},{
			title:"豪华无忧款",
			code:"4",
			topArr:[{
				name:"交强险",//
				code:"JQX-JQX",//
				isForce:true,//是否投保
				isBjmp:null,//不计免赔
				type:"",//所属类型
				value:"投保",//所选的值
			},{
				name:"车船税",
				code:"CCS-CCS",
				isForce:true,//是否投保
				isBjmp:null,//不计免赔
				type:"",
				value:"投保",
			}],
			SYX_Insurance:[{
				name:"机动车损失险",
				code:"SYX-JDCSSX",
				isForce:true,//是否投保boolean
				isBjmp:true,//不计免赔boolean
				type:"",
				value:"投保"
			},{
				name:"第三者责任险",
				code:"SYX-DSZZRX",
				isForce:true,//是否投保boolean
				isBjmp:true,//不计免赔boolean
				type:"",
				value:"150万"
			},{
				name:"司机责任险",
				code:"SYX-SJZRX",
				isForce:true,//是否投保boolean
				isBjmp:true,//不计免赔boolean
				type:"",
				value:"10万"
			},{
				name:"乘客责任险",
				code:"SYX-CKZRX",
				isForce:true,//是否投保boolean
				isBjmp:true,//不计免赔boolean
				type:"",
				value:"10万"
			},{
				name:"盗抢险",
				code:"SYX-DQX",
				isForce:true,//是否投保boolean
				isBjmp:null,//不计免赔boolean
				type:"",
				value:"投保"
			},{
				name:"涉水险",
				code:"SYX-SSX",
				isForce:true,//是否投保boolean
				isBjmp:null,//不计免赔boolean
				type:"",
				value:"投保"
			},{
				name:"玻璃险",
				code:"SYX-BLX",
				isForce:true,//是否投保boolean
				isBjmp:null,//不计免赔boolean
				type:"",
				value:"国产"
			},{
				name:"划痕险",
				code:"SYX-HHX",
				isForce:true,//是否投保boolean
				isBjmp:null,//不计免赔boolean
				type:"",
				value:"2万"
			},{
				name:"自燃损失险",
				code:"SYX-ZRSSX",
				isForce:true,//是否投保boolean
				isBjmp:null,//不计免赔boolean
				type:"",
				value:"投保"
			},{
				name:"指定专修厂险",
				code:"SYX-ZDZXCX",
				isForce:true,//是否投保boolean
				isBjmp:null,//不计免赔boolean
				type:"",
				value:"投保"
			}],
			YWX_Insurance:[{
				name:"人身意外伤害险",
				code:"YWX-RSYYSHX",
				isForce:true,//是否投保boolean
				isBjmp:null,//不计免赔 boolean
				type:"",
				value:"100万"
			},{
				name:"驾乘险",
				code:"YWX-JCX",
				isForce:true,//是否投保boolean
				isBjmp:null,//不计免赔
				type:"",
				value:"100万"
			}]
		}],
		details:{
			topArr:[{
				name:"交强险",//
				code:"JQX-JQX",//
				isForce:true,//是否投保
				isBjmp:null,//不计免赔
				type:"",//所属类型
				value:"投保",//所选的值
			},{
				name:"车船税",
				code:"CCS-CCS",
				isForce:true,//是否投保
				isBjmp:null,//不计免赔
				type:"",
				value:"投保",
			}],
			SYX_Insurance:[{
				name:"机动车损失险",
				code:"SYX-JDCSSX",
				isForce:true,//是否投保boolean
				isBjmp:true,//不计免赔boolean
				type:"",
				value:"投保"
			},{
				name:"第三者责任险",
				code:"SYX-DSZZRX",
				isForce:true,//是否投保boolean
				isBjmp:true,//不计免赔boolean
				type:"",
				value:"150万"
			},{
				name:"司机责任险",
				code:"SYX-SJZRX",
				isForce:true,//是否投保boolean
				isBjmp:true,//不计免赔boolean
				type:"",
				value:"10万"
			},{
				name:"乘客责任险",
				code:"SYX-CKZRX",
				isForce:true,//是否投保boolean
				isBjmp:true,//不计免赔boolean
				type:"",
				value:"10万"
			},{
				name:"盗抢险",
				code:"SYX-DQX",
				isForce:false,//是否投保boolean
				isBjmp:null,//不计免赔boolean
				type:"",
				value:"不投保"
			},{
				name:"涉水险",
				code:"SYX-SSX",
				isForce:false,//是否投保boolean
				isBjmp:null,//不计免赔boolean
				type:"",
				value:"不投保"
			},{
				name:"玻璃险",
				code:"SYX-BLX",
				isForce:false,//是否投保boolean
				isBjmp:null,//不计免赔boolean
				type:"",
				value:"不投保"
			},{
				name:"划痕险",
				code:"SYX-HHX",
				isForce:false,//是否投保boolean
				isBjmp:null,//不计免赔boolean
				type:"",
				value:"不投保"
			},{
				name:"自燃损失险",
				code:"SYX-ZRSSX",
				isForce:false,//是否投保boolean
				isBjmp:null,//不计免赔boolean
				type:"",
				value:"不投保"
			},{
				name:"指定专修厂险",
				code:"SYX-ZDZXCX",
				isForce:false,//是否投保boolean
				isBjmp:null,//不计免赔boolean
				type:"",
				value:"不投保"
			}],
			YWX_Insurance:[{
				name:"人身意外伤害险",
				code:"YWX-RSYYSHX",
				isForce:false,//是否投保boolean
				isBjmp:null,//不计免赔 boolean
				type:"",
				value:"不投保"
			},{
				name:"驾乘险",
				code:"YWX-JCX",
				isForce:true,//是否投保boolean
				isBjmp:null,//不计免赔
				type:"",
				value:"不投保"
			}]
		}
	}
	//选择投保方案页面
	pub.selectcPolicy = {
		init:function(){
			pub.tempCarInfo = JSON.parse(localStorage.getItem("tempCarInfo"))
			require("swiper");
			require("swiperCSS");
			pub.selectcPolicy.htmlInit()
		},
		htmlInit:function(){
			var d = pub.options.policyData,o = d.list,html = '';
			for (var i in o) {
				html +='<div class="swiper-slide">'
				html +='	<div class="car_staging_box">'
				html +='		<div class="car_staging_box_title">'+ o[i].title +'</div>'
				html +='		<div class="car_staging_box_header">'
				
				html += topArrStr(o[i].topArr)
				
				html +='		</div>'
				html +='		<div class="car_staging_box_center">'
				html +='			<div class="car_staging_item">'
				html +='				<div class="car_staging_item_title">'
				html +='					<span class="color_re">商业险</span>'
				html +='				</div>'
				html +='				<div class="car_staging_item_box">'
				
				html += centerDetails(o[i].SYX_Insurance)
				
				html +='				</div>'
				html +='			</div>'
				html +='			<div class="car_staging_item">'
				html +='				<div class="car_staging_item_title">'
				html +='					<span class="color_re">意外险</span>'
				html +='				</div>'
				html +='				<div class="car_staging_item_box">'
				
				html += centerDetails(o[i].YWX_Insurance)
				
				html +='				</div>'
				html +='			</div>'
				html +='		</div>'
				html +='		<div class="edit_wrap">'
				html +='			<span class="edit" data="'+ o[i].code +'">修改</span>'
				html +='		</div>'
				html +='	</div>'
				html +='</div>'
			}
			
			$(".selectc_policy_box .selectc_policy_swiper_wrap").html(html).data("data",o);
			//头部的交强险和车船税
			function topArrStr (o){
				var str =  '';
				for (var i in o) {
					str +='<div class="car_staging_box_header_item clearfloat" data="'+ o[i].code+'">'
					str +='	<span class="float_left">'+o[i].name+'</span>'
					str +='	<span class="float_right">'+o[i].value+'</span>'
					str +='</div>'
				}
				return str
			}
			//中间的详情部分
			function centerDetails (o){
				var str = '';
				for (var i in o) {
					str +='<div class="car_staging_box_c_item clearfloat"  data="'+ o[i].code+'">'
					str +='	<span class="float_left">'+o[i].name+'</span>'
					if (o[i].isBjmp != null) {
						if(o[i].isBjmp == true){
							str +=' <span class="center actived">不计免赔</span>'
						}else{
							str +=' <span class="center">不计免赔</span>'
						}
						
					}
					str +='	<span class="float_right">'+o[i].value+'</span>'
					str +='</div>'
				}
				return str;
			}
			var banner = new Swiper(".selectc_policy_box",{
				autoHeight: true, //高度随内容变化
				pagination : '.swiper-pagination',
				watchSlidesProgress : true,
			})
		},
		insurance_price_query:{
			init: function(o) {
				common.ajaxPost($.extend({
					method: 'insurance_price_query',
				}, pub.userBasicParam , o , pub.tempCarInfo), function(d) {
					d.statusCode == "100000" && pub.selectcPolicy.insurance_price_query.apiData(d);
					d.statusCode != "100000" && common.prompt(d.statusStr)
				});
			},
			apiData: function(d) {
				var o = d.data,html = '';
				sessionStorage.setItem("priceList",JSON.stringify(d.data))
				//common.jumpLinkPlain("../html/new_insurance_price.html")
			}
		},
		eventHandle : {
			init:function(){
				/*跳转修改保单*/
				$(".selectc_policy_swiper_wrap").on("click",".edit",function(){
					common.jumpLinkPlain("../html/edit_policy_programme.html?type="+$(this).attr('data'))
				});
				/*确定跳转到询价页面*/
				$(".submit_btn90").on("click",function(){
					var index = $(".swiper-slide-active").index();
					var listData = $(".selectc_policy_box .selectc_policy_swiper_wrap").data("data");
					
					var r = listData[index];
					
					var arrs = pub.options.policyData.data;
					//复制默认值操作
					for (var i in r.topArr) {
						arrs[r.topArr[i].code] = JSON.stringify(r.topArr[i]);
					}
					for (var i in r.SYX_Insurance) {
						arrs[r.SYX_Insurance[i].code] = JSON.stringify(r.SYX_Insurance[i]);
					}
					for (var i in r.YWX_Insurance) {
						arrs[r.YWX_Insurance[i].code] = JSON.stringify(r.YWX_Insurance[i]);
					}
					//去除 没有赋值为字符串的默认项 如果包含数组 则去除数组后转为json字符串
					for (var i in arrs) {
						if (arrs[i].arr) {
							delete arrs[i]['arr'];
							arrs[i] = JSON.stringify(arrs[i])
						}
					}
					pub.selectcPolicy.insurance_price_query.init(arrs);
					//common.jumpLinkPlain("../html/new_insurance_price.html")
				})
				
			}
		}
	}
	//修改投保方案页面
	pub.editPolicy = {
		init:function(){
			pub.tempCarInfo = JSON.parse(localStorage.getItem("tempCarInfo"))
			pub.type = common.getUrlParam("type");
			require("Picker");
			require("PickerCss");
			
			var defData = pub.options.policyData.details;
			var nowData = pub.options.policyData.list[pub.type-1];
			var resultData = $.extend(true, defData, nowData);
			pub.options.resultData = resultData;
			pub.editPolicy.htmlInit(resultData);
			pub.editPolicy.selectInit(resultData);
			
		},
		htmlInit:function(resultData){
			var html = '';
			
			html += '<div class="edit_policy_programme_box_item">'
			html += '	<h3>交强险</h3>'
			html += '	<div class="edit_policy_programme_box_item_center">'
			html += 		topArrStr(resultData.topArr)
			html += '	</div>'
			html += '</div>'
			html += '<div class="edit_policy_programme_box_item">'
			html += '	<h3>商业险</h3>'
			html += '	<div class="edit_policy_programme_box_item_center">'
			html += 		centerDetails(resultData.SYX_Insurance)
			html += '	</div>'
			html += '</div>'
			html += '<div class="edit_policy_programme_box_item">'
			html += '	<h3>意外险</h3>'
			html += '	<div class="edit_policy_programme_box_item_center">'
			html += 		centerDetails(resultData.YWX_Insurance)
			html += '	</div>'
			html += '</div>'
			$(".edit_policy_programme_box").html(html);
			//头部的交强险和车船税
			function topArrStr (o){
				var str =  '';
				for (var i in o) {
					str +='<div class="edit_policy_programme_item '+ o[i].code+'" data="'+ o[i].code+'" isForce = "'+ (o[i].value != "不投保" ? true :false) +'" isBjmp = "'+ o[i].isBjmp +'">'
					str +='	<span class="left">'+o[i].name+'</span>'
					str +='	<span class="right icon"><b>'+o[i].value+'</b></span>'
					str +='</div>'
				}
				return str
			}
			//中间的详情部分
			function centerDetails (o){
				var str = '';
				for (var i in o) {
					str +='<div class="edit_policy_programme_item '+ o[i].code+'"  data="'+ o[i].code+'" isForce = "'+ (o[i].value != "不投保" ? true :false) +'" isBjmp = "'+ o[i].isBjmp +'">'
					str +='	<span class="left">'+o[i].name+'</span>'
					if (o[i].isBjmp != null) {
						if(o[i].isBjmp == true){
							str +=' <span class="center actived">不计免赔</span>'
						}else{
							str +=' <span class="center">不计免赔</span>'
						}
						
					}
					str +='	<span class="right icon"><b>'+o[i].value+'</b></span>'
					str +='</div>'
				}
				return str;
			}
		},
		selectInit : function(r){
			var arr = ['投保',"不投保"];
			var arrs = pub.options.policyData.data;
			//复制默认值操作
			for (var i in r.topArr) {
				arrs[r.topArr[i].code].value = r.topArr[i].value;
			}
			for (var i in r.SYX_Insurance) {
				arrs[r.SYX_Insurance[i].code].value = r.SYX_Insurance[i].value;
			}
			for (var i in r.YWX_Insurance) {
				arrs[r.YWX_Insurance[i].code].value = r.YWX_Insurance[i].value;
			}
			
			//交强险
			"JQX-JQX"
			pub.editPolicy.picker1 = new myPicker({
				cols: arrs["JQX-JQX"].arr,
				title:"请选择交强险",
				fontSize:18,
				onOkClick: function (values) {
					if(values[0] == "不投保"){
						$(".JQX-JQX").attr("isforce",false)
					}else{
						$(".JQX-JQX").attr("isforce",true)
					}
					$(".JQX-JQX .right.icon b").html(values[0])
				},
				setValues: [arrs["JQX-JQX"].value],
			})
			//车船税
			"CCS-CCS"
			pub.editPolicy.picker2 = new myPicker({
				cols: arrs["CCS-CCS"].arr,
				title:"请选择车船税",
				fontSize:18,
				onOkClick: function (values) {
					if(values[0] == "不投保"){
						$(".CCS-CCS").attr("isforce",false)
					}else{
						$(".CCS-CCS").attr("isforce",true)
					}
					$(".CCS-CCS .right.icon b").html(values[0])
				},
				setValues: [arrs["CCS-CCS"].value],
			})
			//机动车损失险
			"SYX-JDCSSX"
			pub.editPolicy.picker3 = new myPicker({
				cols: arrs["SYX-JDCSSX"].arr,
				title:"请选择机动车损失险",
				fontSize:18,
				onOkClick: function (values) {
					if(values[0] == "不投保"){
						$(".SYX-JDCSSX").attr("isforce",false)
					}else{
						$(".SYX-JDCSSX").attr("isforce",true)
					}
					$(".SYX-JDCSSX .right.icon b").html(values[0])
				},
				setValues: [arrs["SYX-JDCSSX"].value],
			})
			//第三方责任险
			"SYX-DSZZRX"
			pub.editPolicy.picker4 = new myPicker({
				cols: arrs["SYX-DSZZRX"].arr,
				title:"请选择第三方责任险",
				fontSize:18,
				onOkClick: function (values) {
					if(values[0] == "不投保"){
						$(".SYX-DSZZRX").attr("isforce",false)
					}else{
						$(".SYX-DSZZRX").attr("isforce",true)
					}
					$(".SYX-DSZZRX .right.icon b").html(values[0])
				},
				setValues: [arrs["SYX-DSZZRX"].value],
			})
			//司机责任险
			"SYX-SJZRX"
			pub.editPolicy.picker5 = new myPicker({
				cols: arrs["SYX-SJZRX"].arr,
				title:"请选择司机责任险",
				fontSize:18,
				onOkClick: function (values) {
					if(values[0] == "不投保"){
						$(".SYX-SJZRX").attr("isforce",false)
					}else{
						$(".SYX-SJZRX").attr("isforce",true)
					}
					$(".SYX-SJZRX .right.icon b").html(values[0])
				},
				setValues: [arrs["SYX-SJZRX"].value],
			})
			//乘客责任险
			"SYX-CKZRX"
			pub.editPolicy.picker6 = new myPicker({
				cols: arrs["SYX-CKZRX"].arr,
				title:"请选择乘客责任险",
				fontSize:18,
				onOkClick: function (values) {
					if(values[0] == "不投保"){
						$(".SYX-CKZRX").attr("isforce",false)
					}else{
						$(".SYX-CKZRX").attr("isforce",true)
					}
					$(".SYX-CKZRX .right.icon b").html(values[0])
				},
				setValues: [arrs["SYX-CKZRX"].value],
			})
			//强盗险
			"SYX-DQX"
			pub.editPolicy.picker7 = new myPicker({
				cols: arrs["SYX-DQX"].arr,
				title:"请选择",
				fontSize:18,
				onOkClick: function (values) {
					if(values[0] == "不投保"){
						$(".SYX-DQX").attr("isforce",false)
					}else{
						$(".SYX-DQX").attr("isforce",true)
					}
					$(".SYX-DQX .right.icon b").html(values[0])
				},
				setValues: [arrs["SYX-DQX"].value],
			})
			//涉水险
			"SYX-SSX"
			pub.editPolicy.picker8 = new myPicker({
				cols: arrs["SYX-SSX"].arr,
				title:"请选择",
				fontSize:18,
				onOkClick: function (values) {
					if(values[0] == "不投保"){
						$(".SYX-SSX").attr("isforce",false)
					}else{
						$(".SYX-SSX").attr("isforce",true)
					}
					$(".SYX-SSX .right.icon b").html(values[0])
				},
				setValues: [arrs["SYX-SSX"].value],
			})
			//玻璃险
			"SYX-BLX"
			pub.editPolicy.picker9 = new myPicker({
				cols: arrs["SYX-BLX"].arr,
				title:"请选择",
				fontSize:18,
				onOkClick: function (values) {
					if(values[0] == "不投保"){
						$(".SYX-BLX").attr("isforce",false)
					}else{
						$(".SYX-BLX").attr("isforce",true)
					}
					$(".SYX-BLX .right.icon b").html(values[0])
				},
				setValues: [arrs["SYX-BLX"].value],
			})
			//划痕险
			"SYX-HHX"
			pub.editPolicy.picker10= new myPicker({
				cols: arrs["SYX-HHX"].arr,
				title:"请选择",
				fontSize:18,
				onOkClick: function (values) {
					if(values[0] == "不投保"){
						$(".SYX-HHX").attr("isforce",false)
					}else{
						$(".SYX-HHX").attr("isforce",true)
					}
					$(".SYX-HHX .right.icon b").html(values[0])
				},
				setValues: [arrs["SYX-HHX"].value],
			})
			//自燃损失险
			"SYX-ZRSSX"
			pub.editPolicy.picker11= new myPicker({
				cols: arrs["SYX-ZRSSX"].arr,
				title:"请选择",
				fontSize:18,
				onOkClick: function (values) {
					if(values[0] == "不投保"){
						$(".SYX-ZRSSX").attr("isforce",false)
					}else{
						$(".SYX-ZRSSX").attr("isforce",true)
					}
					$(".SYX-ZRSSX .right.icon b").html(values[0])
				},
				setValues: [arrs["SYX-ZRSSX"].value],
			})
			//指定专修厂险
			"SYX-ZDZXCX"
			pub.editPolicy.picker12= new myPicker({
				cols: arrs["SYX-ZDZXCX"].arr,
				title:"请选择",
				fontSize:18,
				onOkClick: function (values) {
					if(values[0] == "不投保"){
						$(".SYX-ZDZXCX").attr("isforce",false)
					}else{
						$(".SYX-ZDZXCX").attr("isforce",true)
					}
					$(".SYX-ZDZXCX .right.icon b").html(values[0])
				},
				setValues: [arrs["SYX-ZDZXCX"].value],
			})
			
			
			
			//人身意外伤害险
			"YWX-RSYYSHX"
			pub.editPolicy.picker13 = new myPicker({
				cols: arrs["YWX-RSYYSHX"].arr,
				title:"请选择人身意外伤害险",
				fontSize:18,
				onOkClick: function (values) {
					if(values[0] == "不投保"){
						$(".YWX-RSYYSHX").attr("isforce",false)
					}else{
						$(".YWX-RSYYSHX").attr("isforce",true)
					}
					$(".YWX-RSYYSHX .right.icon b").html(values[0])
				},
				setValues: [arrs["YWX-RSYYSHX"].value],
			})
			//驾乘险
			"YWX-JCX"
			pub.editPolicy.picker14 = new myPicker({
				cols: arrs["YWX-JCX"].arr,
				title:"请选择驾乘险",
				fontSize:18,
				onOkClick: function (values) {
					if(values[0] == "不投保"){
						$(".YWX-JCX").attr("isforce",false)
					}else{
						$(".YWX-JCX").attr("isforce",true)
					}
					$(".YWX-JCX .right.icon b").html(values[0])
				},
				setValues: [arrs["YWX-JCX"].value],
			})
		},
		insurance_price_query:{
			init: function(o) {
				common.ajaxPost($.extend({
					method: 'insurance_price_query',
				}, pub.userBasicParam , o , pub.tempCarInfo), function(d) {
					d.statusCode == "100000" && pub.editPolicy.insurance_price_query.apiData(d);
					d.statusCode != "100000" && common.prompt(d.statusStr)
				});
			},
			apiData: function(d) {
				var o = d.data,html = '';
				sessionStorage.setItem("priceList",JSON.stringify(d.data))
				common.jumpLinkPlain("../html/new_insurance_price.html")
			}
		},
		eventHandle : {
			init:function(){
				pub.nood = $(".edit_policy_programme_box");
				
				//不计免赔选择事件
				pub.nood.on("click",".edit_policy_programme_item .center",function(){
					var nood = $(this);
					if (nood.is(".actived")) {
						nood.removeClass("actived");
						nood.parent().attr("isbjmp",false)
					}else{
						nood.addClass("actived");
						nood.parent().attr("isbjmp",true)
					}
				});
				
				//交强险
				"JQX-JQX"
				pub.nood.on("click",".JQX-JQX .right.icon",function(){
					var nood = $(this);
					pub.editPolicy.picker1.show();
				});
				//车船税
				"CCS-CCS"
				pub.nood.on("click",".CCS-CCS .right.icon",function(){
					var nood = $(this);
					pub.editPolicy.picker2.show();
				});
				//机动车损失险
				"SYX-JDCSSX"
				pub.nood.on("click",".SYX-JDCSSX .right.icon",function(){
					var nood = $(this);
					pub.editPolicy.picker3.show();
				});
				//第三方责任险
				"SYX-DSZZRX"
				pub.nood.on("click",".SYX-DSZZRX .right.icon",function(){
					var nood = $(this);
					pub.editPolicy.picker4.show();
				});
				//司机责任险
				"SYX-SJZRX"
				pub.nood.on("click",".SYX-SJZRX .right.icon",function(){
					var nood = $(this);
					pub.editPolicy.picker5.show();
				});
				//乘客责任险
				"SYX-CKZRX"
				pub.nood.on("click",".SYX-CKZRX .right.icon",function(){
					var nood = $(this);
					pub.editPolicy.picker6.show();
				});
				//强盗险
				"SYX-DQX"
				pub.nood.on("click",".SYX-DQX .right.icon",function(){
					var nood = $(this);
					pub.editPolicy.picker7.show();
				});
				//涉水险
				"SYX-SSX"
				pub.nood.on("click",".SYX-SSX .right.icon",function(){
					var nood = $(this);
					pub.editPolicy.picker8.show();
				});
				//玻璃险
				"SYX-BLX"
				pub.nood.on("click",".SYX-BLX .right.icon",function(){
					var nood = $(this);
					pub.editPolicy.picker9.show();
				});
				//划痕险
				"SYX-HHX"
				pub.nood.on("click",".SYX-HHX .right.icon",function(){
					var nood = $(this);
					pub.editPolicy.picker10.show();
				});
				//自燃损失险
				"SYX-ZRSSX"
				pub.nood.on("click",".SYX-ZRSSX .right.icon",function(){
					var nood = $(this);
					pub.editPolicy.picker11.show();
				});
				//指定专修厂险
				"SYX-ZDZXCX"
				pub.nood.on("click",".SYX-ZDZXCX .right.icon",function(){
					var nood = $(this);
					pub.editPolicy.picker12.show();
				});
				//人身意外伤害险
				"YWX-RSYYSHX"
				pub.nood.on("click",".YWX-RSYYSHX .right.icon",function(){
					var nood = $(this);
					pub.editPolicy.picker13.show();
				});
				//驾乘险
				"YWX-JCX"
				pub.nood.on("click",".YWX-JCX .right.icon",function(){
					var nood = $(this);
					pub.editPolicy.picker14.show();
				});
				
				$(".submit_btn90").on("click",function(){
					
					var options = {
						"JQX-JQX" : {
							name:"交强险",
							code:"JQX-JQX",
							isForce:pub.nood.find(".JQX-JQX").attr("isForce"),//是否投保
							isBjmp:pub.nood.find(".JQX-JQX").attr("isBjmp"),//不计免赔
							type:"",//所属类型
							value:pub.nood.find(".JQX-JQX .right.icon b").html(),//所选的值
						},
						"CCS-CCS":{
							name:"车船税",
							code:"CCS-CCS",
							isForce:pub.nood.find(".CCS-CCS").attr("isForce"),//是否投保
							isBjmp:pub.nood.find(".CCS-CCS").attr("isBjmp"),//不计免赔
							type:"",//所属类型
							value:pub.nood.find(".CCS-CCS .right.icon b").html(),//所选的值
						},
						"SYX-JDCSSX":{
							name:"机动车损失险",
							code:"SYX-JDCSSX",
							isForce:pub.nood.find(".SYX-JDCSSX").attr("isForce"),//是否投保
							isBjmp:pub.nood.find(".SYX-JDCSSX").attr("isBjmp"),//不计免赔
							type:"",//所属类型
							value:pub.nood.find(".SYX-JDCSSX .right.icon b").html(),//所选的值
						},
						"SYX-DSZZRX":{
							name:"第三者责任险",
							code:"SYX-DSZZRX",
							isForce:pub.nood.find(".SYX-DSZZRX").attr("isForce"),//是否投保
							isBjmp:pub.nood.find(".SYX-DSZZRX").attr("isBjmp"),//不计免赔
							type:"",//所属类型
							value:pub.nood.find(".SYX-DSZZRX .right.icon b").html(),//所选的值
						},
						"SYX-SJZRX":{
							name:"司机责任险",
							code:"SYX-SJZRX",
							isForce:pub.nood.find(".SYX-SJZRX").attr("isForce"),//是否投保
							isBjmp:pub.nood.find(".SYX-SJZRX").attr("isBjmp"),//不计免赔
							type:"",//所属类型
							value:pub.nood.find(".SYX-SJZRX .right.icon b").html(),//所选的值
						},
						"SYX-CKZRX":{
							name:"乘客责任险",
							code:"SYX-CKZRX",
							isForce:pub.nood.find(".SYX-CKZRX").attr("isForce"),//是否投保
							isBjmp:pub.nood.find(".SYX-CKZRX").attr("isBjmp"),//不计免赔
							type:"",//所属类型
							value:pub.nood.find(".SYX-CKZRX .right.icon b").html(),//所选的值
						},
						"SYX-DQX":{
							name:"盗抢险",
							code:"SYX-DQX",
							isForce:pub.nood.find(".SYX-DQX").attr("isForce"),//是否投保
							isBjmp:pub.nood.find(".SYX-DQX").attr("isBjmp"),//不计免赔
							type:"",//所属类型
							value:pub.nood.find(".SYX-DQX .right.icon b").html(),//所选的值
						},
						"SYX-SSX":{
							name:"涉水险",
							code:"SYX-SSX",
							isForce:pub.nood.find(".SYX-SSX").attr("isForce"),//是否投保
							isBjmp:pub.nood.find(".SYX-SSX").attr("isBjmp"),//不计免赔
							type:"",//所属类型
							value:pub.nood.find(".SYX-SSX .right.icon b").html(),//所选的值
						},
						"SYX-BLX":{
							name:"玻璃险",
							code:"SYX-BLX",
							isForce:pub.nood.find(".SYX-BLX").attr("isForce"),//是否投保
							isBjmp:pub.nood.find(".SYX-BLX").attr("isBjmp"),//不计免赔
							type:"",//所属类型
							value:pub.nood.find(".SYX-BLX .right.icon b").html(),//所选的值
						},
						"SYX-HHX":{
							name:"划痕险",
							code:"SYX-HHX",
							isForce:pub.nood.find(".SYX-HHX").attr("isForce"),//是否投保
							isBjmp:pub.nood.find(".SYX-HHX").attr("isBjmp"),//不计免赔
							type:"",//所属类型
							value:pub.nood.find(".SYX-HHX .right.icon b").html(),//所选的值
						},
						"SYX-ZRSSX":{
							name:"自燃损失险",
							code:"SYX-ZRSSX",
							isForce:pub.nood.find(".SYX-ZRSSX").attr("isForce"),//是否投保
							isBjmp:pub.nood.find(".SYX-ZRSSX").attr("isBjmp"),//不计免赔
							type:"",//所属类型
							value:pub.nood.find(".SYX-ZRSSX .right.icon b").html(),//所选的值
						},
						"SYX-ZDZXCX":{
							name:"指定专修厂险",
							code:"SYX-",
							isForce:pub.nood.find(".SYX-ZDZXCX").attr("isForce"),//是否投保
							isBjmp:pub.nood.find(".SYX-ZDZXCX").attr("isBjmp"),//不计免赔
							type:"",//所属类型
							value:pub.nood.find(".SYX-ZDZXCX .right.icon b").html(),//所选的值
						},
						"YWX-RSYYSHX":{
							name:"人身意外伤害险",
							code:"YWX-RSYYSHX",
							isForce:pub.nood.find(".YWX-RSYYSHX").attr("isForce"),//是否投保
							isBjmp:pub.nood.find(".YWX-RSYYSHX").attr("isBjmp"),//不计免赔
							type:"",//所属类型
							value:pub.nood.find(".YWX-RSYYSHX .right.icon b").html(),//所选的值
						},
						"YWX-JCX":{
							name:"驾乘险",
							code:"YWX-JCX",
							isForce:pub.nood.find(".YWX-JCX").attr("isForce"),//是否投保
							isBjmp:pub.nood.find(".YWX-JCX").attr("isBjmp"),//不计免赔
							type:"",//所属类型
							value:pub.nood.find(".YWX-JCX .right.icon b").html(),//所选的值
						}
					};
					for (var i in options) {
						if (options.hasOwnProperty(i)) {
							options[i]=JSON.stringify(options[i])
						}
					}
					pub.editPolicy.insurance_price_query.init(options)
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