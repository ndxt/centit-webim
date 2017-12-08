/**
 *
 * 图片路径
 */
const Default_Avatar = 'http://tva3.sinaimg.cn/crop.0.0.180.180.180/7f5f6861jw1e8qgp5bmzyj2050050aa8.jpg'
const SERVICE_AVATAR = '/src/avatar/service.jpg';
const USER_AVATAR = '/src/avatar/user.png';


const MODE_SERVICE = 'askForService'
const MODE_QUESTION = 'askRobot'

const TYPE_USER = 'C'
const TYPE_SERVICE = 'S'

const MSG_TYPE_CHAT = "C";
const MSG_TYPE_GROUP = "G";
const MSG_TYPE_SYSTEM = "S";
const MSG_TYPE_COMMAND = "M";
const MSG_TYPE_BROADCAST = "B";
const MSG_TYPE_TOALL = "A";
const MSG_TYPE_QUESTION = "Q";

const CONTENT_TYPE_TEXT = "text";
const CONTENT_TYPE_FILE = "file";
const CONTENT_TYPE_IMAGE = "image";
const CONTENT_TYPE_REGISTER = "register";
const CONTENT_TYPE_READ = "read";
const CONTENT_TYPE_READGROUP = "readGroup";
const CONTENT_TYPE_SERVICE = "service";

const CONTENT_TYPE_OFFLINE = "offline";
const CONTENT_TYPE_ASKFORSERVICE = "askForService";
const CONTENT_TYPE_ASKROBOT = "askRobot";
const CONTENT_TYPE_NOTICE = "notice";
const CONTENT_TYPE_FORM = "form";
const CONTENT_TYPE_PUSH_FORM = "pushForm";
const CONTENT_TYPE_OVER = "over";

// 默认IM配置
const Default_IM_Config = {
    mode: MODE_QUESTION
}

//layim扩展部分
const THIS = 'layim-this';
const SHOW = 'layui-show';

window.ctx = _getContextPath();
//公共方法部分
function thisChat(){

    var layimChat = $(".layui-box.layui-layim-chat");
    if(!layimChat) return;
    if(!layimChat.length){
        var cont = $(".layui-unselect.layim-content .layim-chat");
        var to = JSON.parse(decodeURIComponent(cont.find('.layim-chat-tool').data('json')));
        return {
            elem: cont
            ,data: to
            ,textarea: cont.find('input')
        };
    }else{
        var index = $('.layim-chat-list .' + THIS).index();
        var cont = layimChat.find('.layim-chat').eq(index);
        var to = JSON.parse(decodeURIComponent(cont.find('.layim-chat-tool').data('json')));
        return {
            elem: cont
            ,data: to
            ,textarea: cont.find('textarea')
        };
    }
};


function closeThisChat() {
    var currentCloseBtn = $(".layim-this.layim-list-gray .layui-icon");
    if($(".layim-this.layim-list-gray .layui-icon").length > 0){
        currentCloseBtn.click();
    }else{
        $(".layui-layim-chat .layui-layer-ico.layui-layer-close.layui-layer-close1").click();
    }


}

//添加全局函数
String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, '');
}


/**
 * 工具函数：获取当前contentPath
 * @returns {*}
 * @private
 */

function _getContextPath() {
    let match = location.href.match(/^(http:\/\/.*?\/.*?)\//)

    if (match && match[1]) {
        return match[1]
    }
}

/**
 * 工具函数：获取时间戳
 * @returns {number}
 * @private
 */
function _getTimestamp() {
    return new Date().getTime()
}

function _parsedata(list) {
    if (!list || !list.map) return list

    return list.map(d => $.extend(d, {
        id: d.userCode,
        username: d.userName,
        avatar: ctx + USER_AVATAR
    })
).
    sort((me, other) => me.lastActiveDate >= other.lastActiveDate ? -1 : 1
)
.
    sort(me => 'O' === me.userState ? -1 : 1
)
}
//公共模板
var elemChatMain = ['<li {{ d.mine ? "class=layim-chat-mine" : "" }} {{# if(d.cid){ }}data-cid="{{d.cid}}"{{# } }}>'
    ,'<div class="layim-chat-user"><img src="{{ d.avatar }}"><cite>'
    ,'{{# if(d.mine){ }}'
    ,'<i>{{ layui.data.date(d.timestamp) }}</i>{{ d.username||"佚名" }}'
    ,'{{# } else { }}'
    ,'{{ d.username||"佚名" }}<i>{{ layui.data.date(d.timestamp) }}</i>'
    ,'{{# } }}'
    ,'</cite></div>'
    ,'<div class="layim-chat-text">{{ layui.data.content(d.content||"&nbsp") }}</div>'
    ,'</li>'].join('');