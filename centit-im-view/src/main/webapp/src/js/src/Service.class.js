define(["src/js/ie/IM.class","mustache"],function (IM,Mustache) {

    class ServiceIM extends IM {
        constructor(im, mine, config) {
            super(im, mine, config)
            let ctx = this.contextPath;
            this.layer = config.layer;
            this.tree = config.tree;
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

        showSystemMessage(params) {
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
            this.services.list = _parsedata(res[1].filter(d =>
                d.userCode !== this.mine.id
             )
        )
        })

        }

        /**
         * 渲染转接后的历史消息
         * @param sender
         * @param im
         * @param receiver
         * @param ctx
         */
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
                        var system = false;
                        if(message.Type == "S"){
                            system = true;
                        }else if (message.sender == sender.trim()) {
                            var avatar = ctx + USER_AVATAR
                        } else {
                            var avatar = ctx + SERVICE_AVATAR
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
                        }, true)
                    }

                }
            });

        }
        /**
         * 转接的历史消息
         * @param params
         */
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



        /**
         * 绑定自定义的事件
         * @param im
         * @param receiver
         */
        bindEvent(im, receiver) {
            let ctx = this.contextPath;

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



        /**
         * 接受到over命令时的操作
         * @param senderName
         */
        overCommandOp(senderName){//belong to Service
            var panelList = $('.layui-unselect.layim-chat-list li');
            var name;
            for (var j = 0, length = panelList.length; j < length; j++) {
                name = panelList[j].innerText;
                if (name.indexOf(senderName) != -1) {
                    $('.layui-unselect.layim-chat-list li').eq(j).find("i").click();
                }
            }
            if($('.layim-chat-username').eq(0).html().indexOf(senderName) != -1){
                closeThisChat();
            }
            layui.use('layer', function () {
                var layer = layui.layer;

                layer.open({
                    title: '会话结束'
                    , content: senderName + '客户结束了本次会话'
                });
            });
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
                // , uploadImage: {
                //     url: `${ctx}/service/file/upload` //（返回的数据格式见下文）
                //     //默认post
                // }
                // , uploadFile: {
                //     url: `${ctx}/service/file/upload`  //（返回的数据格式见下文）
                //     //默认post
                // }
                , tool: [
                    {
                        alias: 'over'
                        , title: '结束会话'
                        ,iconUnicode: '&#xe60a;'
                        , icon: '&#xe60a;'
                    },
                    {
                        alias: 'return' //工具别名
                        , title: '请求退回' //工具名称
                        , icon: '&#xe627;' //工具图标，参考图标文档
                    }
                    , {
                        alias: 'quickReply'
                        , title: '快速回复'
                        , icon: '&#xe611;'
                    }]
                , isgroup: false
                , copyright: true
                ,chatLog: layui.cache.dir + '../chatlog.html'
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
                if ('F' === d.userState)
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
                        var currentChatId = thisChat().data.id;
                        that.sendAsk4Evaluate(that.mine.userCode, currentChatId);
                        layer.close(index);
                        closeThisChat();
                    }
                });
            }.bind(this));

            this.im.on('tool(transfer)', function () {

                const layer = this.layer;
                const mine = this.mine;
                const that = this;
                var list = [];
                let result = [];
                let service = null;
                layer.open({
                    title: '选择客服',
                    area: ['1024px', '480px'],
                    content: '<div id="service_container">' +
                    '<div style="width: 200px; height: 340px; border-right: 1px solid #ccc; float: left; padding-right: 20px;">' +
                    '<input type="text" name="title" id="service_search"  placeholder="输入类型、客服名称搜索" autocomplete="off" class="layui-input" style="padding-left: 30px;"><i class="layui-icon layui-search" style="position: relative;top:-30px;left:10px;">&#xe615;</i><h5 id="service_text" style="padding: 15px 5px; color: #aaa;">未选中任何客服</h5>' +
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
                        var currentChatId = thisChat().data.id;
                        this.sendSwitchServiceCommand(service.id, currentChatId)

                        layer.open({
                            title: '切换客服'
                            , content: `已发送切换客服[${service.name}]命令！`
                            , btn: ['确定']
                            , btn1: function (index, layero) {
                                closeThisChat();
                                layer.close(index);
                            }.bind(this)
                        });

                    }.bind(this)
                })

                $.get(`${this.contextPath}/json/service.txt`, function (res) {
                    that.queryService().then(function (res1) {
                        list = _parsedata(res1.filter(function (d) {
                            return d.userCode !== mine.id;
                        }))
                        result = parseData(res);
                        createTree('#service_list', result);
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
                })
                function filterData(data, value) {
                    let temp = JSON.parse(JSON.stringify(data));
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
                    layui.use('tree',function () {
                        layui.tree({
                            elem: '#service_list' //传入元素选择器
                            , nodes: data,
                            click: function (node) {
                                $("#service_list").find();
                                if(typeof  node == "undefined"){

                                }else if (!node.children) {
                                    // $('li.selected', tree).removeClass('selected')
                                    // li.addClass('selected')
                                    console.log(node);
                                    $('#service_text').html(`已选中客服：${node.name}${node.offline ? '(不在线)' : ''}`)
                                    service = node;
                                }
                            }
                        });
                        // $('a').on('dblclick',function(){
                        //     clearTimeout(time);
                        //     if(!service.children){
                        //         console.log(2333);
                        //         var currentChatId = thisChat().data.id;
                        //         // that.sendSwitchServiceCommand(service.id, currentChatId)
                        //         layer.open({
                        //             title: '切换客服'
                        //             , content: `已发送切换客服[${service.name}]命令！`
                        //             , btn: ['确定']
                        //             , btn1: function (index, layero) {
                        //                 closeThisChat();
                        //                 layer.close(index);
                        //             }.bind(this)
                        //         });
                        //     }
                        // })
                    });

                    tree.find('li').each(function () {
                        const li = $(this)
                        const node = li.data('node')
                        if(typeof node == "undefined"){

                        }else if (!node.children && node.offline) {
                            li.addClass('offline')
                        }

                    })
                }
            }.bind(this));

            this.im.on('tool(return)', function () {
                var preServiceCode = $('div.layui-show .layim-chat-username').data('preServiceCode') || "",
                    userCode = thisChat().data.id;
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
                that = this,
                lastReadDate = new Date(),
                arr = [],
                arrNum = [];
            lastReadDate.setDate(lastReadDate.getDate() + 1);
            var dateStr = lastReadDate.getFullYear() + '-' + (lastReadDate.getMonth() + 1) + '-' + lastReadDate.getDate();

            $.ajax({
                url: `${ctx}/service/webim/statUnread/${userCode}`,
                dataType: 'json',
                async: false,
                // data: {pageNo: pageNo,lastReadDate: dateStr},

                success: function (res) {
                    var unreadInfo = res.data, x;
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
            for (let i = 0, length = arr.length; i < length; i++) {
                $.ajax({
                    url: `${ctx}/service/webim/historyMessage/${userCode}/${arr[i]}`,//这里也调用了history接口
                    dataType: 'json',
                    async: false,
                    data: {pageNo: 1, lastReadDate: dateStr},
                    success: function (res) {
                        var messageList = res.data.objList,
                            message;
                        for (let j = arrNum[i]-1; j >= 0;j--) {
                            message = messageList[j];
                            console.log(message);
                            var content = JSON.parse(message.content);
                            if(content.chatTye == "service"){
                                that.renderSwitchMessage(content.beforeId,im,message.sender,ctx);
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
                            }, true)
                        }


                    }
                })
            }


        }

        mobileHistory(id){
            var url = ctx + "/service/webim/historyMessage/" + this.mine.userCode + '/' + id;
            var receiver = this.mine.id;
            let lastReadDate = new Date();
            lastReadDate.setDate(lastReadDate.getDate() + 1);
            var dateStr = lastReadDate.getFullYear() + '-' + (lastReadDate.getMonth() + 1) + '-' + lastReadDate.getDate();
            var newMessageList = [];
            $.ajax({
                url: url,
                dataType: 'json',
                async: false,
                data: {pageNo: 1, lastReadDate: dateStr,pageSize:1000000},
                success: function (res) {
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
                        if(message.msgType == "S"){
                            message.system = true;
                        }
                        else if (message.sender == receiver) {
                            message.mine = true;
                            message.avatar = ctx + '/src/avatar/service.jpg';
                        }else{
                            message.mine = false;
                            message.avatar = ctx + '/src/avatar/user.png';
                        }
                        newMessageList.unshift(message);

                    }
                    console.log(newMessageList);
                }
            })
            return newMessageList;
        }

    }


    return ServiceIM;
})