const Default_Avatar = 'http://tva3.sinaimg.cn/crop.0.0.180.180.180/7f5f6861jw1e8qgp5bmzyj2050050aa8.jpg'
const SERVICE_AVATAR = '/src/avatar/service.jpg';
const USER_AVATAR = '/src/avatar/user.png';

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
;(function(global) {
  'use strict'

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

  // 默认IM配置
  const Default_IM_Config = {
    mode: MODE_QUESTION
  }

  class IM {
    constructor(im, mine, config) {
      this.im = im
      this.mine = mine
      this.config = $.extend({}, Default_IM_Config, config)
      this.$ = layui.jquery

      // 路径
      this.contextPath = _getContextPath()

      // 获取当前用户信息
      this.getMineInfo()

      this.beforeInit()
        .then(function() {

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
      if(mode == 'askForService') {
        this.messageHandler = setTimeout(this.sendNotice.bind(this),120000);
      }
    }

    beforeInit() {
      return new Promise(resolve => resolve())
    }

    scoreRate(){
        layui.use('layer', function(){
            var layer = layui.layer;

            layer.open({
                title:'下线通知'
                ,content:'服务结束请对我的服务做出评价<div id="rate"></div>'
                ,yes:function(index){
                    $('#rate').
                    layer.close(index);
                }
            });
        });
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
        ,id = this.mine.id
        ,wsHost

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
        avatar:  ctx + USER_AVATAR
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

    onCommandMessage(data, content) {
      let contentType = data.contentType

      switch(contentType) {
        case CONTENT_TYPE_SERVICE:
          this.showSystemMessage($.extend({id: '0'}, data, {content: content.msg}))
          this.changeUserName(content.userName)
          this.to = $.extend({id: content.userCode}, content)
          break
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
      if(mode == 'askForService') {
          this.sendWSMessage(data);
      }
      // console.log(data);

      // console.log(mode);
      // //现在先写成这样，等后台写好再修改。
      if(mode == 'askRobot'){
          this.sendQuestionRequest({question: (data.content.msg || '').replace(/\n/, '')});
      }

      if (this.onAfterSendChatMessage) {
        this.onAfterSendChatMessage.call(this, data, mode)
      }
    }

      //创造问题消息列表
      createProblemList(problems,data){
          this.showChatMessage($.extend({id: '0'}, data, {content:Mustache.render("[span class=hintMsg]{{msg}}[/span][ul]{{#options}} [li class=question id={{value}} data-type={{type}}][a]{{label}}[/a][/li]{{/options}} [/ul]", problems)}));

      }

    /**
     *发送提醒
     */
    sendNotice(){
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
          $.extend(content, { customerService: this.config.customService ,optId:this.config.optId})
      }

      this.sendCommandMessage({ contentType, content })
    }

      /**
       * 发送切换客服指令
       *
       */
      sendSwitchServiceCommand(service,receiver){
          let contentType = CONTENT_TYPE_SERVICE
          let content = {};
          content.service = service;
          // 添加指定客服

          this.sendCommandMessage({ contentType, content,receiver })
      }
    /**
     * 发送申请机器人
     */
    sendAsk4QuestionCommand() {
      let contentType = CONTENT_TYPE_ASKROBOT
      let content = this.mine
        // this.config.mode = MODE_QUESTION;
      this.sendCommandMessage({ contentType, content })
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
              contentType:'text',
              content:content,
              sender: 'robot',
              sendTime: _getTimestamp()
          }

          this.sendWSMessage(data)
      }

      /**
       * 显示用户所点击的问题
       */
      showClickQuestion(content){
        this.im.showQuestion({content:content.questionContent})
        this.sendQuestionRequest(content)
      }
    /**
     * 将信息通过WS发送
     * @param data
     */
    bindProblemListClickEvent(){
        var that = this;
        $("body").on('click','.question',function () {
            var type = $(this).attr('data-type')
            var keyValue = $(this).attr('id');
            var questionContent = $(this).text();
            switch(type){
                case 'http':
                    window.open(keyValue);
                    break;
                case 'question':
                    that.showClickQuestion({question: keyValue,questionContent:questionContent});
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
        if (this.socket.readyState == '3') {
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
        setTimeout(function() {
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

      try {
        data = JSON.parse(res.data)
        console.log(data)
      }
      catch(e) {
        // console.info(e)
      }
      if(data.contentType == "offline" && this.mine.userType == "S"){
          layui.use('layer', function(){
              var layer = layui.layer;

              layer.open({
                  title:'下线通知'
                  ,content:data.content.msg
              });
          });
      }
      switch(data.type) {
        case MSG_TYPE_CHAT:
          this.showChatMessage($.extend({id: data.sender}, data, {content: data.content.msg}))
          break
        case MSG_TYPE_SYSTEM:
          this.showSystemMessage($.extend({id: '0'}, data, {content: data.content.msg,id:data.content.id,data:data.content}))
          break
        case MSG_TYPE_COMMAND:
          this.onCommandMessage(data, data.content)
          break;
          case MSG_TYPE_QUESTION:
            this.createProblemList(data.content,data);
            break;
        case MSG_TYPE_BROADCAST:
          break
        default:
          console.warn(`未知的数据类型：${data.type}`)
      }
    }

    /**
     * WebSocket关闭打开事件
     */
    onWSClose() {
      this.showSystemMessage({
        id: '0',
        content: Mustache.render('您已掉线，请<a onclick="window.location.reload();" style="color: RGB(98, 158, 229)">刷新</a>重新连接')
      })
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
  function _getTimestamp () {
    return new Date().getTime()
  }


})(window)

;(function(global, IM) {
  'use strict'
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


  class UserIM extends IM {


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
              ,uploadFile: {
                  url: `${ctx}/service/file/upload`  //（返回的数据格式见下文）
                   //默认post
              },
              brief: true,
              tool: [{
                  alias: 'robot' //工具别名
                  ,title: '智能问答' //工具名称
                  ,icon: '&#xe61a;' //工具图标，参考图标文档
              }]
          })
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
        this.im.on('tool(robot)', function(){
          that.config.mode = MODE_QUESTION;
            that.sendAsk4QuestionCommand();
            that.changeUserName('智能客服');

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
      if(this.messageHandler)
        clearTimeout(this.messageHandler);
    }
  }

  /**
   * 工具函数：获取时间戳
   * @returns {number}
   * @private
   */
  function _getTimestamp () {
    return new Date().getTime()
  }

  global.UserIM = global.UserIM || UserIM
})(window, window.IM)

;(function(global, IM) {
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


    dealSwitchServiceMessage(params){
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
        layui.use('layer', function(){
            var layer = layui.layer;

            layer.open({
                title:'系统通知'
                ,content:params.content
                ,btn:['确认','退回']
                ,yes:function(index){
                    that.im.chat(data);
                    $('div.layui-show .layim-chat-username').data('preServiceCode',params.data.serviceCode);
                    layer.close(index);

                }
                ,btn2:function(){
                    that.sendSwitchServiceCommand(params.data.serviceCode,params.data.id);
                }
            });
        });

    }

      showSystemMessage(params) {
          params.system = true
          if(params.data.type == 'A'){

              this.dealSwitchServiceMessage(params);
              return;
          }
          this.showChatMessage(params)
      }

    queryUsers() {
      let ctx = this.contextPath,
        id = this.mine.id

      return fetch(`${ctx }/service/webimcust/cust/${id }`)
        .then(res => res.json())
        .then(res => res.data)
    }



    queryService() {
      let ctx = this.contextPath

      return fetch(`${ctx }/service/webimcust/services`)
        .then(res => res.json())
        .then(res => res.data)
    }





    beforeInit() {

      return Promise.all([
        this.queryUsers(),
        this.queryService()
      ]).then(res => {
        this.users.list = _parsedata(res[0])
        this.services.list = _parsedata(res[1].filter(d => d.userCode !== this.mine.id))
      })

    }

    renderHistoryMessage(sender,im,receiver,ctx){
     var lastReadDate = new Date();
        lastReadDate.setDate(lastReadDate.getDate() + 1);
        var dateStr = lastReadDate.getFullYear() + '-' + (lastReadDate.getMonth()+1)+ '-' + lastReadDate.getDate();
     var pageNo = $(".layim-chat-username").data('pageNo' + sender);
      $.ajax({url:`${ctx}/service/webim/historyMessage/${receiver}/${sender}`,
              dataType:'json',
          data: {pageNo: pageNo,lastReadDate: dateStr},
          success:function (res) {
             var messageList = res.data.objList,
                 message;
              if(messageList.length === 0){
                layer.msg('已无更多聊天消息！');
              }else{
                  pageNo++;
              }
              for(var i = 0,length = messageList.length; i < length; i++) {
                  message = messageList[i];
                  console.log(message);
                  if (message.sender == sender.trim()) {
                      im.getMessage({
                          type: 'friend',
                          system: false,
                          reverse: true,
                          username: message.senderName,
                          id: sender,
                          content: JSON.parse(message.content).msg,
                          timestamp: message.sendTime,
                          avatar: ctx + USER_AVATAR
                      }, true)
                  } else {
                       im.showMineMessage({content: JSON.parse(message.content).msg,timestamp: message.sendTime});
                  }
              }

              $(".layim-chat-username").data('pageNo' + sender,pageNo);
          }
      });


    }

    bindEvent(im,receiver){
        let ctx = this.contextPath,
            renderHistoryMessage = this.renderHistoryMessage;


        $("body").on("click",'*[layim-event="chat"]',function () {

          var userCode = $(this).attr('class').substr(12);
          $(".layim-chat-username").attr('userCode',userCode);
            $(".layim-chat-username").data('pageNo'+userCode,1);

            // renderHistoryMessage(userCode,im,receiver,ctx);(在layim的popchat函数中还会render一次)

        });

        $("body").on("click",'*[layim-event="chatLog"]',function(){
          var userCode = $(".layim-chat-username").attr('userCode');

            renderHistoryMessage(userCode,im,receiver,ctx);
        });
    }

    renderDistributableServicesList(){
      let services = this.services.list;
      let servicesJson = {};
          servicesJson.services = services;
          servicesJson.generateClass = function(){
            var className;
            if(this.userState == "F"){
              className =  "offline";
            }else{
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

    afterInit() {
      let users = this.users.list,
        services = this.services.list;

      this.bindEvent(this.im,this.mine.userCode);

      ;[].concat(users, services).forEach(d => {
        if ('F' === d.userState) {
          this.im.setFriendStatus(d.userCode, 'offline')
        }
      })
      $('#layui-layer1').css('top','0px');//在右上角显示窗体
        this.queryUnread();
        let that = this;
        this.im.on('tool(transfer)', function(){

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
                    layer.alert(`已发送切换客服[${service.name}]命令！`)
                }.bind(this)
            })


            $.get(`${this.contextPath}/json/service.txt`, function (res) {
                result = parseData(res)
                createTree('#service_list', result)
                let lastValue = null;
                $('#service_search').change(function() {
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
                    for (let i=data.length - 1; i>=0; i--) {
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
                    .map(line => line.replace(/\s/, ''))
                    .map(line => {
                        let level = 1
                        while ((line = line.replace('#', '')).startsWith('#')) {
                            level++
                        }
                        line = line.split(',')
                        return {
                            level,
                            id: line[0],
                            name: line[1] || line[0],
                            // 如果是自己或者客服不在线
                            offline: mine.userCode === line[0] || list.some(user => (user.userCode === line[0] && user.userState === 'F') || list.every(user => user.userCode !== line[0]))
                        }
                    })

                // 重点是levels保存了上一个父级节点，所以数据的顺序一定要正确
                const result = []
                const levels = []
                nodes.forEach(function(node) {
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
                    ,nodes: data,
                    click: function (node, li) {
                        if (!node.children) {
                            $('li.selected', tree).removeClass('selected')
                            li.addClass('selected')
                            $('#service_text').html(`已选中客服：${node.name}${node.offline ? '(不在线)' : ''}`)
                            service = node
                        }
                    }
                });

                tree.find('li').each(function() {
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

        this.im.on('tool(return)',function(){
          var preServiceCode = $('div.layui-show .layim-chat-username').data('preServiceCode')||"",
              userCode = $(".layim-chat-username").attr('usercode');
          if(!!preServiceCode){
            this.sendSwitchServiceCommand(preServiceCode,userCode);
          }else{
              layer.open({
                  title: '系统提示'
                  ,content: '此用户不是转接的！'
              });
          }
        }.bind(this))

        // this.im.on('tool(over)',function(){
        //
        // });尚未实现
        this.im.on('tool(quickReply)',function(){
            $.get(`${this.contextPath}/json/reply.txt`, function (res) {
                if(!!$("div.layui-show .selectContainer").html()) {         //判断Id = selectContainer的元素是否存在
                    $('div.layui-show .serviceList').css('display','block');
                    return;
                }
                var replys = res.split('\n');
                console.log(replys);
                var jsonReply = {};
                var replyArr = [];
                for(var i = replys.length - 1 ;i+1; i--){
                    let relyObj = {"reply":replys[i]};
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
        $("body").on('change','.serviceList',function(){
                var reply = $(this).val();
                console.log(reply);
                $("div.layui-show .layim-chat-textarea textarea").text(reply);
                $(this).css('display','none');
        })

        // this.scoreRate();
    }


    queryUnread(){
        let ctx = this.contextPath,
            userCode = this.mine.userCode,
            im = this.im,
            lastReadDate = new Date(),
            arr = [];
        lastReadDate.setDate(lastReadDate.getDate() + 1);
        var dateStr = lastReadDate.getFullYear() + '-' + (lastReadDate.getMonth()+1)+ '-' + lastReadDate.getDate();

        $.ajax({url:`${ctx}/service/webim/statUnread/${userCode}`,
            dataType:'json',
            async: false,
            // data: {pageNo: pageNo,lastReadDate: dateStr},

            success:function (res) {
                // console.log(res.data);
                var unreadInfo = res.data,x;

                for(x in unreadInfo){
                  // console.log(x);
                  var attr = x;
                  // console.log(unreadInfo[attr]);
                  if(unreadInfo[attr] > 0){
                      arr.push(attr);
                  }

                }
                // console.log(arr);

        }
        });
      for(let i = 0,length = arr.length; i < length; i++) {

          $.ajax({url:`${ctx}/service/webim/historyMessage/${userCode}/${arr[i]}`,
              dataType:'json',
              async: false,
              data: {pageNo: 1,lastReadDate: dateStr},
              success:function(res){
                  var messageList = res.data.objList,
                      message;
                  for(let j = 0,length = messageList.length; j < length; j++) {
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
                          }, true)
                      } else {
                          im.showMineMessage({content: JSON.parse(message.content).msg,timestamp: message.sendTime});
                      }
                  }


              }
          })
      }



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
          ,uploadImage: {
              url: `${ctx}/service/file/upload` //（返回的数据格式见下文）
              //默认post
          }
          ,uploadFile: {
              url: `${ctx}/service/file/upload`  //（返回的数据格式见下文）
              //默认post
          }
          ,tool:[{
              alias: 'return' //工具别名
              ,title: '请求退回' //工具名称
              ,icon: '&#xe627;' //工具图标，参考图标文档
           }//{
          //     alias: 'over'
          //     ,title: '结束会话'
          //     ,icon: '&#xe60a;'
          // }
              ,{
              alias: 'quickReply'
              ,title: '快速回复'
              ,icon: '&#xe611;'
          }]
          ,isgroup: false
          ,copyright: true
      };

      if(!!this.mine.switchServiceBtn){
          config.tool.push({
              alias: 'transfer' //工具别名
              ,title: '切换客服' //工具名称
              ,icon: '&#xe65c;' //工具图标，参考图标文档
          });
      }
      this.im.config(config)
    }
  }

  function _parsedata(list) {
    if (!list || !list.map) return list

    return list.map(d => $.extend(d, {
      id: d.userCode,
      username: d.userName,
      avatar: ctx + USER_AVATAR
    })).sort((me, other) => me.lastActiveDate >= other.lastActiveDate ? -1: 1)
      .sort(me => 'O' === me.userState ? -1 : 1 )
  }

  global.ServiceIM = global.ServiceIM || ServiceIM
})(window, window.IM)
