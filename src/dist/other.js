
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
	pub.options = {};
	
	
	
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
    	}else if (pub.module_id == "myInfo"){
    		pub.myInfo.init()
			pub.myInfo.eventHandle.init();
    	}else if (pub.module_id == "packet"){
    		pub.packet.init()
			pub.packet.eventHandle.init();
    	}else if (pub.module_id == "garage"){
    		pub.garage.init()
			pub.garage.eventHandle.init();
    	}else if (pub.module_id == "myInfo"){
    		pub.myInfo.init()
			pub.myInfo.eventHandle.init();
    	}else if (pub.module_id == "editName"){
    		pub.editName.init()
			pub.editName.eventHandle.init();
    	}else if (pub.module_id == ""){
    		pub.packet.init()
			pub.packet.eventHandle.init();
    	}
    	pub.eventHandle.init()
	};
	module.exports = pub;
})