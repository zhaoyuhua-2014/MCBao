
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
				code:"JQX",
				arr:["投保","不投保"]
			},
			"CCS-CCS":{
				name:"车船税",
				code:"CCS",
				arr:["投保","不投保"]
			},
			"SYX-JDCSSX":{
				name:"机动车损失险",
				code:"JDCSSX",
				arr:["投保","不投保"]
			},
			"":{
				name:"第三者责任险",
				code:"DSZZRX",
				arr:["5万","10万","15万","20万","30万","50万","100万","150万","200万","不投保"]
			},{
				name:"司机责任险",
				code:"SJZRX",
				arr:["1万","2万","3万","4万","5万","10万","15万","20万","不投保"]
			},{
				name:"乘客责任险",
				code:"CKZRX",
				arr:["1万","2万","3万","4万","5万","10万","15万","20万","不投保"]
			},{
				name:"盗抢险",
				code:"DQX",
				arr:["投保","不投保"]
			},{
				name:"涉水险",
				code:"SSX",
				arr:["投保","不投保"]
			},{
				name:"玻璃险",
				code:"BLX",
				arr:["国产","进口","不投保"]
			},{
				name:"划痕险",
				code:"HHX",
				arr:["5千","1万","2万","不投保"]
			},{
				name:"自燃损失险",
				code:"BLX",
				arr:["投保","不投保"]
			},{
				name:"指定专修厂险",
				code:"BLX",
				arr:["投保","不投保"]
			},{
				name:"人身意外伤害险",
				code:"BLX",
				arr:["投保","不投保"]
			},{
				name:"驾乘险",
				code:"BLX",
				arr:["投保","不投保"]
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
				isForce:true,//是否投保boolean
				isBjmp:null,//不计免赔
				type:"",
				value:"50万"
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
				isBjmp:true,//不计免赔 boolean
				type:"",
				value:"100万"
			},{
				name:"驾乘险",
				code:"YWX-JCX",
				isForce:true,//是否投保boolean
				isBjmp:null,//不计免赔
				type:"",
				value:"50万"
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
				value:"100万"
			},{
				name:"驾乘险",
				code:"YWX-JCX",
				isForce:true,//是否投保boolean
				isBjmp:null,//不计免赔
				type:"",
				value:"100万"
			}]
		}
	}
	//选择投保方案页面
	pub.selectcPolicy = {
		init:function(){
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
			
			$(".selectc_policy_box .selectc_policy_swiper_wrap").html(html);
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
		},
		eventHandle : {
			init:function(){
				/*跳转修改保单*/
				$(".selectc_policy_swiper_wrap").on("click",".edit",function(){
					common.jumpLinkPlain("../html/edit_policy_programme.html?type="+$(this).attr('data'))
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
			pub.type = common.getUrlParam("type");
			require("Picker");
			require("PickerCss");
			pub.editPolicy.htmlInit();
			pub.editPolicy.selectInit();
			
		},
		htmlInit:function(){
			var defData = pub.options.policyData.details;
			var nowData = pub.options.policyData.list[pub.type-1];
			var html = '';
			var resultData = $.extend(true, nowData, defData);
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
					str +='<div class="edit_policy_programme_item" data="'+ o[i].code+'">'
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
					str +='<div class="edit_policy_programme_item"  data="'+ o[i].code+'">'
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
		selectInit : function(){
			var arr = ['投保',"不投保"];
			//交强险
			"JQX-JQX"
			pub.editPolicy.picker1 = new myPicker({
				cols: arr,
				title:"请选择交强险",
				fontSize:18,
				onOkClick: function (values) {
					
				},
			})
			//车船税
			"CCS-CCS"
			pub.editPolicy.picker2 = new myPicker({
				cols: ['代缴',"不代缴"],
				title:"请选择车船税",
				fontSize:18,
				onOkClick: function (values) {},
			})
			//机动车损失险
			"SYX-JDCSSX"
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
				title:"请选择",
				fontSize:18,
				onOkClick: function (values) {},
			})
			//涉水险
			"Wading_insurance"
			pub.editPolicy.picker8 = new myPicker({
				cols: arr,
				title:"请选择",
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
				pub.nood = $(".edit_policy_programme_box");
				
				//不计免赔选择事件
				pub.nood.find(".edit_policy_programme_box_item").on("click",".edit_policy_programme_item .center",function(){
					var nood = $(this);
					if (nood.is(".actived")) {
						nood.removeClass("actived")
					}else{
						nood.addClass("actived");
					}
				});
				
				//交强险
				"JQX-JQX"
				pub.nood.find(".edit_policy_programme_box_item").on("click",".JQX-JQX .right.icon",function(){
					var nood = $(this);
					pub.editPolicy.picker1.show();
				});
				//车船税
				"CCS-CCS"
				pub.nood.find(".edit_policy_programme_box_item").on("click",".CCS-CCS .right.icon",function(){
					var nood = $(this);
					pub.editPolicy.picker2.show();
				});
				//机动车损失险
				"SYX-JDCSSX"
				pub.nood.find(".edit_policy_programme_box_item").on("click",".motor_vehicle_loss_insurance .right.icon",function(){
					var nood = $(this);
					pub.editPolicy.picker3.show();
				});
				//第三方责任险
				"SYX-DSZZRX"
				pub.nood.find(".edit_policy_programme_box_item").on("click",".Third_party_liability_insurance .right.icon",function(){
					var nood = $(this);
					pub.editPolicy.picker4.show();
				});
				//司机责任险
				"SJZRX"
				pub.nood.find(".edit_policy_programme_box_item").on("click",".Driver_liability_insurance .right.icon",function(){
					var nood = $(this);
					pub.editPolicy.picker5.show();
				});
				//乘客责任险
				"Passenger_liability_insurance"
				pub.nood.find(".edit_policy_programme_box_item").on("click",".Passenger_liability_insurance .right.icon",function(){
					var nood = $(this);
					pub.editPolicy.picker6.show();
				});
				//强盗险
				"Robber_risk_insurance"
				pub.nood.find(".edit_policy_programme_box_item").on("click",".Robber_risk_insurance .right.icon",function(){
					var nood = $(this);
					pub.editPolicy.picker7.show();
				});
				//涉水险
				"Wading_insurance"
				pub.nood.find(".edit_policy_programme_box_item").on("click",".Wading_insurance .right.icon",function(){
					var nood = $(this);
					pub.editPolicy.picker8.show();
				});
				//人身意外伤害险
				"Personal_accident_injury_insurance"
				pub.nood.find(".edit_policy_programme_box_item").on("click",".Personal_accident_injury_insurance .right.icon",function(){
					var nood = $(this);
					pub.editPolicy.picker9.show();
				});
				//驾乘险
				"Driving_risk_insurance"
				pub.nood.find(".edit_policy_programme_box_item").on("click",".Driving_risk_insurance .right.icon",function(){
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