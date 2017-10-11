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
                this.im.closeThisChat();
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
                    this.showSystemMessage($.extend({id: '0'}, data, {content: content.msg}))
                    this.changeUserName(content.userName)
                    $(".layim-chat-status").eq(0).data('userCode',content.userCode);
                    this.to = $.extend({id: content.userCode}, content)
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
            this.showChatMessage($.extend({id: '0'}, data, {content: Mustache.render("[span class=hintMsg]{{msg}}[/span][ul]{{#options}} [li class=question id={{value}} data-type={{type}}][a]{{label}}[/a][/li]{{/options}} [/ul]", problems)}));

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
         * 显示用户所点击的问题
         */
        showClickQuestion(content) {
            this.im.showQuestion({content: content.questionContent})
            this.sendQuestionRequest(content)
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
        }

        /**
         * WebSocket关闭打开事件
         */
        onWSClose() {
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


        initIM() {
            let ctx = this.contextPath;
            this.mine.avatar = ctx + USER_AVATAR;

            this.im.config({
                init: {
                    mine: this.mine
                },

                brief: true,

            })
        }
        renderHistoryMessage(sender, im, receiver) {

            let ctx = this.contextPath;
            var lastReadDate = new Date();
            lastReadDate.setDate(lastReadDate.getDate() + 1);
            var dateStr = lastReadDate.getFullYear() + '-' + (lastReadDate.getMonth() + 1) + '-' + lastReadDate.getDate();
            var pageNo = $(".layim-chat-username").data('pageNo' + sender) || 1;
            $.ajax({
                url: `${ctx}/service/webim/historyMessage/${receiver}/${sender}`,
                dataType: 'json',
                data: {pageNo: pageNo, lastReadDate: dateStr},
                success: function (res) {
                    var messageList = res.data.objList,
                        message;
                    if (messageList.length === 0) {
                        layer.msg('已无更多聊天消息！');
                    } else {
                        pageNo++;
                    }
                    for (var i = 0, length = messageList.length; i < length; i++) {
                        message = messageList[i];
                        console.log(message);
                        if (message.msgType == 'S') {
                            im.getMessage({
                                type: 'friend',
                                system: true,
                                reverse: true,
                                username: message.senderName,
                                id: '0',
                                fromid:'0',
                                content: JSON.parse(message.content).msg,
                                timestamp: message.sendTime,
                                avatar: ctx + USER_AVATAR
                            }, false)
                        } else if (message.sender == sender.trim()) {
                            im.getMessage({
                                type: 'friend',
                                system: false,
                                reverse: true,
                                username: message.senderName,
                                id: '0',
                                fromid:'0',
                                content: JSON.parse(message.content).msg,
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
                                content: JSON.parse(message.content).msg,
                                timestamp: message.sendTime,
                                avatar: ctx + USER_AVATAR
                            }, false);
                        }
                    }

                    $(".layim-chat-username").data('pageNo' + sender, pageNo);
                }
            });


        }

        afterInit() {
            this.bindProblemListClickEvent();
            let ctx = this.contextPath;
            this.window = {
                id: '0',
                type: 'friend',
                name: '历史消息',
                avatar: ctx + SERVICE_AVATAR
            }
            let that = this;

            this.im.chat(this.window);
            this.renderHistoryMessage(this.mine.receiver,this.im,this.mine.sender);
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


