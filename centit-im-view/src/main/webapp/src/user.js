require(["../plugins/jquery-1.9.1.min", "../plugins/base64", "../src/js/ie/User.class"], function ($,base64,UserIM) {
    var result = parseURL(),
        token = result.params.token,
        params = JSON.parse(decodeURIComponent(base64.decode(token))),
        mine = {
            userCode: params.userCode,
            userName: params.userName,

        },

        config = {
            customService: params.customService,
            mode: params.mode,
            optId:params.optId || 'ww',//原先有默认值‘12345’
            osId: params.osId
        };
    document.title = 'User - ' + params.userName;

    layui.use('layim', function (im) {
        new UserIM(im, layui.$.extend({
            userType: 'C'
        }, mine), config)
    })
})
