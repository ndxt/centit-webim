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
                            im.showMineMessage({content: JSON.parse(message.content).msg, timestamp: message.sendTime});
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
            this.renderAllHistoryMessage(this.im,this.mine.userCode,that);
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
                        if (message.sender == sender.trim()) {
                            var avatar = ctx + USER_AVATAR
                        } else {
                            var avatar = ctx + SERVICE_AVATAR
                        }
                        im.getMessage({
                            type: 'friend',
                            system: false,
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

        renderHistoryMessage(sender, im, receiver, ctx) {
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
                            this.showSystemMessage(message);
                        } else if (message.sender == sender.trim()) {
                            im.getMessage({
                                type: 'friend',
                                system: false,
                                reverse: true,
                                username: message.senderName,
                                id: sender,
                                content: JSON.parse(message.content).msg,
                                timestamp: message.sendTime,
                                avatar: ctx + USER_AVATAR
                            }, false)
                        } else {
                            im.showMineMessage({content: JSON.parse(message.content).msg, timestamp: message.sendTime});
                        }
                    }

                    $(".layim-chat-username").data('pageNo' + sender, pageNo);
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
                    alias: 'return' //工具别名
                    , title: '请求退回' //工具名称
                    , icon: '&#xe627;' //工具图标，参考图标文档
                }
                    , {
                        alias: 'over'
                        , title: '结束会话'
                        , icon: '&#xe60a;'
                    }
                    , {
                        alias: 'quickReply'
                        , title: '快速回复'
                        , icon: '&#xe611;'
                    }]
                , isgroup: false
                , copyright: true
                ,chatLog: layui.cache.dir + 'css/modules/layim/html/chatlog.html'
            };

            if (!!this.mine.switchServiceBtn) {
                config.tool.push({
                    alias: 'transfer' //工具别名
                    , title: '切换客服' //工具名称
                    , icon: '&#xe65c;' //工具图标，参考图标文档
                });
            }
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
                        that.sendAsk4Evaluate(that.mine.userCode, $(".layim-chat-username").attr('userCode').trim());
                        layer.close(index);
                        that.im.closeThisChat();
                    }
                });
            }.bind(this));
            this.im.on('tool(transfer)', function () {

                const layer = this.layer;
                const mine = this.mine;
                const list = this.services.list;

                let result = []
                let service = null;

                layer.open({
                    title: '选择客服',
                    area: ['1024px', '480px'],
                    content: '<div id="service_container">' +
                    '<div style="width: 200px; height: 340px; border-right: 1px solid #ccc; float: left; padding-right: 20px;">' +
                    '<input type="text" name="title" id="service_search"  placeholder="输入类型、客服名称搜索" autocomplete="off" class="layui-input"><h5 id="service_text" style="padding: 15px 5px; color: #aaa;">未选中任何客服</h5>' +
                    '</div>' +
                    '<div style="margin-left: 230px; overflow: auto; height: 340px;">' +
                    '<ul id="service_list"></ul>' +
                    '</div>' +
                    '</div>',
                    yes: function () {
                        if (!service) {
                            layer.alert('没有选择客服！')
                            return;
                        }

                        this.sendSwitchServiceCommand(service.id, $(".layim-chat-username").attr('usercode'))

                        layer.open({
                            title: '切换客服'
                            , content: `已发送切换客服[${service.name}]命令！`
                            , btn: ['确定']
                            , btn1: function (index, layero) {
                                this.im.closeThisChat();
                                layer.close(index);
                            }.bind(this)
                        });

                    }.bind(this)
                })

                $.get(`${this.contextPath}/json/service.txt`, function (res) {
                    result = parseData(res)
                    createTree('#service_list', result)
                    let lastValue = null;
                    $('#service_search').change(function () {
                        let value = $(this).val()
                        if (value !== lastValue) {

                            // 清空查询条件
                            if (!value) {
                                createTree('#service_list', result)
                            } else {
                                let tempData = filterData(result, value)
                                console.log(tempData)
                                createTree('#service_list', tempData)
                            }

                            service = null;
                            $('#service_text').html('未选中任何客服')
                        }
                        lastValue = value;
                    })
                })

                function filterData(data, value) {

                    let temp = JSON.parse(JSON.stringify(data))

                    filterLeaf(temp, value)

                    return temp

                    /**
                     * 这段有点难理解，不过确实行得通。基于树的深度遍历。
                     * 1·如果非叶子节点符合搜索，则不再过滤它的子节点，全部展示
                     * 2·否则则一直深度遍历到最顶级叶子节点，判断是否符合搜索，不符合就删掉
                     * 3·返回时如果非叶子节点的子元素数为0，则删掉这个非叶子节点
                     * 4·最后过滤得出完整的新数据 #### 120000201101127894,客服-邓明
                     * @param data
                     * @param value
                     */
                    function filterLeaf(data, value) {
                        for (let i = data.length - 1; i >= 0; i--) {
                            let node = data[i]
                            if (node.children) {
                                if (node.name.indexOf(value) === -1) {
                                    filterLeaf(data[i].children, value)
                                    if (0 === node.children.length) {
                                        data.splice(i, 1)
                                    }
                                }

                                node.spread = true
                            }
                            else {
                                if (node.name.indexOf(value) === -1) {
                                    data.splice(i, 1)
                                }
                            }
                        }
                    }

                }

                function parseData(res) {
                    // 将文本格式转换为树形结构
                    const nodes = res.split('\n')
                            .map(line => line.replace(/\s/, '')
                )
                .
                    map(line => {
                        let level = 1
                        while ((line = line.replace('#', '')).startsWith('#')
                )
                    {
                        level++
                    }
                    line = line.split(',')
                    return {
                        level,
                        id: line[0],
                        name: line[1] || line[0],
                        // 如果是自己或者客服不在线
                        offline: mine.userCode === line[0] || list.some(user => (user.userCode === line[0] && user.userState === 'F') || list.every(user => user.userCode !== line[0]
                ))
                }
                })

                    // 重点是levels保存了上一个父级节点，所以数据的顺序一定要正确
                    const result = []
                    const levels = []
                    nodes.forEach(function (node) {
                        let level = node.level


                        if (level === 1) {
                            // 顶层直接放入
                            result.push(node)
                        }
                        else {
                            // 取最后一个父级节点，并放入
                            let last = levels[level - 1][levels[level - 1].length - 1]
                            if (last) {
                                last.children = last.children || []
                                last.children.push(node)
                            }
                        }

                        if (!levels[level]) {
                            levels[level] = []
                        }
                        levels[level].push(node)
                    })

                    return result;
                }

                function createTree(selector, data) {
                    const tree = $(selector)
                    tree.html('');

                    layui.tree({
                        elem: '#service_list' //传入元素选择器
                        , nodes: data,
                        click: function (node, li) {
                            if (!node.children) {
                                $('li.selected', tree).removeClass('selected')
                                li.addClass('selected')
                                $('#service_text').html(`已选中客服：${node.name}${node.offline ? '(不在线)' : ''}`)
                                service = node
                            }
                        }
                    });

                    tree.find('li').each(function () {
                        const li = $(this)
                        const node = li.data('node')
                        if (!node.children && node.offline) {
                            li.addClass('offline')
                        }
                    })
                }


                // if(!!$("div.layui-show .selectContainer").html()) {//判断Id = selectContainer的元素是否存在
                //     $('div.layui-show .serviceList').css('display','block');
                //     return;
                // }
                // that.renderDistributableServicesList();
            }.bind(this));

            this.im.on('tool(return)', function () {
                var preServiceCode = $('div.layui-show .layim-chat-username').data('preServiceCode') || "",
                    userCode = $(".layim-chat-username").attr('usercode');
                if (!!preServiceCode) {
                    this.sendSwitchServiceCommand(preServiceCode, userCode);
                } else {
                    layer.open({
                        title: '系统提示'
                        , content: '此用户不是转接的！'
                    });
                }
            }.bind(this))


            this.im.on('tool(quickReply)', function () {
                $.get(`${this.contextPath}/json/reply.txt`, function (res) {
                    if (!!$("div.layui-show .selectContainer").html()) {         //判断Id = selectContainer的元素是否存在
                        $('div.layui-show .serviceList').css('display', 'block');
                        return;
                    }
                    var replys = res.split('\n');
                    console.log(replys);
                    var jsonReply = {};
                    var replyArr = [];
                    for (var i = replys.length - 1; i + 1; i--) {
                        let relyObj = {"reply": replys[i]};
                        replyArr.push(relyObj);
                    }
                    jsonReply.replys = replyArr;


                    var render = Mustache.render('{{#replys}} <option class={{generateClass}}>{{reply}}</option>{{/replys}}', jsonReply);

                    var form = $('<div class="layui-form" style="display: inline-block;font-size: 16px;"></div>')
                    var selectContainer = $('<div  class="layui-form-item selectContainer"></div>');
                    var str = '<div class="layui-input-block" style="margin-left: 0;margin-top: 6px;">' +
                        '</div>';
                    var selectOption = '<select class="serviceList" name="service" lay-verify="required" style="display: block;width:150px;">' +
                        '<option value="">请选择回复</option>' +
                        render +
                        '</select>';
                    selectContainer.html(str);
                    form.append(selectContainer);

                    $('div.layui-show .layui-unselect.layim-chat-tool').append(form);
                    $('div.layui-show .selectContainer div.layui-input-block').html(selectOption);

                })
            }.bind(this));
            $("body").on('change', '.serviceList', function () {
                var reply = $(this).val();
                console.log(reply);
                $("div.layui-show .layim-chat-textarea textarea").val(reply);
                $(this).css('display', 'none');
            })

            // this.scoreRate();
            $(".layim-title p").html('在线咨询');
        }


        queryUnread() {
            let ctx = this.contextPath,
                userCode = this.mine.userCode,
                im = this.im,
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
                    data: {pageNo: 1, lastReadDate: dateStr},
                    success: function (res) {
                        var messageList = res.data.objList,
                            message;
                        for (let j = 0, length = messageList.length; j < length; j++) {
                            message = messageList[j];
                            console.log(message);
                            if (message.sender == arr[i]) {
                                im.getMessage({
                                    type: 'friend',
                                    system: false,
                                    reverse: true,
                                    fromid: message.sender,
                                    username: message.senderName,
                                    id: arr[i],
                                    content: JSON.parse(message.content).msg,
                                    timestamp: message.sendTime,
                                    avatar: ctx + USER_AVATAR
                                }, true)
                            }
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
