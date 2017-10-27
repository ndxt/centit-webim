require.config({
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
        "jquery.raty":"plugins/jquery.raty",
        "mustache":"plugins/mustache.min",
        "jquery":"plugins/jquery-1.9.1.min",
        "base64":"plugins/base64",
        "promise":"plugins/shim/promise.min",
        "url":"plugins/url",
        "fetch":"plugins/shim/fetch",
        "layui":"src/layui",
        "im-ie":"im-ie"
    }
});
// Load the main app module to start the app
