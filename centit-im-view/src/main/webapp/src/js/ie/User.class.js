"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(["IM", "mustache", "jquery.raty"], function (IM, Mustache) {
    var UserIM = function (_IM) {
        _inherits(UserIM, _IM);

        function UserIM() {
            _classCallCheck(this, UserIM);

            return _possibleConstructorReturn(this, (UserIM.__proto__ || Object.getPrototypeOf(UserIM)).apply(this, arguments));
        }

        _createClass(UserIM, [{
            key: "showQuestionMessage",
            value: function showQuestionMessage(content) {
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

        }, {
            key: "showClickQuestion",
            value: function showClickQuestion(content) {
                this.showQuestionMessage(content.question);
                this.sendQuestionRequest(content);
            }
        }, {
            key: "initIM",
            value: function initIM() {
                var ctx = this.contextPath;
                this.mine.avatar = ctx + USER_AVATAR;

                this.im.config({
                    init: {
                        mine: this.mine
                    },
                    uploadImage: {
                        url: ctx + "/service/file/upload" //（返回的数据格式见下文）
                        //默认post
                    },
                    uploadFile: {
                        url: ctx + "/service/file/upload" //（返回的数据格式见下文）
                        //默认post
                    },
                    brief: true,
                    tool: [{
                        alias: 'robot' //工具别名
                        , title: '智能问答' //工具名称
                        , icon: '&#xe61a;' //工具图标，参考图标文档
                    }],
                    chatLog: layui.cache.dir + '../allChatLog.html'
                });
            }
        }, {
            key: "onAfterSendChatMessage",
            value: function onAfterSendChatMessage(data, mode) {
                //BTU

                if (mode == 'askForService') {
                    if (!!this.messageHandler) {
                        clearTimeout(this.messageHandler);
                    }
                    this.messageHandler = setTimeout(this.sendNotice.bind(this), 120000);
                }
            }
        }, {
            key: "scoreRate",
            value: function scoreRate(sender, receiver) {
                //belong to User
                var that = this;
                layui.use('layer', function () {
                    var layer = layui.layer;

                    layer.open({
                        title: '温馨提示',
                        content: Mustache.render('客服人员希望您对他的服务做出评价<div id="rate"></div>'),
                        yes: function yes(index) {
                            $('#rate').raty({
                                number: 5, //多少个星星设置
                                path: 'plugins/images',
                                hints: ['不满意', '不太满意', '基本满意', '满意', '非常满意'],
                                size: 24,
                                cancel: false,
                                click: function click(score, evt) {
                                    that.sendEvaluatedScore(sender, receiver, score);
                                    layer.close(index);
                                    window.close();
                                }
                            });
                        }
                    });
                });
            }

            //创造问题消息列表

        }, {
            key: "createProblemList",
            value: function createProblemList(problems, data) {
                //belong to User
                this.showChatMessage($.extend({ id: '0' }, data, { content: Mustache.render("[span class=hintMsg]{{msg}}[/span][ul]{{#options}} [li class=question id={{value}} data-type={{type}}][span]{{label}}[/span][/li]{{/options}} [/ul]", problems) }));
            }

            /**
             *发送提醒
             */

        }, {
            key: "sendNotice",
            value: function sendNotice() {
                //belong to User
                this.showSystemMessage({
                    id: '0',
                    content: Mustache.render('客服可能暂时不在，请稍作等待')
                });
            }

            /**
             * 发送申请客服指令
             */

        }, {
            key: "sendAsk4ServiceCommand",
            value: function sendAsk4ServiceCommand() {
                //belong to User
                var contentType = CONTENT_TYPE_ASKFORSERVICE;
                var content = this.mine;
                this.config.mode = MODE_SERVICE;
                // 添加指定客服
                if (this.config.customService) {
                    $.extend(content, { customerService: this.config.customService, optId: this.config.optId });
                }

                this.sendCommandMessage({ contentType: contentType, content: content });
            }

            /**
             * 发送申请机器人命令
             */

        }, {
            key: "sendAsk4QuestionCommand",
            value: function sendAsk4QuestionCommand() {
                //belong to User
                var contentType = CONTENT_TYPE_ASKROBOT;
                var content = this.mine;
                var currentServiceCode = $('.layim-chat-status').data('userCode');
                // this.config.mode = MODE_QUESTION;
                this.sendCommandMessage({ contentType: contentType, content: content });
                var senderName = content.userName;
                this.sendCommandOver(currentServiceCode, senderName);
            }

            /**
             * 发送结束命令
             */

        }, {
            key: "sendCommandOver",
            value: function sendCommandOver(receiver, senderName) {
                //belong to User
                var contentType = CONTENT_TYPE_OVER;
                var content = { senderName: senderName };
                this.sendCommandMessage({ contentType: contentType, content: content, receiver: receiver });
            }

            /**
             * 再次请求问题
             * @param contentType
             * @param content
             * @param receiver
             */

        }, {
            key: "sendQuestionRequest",
            value: function sendQuestionRequest(content) {
                //BTU
                var data = {
                    type: MSG_TYPE_QUESTION,
                    contentType: 'text',
                    content: content,
                    sender: 'robot',
                    sendTime: _getTimestamp()
                };

                this.sendWSMessage(data);
            }

            /**
             * 将信息通过WS发送
             * @param data
             */

        }, {
            key: "bindProblemListClickEvent",
            value: function bindProblemListClickEvent() {
                //BTU
                var that = this;
                $("body").on('click', '.question', function () {
                    var type = $(this).attr('data-type');
                    var keyValue = $(this).attr('id');
                    var questionContent = $(this).text();
                    switch (type) {
                        case 'http':
                            window.open(keyValue);
                            break;
                        case 'question':
                            that.showClickQuestion({ question: keyValue, questionContent: questionContent });
                            break;
                        case 'command':
                            that.sendAsk4ServiceCommand();
                            break;
                        default:
                            console.warn('未知的命令类型：' + type);

                    }
                });
            }
            /**
             * 显示receiver所有的聊天记录
             * @param im
             * @param receiver
             */

        }, {
            key: "renderAllHistoryMessage",
            value: function renderAllHistoryMessage(im, receiver, that) {
                var lastReadDate = new Date();
                lastReadDate.setDate(lastReadDate.getDate() + 1);
                var dateStr = lastReadDate.getFullYear() + '-' + (lastReadDate.getMonth() + 1) + '-' + lastReadDate.getDate();

                $.ajax({
                    url: ctx + "/service/webim/allHistoryMessage/" + receiver,
                    dataType: 'json',
                    data: { lastReadDate: dateStr, pageSize: 100000 },
                    success: function success(res) {
                        var messageList = res.data.objList,
                            message;
                        if (messageList.length === 0) {
                            layer.msg('已无更多聊天消息！');
                        }
                        for (var i = 0, length = messageList.length; i < length; i++) {
                            message = messageList[i];
                            console.log(message);
                            var content = JSON.parse(message.content);
                            if (content.chatType == 'service' || message.sender == "robot") {} else if (message.msgType == 'S') {
                                that.showSystemMessage({ content: JSON.parse(message.content).msg, timestamp: message.sendTime });
                            } else if (message.sender == receiver.trim()) {
                                im.getMessage({
                                    fromid: message.sender,
                                    type: 'friend',
                                    system: false,
                                    reverse: true,
                                    username: message.senderName,
                                    id: '0',
                                    content: content.msg,
                                    timestamp: message.sendTime,
                                    avatar: ctx + USER_AVATAR
                                }, false);
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
                                }, false);
                            }
                        }
                    }
                });
            }
        }, {
            key: "afterInit",
            value: function afterInit() {
                this.bindProblemListClickEvent();
                var ctx = this.contextPath;
                this.window = {
                    id: '0',
                    type: 'friend',
                    name: '智能客服',
                    avatar: ctx + SERVICE_AVATAR
                };
                var that = this;
                this.im.on('tool(robot)', function () {

                    that.config.mode = MODE_QUESTION;

                    layer.open({
                        title: '结束会话',
                        content: '是否结束本次会话，并切换回智能问答吗？',
                        btn: ['确认', '取消'],
                        yes: function yes(index) {
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

        }, {
            key: "showChatMessage",
            value: function showChatMessage(_ref) {
                var content = _ref.content,
                    timestamp = _ref.timestamp,
                    senderName = _ref.senderName,
                    _ref$system = _ref.system,
                    system = _ref$system === undefined ? false : _ref$system;

                var ctx = this.contextPath;
                this.im.getMessage({
                    type: 'friend',
                    system: system,
                    username: senderName,
                    id: this.window.id,
                    content: content,
                    timestamp: timestamp || _getTimestamp(),
                    avatar: ctx + SERVICE_AVATAR
                });
                if (this.messageHandler) clearTimeout(this.messageHandler);
            }
        }]);

        return UserIM;
    }(IM);

    return UserIM;
});