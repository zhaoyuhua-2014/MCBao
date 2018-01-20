var common = {
	EVE:true
};
(function(){
	var m = document.createElement("meta"),
		h = document.getElementsByTagName("head")[0];
		m.setAttribute("http-equiv","Content-Security-Policy");
	if (common.EVE) {
		m.setAttribute("content","script-src 'self' 'unsafe-inline' 'unsafe-eval' http://api.91mcb.com/mcb_api/server/api.do; style-src 'self' 'unsafe-inline' 'unsafe-eval' ");
	}else{
		m.setAttribute("content","script-src 'self' 'unsafe-inline' 'unsafe-eval' http://api.91mcb.com/mcb_api/server/api.do; style-src 'self' 'unsafe-inline' 'unsafe-eval'");
	}
	
	var t = window.location.href;
	if(t.indexOf("store_map") < 0){
		h.appendChild(m)
	}
})(common);
