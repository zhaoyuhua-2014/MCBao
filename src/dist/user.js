define(function(require, exports, module){

	require('jquery');
	var common = require('../dist/common');

	// 命名空间

	var pub = {};
	
	

	pub.init = function(){

		pub.eventHandle.init(); // 公共模块
		
		
	};

	module.exports = pub;

});