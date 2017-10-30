"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(["mustache", "layui", "promise", "fetch", "url", "common.unit"], function (Mustache) {
    var IM = function () {
        function IM(im, mine, config) {
            _classCallCheck(this, IM);

            this.im = im;
            this.messageHandler = '';
            this.mine = mine;
            this.config = $.extend({}, Default_IM_Config, config);
            this.$ = layui.jquery;

            // 路径
            this.contextPath = _getContextPath();

            // 获取当前用户信息
            this.getMineInfo();

            this.beforeInit().then(function () {

                // 初始化IM
                this.initIM();

                this.im.on('sendMessage', this.onIMMessage.bind(this));

                // 创建WS链接
                this.createWSConnection();

                // 创建完后做一些处理
                this.afterInit();
            }.bind(this));
        }

        _createClass(IM, [{
            key: "onAfterSendChatMessage",
            value: function onAfterSendChatMessage(data, mode) {

                if (mode == 'askForService') {
                    if (!!this.messageHandler) {
                        clearTimeout(this.messageHandler);
                    }
                    this.messageHandler = setTimeout(this.sendNotice.bind(this), 120000);
                }
            }
        }, {
            key: "beforeInit",
            value: function beforeInit() {
                return new Promise(function (resolve) {
                    return resolve();
                });
            }
        }, {
            key: "sendEvaluatedScore",
            value: function sendEvaluatedScore(sender, receiver, score) {
                var contentType = CONTENT_TYPE_FORM;
                var content = {};
                content.service = sender;
                content.formType = "praise";
                content.score = score;
                // 添加指定客服

                this.sendCommandMessage({ contentType: contentType, content: content, receiver: receiver });
            }
        }, {
            key: "scoreRate",
            value: function scoreRate(sender, receiver) {
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
        }, {
            key: "showNoticeMessage",
            value: function showNoticeMessage(data) {
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
                    newFriend.addClass("layim-friend" + data.sender);
                    newFriend.find('span').html(data.senderName);
                    parent.prepend(newFriend);
                }
            }
        }, {
            key: "onBroadcastMessage",
            value: function onBroadcastMessage(data) {
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

        }, {
            key: "afterInit",
            value: function afterInit() {}

            /**
             * 初始化IM
             */

        }, {
            key: "initIM",
            value: function initIM() {
                this.im.config({
                    init: {
                        mine: this.mine
                    },
                    brief: true
                });
            }

            /**
             * 获取当前用户信息
             * @returns {*|{id: *, name: string, avatar: string}}
             */

        }, {
            key: "getMineInfo",
            value: function getMineInfo() {
                if ('string' === typeof this.mine) {
                    // TODO 从后台获取用户信息
                    this.mine = {
                        id: this.mine,
                        osId: this.config.osId || 'centit',
                        username: '我',
                        avatar: ctx + USER_AVATAR
                    };
                }

                var mine = this.mine;
                mine.osId = this.config.osId || mine.osId || 'centit';
                mine.optId = this.config.optId || mine.optId || 'centit';
                mine.id = mine.id || mine.userCode; // 后台需要的名字是userCode
                mine.username = mine.username || mine.userName; // 后台需要的名字是userName
                mine.avatar = mine.avatar || Default_Avatar;
                mine.userType = mine.userType || 'C';

                return mine;
            }

            /**
             * 创建WS链接
             */

        }, {
            key: "createWSConnection",
            value: function createWSConnection() {
                var contextPath = _getContextPath(),
                    id = this.mine.id,
                    wsHost = void 0;

                if (contextPath) {
                    wsHost = contextPath.replace(/^http/, 'ws');
                    wsHost = wsHost + "/im/" + id;
                }

                var socket = this.socket = new WebSocket(wsHost);

                socket.onopen = this.onWSOpen.bind(this);

                socket.onmessage = this.onWSMessage.bind(this);

                socket.onclose = this.onWSClose.bind(this);
            }

            /**
             * 显示收到的聊天信息
             * @param id
             * @param content
             * @param senderName
             * @param system
             * @param timestamp
             */

        }, {
            key: "showChatMessage",
            value: function showChatMessage(_ref) {
                var id = _ref.id,
                    content = _ref.content,
                    timestamp = _ref.timestamp,
                    senderName = _ref.senderName,
                    _ref$system = _ref.system,
                    system = _ref$system === undefined ? false : _ref$system;


                this.im.getMessage({
                    type: 'friend',
                    system: system,
                    username: senderName,
                    id: id,
                    content: content,
                    timestamp: timestamp || _getTimestamp(),
                    avatar: ctx + USER_AVATAR
                });
            }

            /**
             * 显示系统消息
             * @param params
             */

        }, {
            key: "showSystemMessage",
            value: function showSystemMessage(params) {
                params.system = true;
                this.showChatMessage(params);
            }

            /**
             * 接受到over命令时的操作
             * @param senderName
             */

        }, {
            key: "overCommandOp",
            value: function overCommandOp(senderName) {
                var panelList = $('.layui-unselect.layim-chat-list li');
                var name;
                for (var j = 0, length = panelList.length; j < length; j++) {
                    name = panelList[j].innerText;
                    if (name.indexOf(senderName) != -1) {
                        $('.layui-unselect.layim-chat-list li').eq(j).find("i").click();
                    }
                }
                if ($('.layim-chat-username').eq(0).html().indexOf(senderName) != -1) {
                    closeThisChat();
                }
                layui.use('layer', function () {
                    var layer = layui.layer;

                    layer.open({
                        title: '会话结束',
                        content: senderName + '客户结束了本次会话'
                    });
                });
            }

            /**
             * 根据接受到的不同命令采取不同操作
             * @param data
             * @param content
             */

        }, {
            key: "onCommandMessage",
            value: function onCommandMessage(data, content) {
                var contentType = data.contentType;

                switch (contentType) {
                    case CONTENT_TYPE_SERVICE:
                        this.showSystemMessage($.extend({ id: '0' }, data, { content: content.msg }));
                        this.changeUserName(content.userName);
                        $(".layim-chat-status").eq(0).data('userCode', content.userCode);
                        this.to = $.extend({ id: content.userCode }, content);
                        break;
                    case CONTENT_TYPE_PUSH_FORM:
                        this.scoreRate(this.mine.userCode, data.sender);
                        break;
                    case CONTENT_TYPE_OVER:
                        this.overCommandOp(content.senderName);
                        break;
                    default:
                        break;
                }
            }

            /**
             * IM发送信息事件
             * @param res
             */

        }, {
            key: "onIMMessage",
            value: function onIMMessage(res) {
                var mine = res.mine,
                    to = res.to;

                // 用户时修改发送id
                to.id = this.to ? this.to.id : to.id;

                // TODO 后期会判断不同的消息类别：文字、图片

                this.sendChatMessage({ mine: mine, to: to });
            }

            /**
             * 发送聊天信息
             * @param mine
             * @param to
             */

        }, {
            key: "sendChatMessage",
            value: function sendChatMessage(_ref2) {
                var mine = _ref2.mine,
                    to = _ref2.to;

                var data = {
                    type: MSG_TYPE_CHAT,
                    contentType: CONTENT_TYPE_TEXT,
                    content: {
                        msg: mine.content || mine
                    },
                    sender: mine.id,
                    senderName: mine.username,
                    receiver: to.id,
                    sendTime: _getTimestamp()
                };
                var mode = this.config.mode;
                if (mode == 'askForService') {
                    this.sendWSMessage(data);
                }
                // //现在先写成这样，等后台写好再修改。
                if (mode == 'askRobot') {
                    this.sendQuestionRequest({ question: (data.content.msg || '').replace(/\n/, '') });
                }

                if (this.onAfterSendChatMessage) {
                    this.onAfterSendChatMessage.call(this, data, mode);
                }
            }

            //创造问题消息列表

        }, {
            key: "createProblemList",
            value: function createProblemList(problems, data) {
                this.showChatMessage($.extend({ id: '0' }, data, { content: Mustache.render("[span class=hintMsg]{{msg}}[/span][ul]{{#options}} [li class=question id={{value}} data-type={{type}}][span]{{label}}[/span][/li]{{/options}} [/ul]", problems) }));
            }

            /**
             *发送提醒
             */

        }, {
            key: "sendNotice",
            value: function sendNotice() {
                this.showSystemMessage({
                    id: '0',
                    content: Mustache.render('客服可能暂时不在，请稍作等待')
                });
            }

            /**
             * 发送注册（上线）指令
             */

        }, {
            key: "sendRegisterCommand",
            value: function sendRegisterCommand() {
                var contentType = CONTENT_TYPE_REGISTER,
                    content = this.mine,
                    receiver = this.window ? this.window.id : this.mine.id;
                this.sendCommandMessage({ contentType: contentType, content: content, receiver: receiver });
            }

            /**
             * 发送申请客服指令
             */

        }, {
            key: "sendAsk4ServiceCommand",
            value: function sendAsk4ServiceCommand() {
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
             * 发送切换客服指令
             *
             */

        }, {
            key: "sendSwitchServiceCommand",
            value: function sendSwitchServiceCommand(service, receiver) {
                var contentType = CONTENT_TYPE_SERVICE;
                var content = {};
                content.service = service;
                // 添加指定客服

                this.sendCommandMessage({ contentType: contentType, content: content, receiver: receiver });
            }

            /**
             * 发送申请机器人
             */

        }, {
            key: "sendAsk4QuestionCommand",
            value: function sendAsk4QuestionCommand() {
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
                var contentType = CONTENT_TYPE_OVER;
                var content = { senderName: senderName };
                this.sendCommandMessage({ contentType: contentType, content: content, receiver: receiver });
            }

            /**
             * 发送指令信息
             * @param contentType
             * @param content
             * @param receiver
             */

        }, {
            key: "sendCommandMessage",
            value: function sendCommandMessage(_ref3) {
                var contentType = _ref3.contentType,
                    content = _ref3.content,
                    receiver = _ref3.receiver;

                var data = {
                    type: MSG_TYPE_COMMAND,
                    contentType: contentType,
                    content: content,
                    receiver: receiver,
                    sender: this.mine.id,
                    sendTime: _getTimestamp()
                };

                this.sendWSMessage(data);
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
        }, {
            key: "sendWSMessage",
            value: function sendWSMessage(data) {
                console.log(data);
                if (this.socket.readyState == '3') {
                    window.location.reload();
                    this.showSystemMessage({
                        id: '0',
                        content: Mustache.render('您已掉线，请<a onclick="window.location.reload();" style="color: RGB(98, 158, 229)">刷新</a>重新连接')
                    });
                } else if (this.socket.readyState == '1') {
                    this.socket.send(JSON.stringify(data));
                }
            }

            /**
             * WebSocket通道打开事件
             */

        }, {
            key: "onWSOpen",
            value: function onWSOpen() {
                this.sendRegisterCommand();

                if (this.mine.userType === TYPE_USER) {
                    // 确保注册完成之后执行
                    setTimeout(function () {
                        var mode = this.config.mode;
                        if (mode === MODE_SERVICE) {
                            // 申请客服
                            this.sendAsk4ServiceCommand();
                        } else if (mode === MODE_QUESTION) {
                            this.sendAsk4QuestionCommand();
                        }
                    }.bind(this), 1000);
                }
                console.log('WebSocket connection is opened.');
            }

            /**
             * WebSocket通道收到信息事件
             * @param res
             */

        }, {
            key: "onWSMessage",
            value: function onWSMessage(res) {
                var data = res.data;
                if (!this.messageHandler) {
                    clearTimeout(this.messageHandler);
                }
                try {
                    data = JSON.parse(res.data);
                    console.log(data);
                } catch (e) {
                    // console.info(e)
                }
                if (data.contentType == "offline" && this.mine.userType == "S") {
                    layui.use('layer', function () {
                        var layer = layui.layer;

                        layer.open({
                            title: '下线通知',
                            content: data.content.msg
                        });
                    });
                }
                switch (data.type) {
                    case MSG_TYPE_CHAT:
                        this.showChatMessage($.extend({ id: data.sender }, data, { content: data.content.msg }));
                        break;
                    case MSG_TYPE_SYSTEM:
                        this.showSystemMessage($.extend({ id: '0' }, data, {
                            content: data.content.msg,
                            id: data.content.id,
                            data: data.content
                        }));
                        break;
                    case MSG_TYPE_COMMAND:
                        this.onCommandMessage(data, data.content);
                        break;
                    case MSG_TYPE_QUESTION:
                        this.createProblemList(data.content, data);
                        break;

                    case MSG_TYPE_BROADCAST:
                        // this.onBroadcastMessage(data);
                        break;
                    default:
                        console.warn("\u672A\u77E5\u7684\u6570\u636E\u7C7B\u578B\uFF1A" + data.type);
                }
            }

            /**
             * WebSocket关闭打开事件
             */

        }, {
            key: "onWSClose",
            value: function onWSClose() {
                window.location.reload();
                layui.use('layer', function () {
                    var layer = layui.layer;

                    layer.open({
                        title: '系统通知',

                        content: Mustache.render('您已掉线，请<a onclick="window.location.reload();" style="color: RGB(98, 158, 229);cursor: pointer">刷新</a>重新连接')
                    });
                });
            }
        }, {
            key: "changeUserName",
            value: function changeUserName(name) {
                this.$('.layim-chat-username').text(name);
            }
        }]);

        return IM;
    }();

    return IM;
});