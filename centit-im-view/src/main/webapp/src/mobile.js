/**
 * Created by lu_sn on 2017/11/8.
 */
require(["../plugins/jquery-1.9.1.min", "../plugins/base64", "../src/js/ie/Mobile.class"], function ($,base64,MobileIM) {
    var result = parseURL(),
        token = result.params.token,
        params = JSON.parse(decodeURIComponent(base64.decode(token)));
    mine = {
        userCode: params.userCode,
        userName: params.userName,
        switchServiceBtn:params.switchServiceBtn || ""
    },

        document.title = 'KF - ' + params.userName

    layui.use(['mobile', 'layer'], function (im, layer) {
       var mobile = layui.mobile
        ,im = mobile.layim;
        new MobileIM(im, layui.$.extend({
            userType: 'S'
        }, mine), {layer: layer})
    })
})

// define(['Params', 'ServiceIM'], function(Params, ServiceIM) {
//     new ServiceIM(Params.parse())
// })