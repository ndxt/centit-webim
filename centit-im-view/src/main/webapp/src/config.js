require.config({
    baseUrl: './',
    "shim":{
        "jquery.raty":["jquery"],
        "common.unit":["jquery"],
        "promise":{},
        "url":{},
        "fetch":{},
        "layui":{},
        "im-ie":{
            deps: ['jquery','jquery.raty','promise','url','fetch','layui','mustache','base64']
        }
    },
    "paths":{
        //支持AMD的模块
        "mustache":"../plugins/mustache.min",
        "jquery":"../plugins/jquery-1.9.1.min",
        "base64":"../plugins/base64",
        "IM":"src/js/ie/IM.class",
        "Service":"src/js/ie/Service.class",
        "User":"src/js/ie/User.class",
        //不支持AMD的模块
        "promise":"../plugins/shim/promise.min",
        "url":"../plugins/url",
        "fetch":"../plugins/shim/fetch",
        "layui":"layui",
        "im-ie":"../im-ie",
        "common.unit":"js/ie/common.unit",
        //jquery插件
        "jquery.raty":"../plugins/jquery.raty"
    },
    waitSeconds: 0
});
// Load the main app module to start the app
