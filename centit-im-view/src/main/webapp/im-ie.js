'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

// 默认IM配置
var Default_IM_Config = {
    mode: MODE_QUESTION
    //添加全局函数
};String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, '');
};
window.ctx = _getContextPath();
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
;(function (global) {
    'use strict';

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
            key: 'onAfterSendChatMessage',
            value: function onAfterSendChatMessage(data, mode) {

                if (mode == 'askForService') {
                    if (!!this.messageHandler) {
                        clearTimeout(this.messageHandler);
                    }
                    this.messageHandler = setTimeout(this.sendNotice.bind(this), 120000);
                }
            }
        }, {
            key: 'beforeInit',
            value: function beforeInit() {
                return new Promise(function (resolve) {
                    return resolve();
                });
            }
        }, {
            key: 'sendEvaluatedScore',
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
            key: 'scoreRate',
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
            key: 'showNoticeMessage',
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
            key: 'onBroadcastMessage',
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
            key: 'afterInit',
            value: function afterInit() {}

            /**
             * 初始化IM
             */

        }, {
            key: 'initIM',
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
            key: 'getMineInfo',
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
            key: 'createWSConnection',
            value: function createWSConnection() {
                var contextPath = _getContextPath(),
                    id = this.mine.id,
                    wsHost = void 0;

                if (contextPath) {
                    wsHost = contextPath.replace(/^http/, 'ws');
                    wsHost = wsHost + '/im/' + id;
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
            key: 'showChatMessage',
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
            key: 'showSystemMessage',
            value: function showSystemMessage(params) {
                params.system = true;
                this.showChatMessage(params);
            }
        }, {
            key: 'onCommandMessage',
            value: function onCommandMessage(data, content) {
                var contentType = data.contentType;

                switch (contentType) {
                    case CONTENT_TYPE_SERVICE:
                        this.showSystemMessage($.extend({ id: '0' }, data, { content: content.msg }));
                        this.changeUserName(content.userName);
                        this.to = $.extend({ id: content.userCode }, content);
                        break;
                    case CONTENT_TYPE_PUSH_FORM:
                        this.scoreRate(this.mine.userCode, data.sender);
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
            key: 'onIMMessage',
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
            key: 'sendChatMessage',
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
                // console.log(data);

                // console.log(mode);
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
            key: 'createProblemList',
            value: function createProblemList(problems, data) {
                this.showChatMessage($.extend({ id: '0' }, data, { content: Mustache.render("[span class=hintMsg]{{msg}}[/span][ul]{{#options}} [li class=question id={{value}} data-type={{type}}][a]{{label}}[/a][/li]{{/options}} [/ul]", problems) }));
            }

            /**
             *发送提醒
             */

        }, {
            key: 'sendNotice',
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
            key: 'sendRegisterCommand',
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
            key: 'sendAsk4ServiceCommand',
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
            key: 'sendSwitchServiceCommand',
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
            key: 'sendAsk4QuestionCommand',
            value: function sendAsk4QuestionCommand() {
                var contentType = CONTENT_TYPE_ASKROBOT;
                var content = this.mine;
                // this.config.mode = MODE_QUESTION;
                this.sendCommandMessage({ contentType: contentType, content: content });
            }

            /**
             * 发送指令信息
             * @param contentType
             * @param content
             * @param receiver
             */

        }, {
            key: 'sendCommandMessage',
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
            key: 'sendQuestionRequest',
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
             * 显示用户所点击的问题
             */

        }, {
            key: 'showClickQuestion',
            value: function showClickQuestion(content) {
                this.im.showQuestion({ content: content.questionContent });
                this.sendQuestionRequest(content);
            }

            /**
             * 将信息通过WS发送
             * @param data
             */

        }, {
            key: 'bindProblemListClickEvent',
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
            key: 'sendWSMessage',
            value: function sendWSMessage(data) {
                console.log(data);
                if (this.socket.readyState == '3') {
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
            key: 'onWSOpen',
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
            key: 'onWSMessage',
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
                        console.warn('\u672A\u77E5\u7684\u6570\u636E\u7C7B\u578B\uFF1A' + data.type);
                }
            }

            /**
             * WebSocket关闭打开事件
             */

        }, {
            key: 'onWSClose',
            value: function onWSClose() {
                layui.use('layer', function () {
                    var layer = layui.layer;

                    layer.open({
                        title: '系统通知',

                        content: Mustache.render('您已掉线，请<a onclick="window.location.reload();" style="color: RGB(98, 158, 229);cursor: pointer">刷新</a>重新连接')
                    });
                });
            }
        }, {
            key: 'changeUserName',
            value: function changeUserName(name) {
                this.$('.layim-chat-username').text(name);
            }
        }]);

        return IM;
    }();

    global.IM = global.IM || IM;

    /////////////////////////////////////


    /**
     * 工具函数：获取时间戳
     * @returns {number}
     * @private
     */
    function _getTimestamp() {
        return new Date().getTime();
    }
})(window);(function (global, IM) {
    'use strict';

    var UserIM = function (_IM) {
        _inherits(UserIM, _IM);

        function UserIM() {
            _classCallCheck(this, UserIM);

            return _possibleConstructorReturn(this, (UserIM.__proto__ || Object.getPrototypeOf(UserIM)).apply(this, arguments));
        }

        _createClass(UserIM, [{
            key: 'initIM',
            value: function initIM() {
                var ctx = this.contextPath;
                this.mine.avatar = ctx + USER_AVATAR;

                this.im.config({
                    init: {
                        mine: this.mine
                    },
                    uploadImage: {
                        url: ctx + '/service/file/upload' //（返回的数据格式见下文）
                        //默认post
                    },
                    uploadFile: {
                        url: ctx + '/service/file/upload' //（返回的数据格式见下文）
                        //默认post
                    },
                    brief: true,
                    tool: [{
                        alias: 'robot' //工具别名
                        , title: '智能问答' //工具名称
                        , icon: '&#xe61a;' //工具图标，参考图标文档
                    }]
                });
            }
        }, {
            key: 'afterInit',
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
            key: 'showChatMessage',
            value: function showChatMessage(_ref4) {
                var content = _ref4.content,
                    timestamp = _ref4.timestamp,
                    senderName = _ref4.senderName,
                    _ref4$system = _ref4.system,
                    system = _ref4$system === undefined ? false : _ref4$system;

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

    /**
     * 工具函数：获取时间戳
     * @returns {number}
     * @private
     */


    function _getTimestamp() {
        return new Date().getTime();
    }

    global.UserIM = global.UserIM || UserIM;
})(window, window.IM);(function (global, IM) {
    'use strict';

    var ServiceIM = function (_IM2) {
        _inherits(ServiceIM, _IM2);

        function ServiceIM(im, mine, config) {
            _classCallCheck(this, ServiceIM);

            var _this2 = _possibleConstructorReturn(this, (ServiceIM.__proto__ || Object.getPrototypeOf(ServiceIM)).call(this, im, mine, config));

            var ctx = _this2.contextPath;
            _this2.layer = config.layer;
            _this2.config.mode = 'askForService'; //因为在发送消息时会判断是否为'askForService',最好改为在UserIM中重写方法

            _this2.services = {
                id: "0",
                groupname: '客服同事',
                list: []
            };

            _this2.users = {
                id: "1",
                groupname: '服务过的用户',
                list: []
            };
            return _this2;
        }

        _createClass(ServiceIM, [{
            key: 'dealSwitchServiceMessage',
            value: function dealSwitchServiceMessage(params) {
                var that = this;
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
                        title: '系统通知',
                        content: params.content,
                        btn: ['确认', '退回'],
                        yes: function yes(index) {
                            that.im.chat(data);
                            setTimeout(that.renderSwitchMessage(params.id, that.im, params.data.serviceCode, that.contextPath), 500);
                            console.log(1);
                            $('div.layui-show .layim-chat-username').data('preServiceCode', params.data.serviceCode);
                            layer.close(index);
                        },
                        btn2: function btn2() {
                            that.sendSwitchServiceCommand(params.data.serviceCode, params.data.id);
                        }
                    });
                });
            }
        }, {
            key: 'showSystemMessage',
            value: function showSystemMessage(params) {
                params.system = true;
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
        }, {
            key: 'queryUsers',
            value: function queryUsers() {
                var ctx = this.contextPath,
                    id = this.mine.id;

                return fetch(ctx + '/service/webimcust/cust/' + id + '?lastServiceDate=1949-10-1').then(function (res) {
                    return res.json();
                }).then(function (res) {
                    return res.data;
                });
            }
        }, {
            key: 'queryService',
            value: function queryService() {
                var ctx = this.contextPath;

                return fetch(ctx + '/service/webimcust/services').then(function (res) {
                    return res.json();
                }).then(function (res) {
                    return res.data;
                });
            }
        }, {
            key: 'beforeInit',
            value: function beforeInit() {
                var _this3 = this;

                return Promise.all([this.queryUsers(), this.queryService()]).then(function (res) {
                    _this3.users.list = _parsedata(res[0]);
                    _this3.services.list = _parsedata(res[1].filter(function (d) {
                        return d.userCode !== _this3.mine.id;
                    }));
                });
            }
        }, {
            key: 'renderSwitchMessage',
            value: function renderSwitchMessage(sender, im, receiver, ctx) {
                var lastReadDate = new Date();
                lastReadDate.setDate(lastReadDate.getDate() + 1);
                var dateStr = lastReadDate.getFullYear() + '-' + (lastReadDate.getMonth() + 1) + '-' + lastReadDate.getDate();
                var pageNo = 1;
                $.ajax({
                    url: ctx + '/service/webim/historyMessage/' + receiver + '/' + sender,
                    async: false,
                    dataType: 'json',
                    data: { pageNo: pageNo, lastReadDate: dateStr, pageSize: 100000 },
                    success: function success(res) {
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
                                var avatar = ctx + USER_AVATAR;
                            } else {
                                var avatar = ctx + SERVICE_AVATAR;
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
                            }, true);
                        }
                    }
                });
            }
        }, {
            key: 'renderHistoryMessage',
            value: function renderHistoryMessage(sender, im, receiver, ctx) {
                var lastReadDate = new Date();
                lastReadDate.setDate(lastReadDate.getDate() + 1);
                var dateStr = lastReadDate.getFullYear() + '-' + (lastReadDate.getMonth() + 1) + '-' + lastReadDate.getDate();
                var pageNo = $(".layim-chat-username").data('pageNo' + sender) || 1;
                $.ajax({
                    url: ctx + '/service/webim/historyMessage/' + receiver + '/' + sender,
                    dataType: 'json',
                    data: { pageNo: pageNo, lastReadDate: dateStr },
                    success: function success(res) {
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
                                im.showSystemMessage(message);
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
                                }, false);
                            } else {
                                im.showMineMessage({ content: JSON.parse(message.content).msg, timestamp: message.sendTime });
                            }
                        }

                        $(".layim-chat-username").data('pageNo' + sender, pageNo);
                    }
                });
            }
        }, {
            key: 'bindEvent',
            value: function bindEvent(im, receiver) {
                var ctx = this.contextPath,
                    renderHistoryMessage = this.renderHistoryMessage;

                $("body").on("click", '*[layim-event="chat"]', function () {

                    var userCode = $(this).attr("class").split(" ")[0].substr(12).trim();
                    $(".layim-chat-username").attr('userCode', userCode);
                    $(".layim-chat-username").data('pageNo' + userCode, 1);

                    // renderHistoryMessage(userCode,im,receiver,ctx);(在layim的popchat函数中还会render一次)
                });

                $("body").on("click", '*[layim-event="chatLog"]', function () {
                    var userCode = $(".layim-chat-username").attr('userCode');
                    renderHistoryMessage(userCode, im, receiver, ctx);
                });
            }

            /**
             * 发送请求评价指令
             */

        }, {
            key: 'sendAsk4Evaluate',
            value: function sendAsk4Evaluate(service, receiver) {
                var contentType = CONTENT_TYPE_PUSH_FORM;
                var content = {};
                content.service = service;
                // 添加指定客服

                this.sendCommandMessage({ contentType: contentType, content: content, receiver: receiver });
            }
        }, {
            key: 'renderDistributableServicesList',
            value: function renderDistributableServicesList() {
                var services = this.services.list;
                var servicesJson = {};
                servicesJson.services = services;
                servicesJson.generateClass = function () {
                    var className;
                    if (this.userState == "F") {
                        className = "offline";
                    } else {
                        className = "online";
                    }
                    return className;
                };

                var render = Mustache.render('{{#services}} <option class={{generateClass}} value={{userCode}}>{{userName}}</option>{{/services}}', servicesJson);

                var form = $('<div class="layui-form" style="display: inline-block;font-size: 16px;"></div>');
                var selectContainer = $('<div  class="layui-form-item selectContainer"></div>');
                var str = '<div class="layui-input-block" style="margin-left: 0;margin-top: 6px;">' + '</div>';
                var selectOption = '<select class="serviceList" name="service" lay-verify="required" style="display: block;">' + '<option value="">请选择客服</option>' + render + '</select>';
                selectContainer.html(str);
                form.append(selectContainer);

                $('div.layui-show .layui-unselect.layim-chat-tool').append(form);
                $('div.layui-show .selectContainer div.layui-input-block').html(selectOption);
            }
        }, {
            key: 'initIM',
            value: function initIM() {
                var ctx = this.contextPath;
                this.mine.avatar = ctx + SERVICE_AVATAR;
                var config = {
                    init: {
                        mine: this.mine,
                        friend: [this.users, this.services]
                    },
                    uploadImage: {
                        url: ctx + '/service/file/upload' //（返回的数据格式见下文）
                        //默认post
                    },
                    uploadFile: {
                        url: ctx + '/service/file/upload' //（返回的数据格式见下文）
                        //默认post
                    },
                    tool: [{
                        alias: 'return' //工具别名
                        , title: '请求退回' //工具名称
                        , icon: '&#xe627;' //工具图标，参考图标文档
                    }, {
                        alias: 'over',
                        title: '结束会话',
                        icon: '&#xe60a;'
                    }, {
                        alias: 'quickReply',
                        title: '快速回复',
                        icon: '&#xe611;'
                    }],
                    isgroup: false,
                    copyright: true
                };

                if (!!this.mine.switchServiceBtn) {
                    config.tool.push({
                        alias: 'transfer' //工具别名
                        , title: '切换客服' //工具名称
                        , icon: '&#xe65c;' //工具图标，参考图标文档
                    });
                }
                this.im.config(config);
            }
        }, {
            key: 'afterInit',
            value: function afterInit() {
                var _this4 = this;

                var users = this.users.list,
                    services = this.services.list;

                this.bindEvent(this.im, this.mine.userCode);

                ;
                [].concat(users, services).forEach(function (d) {
                    if ('F' === d.userState) {
                        _this4.im.setFriendStatus(d.userCode, 'offline');
                    }
                });
                $('#layui-layer1').css('top', '0px'); //在右上角显示窗体
                this.queryUnread();
                var that = this;
                this.im.on('tool(over)', function () {
                    var layer = this.layer;
                    layer.open({
                        title: '结束会话',
                        content: '是否结束本次会话，并发送评价请求？',
                        btn: ['确认', '取消'],
                        yes: function yes(index) {
                            that.sendAsk4Evaluate(that.mine.userCode, $(".layim-chat-username").attr('userCode').trim());
                            layer.close(index);
                            that.im.closeThisChat();
                        }
                    });
                }.bind(this));
                this.im.on('tool(transfer)', function () {

                    var layer = this.layer;
                    var mine = this.mine;
                    var list = this.services.list;

                    var result = [];
                    var service = null;

                    layer.open({
                        title: '选择客服',
                        area: ['1024px', '480px'],
                        content: '<div id="service_container">' + '<div style="width: 200px; height: 340px; border-right: 1px solid #ccc; float: left; padding-right: 20px;">' + '<input type="text" name="title" id="service_search"  placeholder="输入类型、客服名称搜索" autocomplete="off" class="layui-input"><h5 id="service_text" style="padding: 15px 5px; color: #aaa;">未选中任何客服</h5>' + '</div>' + '<div style="margin-left: 230px; overflow: auto; height: 340px;">' + '<ul id="service_list"></ul>' + '</div>' + '</div>',
                        yes: function () {
                            if (!service) {
                                layer.alert('没有选择客服！');
                                return;
                            }

                            this.sendSwitchServiceCommand(service.id, $(".layim-chat-username").attr('usercode'));

                            layer.open({
                                title: '切换客服',
                                content: '\u5DF2\u53D1\u9001\u5207\u6362\u5BA2\u670D[' + service.name + ']\u547D\u4EE4\uFF01',
                                btn: ['确定'],
                                btn1: function (index, layero) {
                                    this.im.closeThisChat();
                                    layer.close(index);
                                }.bind(this)
                            });
                        }.bind(this)
                    });

                    $.get(this.contextPath + '/json/service.txt', function (res) {
                        result = parseData(res);
                        createTree('#service_list', result);
                        var lastValue = null;
                        $('#service_search').change(function () {
                            var value = $(this).val();
                            if (value !== lastValue) {

                                // 清空查询条件
                                if (!value) {
                                    createTree('#service_list', result);
                                } else {
                                    var tempData = filterData(result, value);
                                    console.log(tempData);
                                    createTree('#service_list', tempData);
                                }

                                service = null;
                                $('#service_text').html('未选中任何客服');
                            }
                            lastValue = value;
                        });
                    });

                    function filterData(data, value) {

                        var temp = JSON.parse(JSON.stringify(data));

                        filterLeaf(temp, value);

                        return temp;

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
                            for (var i = data.length - 1; i >= 0; i--) {
                                var node = data[i];
                                if (node.children) {
                                    if (node.name.indexOf(value) === -1) {
                                        filterLeaf(data[i].children, value);
                                        if (0 === node.children.length) {
                                            data.splice(i, 1);
                                        }
                                    }

                                    node.spread = true;
                                } else {
                                    if (node.name.indexOf(value) === -1) {
                                        data.splice(i, 1);
                                    }
                                }
                            }
                        }
                    }

                    function parseData(res) {
                        // 将文本格式转换为树形结构
                        var nodes = res.split('\n').map(function (line) {
                            return line.replace(/\s/, '');
                        }).map(function (line) {
                            var level = 1;
                            while ((line = line.replace('#', '')).startsWith('#')) {
                                level++;
                            }
                            line = line.split(',');
                            return {
                                level: level,
                                id: line[0],
                                name: line[1] || line[0],
                                // 如果是自己或者客服不在线
                                offline: mine.userCode === line[0] || list.some(function (user) {
                                    return user.userCode === line[0] && user.userState === 'F' || list.every(function (user) {
                                        return user.userCode !== line[0];
                                    });
                                })
                            };
                        });

                        // 重点是levels保存了上一个父级节点，所以数据的顺序一定要正确
                        var result = [];
                        var levels = [];
                        nodes.forEach(function (node) {
                            var level = node.level;

                            if (level === 1) {
                                // 顶层直接放入
                                result.push(node);
                            } else {
                                // 取最后一个父级节点，并放入
                                var last = levels[level - 1][levels[level - 1].length - 1];
                                if (last) {
                                    last.children = last.children || [];
                                    last.children.push(node);
                                }
                            }

                            if (!levels[level]) {
                                levels[level] = [];
                            }
                            levels[level].push(node);
                        });

                        return result;
                    }

                    function createTree(selector, data) {
                        var tree = $(selector);
                        tree.html('');

                        layui.tree({
                            elem: '#service_list' //传入元素选择器
                            , nodes: data,
                            click: function click(node, li) {
                                if (!node.children) {
                                    $('li.selected', tree).removeClass('selected');
                                    li.addClass('selected');
                                    $('#service_text').html('\u5DF2\u9009\u4E2D\u5BA2\u670D\uFF1A' + node.name + (node.offline ? '(不在线)' : ''));
                                    service = node;
                                }
                            }
                        });

                        tree.find('li').each(function () {
                            var li = $(this);
                            var node = li.data('node');
                            if (!node.children && node.offline) {
                                li.addClass('offline');
                            }
                        });
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
                            title: '系统提示',
                            content: '此用户不是转接的！'
                        });
                    }
                }.bind(this));

                this.im.on('tool(quickReply)', function () {
                    $.get(this.contextPath + '/json/reply.txt', function (res) {
                        if (!!$("div.layui-show .selectContainer").html()) {
                            //判断Id = selectContainer的元素是否存在
                            $('div.layui-show .serviceList').css('display', 'block');
                            return;
                        }
                        var replys = res.split('\n');
                        console.log(replys);
                        var jsonReply = {};
                        var replyArr = [];
                        for (var i = replys.length - 1; i + 1; i--) {
                            var relyObj = { "reply": replys[i] };
                            replyArr.push(relyObj);
                        }
                        jsonReply.replys = replyArr;

                        var render = Mustache.render('{{#replys}} <option class={{generateClass}}>{{reply}}</option>{{/replys}}', jsonReply);

                        var form = $('<div class="layui-form" style="display: inline-block;font-size: 16px;"></div>');
                        var selectContainer = $('<div  class="layui-form-item selectContainer"></div>');
                        var str = '<div class="layui-input-block" style="margin-left: 0;margin-top: 6px;">' + '</div>';
                        var selectOption = '<select class="serviceList" name="service" lay-verify="required" style="display: block;width:150px;">' + '<option value="">请选择回复</option>' + render + '</select>';
                        selectContainer.html(str);
                        form.append(selectContainer);

                        $('div.layui-show .layui-unselect.layim-chat-tool').append(form);
                        $('div.layui-show .selectContainer div.layui-input-block').html(selectOption);
                    });
                }.bind(this));
                $("body").on('change', '.serviceList', function () {
                    var reply = $(this).val();
                    console.log(reply);
                    $("div.layui-show .layim-chat-textarea textarea").val(reply);
                    $(this).css('display', 'none');
                });

                // this.scoreRate();
                $(".layim-title p").html('在线咨询');
            }
        }, {
            key: 'queryUnread',
            value: function queryUnread() {
                var ctx = this.contextPath,
                    userCode = this.mine.userCode,
                    im = this.im,
                    lastReadDate = new Date(),
                    arr = [];
                lastReadDate.setDate(lastReadDate.getDate() + 1);
                var dateStr = lastReadDate.getFullYear() + '-' + (lastReadDate.getMonth() + 1) + '-' + lastReadDate.getDate();

                $.ajax({
                    url: ctx + '/service/webim/statUnread/' + userCode,
                    dataType: 'json',
                    async: false,
                    // data: {pageNo: pageNo,lastReadDate: dateStr},

                    success: function success(res) {
                        // console.log(res.data);
                        var unreadInfo = res.data,
                            x;

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

                var _loop = function _loop(i, length) {

                    $.ajax({
                        url: ctx + '/service/webim/historyMessage/' + userCode + '/' + arr[i],
                        dataType: 'json',
                        async: false,
                        data: { pageNo: 1, lastReadDate: dateStr },
                        success: function success(res) {
                            var messageList = res.data.objList,
                                message;
                            for (var j = 0, _length = messageList.length; j < _length; j++) {
                                message = messageList[j];
                                console.log(message);
                                if (message.sender == arr[i]) {
                                    im.getMessage({
                                        type: 'friend',
                                        system: false,
                                        reverse: true,
                                        username: message.senderName,
                                        id: arr[i],
                                        content: JSON.parse(message.content).msg,
                                        timestamp: message.sendTime,
                                        avatar: ctx + USER_AVATAR
                                    }, true);
                                } else {
                                    im.showMineMessage({
                                        content: JSON.parse(message.content).msg,
                                        timestamp: message.sendTime
                                    });
                                }
                            }
                        }
                    });
                };

                for (var i = 0, length = arr.length; i < length; i++) {
                    _loop(i, length);
                }
            }
        }]);

        return ServiceIM;
    }(IM);

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

    global.ServiceIM = global.ServiceIM || ServiceIM;
})(window, window.IM);