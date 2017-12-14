seajs.config({
  // Configure alias
  alias: {

    'mobile-util':'js/mobile-util',
    'jquery': 'js/jquery-1.8.3.min',
    // 'jquery': 'https://g.alicdn.com/tb/m-marketing/0.0.27/jquery/jquery-1.8.2.min.js',
    'swiper':'js/swiper-3.3.1.min',
    'swiperCSS' : 'css/swiper-3.3.1.min.css',
    'mdData':'js/mdData',
    'sha1':'js/jquery.sha1',
    // 'weixinSDK':'http://res.wx.qq.com/open/js/jweixin-1.0.0.js',
    'weixinSDK':'js/jweixin-1.0.0.js',
    'LArea':'js/LArea',
    'LAreaCSS':'css/LArea.css',
    'LAreaData':'js/LAreaData',
    'LAreaData2':'js/LAreaData2',
    'map':'http://webapi.amap.com/maps?v=1.3&key=68f1f7850d75a2c422f417cc77331395&plugin=AMap.DragRoute',
  },
  preload: [
    'mobile-util',
    'jquery'
  ]
});
