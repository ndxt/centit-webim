'use strict';

/**
 *
 * 图片路径
 */
var Default_Avatar = 'http://tva3.sinaimg.cn/crop.0.0.180.180.180/7f5f6861jw1e8qgp5bmzyj2050050aa8.jpg';
var SERVICE_AVATAR = '/src/avatar/service.jpg';
var USER_AVATAR = '/src/avatar/user.png';

var MODE_SERVICE = 'askForService';
var MODE_QUESTION = 'askRobot';

var TYPE_USER = 'C';
var TYPE_SERVICE = 'S';

var MSG_TYPE_CHAT = "C";
var MSG_TYPE_GROUP = "G";
var MSG_TYPE_SYSTEM = "S";
var MSG_TYPE_COMMAND = "M";
var MSG_TYPE_BROADCAST = "B";
var MSG_TYPE_TOALL = "A";
var MSG_TYPE_QUESTION = "Q";

var CONTENT_TYPE_TEXT = "text";
var CONTENT_TYPE_FILE = "file";
var CONTENT_TYPE_IMAGE = "image";
var CONTENT_TYPE_REGISTER = "register";
var CONTENT_TYPE_READ = "read";
var CONTENT_TYPE_READGROUP = "readGroup";
var CONTENT_TYPE_SERVICE = "service";

var CONTENT_TYPE_OFFLINE = "offline";
var CONTENT_TYPE_ASKFORSERVICE = "askForService";
var CONTENT_TYPE_ASKROBOT = "askRobot";
var CONTENT_TYPE_NOTICE = "notice";
var CONTENT_TYPE_FORM = "form";
var CONTENT_TYPE_PUSH_FORM = "pushForm";
var CONTENT_TYPE_OVER = "over";

// 默认IM配置
var Default_IM_Config = {
    mode: MODE_QUESTION

    //layim扩展部分
};var THIS = 'layim-this';
var SHOW = 'layui-show';

window.ctx = _getContextPath();
//公共方法部分
function thisChat() {

    var layimChat = $(".layui-box.layui-layim-chat");
    if (!layimChat) return;
    if (!layimChat.length) {
        var cont = $(".layui-unselect.layim-content .layim-chat");
        var to = JSON.parse(decodeURIComponent(cont.find('.layim-chat-tool').data('json')));
        return {
            elem: cont,
            data: to,
            textarea: cont.find('input')
        };
    } else {
        var index = $('.layim-chat-list .' + THIS).index();
        var cont = layimChat.find('.layim-chat').eq(index);
        var to = JSON.parse(decodeURIComponent(cont.find('.layim-chat-tool').data('json')));
        return {
            elem: cont,
            data: to,
            textarea: cont.find('textarea')
        };
    }
};

function closeThisChat() {
    var currentCloseBtn = $(".layim-this.layim-list-gray .layui-icon");
    if ($(".layim-this.layim-list-gray .layui-icon").length > 0) {
        currentCloseBtn.click();
    } else {
        if ($(".layui-layim-chat .layui-layer-ico.layui-layer-close.layui-layer-close1").length > 0) {
            $(".layui-layim-chat .layui-layer-ico.layui-layer-close.layui-layer-close1").click();
        } else {
            var layero = $('.layui-m-layer .layim-title .layim-chat-back').parents('.layui-m-layer').eq(0),
                index = layero.attr('index'),
                PANEL = '.layim-panel';
            setTimeout(function () {
                $('.layui-m-layer .layim-title .layim-chat-back').parents(PANEL).eq(0).removeClass('layui-m-anim-left').addClass('layui-m-anim-rout');
                layero.prev().find(PANEL).eq(0).removeClass('layui-m-anim-lout').addClass('layui-m-anim-right');
                layero.remove();
            }, 500);
        }
    }
}

//添加全局函数
String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, '');
};

/**
 * 工具函数：获取当前contentPath
 * @returns {*}
 * @private
 */

function _getContextPath() {
    var match = location.href.match(/^(http:\/\/.*?\/.*?)\//);

    if (match && match[1]) {
        return match[1];
    }
}

/**
 * 工具函数：获取时间戳
 * @returns {number}
 * @private
 */
function _getTimestamp() {
    return new Date().getTime();
}

function _parsedata(list) {
    if (!list || !list.map) return list;

    return list.map(function (d) {
        return $.extend(d, {
            id: d.userCode,
            username: d.userName,
            avatar: ctx + USER_AVATAR
        });
    }).sort(function (me, other) {
        return me.lastActiveDate >= other.lastActiveDate ? -1 : 1;
    }).sort(function (me) {
        return 'O' === me.userState ? -1 : 1;
    });
}
//公共模板
var elemChatMain = ['<li {{ d.mine ? "class=layim-chat-mine" : "" }} {{# if(d.cid){ }}data-cid="{{d.cid}}"{{# } }}>', '<div class="layim-chat-user"><img src="{{ d.avatar }}"><cite>', '{{# if(d.mine){ }}', '<i>{{ layui.data.date(d.timestamp) }}</i>{{ d.username||"佚名" }}', '{{# } else { }}', '{{ d.username||"佚名" }}<i>{{ layui.data.date(d.timestamp) }}</i>', '{{# } }}', '</cite></div>', '<div class="layim-chat-text">{{ layui.data.content(d.content||"&nbsp") }}</div>', '</li>'].join('');