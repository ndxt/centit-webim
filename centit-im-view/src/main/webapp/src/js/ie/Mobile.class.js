"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(["src/js/ie/IM.class", "mustache"], function (IM, Mustache) {
    var MobileIM = function (_IM) {
        _inherits(MobileIM, _IM);

        function MobileIM(im, mine, config) {
            _classCallCheck(this, MobileIM);

            var _this = _possibleConstructorReturn(this, (MobileIM.__proto__ || Object.getPrototypeOf(MobileIM)).call(this, im, mine, config));

            var ctx = _this.contextPath;
            _this.layer = config.layer;
            _this.tree = config.tree;
            _this.config.mode = 'askForService'; //因为在发送消息时会判断是否为'askForService',最好改为在UserIM中重写方法

            _this.services = {
                id: "0",
                groupname: '客服同事',
                list: []
            };

            _this.users = {
                id: "1",
                groupname: '服务过的用户',
                list: []
            };
            return _this;
        }

        _createClass(MobileIM, [{
            key: "showSystemMessage",
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
            key: "queryUsers",
            value: function queryUsers() {
                var ctx = this.contextPath,
                    id = this.mine.id;
                return fetch(ctx + "/webim/webimcust/cust/" + id + "?lastServiceDate=1949-10-1").then(function (res) {
                    return res.json();
                }).then(function (res) {
                    return res.data;
                });
            }
        }, {
            key: "queryService",
            value: function queryService() {
                var ctx = this.contextPath;

                return fetch(ctx + "/webim/webimcust/services").then(function (res) {
                    return res.json();
                }).then(function (res) {
                    return res.data;
                });
            }
        }, {
            key: "beforeInit",
            value: function beforeInit() {
                var _this2 = this;

                return Promise.all([this.queryUsers(), this.queryService()]).then(function (res) {
                    _this2.users.list = _parsedata(res[0]);
                    _this2.services.list = _parsedata(res[1].filter(function (d) {
                        return d.userCode !== _this2.mine.id;
                    }));
                });
            }

            /**
             * 渲染转接后的历史消息
             * @param sender
             * @param im
             * @param receiver
             * @param ctx
             */

        }, {
            key: "renderSwitchMessage",
            value: function renderSwitchMessage(sender, im, receiver, ctx) {
                var lastReadDate = new Date();
                lastReadDate.setDate(lastReadDate.getDate() + 1);
                var dateStr = lastReadDate.getFullYear() + '-' + (lastReadDate.getMonth() + 1) + '-' + lastReadDate.getDate();
                var pageNo = 1;
                $.ajax({
                    url: ctx + "/webim/webim/historyMessage/" + receiver + "/" + sender,
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
                            var system = false;
                            if (message.Type == "S") {
                                system = true;
                            } else if (message.sender == sender.trim()) {
                                var avatar = ctx + USER_AVATAR;
                            } else {
                                var avatar = ctx + SERVICE_AVATAR;
                            }
                            im.getMessage({
                                type: 'friend',
                                system: system,
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
            /**
             * 转接的历史消息
             * @param params
             */

        }, {
            key: "dealSwitchServiceMessage",
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

            /**
             * 绑定自定义的事件
             * @param im
             * @param receiver
             */

        }, {
            key: "bindEvent",
            value: function bindEvent(im, receiver) {
                var ctx = this.contextPath;
            }

            /**
             * 发送请求评价指令
             */

        }, {
            key: "sendAsk4Evaluate",
            value: function sendAsk4Evaluate(service, receiver) {
                var contentType = CONTENT_TYPE_PUSH_FORM;
                var content = {};
                content.service = service;
                // 添加指定客服

                this.sendCommandMessage({ contentType: contentType, content: content, receiver: receiver });
            }

            /**
             * 接受到over命令时的操作
             * @param senderName
             */

        }, {
            key: "overCommandOp",
            value: function overCommandOp(senderName) {
                //belong to Service
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
        }, {
            key: "renderDistributableServicesList",
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
            key: "initIM",
            value: function initIM() {
                var ctx = this.contextPath;
                this.mine.avatar = ctx + SERVICE_AVATAR;
                var config = {
                    init: {
                        mine: this.mine,
                        friend: [this.users, this.services]
                        // , uploadImage: {
                        //     url: `${ctx}/webim/file/upload` //（返回的数据格式见下文）
                        //     //默认post
                        // }
                        // , uploadFile: {
                        //     url: `${ctx}/webim/file/upload`  //（返回的数据格式见下文）
                        //     //默认post
                        // }
                    }, tool: [{
                        alias: 'over',
                        title: '结束会话',
                        iconUnicode: '&#xe60a;'
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
            key: "afterInit",
            value: function afterInit() {
                var _this3 = this;

                var users = this.users.list,
                    services = this.services.list;

                this.bindEvent(this.im, this.mine.userCode);

                ;
                [].concat(users, services).forEach(function (d) {
                    if ('F' === d.userState) {
                        _this3.im.setFriendStatus(d.userCode, 'offline');
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
                            var currentChatId = thisChat().data.id;
                            that.sendAsk4Evaluate(that.mine.userCode, currentChatId);
                            layer.close(index);
                            closeThisChat();
                        }
                    });
                }.bind(this));

                //手机端的聊天记录
                this.im.on('chatlog', function (data, ul) {
                    var messageList = this.mobileHistory(data.id);
                    console.log(data); //得到当前会话对象的基本信息
                    //弹出一个更多聊天记录面板
                    this.im.panel({
                        title: '与 ' + data.username + ' 的聊天记录' //标题
                        , tpl: "<div class=\"layim-chat-main\" style=\"bottom:0px;\">\n<ul id=\"LAY_view\">\n{{# layui.each(d.data, function(index, item){\n  if(item.system == true){ }}\n  <li class=\"layim-chat-system\"><span>{{ layui.data.content(item.content||\"&nbsp\") }}</span></li>\n  {{# } else if(item.mine){ }}\n      <li class=\"layim-chat-mine\"><div class=\"layim-chat-user\"><img src=\"{{ item.avatar }}\"><cite><i>{{ layui.data.date(item.timestamp) }}</i>{{ item.username }}</cite></div><div class=\"layim-chat-text\">{{ layui.data.content(item.content||\"&nbsp\") }}</div></li>\n  {{# }else{ }}\n    <li><div class=\"layim-chat-user\"><img src=\"{{ item.avatar }}\"><cite>{{ item.username }}<i>{{ layui.data.date(item.timestamp) }}</i></cite></div><div class=\"layim-chat-text\">{{ layui.data.content(item.content||\"&nbsp\") }}</div></li>\n  {{# }\n}); }}\n</ul></div>" //模版
                        , data: messageList
                    });
                }.bind(this));
                // this.im.on('chatlog',function(data,ul){
                //     var userId = data.id,
                //         cache = that.im.cache(),
                //         serviceId = cache.mine.id,
                //         localLogL = 0,
                //         pageItem = 0;
                //     if (typeof cache.local.chatlog["friend" + userId] != "undefine") {
                //         localLogL = cache.local.chatlog["friend" + userId].length;
                //         pageItem = localLogL % 20;
                //     }
                //     var pageNo = $("#layui-m-layer0").data('pageNo' + userId) || Math.floor(localLogL / 20) + 1;
                //     var lastReadDate = new Date();
                //     lastReadDate.setDate(lastReadDate.getDate() + 1);
                //     var dateStr = lastReadDate.getFullYear() + '-' + (lastReadDate.getMonth() + 1) + '-' + lastReadDate.getDate();
                //     $.ajax({
                //         url: ctx + '/webim/webim/historyMessage/' + serviceId + '/' + userId,
                //         dataType: 'json',
                //         async: false,
                //         data: {pageNo: pageNo, lastReadDate: dateStr ,pageSize:20},
                //         success:function(res){
                //             var messageList = res.data.objList,
                //                 message;
                //             var i = 0;
                //             if (pageNo == 1 && pageItem != 0) {
                //                 i = pageItem - 1;
                //             }
                //             if (messageList.length === 0) {
                //                 layer.msg('已无更多聊天消息！');
                //             } else {
                //                 pageNo++;
                //             }
                //             for(var length = messageList.length; i < length; i++){
                //                 message = messageList[i];
                //                 message.type = 'friend';
                //                 message.id = message.sender;
                //                 message.content = JSON.parse(message.content).msg;
                //                 message.timestamp = message.sendTime;
                //                 message.username = message.senderName;
                //                 message.avatar = ctx + '/src/avatar/service.jpg';
                //                 if(message.msgType == 'S'){
                //                     message.system = true;
                //                 }else if(message.id == serviceId){
                //                     message.mine = true;
                //                     message.avatar = ctx + '/src/avatar/service.jpg';
                //                 }else{
                //                     message.mine = false;
                //                     message.avatar = ctx + '/src/avatar/user.png';
                //                 }
                //                 if (message.system) {
                //                     ul.prepend('<li class="layim-chat-system"><span>' + message.content + '</span></li>');
                //                 }else if(message.content.replace(/\s/g, '') !== ''){
                //                     ul.prepend('<li class="layim-chat-system"><span>' + layui.data.date(data.timestamp) + '</span></li>');
                //                     layui.use('laytpl', function () {
                //                         var laytpl = layui.laytpl;
                //                         ul.prepend(laytpl(elemChatMain).render(message));
                //                     });
                //                 }
                //             }
                //             $("#layui-m-layer0").data('pageNo' + userId, pageNo);
                //         }
                //     })
                // }.bind(this))


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
            key: "queryUnread",
            value: function queryUnread() {
                var ctx = this.contextPath,
                    userCode = this.mine.userCode,
                    im = this.im,
                    that = this,
                    lastReadDate = new Date(),
                    arr = [],
                    arrNum = [];
                lastReadDate.setDate(lastReadDate.getDate() + 1);
                var dateStr = lastReadDate.getFullYear() + '-' + (lastReadDate.getMonth() + 1) + '-' + lastReadDate.getDate();

                $.ajax({
                    url: ctx + "/webim/webim/statUnread/" + userCode,
                    dataType: 'json',
                    async: false,
                    // data: {pageNo: pageNo,lastReadDate: dateStr},

                    success: function success(res) {
                        var unreadInfo = res.data,
                            x;
                        console.log(unreadInfo);
                        for (x in unreadInfo) {
                            var attr = x;
                            // console.log(unreadInfo[attr]);
                            if (unreadInfo[attr] > 0) {
                                arr.push(attr);
                                arrNum.push(unreadInfo[attr]);
                            }
                        }
                    }
                });

                var _loop = function _loop(i, length) {
                    $.ajax({
                        url: ctx + "/webim/webim/historyMessage/" + userCode + "/" + arr[i], //这里也调用了history接口
                        dataType: 'json',
                        async: false,
                        data: { pageNo: 1, lastReadDate: dateStr },
                        success: function success(res) {
                            var messageList = res.data.objList,
                                message;
                            for (var j = arrNum[i] - 1; j >= 0; j--) {
                                message = messageList[j];
                                console.log(message);
                                var content = JSON.parse(message.content);
                                if (content.chatTye == "service") {
                                    that.renderSwitchMessage(content.beforeId, im, message.sender, ctx);
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
                                }, true);
                            }
                        }
                    });
                };

                for (var i = 0, length = arr.length; i < length; i++) {
                    _loop(i, length);
                }
            }
        }, {
            key: "mobileHistory",
            value: function mobileHistory(id) {
                var url = ctx + "/webim/webim/historyMessage/" + this.mine.userCode + '/' + id;
                var receiver = this.mine.id;
                var lastReadDate = new Date();
                lastReadDate.setDate(lastReadDate.getDate() + 1);
                var dateStr = lastReadDate.getFullYear() + '-' + (lastReadDate.getMonth() + 1) + '-' + lastReadDate.getDate();
                var newMessageList = [];
                $.ajax({
                    url: url,
                    dataType: 'json',
                    async: false,
                    data: { pageNo: 1, lastReadDate: dateStr, pageSize: 1000000 },
                    success: function success(res) {
                        var messageList = res.data.objList,
                            message;
                        for (var i = 0, length = messageList.length; i < length; i++) {
                            message = messageList[i];
                            message.content = JSON.parse(message.content).msg;
                            message.type = 'friend';
                            message.id = message.sender;
                            message.timestamp = message.sendTime;
                            message.username = message.senderName;
                            message.avatar = ctx + '/src/avatar/service.jpg';
                            if (message.msgType == "S") {
                                message.system = true;
                            } else if (message.sender == receiver) {
                                message.mine = true;
                                message.avatar = ctx + '/src/avatar/service.jpg';
                            } else {
                                message.mine = false;
                                message.avatar = ctx + '/src/avatar/user.png';
                            }
                            newMessageList.unshift(message);
                        }
                        console.log(newMessageList);
                    }
                });
                return newMessageList;
            }
        }]);

        return MobileIM;
    }(IM);

    return MobileIM;
}); /**
    * Created by lu_sn on 2017/12/21.
    */
