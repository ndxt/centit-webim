define(["IM","common.unit"],function (IM) {
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
    return UserIM;
})