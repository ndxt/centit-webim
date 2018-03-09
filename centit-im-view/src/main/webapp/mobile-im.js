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
function thisChat(){
    var cont = $(".layui-unselect.layim-content .layim-chat");
    var to = JSON.parse(decodeURIComponent(cont.find('.layim-chat-tool').data('json')));
    return {
        elem: cont
        ,data: to
        ,textarea: cont.find('input')
    };
};
//layim扩展部分
const THIS = 'layim-this';
const SHOW = 'layui-show';


function closeThisChat() {
    var currentCloseBtn = $(".layim-this.layim-list-gray .layui-icon");
    if($(".layim-this.layim-list-gray .layui-icon").length > 0){
        currentCloseBtn.click();
    }else{
        $(".layui-layim-chat .layui-layer-ico.layui-layer-close.layui-layer-close1").click();
    }


}

var elemChatMain = ['<li class="layim-chat-li{{ d.mine ? " layim-chat-mine" : "" }}">'
    ,'<div class="layim-chat-user"><img src="{{ d.avatar }}"><cite>'
    ,'{{ d.username||"佚名" }}'
    ,'</cite></div>'
    ,'<div class="layim-chat-text">{{ layui.data.content(d.content||"&nbsp;") }}</div>'
    ,'</li>'].join('');
//添加全局函数
String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, '');
}
window.ctx = _getContextPath();

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

