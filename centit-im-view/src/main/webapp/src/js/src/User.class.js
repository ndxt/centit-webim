define(["IM","mustache","jquery.raty"],function (IM,Mustache) {
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
                chatLog:layui.cache.dir + '../allChatLog.html'
            })
        }

        onAfterSendChatMessage(data, mode) {//BTU

            if (mode == 'askForService') {
                if (!!this.messageHandler) {
                    clearTimeout(this.messageHandler);
                }
                this.messageHandler = setTimeout(this.sendNotice.bind(this), 120000);
            }
        }

        scoreRate(sender, receiver) {//belong to User
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
                                // window.close();
                            }
                        });

                    }
                });
            });
        }



        //创造问题消息列表
        createProblemList(problems, data) {//belong to User
            this.showChatMessage($.extend({id: '0'}, data, {content: Mustache.render("[span class=hintMsg]{{msg}}[/span][ul]{{#options}} [li class=question id={{value}} data-type={{type}}][span]{{label}}[/span][/li]{{/options}} [/ul]", problems)}));

        }

        /**
         *发送提醒
         */
        sendNotice() {//belong to User
            this.showSystemMessage({
                id: '0',
                content: Mustache.render('客服可能暂时不在，请稍作等待')
            })

        }

        /**
         * 发送申请客服指令
         */
        sendAsk4ServiceCommand() {//belong to User
            let contentType = CONTENT_TYPE_ASKFORSERVICE
            let content = this.mine
            this.config.mode = MODE_SERVICE;
            // 添加指定客服
            console.log(this.config);
            if (this.config.customService) {
                $.extend(content, {customerService: this.config.customService, optId: this.config.optId})
            }

            this.sendCommandMessage({contentType, content})
        }



        /**
         * 发送申请机器人命令
         */
        sendAsk4QuestionCommand() {//belong to User
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
        sendCommandOver(receiver,senderName){//belong to User
            let contentType = CONTENT_TYPE_OVER;
            let content = {senderName};
            this.sendCommandMessage({contentType, content,receiver});
        }

        /**
         * 再次请求问题
         * @param contentType
         * @param content
         * @param receiver
         */
        sendQuestionRequest(content) {//BTU
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
        bindProblemListClickEvent() {//BTU
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
                name: '客服',
                avatar: ctx + SERVICE_AVATAR
            }
            let that = this;
            this.im.on('tool(robot)', function () {
                if(that.config.mode == MODE_QUESTION){
                    layer.open({
                        title: '结束会话'
                        , content: '是否结束本次会话，并切换回人工服务吗？'
                        , btn: ['确认', '取消']
                        , yes: function (index) {
                            that.config.mode = MODE_SERVICE;
                            that.sendAsk4ServiceCommand();
                            layer.close(index);
                        }
                    });
                }else{
                    layer.open({
                        title: '结束会话'
                        , content: '是否结束本次会话，并切换回智能问答吗？'
                        , btn: ['确认', '取消']
                        , yes: function (index) {
                            that.sendAsk4QuestionCommand();
                            that.changeUserName('智能客服');
                            that.config.mode = MODE_QUESTION;
                            layer.close(index);
                        }
                    });
                }

            });
            this.im.chat(this.window);
        }

        /**
         * 向后台发送评价
         * @param sender
         * @param receiver
         * @param score
         */
        sendEvaluatedScore(sender, receiver, score) {//belong to user
            let contentType = CONTENT_TYPE_FORM;
            let content = {};
            content.service = sender;
            content.formType = "praise";
            content.score = score
            // 添加指定客服
            this.sendCommandMessage({contentType, content, receiver})

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
    return UserIM;
})