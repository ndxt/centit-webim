require.config({
    "baseUrl":"plugins/",
    "shim":{
        "jquery.raty":["jquery"],
        "promise":{},
        "url":{},
        "fetch":{},
        "layui":{},
        "im-ie":{
            deps: ['jquery','jquery.raty','promise','url','fetch','layui','mustache','base64']
        }
    },
    "paths":{
        "mustache":"mustache.min.js",
        "jquery":"jquery-1.9.1.min.js",
        "base64":"base64.js",
        "promise":"shim/promise",
        "url":"url",
        "fetch":"shim/fetch",
        "layui":"../src/layui",
        "im-ie":"../im-ie"
    }
});

define(["mustache","jquery","layui","base64","promise","url","fetch"],function (mustache,$,layui,base64) {
    
})