;(function (global) {
    'use strict'


    class IM {
        constructor(im, mine, config) {
            this.im = im
            this.messageHandler = '';
            this.mine = mine
            this.config = $.extend({}, Default_IM_Config, config)
            this.$ = layui.jquery

            // 路径
            this.contextPath = _getContextPath()

            // 获取当前用户信息
            this.getMineInfo()

            this.beforeInit()
                .then(function () {

                    // 初始化IM
                    this.initIM()

                    this.im.on('sendMessage', this.onIMMessage.bind(this))

                    // 创建WS链接
                    this.createWSConnection()

                    // 创建完后做一些处理
                    this.afterInit()
                }.bind(this))
        }


        onAfterSendChatMessage(data, mode) {

            if (mode == 'askForService') {
                if (!!this.messageHandler) {
                    clearTimeout(this.messageHandler);
                }
                this.messageHandler = setTimeout(this.sendNotice.bind(this), 120000);
            }
        }

        beforeInit() {
            return new Promise(resolve => resolve())
        }

        sendEvaluatedScore(sender, receiver, score) {
            let contentType = CONTENT_TYPE_FORM;
            let content = {};
            content.service = sender;
            content.formType = "praise";
            content.score = score
            // 添加指定客服

            this.sendCommandMessage({contentType, content, receiver})

        }

        scoreRate(sender, receiver) {
            var that = this;
            layui.use('layer', function () {
                var layer = layui.layer;

                layer.open({
                    title: '温馨提示'
                    , content: Mustache.render('客服人员希望您对他的服务做出评价<div id="rate"></div>')
                    , yes: function (index) {
                        $('#rate').raty({
                            number: 5, //多少个星星设置
                            path: 'plugins/images',
                            hints: ['不满意', '不太满意', '基本满意', '满意', '非常满意'],
                            size: 24,
                            cancel: false,
                            click: function (score, evt) {
                                that.sendEvaluatedScore(sender, receiver, score);
                                layer.close(index);
                                window.close();
                            }
                        });

                    }
                });
            });
        }

        showNoticeMessage(data) {
            var friendCode = data.sender;
            var flag = 1;
            var $friendList = $('.layim-list-friend li[data-type="friend"]');
            for (var counter = 0, length = $friendList.length; counter < length; counter++) {
                var tempFriendCode = $friendList.eq(counter).attr("class").split(" ")[0].substr(12).trim();
                if (tempFriendCode == friendCode) {
                    flag = 0;
                    var state = data.content.state;
                    var tempNode = $friendList.eq(counter);
                    switch (state) {
                        case "online":
                            tempNode.removeClass("layim-list-gray");
                            break;
                        case "offline":
                            tempNode.addClass("layim-list-gray");
                            break;
                        default:

                            break;
                    }
                    var parentList = tempNode.parent();
                    parentList.prepend(tempNode.remove());
                }
            }
            if (flag == 1 && data.sender != this.mine.userCode) {
                var parent = $friendList.eq(0).parent();
                var newFriend = $friendList.eq(0).clone(true);
                newFriend.removeClass();
                newFriend.addClass("layim-friend" + data.sender)
                newFriend.find('span').html(data.senderName)
                parent.prepend(newFriend)
            }
        }

        onBroadcastMessage(data) {
            var type = data.contentType;

            switch (type) {
                case CONTENT_TYPE_NOTICE:
                    this.showNoticeMessage(data);
                    break;
                default:
                    break;
            }
        }

        /**
         * 初始化后实例做的事
         */
        afterInit() {

        }

        /**
         * 初始化IM
         */
        initIM() {
            this.im.config({
                init: {
                    mine: this.mine
                },
                brief: true
            })
        }

        /**
         * 获取当前用户信息
         * @returns {*|{id: *, name: string, avatar: string}}
         */
        getMineInfo() {
            if ('string' === typeof this.mine) {
                // TODO 从后台获取用户信息
                this.mine = {
                    id: this.mine,
                    osId: this.config.osId || 'centit',
                    username: '我',
                    avatar: ctx + USER_AVATAR
                }
            }

            let mine = this.mine
            mine.osId = this.config.osId || mine.osId || 'centit'
            mine.optId = this.config.optId || mine.optId || 'centit'
            mine.id = mine.id || mine.userCode  // 后台需要的名字是userCode
            mine.username = mine.username || mine.userName // 后台需要的名字是userName
            mine.avatar = mine.avatar || Default_Avatar
            mine.userType = mine.userType || 'C'

            return mine
        }


        /**
         * 创建WS链接
         */
        createWSConnection() {
            let contextPath = _getContextPath()
                , id = this.mine.id
                , wsHost

            if (contextPath) {
                wsHost = contextPath.replace(/^http/, 'ws')
                wsHost = `${wsHost}/im/${id}`
            }

            let socket = this.socket = new WebSocket(wsHost)

            socket.onopen = this.onWSOpen.bind(this)

            socket.onmessage = this.onWSMessage.bind(this)

            socket.onclose = this.onWSClose.bind(this)
        }

        /**
         * 显示收到的聊天信息
         * @param id
         * @param content
         * @param senderName
         * @param system
         * @param timestamp
         */
        showChatMessage({id, content, timestamp, senderName, system = false}) {

            this.im.getMessage({
                type: 'friend',
                system,
                username: senderName,
                id,
                content,
                timestamp: timestamp || _getTimestamp(),
                avatar: ctx + USER_AVATAR
            })
        }

        /**
         * 显示系统消息
         * @param params
         */
        showSystemMessage(params) {
            params.system = true
            this.showChatMessage(params)
        }

        /**
         * 接受到over命令时的操作
         * @param senderName
         */
        overCommandOp(senderName){
            var panelList = $('.layui-unselect.layim-chat-list li');
            var name;
            for (var j = 0, length = panelList.length; j < length; j++) {
                name = panelList[j].innerText;
                if (name.indexOf(senderName) != -1) {
                    $('.layui-unselect.layim-chat-list li').eq(j).find("i").click();
                }
            }
            if($('.layim-chat-username').eq(0).html().indexOf(senderName) != -1){
                closeThisChat();
            }
            layui.use('layer', function () {
                var layer = layui.layer;

                layer.open({
                    title: '会话结束'
                    , content: senderName + '客户结束了本次会话'
                });
            });
        }

        /**
         * 根据接受到的不同命令采取不同操作
         * @param data
         * @param content
         */
        onCommandMessage(data, content) {
            let contentType = data.contentType

            switch (contentType) {
                case CONTENT_TYPE_SERVICE:
                    this.showSystemMessage($.extend({id: '0'}, data, {content: content.msg}));
                    this.changeUserName(content.userName);
                    $(".layim-chat-status").eq(0).data('userCode',content.userCode);
                    this.to = $.extend({id: content.userCode}, content);
                    break
                case CONTENT_TYPE_PUSH_FORM:
                    this.scoreRate(this.mine.userCode, data.sender);
                    break;
                case CONTENT_TYPE_OVER:
                    this.overCommandOp(content.senderName);
                    break;
                default:
                    break
            }
        }

        /**
         * IM发送信息事件
         * @param res
         */
        onIMMessage(res) {
            let mine = res.mine,
                to = res.to

            // 用户时修改发送id
            to.id = this.to ? this.to.id : to.id

            // TODO 后期会判断不同的消息类别：文字、图片

            this.sendChatMessage({mine, to})

        }

        /**
         * 发送聊天信息
         * @param mine
         * @param to
         */
        sendChatMessage({mine, to}) {
            let data = {
                type: MSG_TYPE_CHAT,
                contentType: CONTENT_TYPE_TEXT,
                content: {
                    msg: mine.content || mine
                },
                sender: mine.id,
                senderName: mine.username,
                receiver: to.id,
                sendTime: _getTimestamp()
            }
            let mode = this.config.mode;
            if (mode == 'askForService') {
                this.sendWSMessage(data);
            }
            // //现在先写成这样，等后台写好再修改。
            if (mode == 'askRobot') {
                this.sendQuestionRequest({question: (data.content.msg || '').replace(/\n/, '')});
            }

            if (this.onAfterSendChatMessage) {
                this.onAfterSendChatMessage.call(this, data, mode)
            }
        }

        //创造问题消息列表
        createProblemList(problems, data) {
            this.showChatMessage($.extend({id: '0'}, data, {content: Mustache.render("[span class=hintMsg]{{msg}}[/span][ul]{{#options}} [li class=question id={{value}} data-type={{type}}][span]{{label}}[/span][/li]{{/options}} [/ul]", problems)}));

        }

        /**
         *发送提醒
         */
        sendNotice() {
            this.showSystemMessage({
                id: '0',
                content: Mustache.render('客服可能暂时不在，请稍作等待')
            })

        }

        /**
         * 发送注册（上线）指令
         */
        sendRegisterCommand() {
            let contentType = CONTENT_TYPE_REGISTER,
                content = this.mine,
                receiver = this.window ? this.window.id : this.mine.id
            this.sendCommandMessage({contentType, content, receiver})
        }

        /**
         * 发送申请客服指令
         */
        sendAsk4ServiceCommand() {
            let contentType = CONTENT_TYPE_ASKFORSERVICE
            let content = this.mine
            this.config.mode = MODE_SERVICE;
            // 添加指定客服
            if (this.config.customService) {
                $.extend(content, {customerService: this.config.customService, optId: this.config.optId})
            }

            this.sendCommandMessage({contentType, content})
        }

        /**
         * 发送切换客服指令
         *
         */
        sendSwitchServiceCommand(service, receiver) {
            let contentType = CONTENT_TYPE_SERVICE
            let content = {};
            content.service = service;
            // 添加指定客服

            this.sendCommandMessage({contentType, content, receiver})
        }


        /**
         * 发送申请机器人
         */
        sendAsk4QuestionCommand() {
            let contentType = CONTENT_TYPE_ASKROBOT;
            let content = this.mine;
            let currentServiceCode = $('.layim-chat-status').data('userCode');
            // this.config.mode = MODE_QUESTION;
            this.sendCommandMessage({contentType, content});
            let senderName = content.userName;
            this.sendCommandOver(currentServiceCode,senderName);
        }

        /**
         * 发送结束命令
         */
        sendCommandOver(receiver,senderName){
            let contentType = CONTENT_TYPE_OVER;
            let content = {senderName};
            this.sendCommandMessage({contentType, content,receiver});
        }

        /**
         * 发送指令信息
         * @param contentType
         * @param content
         * @param receiver
         */
        sendCommandMessage({contentType, content, receiver}) {
            let data = {
                type: MSG_TYPE_COMMAND,
                contentType,
                content,
                receiver,
                sender: this.mine.id,
                sendTime: _getTimestamp()
            }

            this.sendWSMessage(data)
        }

        /**
         * 再次请求问题
         * @param contentType
         * @param content
         * @param receiver
         */
        sendQuestionRequest(content) {
            let data = {
                type: MSG_TYPE_QUESTION,
                contentType: 'text',
                content: content,
                sender: 'robot',
                sendTime: _getTimestamp()
            }

            this.sendWSMessage(data)
        }



        /**
         * 将信息通过WS发送
         * @param data
         */
        bindProblemListClickEvent() {
            var that = this;
            $("body").on('click', '.question', function () {
                var type = $(this).attr('data-type')
                var keyValue = $(this).attr('id');
                var questionContent = $(this).text();
                switch (type) {
                    case 'http':
                        window.open(keyValue);
                        break;
                    case 'question':
                        that.showClickQuestion({question: keyValue, questionContent: questionContent});
                        break;
                    case 'command':
                        that.sendAsk4ServiceCommand();
                        break;
                    default:
                        console.warn('未知的命令类型：' + type);

                }
            })
        }

        sendWSMessage(data) {
            console.log(data);
            if (this.socket.readyState == '3') {
                window.location.reload();
                this.showSystemMessage({
                    id: '0',
                    content: Mustache.render('您已掉线，请<a onclick="window.location.reload();" style="color: RGB(98, 158, 229)">刷新</a>重新连接')
                })
            } else if (this.socket.readyState == '1') {
                this.socket.send(JSON.stringify(data))
            }
        }

        /**
         * WebSocket通道打开事件
         */
        onWSOpen() {
            this.sendRegisterCommand()

            if (this.mine.userType === TYPE_USER) {
                // 确保注册完成之后执行
                setTimeout(function () {
                    let mode = this.config.mode
                    if (mode === MODE_SERVICE) {
                        // 申请客服
                        this.sendAsk4ServiceCommand()
                    } else if (mode === MODE_QUESTION) {
                        this.sendAsk4QuestionCommand()
                    }
                }.bind(this), 1000)
            }
            console.log('WebSocket connection is opened.')
        }

        /**
         * WebSocket通道收到信息事件
         * @param res
         */
        onWSMessage(res) {
            let data = res.data
            if (!this.messageHandler) {
                clearTimeout(this.messageHandler);
            }
            try {
                data = JSON.parse(res.data)
                console.log(data)
            }
            catch (e) {
                // console.info(e)
            }
            if (data.contentType == "offline" && this.mine.userType == "S") {
                layui.use('layer', function () {
                    var layer = layui.layer;

                    layer.open({
                        title: '下线通知'
                        , content: data.content.msg
                    });
                });
            }
            switch (data.type) {
                case MSG_TYPE_CHAT:
                    this.showChatMessage($.extend({id: data.sender}, data, {content: data.content.msg}))
                    break
                case MSG_TYPE_SYSTEM:
                    this.showSystemMessage($.extend({id: '0'}, data, {
                        content: data.content.msg,
                        id: data.content.id,
                        data: data.content
                    }))
                    break
                case MSG_TYPE_COMMAND:
                    this.onCommandMessage(data, data.content)
                    break;
                case MSG_TYPE_QUESTION:
                    this.createProblemList(data.content, data);
                    break;

                case MSG_TYPE_BROADCAST:
                    // this.onBroadcastMessage(data);
                    break
                default:
                    console.warn(`未知的数据类型：${data.type}`)
            }
        }

        /**
         * WebSocket关闭打开事件
         */
        onWSClose() {
            window.location.reload();
            layui.use('layer', function () {
                var layer = layui.layer;

                layer.open({
                    title: '系统通知'
                    ,
                    content: Mustache.render('您已掉线，请<a onclick="window.location.reload();" style="color: RGB(98, 158, 229);cursor: pointer">刷新</a>重新连接')
                });
            });
        }

        changeUserName(name) {
            this.$('.layim-chat-username').text(name)
        }
    }

    global.IM = global.IM || IM

    /////////////////////////////////////


    /**
     * 工具函数：获取时间戳
     * @returns {number}
     * @private
     */
    function _getTimestamp() {
        return new Date().getTime()
    }


})(window)

