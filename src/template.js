
define(function(require, exports, module){
	
	require('jquery');
	var common = require('../dist/common');

	// 命名空间

	var pub = {};
	
	// 接口处理命名空间
	pub.apiHandle = {
		//接口初始化
		init:function(){
			
		}
		//
	};
	
	//事件处理
	pub.eventHandle = {
		//时间初始化
		init:function(){
			
		}
	}
	pub.init = function(){
		pub.apiHandle.init();
		pub.eventHandle.init();
	};
	module.exports = pub;
})