"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(["IM"], function (IM) {
    var ServiceIM = function (_IM) {
        _inherits(ServiceIM, _IM);

        function ServiceIM(im, mine, config) {
            _classCallCheck(this, ServiceIM);

            var _this = _possibleConstructorReturn(this, (ServiceIM.__proto__ || Object.getPrototypeOf(ServiceIM)).call(this, im, mine, config));

            var ctx = _this.contextPath;
            _this.layer = config.layer;
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

        _createClass(ServiceIM, [{
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
        }, {
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

                return fetch(ctx + "/service/webimcust/cust/" + id + "?lastServiceDate=1949-10-1").then(function (res) {
                    return res.json();
                }).then(function (res) {
                    return res.data;
                });
            }
        }, {
            key: "queryService",
            value: function queryService() {
                var ctx = this.contextPath;

                return fetch(ctx + "/service/webimcust/services").then(function (res) {
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
        }, {
            key: "renderSwitchMessage",
            value: function renderSwitchMessage(sender, im, receiver, ctx) {
                var lastReadDate = new Date();
                lastReadDate.setDate(lastReadDate.getDate() + 1);
                var dateStr = lastReadDate.getFullYear() + '-' + (lastReadDate.getMonth() + 1) + '-' + lastReadDate.getDate();
                var pageNo = 1;
                $.ajax({
                    url: ctx + "/service/webim/historyMessage/" + receiver + "/" + sender,
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
        }, {
            key: "renderHistoryMessage",
            value: function renderHistoryMessage(sender, im, receiver, ctx) {
                var lastReadDate = new Date();
                lastReadDate.setDate(lastReadDate.getDate() + 1);
                var dateStr = lastReadDate.getFullYear() + '-' + (lastReadDate.getMonth() + 1) + '-' + lastReadDate.getDate();
                var pageNo = $(".layim-chat-username").data('pageNo' + sender) || 1;
                $.ajax({
                    url: ctx + "/service/webim/historyMessage/" + receiver + "/" + sender,
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
                                }, false);
                            } else {
                                im.showMineMessage({ content: JSON.parse(message.content).msg, timestamp: message.sendTime });
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

        }, {
            key: "bindEvent",
            value: function bindEvent(im, receiver) {
                var ctx = this.contextPath,
                    renderHistoryMessage = this.renderHistoryMessage;
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
        }, {
            key: "sendEvaluatedScore",
            value: function sendEvaluatedScore(sender, receiver, score) {
                //belong to Service
                var contentType = CONTENT_TYPE_FORM;
                var content = {};
                content.service = sender;
                content.formType = "praise";
                content.score = score;
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
                    },
                    uploadImage: {
                        url: ctx + "/service/file/upload" //（返回的数据格式见下文）
                        //默认post
                    },
                    uploadFile: {
                        url: ctx + "/service/file/upload" //（返回的数据格式见下文）
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
                    copyright: true,
                    chatLog: layui.cache.dir + 'css/modules/layim/html/chatlog.html'
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
                            var currentChatId = thisChat().data.id;
                            this.sendSwitchServiceCommand(service.id, currentChatId);

                            layer.open({
                                title: '切换客服',
                                content: "\u5DF2\u53D1\u9001\u5207\u6362\u5BA2\u670D[" + service.name + "]\u547D\u4EE4\uFF01",
                                btn: ['确定'],
                                btn1: function (index, layero) {
                                    closeThisChat();
                                    layer.close(index);
                                }.bind(this)
                            });
                        }.bind(this)
                    });

                    $.get(this.contextPath + "/json/service.txt", function (res) {
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
                            click: function click(node) {
                                $("#service_list").find();
                                if (typeof node == "undefined") {} else if (!node.children) {
                                    // $('li.selected', tree).removeClass('selected')
                                    // li.addClass('selected')
                                    $('#service_text').html("\u5DF2\u9009\u4E2D\u5BA2\u670D\uFF1A" + node.name + (node.offline ? '(不在线)' : ''));
                                    service = node;
                                }
                            }
                        });

                        tree.find('li').each(function () {
                            var li = $(this);
                            var node = li.data('node');
                            if (typeof node == "undefined") {} else if (!node.children && node.offline) {
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
                        userCode = thisChat().data.id;
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
                    $.get(this.contextPath + "/json/reply.txt", function (res) {
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
            key: "queryUnread",
            value: function queryUnread() {
                var ctx = this.contextPath,
                    userCode = this.mine.userCode,
                    im = this.im,
                    that = this,
                    lastReadDate = new Date(),
                    arr = [];
                lastReadDate.setDate(lastReadDate.getDate() + 1);
                var dateStr = lastReadDate.getFullYear() + '-' + (lastReadDate.getMonth() + 1) + '-' + lastReadDate.getDate();

                $.ajax({
                    url: ctx + "/service/webim/statUnread/" + userCode,
                    dataType: 'json',
                    async: false,
                    // data: {pageNo: pageNo,lastReadDate: dateStr},

                    success: function success(res) {
                        // console.log(res.data);
                        var unreadInfo = res.data,
                            x;
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

                var _loop = function _loop(i, length) {

                    $.ajax({
                        url: ctx + "/service/webim/historyMessage/" + userCode + "/" + arr[i],
                        dataType: 'json',
                        async: false,
                        data: { pageNo: 1, lastReadDate: dateStr },
                        success: function success(res) {
                            var messageList = res.data.objList,
                                message;
                            for (var j = 0, _length = messageList.length; j < _length; j++) {
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
        }]);

        return ServiceIM;
    }(IM);

    return ServiceIM;
});