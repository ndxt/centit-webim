/*
    BTU:belong to User;
    BTS:belong to Service;
    CF: common Function;

 */
define(["mustache", "layui", "promise", "fetch", "url", "common.unit"],function (Mustache) {
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




        beforeInit() {
            return new Promise(resolve => resolve())
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
         * 发送聊天信息
         * @param mine
         * @param to
         */
        sendChatMessage({mine, to}) {//CF
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
        /**
         * 显示收到的聊天信息
         * @param id
         * @param content
         * @param senderName
         * @param system
         * @param timestamp
         */
        showChatMessage({id, content, timestamp, senderName, system = false}) {//rewrite TODO

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
        showSystemMessage(params) {//与上面的代码合并
            params.system = true
            this.showChatMessage(params)
        }



        /**
         * 根据接受到的不同命令采取不同操作
         * @param data
         * @param content
         */
        onCommandMessage(data, content) {//CF
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
         * 发送注册（上线）指令
         */
        sendRegisterCommand() {
            let contentType = CONTENT_TYPE_REGISTER,
                content = this.mine,
                receiver = this.window ? this.window.id : this.mine.id
            this.sendCommandMessage({contentType, content, receiver})
        }

        /**
         * 发送指令信息
         * @param contentType
         * @param content
         * @param receiver
         */
        sendCommandMessage({contentType, content, receiver}) {//CF
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







        sendWSMessage(data) {//CF
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
        onWSOpen() {//CF
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
        onWSMessage(res) {//CF
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
        onWSClose() {//CF
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

        changeUserName(name) {//CF
            this.$('.layim-chat-username').text(name)
        }
    }

    return IM;
})