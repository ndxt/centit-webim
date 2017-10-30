require(["../plugins/jquery-1.9.1.min", "../plugins/base64", "../src/js/ie/Service.class"], function ($,base64,ServiceIM) {
    var result = parseURL(),
        token = result.params.token,
        params = JSON.parse(decodeURIComponent(base64.decode(token)));
    mine = {
        userCode: params.userCode,
        userName: params.userName,
        switchServiceBtn: params.switchServiceBtn || ""
    },

        document.title = 'KF - ' + params.userName

    layui.use(['layim', 'layer'], function (im, layer) {
        new ServiceIM(im, layui.$.extend({
            userType: 'S'
        }, mine), {layer: layer})
    })
})

// define(['Params', 'ServiceIM'], function(Params, ServiceIM) {
//     new ServiceIM(Params.parse())
// })