;(function (global, IM) {
    'use strict'


    class UserIM extends IM {


        showQuestionMessage(content){
            var message = {};
            message.content = content;
            message.type = 'friend';
            message.id = '0';
            message.timestamp = message.sendTime || new Date().getTime();
            var cache = layui.layim.cache();
            message.username = cache.mine.username;
            message.fromid = cache.mine.userCode;
            message.mine = true;
            message.avatar = ctx + '/src/avatar/user.png';
            this.im.getMessage(message);

        }

        /**
         * 显示用户所点击的问题
         */
        showClickQuestion(content) {
            this.showQuestionMessage(content.question);
            this.sendQuestionRequest(content);
        }

        initIM() {
            let ctx = this.contextPath;
            this.mine.avatar = ctx + USER_AVATAR;

            this.im.config({
                init: {
                    mine: this.mine
                },
                uploadImage: {
                    url: `${ctx}/service/file/upload` //（返回的数据格式见下文）
                    //默认post
                }
                , uploadFile: {
                    url: `${ctx}/service/file/upload`  //（返回的数据格式见下文）
                    //默认post
                },
                brief: true,
                tool: [{
                    alias: 'robot' //工具别名
                    , title: '智能问答' //工具名称
                    , icon: '&#xe61a;' //工具图标，参考图标文档
                }],
                chatLog:layui.cache.dir + 'css/modules/layim/html/allChatLog.html'
            })
        }

        /**
         * 显示receiver所有的聊天记录
         * @param im
         * @param receiver
         */
        renderAllHistoryMessage( im, receiver,that) {
            var lastReadDate = new Date();
            lastReadDate.setDate(lastReadDate.getDate() + 1);
            var dateStr = lastReadDate.getFullYear() + '-' + (lastReadDate.getMonth() + 1) + '-' + lastReadDate.getDate();

            $.ajax({
                url: `${ctx}/service/webim/allHistoryMessage/${receiver}`,
                dataType: 'json',
                data: { lastReadDate: dateStr,pageSize:100000},
                success: function (res) {
                    var messageList = res.data.objList,
                        message;
                    if (messageList.length === 0) {
                        layer.msg('已无更多聊天消息！');
                    }
                    for (var i = 0, length = messageList.length; i < length; i++) {
                        message = messageList[i];
                        console.log(message);
                        var content = JSON.parse(message.content);
                        if(content.chatType == 'service' || message.sender=="robot"){

                        }else if (message.msgType == 'S') {
                            that.showSystemMessage({content: JSON.parse(message.content).msg, timestamp: message.sendTime});
                        } else if (message.sender == receiver.trim()) {
                            im.getMessage({
                                fromid:message.sender,
                                type: 'friend',
                                system: false,
                                reverse: true,
                                username: message.senderName,
                                id: '0',
                                content: content.msg,
                                timestamp: message.sendTime,
                                avatar: ctx + USER_AVATAR
                            }, false)
                        } else {
                            im.getMessage({
                                type: 'friend',
                                system: false,
                                reverse: true,
                                username: message.senderName,
                                id: '0',
                                content: content.msg,
                                timestamp: message.sendTime,
                                avatar: ctx + USER_AVATAR
                            }, false)

                        }
                    }


                }
            });


        }

        afterInit() {
            this.bindProblemListClickEvent();
            let ctx = this.contextPath;
            this.window = {
                id: '0',
                type: 'friend',
                name: '智能客服',
                avatar: ctx + SERVICE_AVATAR
            }
            let that = this;
            this.im.on('tool(robot)', function () {

                that.config.mode = MODE_QUESTION;

                layer.open({
                    title: '结束会话'
                    , content: '是否结束本次会话，并切换回智能问答吗？'
                    , btn: ['确认', '取消']
                    , yes: function (index) {
                        that.sendAsk4QuestionCommand();
                        that.changeUserName('智能客服');
                        layer.close(index);
                    }
                });
            });
            this.im.chat(this.window);
        }


        /**
         * 显示收到的聊天信息
         * @param content
         * @param senderName
         * @param system
         * @param timestamp
         */
        showChatMessage({content, timestamp, senderName, system = false}) {
            let ctx = this.contextPath;
            this.im.getMessage({
                type: 'friend',
                system,
                username: senderName,
                id: this.window.id,
                content,
                timestamp: timestamp || _getTimestamp(),
                avatar: ctx + SERVICE_AVATAR
            })
            if (this.messageHandler)
                clearTimeout(this.messageHandler);
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

    global.UserIM = global.UserIM || UserIM
})(window, window.IM)

;(function (global, IM) {
    'use strict'


    class ServiceIM extends IM {
        constructor(im, mine, config) {
            super(im, mine, config)
            let ctx = this.contextPath;
            this.layer = config.layer
            this.config.mode = 'askForService';//因为在发送消息时会判断是否为'askForService',最好改为在UserIM中重写方法

            this.services = {
                id: "0",
                groupname: '客服同事',
                list: []
            }

            this.users = {
                id: "1",
                groupname: '服务过的用户',
                list: []
            }
        }


        dealSwitchServiceMessage(params) {
            let that = this;
            var data = {};
            data.avatar = Default_Avatar;
            data.id = params.data.id;
            data.name = params.data.custName;
            data.system = false;
            data.temporary = true;
            data.timestamp = params.longSendTime;
            data.type = "friend";
            data.username = params.data.custName;
            layui.use('layer', function () {
                var layer = layui.layer;

                layer.open({
                    title: '系统通知'
                    , content: params.content
                    , btn: ['确认', '退回']
                    , yes: function (index) {
                        that.im.chat(data);
                        setTimeout(that.renderSwitchMessage(params.id, that.im, params.data.serviceCode, that.contextPath), 500);
                        console.log(1);
                        $('div.layui-show .layim-chat-username').data('preServiceCode', params.data.serviceCode);
                        layer.close(index);

                    }
                    , btn2: function () {
                        that.sendSwitchServiceCommand(params.data.serviceCode, params.data.id);
                    }
                });
            });

        }

        showSystemMessage(params) {
            params.system = true
            if (typeof params.data.type === 'undefined') {
                params.data.type = "";
            }
            if (params.data.type == 'A') {
                this.dealSwitchServiceMessage(params);
                return;
            }
            this.im.getMessage({
                type: 'friend',
                system: true,
                username: params.senderName,
                id: params.id,
                content: params.content
            });
        }

        queryUsers() {
            let ctx = this.contextPath,
                id = this.mine.id

            return fetch(`${ctx }/service/webimcust/cust/${id }?lastServiceDate=1949-10-1`)
                .then(res => res.json()
        )
        .
            then(res => res.data
        )
        }


        queryService() {
            let ctx = this.contextPath

            return fetch(`${ctx }/service/webimcust/services`)
                .then(res => res.json()
        )
        .
            then(res => res.data
        )
        }


        beforeInit() {

            return Promise.all([
                this.queryUsers(),
                this.queryService()
            ]).then(res => {
                this.users.list = _parsedata(res[0])
            this.services.list = _parsedata(res[1].filter(d => d.userCode !== this.mine.id)
        )
        })

        }

        renderSwitchMessage(sender, im, receiver, ctx) {
            var lastReadDate = new Date();
            lastReadDate.setDate(lastReadDate.getDate() + 1);
            var dateStr = lastReadDate.getFullYear() + '-' + (lastReadDate.getMonth() + 1) + '-' + lastReadDate.getDate();
            var pageNo = 1;
            $.ajax({
                url: `${ctx}/service/webim/historyMessage/${receiver}/${sender}`,
                async: false,
                dataType: 'json',
                data: {pageNo: pageNo, lastReadDate: dateStr, pageSize: 100000},
                success: function (res) {
                    var messageList = res.data.objList,
                        message;
                    if (messageList.length === 0) {
                        layer.msg('已无更多聊天消息！');
                    } else {
                        pageNo++;
                    }
                    for (var i = messageList.length - 1; i >= 0; i--) {
                        message = messageList[i];
                        console.log(message);
                        var system = false;
                        if(message.Type == "S"){
                            system = true;
                        }else if (message.sender == sender.trim()) {
                            var avatar = ctx + USER_AVATAR
                        } else {
                            var avatar = ctx + SERVICE_AVATAR
                        }
                        im.getMessage({
                            type: 'friend',
                            system: system ,
                            reverse: false,
                            username: message.senderName,
                            id: sender,
                            content: JSON.parse(message.content).msg,
                            timestamp: message.sendTime,
                            avatar: avatar
                        }, true)
                    }
                }
            });
        }


        /**
         * 绑定自定义的事件
         * @param im
         * @param receiver
         */
        bindEvent(im, receiver) {
            let ctx = this.contextPath,
                renderHistoryMessage = this.renderHistoryMessage;

            $("body").on('click','*[layim-event=chat]',function () {
                var ul = $(".layim-chat-main ul")
                if($("[layim-event=chatLog]").length == 0){
                    ul.before('<div class="layim-chat-system"><span layim-event="chatLog">查看更多记录</span></div>');
                }
            })

        }

        /**
         * 发送请求评价指令
         */
        sendAsk4Evaluate(service, receiver) {
            let contentType = CONTENT_TYPE_PUSH_FORM;
            let content = {};
            content.service = service;
            // 添加指定客服

            this.sendCommandMessage({contentType, content, receiver})

        }

        renderDistributableServicesList() {
            let services = this.services.list;
            let servicesJson = {};
            servicesJson.services = services;
            servicesJson.generateClass = function () {
                var className;
                if (this.userState == "F") {
                    className = "offline";
                } else {
                    className = "online";
                }
                return className;
            }

            var render = Mustache.render('{{#services}} <option class={{generateClass}} value={{userCode}}>{{userName}}</option>{{/services}}', servicesJson);

            var form = $('<div class="layui-form" style="display: inline-block;font-size: 16px;"></div>')
            var selectContainer = $('<div  class="layui-form-item selectContainer"></div>');
            var str = '<div class="layui-input-block" style="margin-left: 0;margin-top: 6px;">' +
                '</div>';
            var selectOption = '<select class="serviceList" name="service" lay-verify="required" style="display: block;">' +
                '<option value="">请选择客服</option>' +
                render +
                '</select>';
            selectContainer.html(str);
            form.append(selectContainer);

            $('div.layui-show .layui-unselect.layim-chat-tool').append(form);
            $('div.layui-show .selectContainer div.layui-input-block').html(selectOption);

        }

        initIM() {
            let ctx = this.contextPath;
            this.mine.avatar = ctx + SERVICE_AVATAR
            let config = {
                init: {
                    mine: this.mine,
                    friend: [
                        this.users,
                        this.services
                    ]
                }
                , uploadImage: {
                    url: `${ctx}/service/file/upload` //（返回的数据格式见下文）
                    //默认post
                }
                , uploadFile: {
                    url: `${ctx}/service/file/upload`  //（返回的数据格式见下文）
                    //默认post
                }
                , tool: [{
                        alias: 'over'
                        , title: '结束会话'
                        , iconUnicode: '&#xe60a;'
                    }]
                , isgroup: false
                , copyright: true
            };
            this.im.config(config)
        }

        afterInit() {
            let users = this.users.list,
                services = this.services.list;

            this.bindEvent(this.im, this.mine.userCode);

            ;
            [].concat(users, services).forEach(d => {
                if ('F' === d.userState
        )
            {
                this.im.setFriendStatus(d.userCode, 'offline')
            }
        })
            $('#layui-layer1').css('top', '0px');//在右上角显示窗体
            this.queryUnread();
            let that = this;
            this.im.on('tool(over)', function () {
                const layer = this.layer;
                layer.open({
                    title: '结束会话'
                    , content: '是否结束本次会话，并发送评价请求？'
                    , btn: ['确认', '取消']
                    , yes: function (index) {
                        var currentChatId = thisChat().data.id;
                        that.sendAsk4Evaluate(that.mine.userCode, currentChatId);
                        layer.close(index);
                        closeThisChat();
                    }
                });
            }.bind(this));
            this.im.on('chatlog', function(data, ul){
                console.log(data); //得到当前会话对象的基本信息
                console.log(ul); //得到当前聊天列表所在的ul容器，比如可以借助他来实现往上插入更多记录

                var userId = data.id,
                    cache = that.im.cache(),
                    serviceId = cache.mine.id,
                    localLogL = 0,
                    pageItem = 0;
                if(typeof cache.local.chatlog["friend" + userId] != "undefine"){
                    localLogL = cache.local.chatlog["friend" + userId].length;
                    pageItem = localLogL % 20;
                }
                var pageNo = $("#layui-m-layer0").data('pageNo' + userId) || (Math.floor(localLogL / 20) + 1);
                var lastReadDate = new Date();
                lastReadDate.setDate(lastReadDate.getDate() + 1);
                var dateStr = lastReadDate.getFullYear() + '-' + (lastReadDate.getMonth() + 1) + '-' + lastReadDate.getDate();

                $.ajax({
                    url: `${ctx}/service/webim/historyMessage/${serviceId}/${userId}`,
                    dataType: 'json',
                    data: {pageNo: pageNo, lastReadDate: dateStr},
                    success: function (res) {
                        var messageList = res.data.objList,
                            message;
                        var i = 0
                        if(pageNo == 1 && pageItem != 0){
                            i = pageItem - 1;
                        }
                        if (messageList.length === 0) {
                            layer.msg('已无更多聊天消息！');
                        } else {
                            pageNo++;
                        }
                        for (var length = messageList.length; i < length; i++) {
                            message = messageList[i];
                            console.log(message);
                            message.content = JSON.parse(message.content).msg;
                            message.type = 'friend';
                            message.id = message.sender;
                            message.timestamp = message.sendTime;
                            message.username = message.senderName;
                            message.avatar = ctx + '/src/avatar/service.jpg';
                            if(message.msgType == "S"){
                                message.system = true;
                            }
                            else if (message.sender == serviceId) {
                                message.mine = true;
                                message.avatar = ctx + '/src/avatar/service.jpg';
                            }else{
                                message.mine = false;
                                message.avatar = ctx + '/src/avatar/user.png';
                            }
                            if(message.system){
                                ul.prepend('<li class="layim-chat-system"><span>'+ message.content +'</span></li>');
                            } else if(message.content.replace(/\s/g, '') !== ''){
                                ul.prepend('<li class="layim-chat-system"><span>'+ layui.data.date(data.timestamp) +'</span></li>');
                                layui.use('laytpl',function () {
                                    var laytpl = layui.laytpl;
                                    ul.prepend(laytpl(elemChatMain).render(message));
                                })

                            }
                        }
                        $("#layui-m-layer0").data('pageNo' + userId, pageNo);
                    }
                });



        });
        }

        queryUnread() {
            let ctx = this.contextPath,
                userCode = this.mine.userCode,
                im = this.im,
                that = this,
                lastReadDate = new Date(),
                arr = [];
            lastReadDate.setDate(lastReadDate.getDate() + 1);
            var dateStr = lastReadDate.getFullYear() + '-' + (lastReadDate.getMonth() + 1) + '-' + lastReadDate.getDate();

            $.ajax({
                url: `${ctx}/service/webim/statUnread/${userCode}`,
                dataType: 'json',
                async: false,
                // data: {pageNo: pageNo,lastReadDate: dateStr},

                success: function (res) {
                    // console.log(res.data);
                    var unreadInfo = res.data, x;
                    console.log(res);
                    for (x in unreadInfo) {
                        // console.log(x);
                        var attr = x;
                        // console.log(unreadInfo[attr]);
                        if (unreadInfo[attr] > 0) {
                            arr.push(attr);
                        }

                    }
                    // console.log(arr);

                }
            });
            for (let i = 0, length = arr.length; i < length; i++) {

                $.ajax({
                    url: `${ctx}/service/webim/historyMessage/${userCode}/${arr[i]}`,
                    dataType: 'json',
                    async: false,
                    data: {pageNo: 0, lastReadDate: dateStr},
                    success: function (res) {
                        var messageList = res.data.objList,
                            message;
                        for (let j = 0, length = messageList.length; j < length; j++) {
                            message = messageList[j];
                            console.log(message);
                            var content = JSON.parse(message.content);
                            if(content.chatTye == "service"){
                                that.renderSwitchMessage(content.beforeId,im,message.sender,ctx);
                            }
                            im.getMessage({
                                type: 'friend',
                                system: false,
                                reverse: true,
                                username: message.senderName,
                                id: arr[i],
                                content: content.msg,
                                timestamp: message.sendTime,
                                avatar: ctx + USER_AVATAR
                            }, true)
                        }


                    }
                })
            }


        }


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

    global.ServiceIM = global.ServiceIM || ServiceIM
})(window, window.IM)
