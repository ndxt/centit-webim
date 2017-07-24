/**
 *此js是南大先腾即时通讯im系统的jquery插件,目的是在别的系统中使用im系统时，方便接入
 * 该插件的核心函数是im()：1、将调用它的div元素渲染成一个按钮
 *                      2、点击此按钮会在创建一个（如果没创建的话）用div实现的类dialog框其中包含了一个iframe
 * 函数im可以接受一个字符串类型配置contentPath
 * example:$.im.contentPath = 'xxxx'
 */
(function ($) {
    $.fn.extend({
        /**
         * @param {object}  config - 配置参数
         *        1.ifOpenWindow:是否新标签页打开窗口，默认为true
         *        2.ifRenderToBtn:是否给调用元素添加样式，默认为false
         *        3.mode:聊天模式选择，无默认值，目前有两种可选参数:'askForService'、'askRobot'
         *        4.customService:指定客服code，无默认值
         *        5.osId
         *        6.optId
         */
        "im": function (config) {


            //默认配置
            config = initConfig(config);
            var url = generateUrl(this, config);
            renderToBtn(this, config.ifRenderToBtn);
            if (config.ifOpenWindow === true) {


                $('.contactService').bind('click', function () {
                    window.open(url);
                });
            } else {
                createWindow(url);
                bindEvents();
            }
            return this;
        }
    });

    /**
     * @param
     * path:对应服务器上的访问地址，应为string类型
     */
    $.extend({

        "im": {
            contentPath: 'http://192.168.132.145:8080/qq' //默认参数地址参数
        },

        /**
         *
         * @param {Object} config - json对像token的原始值
         * @returns {string|*}
         */
        "serviceURL":function(config){
            var params = {
                userCode: config.userCode,
                userName: config.userName
            };


            token = 'token=' + base64.encode(encodeURIComponent(JSON.stringify(params)));
            url = $.im.contentPath + '/kefu.html?' + token;
            return url;
        }
    })

    //默认配置参数
    function initConfig(config){
        if (Object.prototype.toString.call(config) !== '[object Object]') {
            console.warn('参数格式错误');
            return false;
        }
        config.ifOpenWindow = config.ifOpenWindow || true;
        config.ifRenderToBtn = config.ifRenderToBtn || false;
        return config;
    }

    // 通过新建窗口的方式打开页面
    function openWindow(url) {
        window.open(url);
    }

    //判断是否为字符串
    function isString(str) {
        return typeof str === 'string';
    }



    //生成url地址
    function generateUrl(that, config) {


        var params = {
            userCode: that.attr('userCode'),
            userName: that.attr('userName'),
            customService:that.attr('service')
        };
        //这里是否可以用$.extend()函数完成
        if (!!config.mode) {
            params.mode = config.mode;
        }
        if(!!config.osId){
            params.osId = config.osId;
        }
        if(!!config.optId){
            params.optId = config.optId;
        }
        if(!!config.customService){
            params.customService = config.customService;
        }

            token = 'token=' + base64.encode(encodeURIComponent(JSON.stringify(params)));
        url = $.im.contentPath + '/user.html?' + token;
        return url;
    }

    //将params解析成url中的查询参数
    function stringifyParams(params) {
        if (!params) return;

        var ret = []
        for (var name in params) {
            ret.push(name + '=' + params[name])
        }

        return ret.join('&')
    }

    //创建弹出dialog
    function createWindow(url) {
        var containerWindow = $('<div id="simulateWindow" style="z-index:999;position:absolute;display:none;top:200px;left:400px;width: 600px;height: 550px;background-color: #00b3ee;">');
        var closeBtn = $('<a class="closeBtn" style="float:right;display:inline-block;font-size:20px;color:white;">x</a>');
        var dragColumn = $('<div class="dragColumn show" style="height:30px;width: 590px;">');
        var chatIframe = $('<iframe id="chatFrame" class="chatWindow" src=""  frameborder="no" border="0" marginwidth="0" marginheight="0" style="width: 600px;height: 520px;">');

        dragColumn.append(closeBtn);
        containerWindow.append(dragColumn);
        containerWindow.append(chatIframe);

        chatIframe.attr('src', url);

        $(document.body).append(containerWindow);
    }

    //将调用的div渲染成小窗式按钮
    function renderToBtn(that, ifRenderToBtn) {

        // var closeBtn = $('<a class="closeBtn" style="float: right;display: inline;width: 15%;height: 15%;font-size: 22px;color:white;">x</a>');
        // that.append(closeBtn);
        that.addClass('contactService');
        if (ifRenderToBtn) {
            that.text('联系客服');
            that.css({
                'z-index': '999',
                'position': 'fixed',
                'bottom': '20px',
                'right': '10px',
                'width': '150px',
                'height': '150px',
                'line-height': '150px',
                'font-size': '30px',
                'text-align': 'center',
                'color': 'white',
                'background-color': '#7cc5e5',
                'cursor':'pointer'
            });
        }
    }

    //给按钮和窗口绑定事件
    function bindEvents() {
        //模拟拖拽
        $(".show").mousedown(function (e)//e鼠标事件
        {
            $(this).css("cursor", "move");//改变鼠标指针的形状

            var offset = $('#simulateWindow').offset();//DIV在页面的位置
            var x = e.pageX - offset.left;//获得鼠标指针离DIV元素左边界的距离
            var y = e.pageY - offset.top;//获得鼠标指针离DIV元素上边界的距离
            $(document).bind("mousemove", function (ev)//绑定鼠标的移动事件，因为光标在DIV元素外面也要有效果，所以要用doucment的事件，而不用DIV元素的事件
            {
                $("#simulateWindow").stop();//加上这个之后

                var _x = ev.pageX - x;//获得X轴方向移动的值
                var _y = ev.pageY - y;//获得Y轴方向移动的值

                $("#simulateWindow").animate({left: _x + "px", top: _y + "px"}, 1);
            });

        });

        $(document).mouseup(function () {
            $(".show").css("cursor", "default");
            $(this).unbind("mousemove");
        })
        $('.contactService').hover(function () {
            $(this).css('cursor', 'pointer');
        });
        //设置关闭按钮的鼠标悬停样式
        $('.closeBtn').hover(function () {
            $(this).css({'color': 'red', 'text-decoration': 'none', 'cursor': 'pointer'});
        }, function () {
            $(this).css({'color': 'white'});
        });
        //
        $('.contactService').bind('click', function () {
            $('#chatFrame').attr('src', $('#chatFrame').attr('src'));
            $('#simulateWindow').css('display', 'block');
            // $(this).css('display','none');

        });

        $('#simulateWindow .closeBtn').bind('click', function () {
            $('#simulateWindow').css('display', 'none');
            $('.contactService').css('display', 'block');
        })
    }
})(jQuery)