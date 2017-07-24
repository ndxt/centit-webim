;(function(global) {
  'use strict'



  const Default_Avatar = 'http://tva3.sinaimg.cn/crop.0.0.180.180.180/7f5f6861jw1e8qgp5bmzyj2050050aa8.jpg'

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

    beforeInit() {
      return new Promise(resolve => resolve())
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
          avatar: Default_Avatar
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
        avatar: Default_Avatar
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
    }

      //创造问题消息列表
      createProblemList(problems,data){
          this.showChatMessage($.extend({id: '0'}, data, {content:Mustache.render("[span class=hintMsg]{{msg}}[/span][ul]{{#options}} [li class=question id={{value}} data-type={{type}}][a]{{label}}[/a][/li]{{/options}} [/ul]", problems)}));

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
      this.socket.send(JSON.stringify(data))
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
          this.showSystemMessage($.extend({id: '0'}, data, {content: data.content.msg}))
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
    onWSClose() { console.log('WebSocket connection is closed.') }

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
})(window)

;(function(global, IM) {
  'use strict'

  const Default_Avatar = 'http://tva3.sinaimg.cn/crop.0.0.180.180.180/7f5f6861jw1e8qgp5bmzyj2050050aa8.jpg'
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
        let ctx = this.contextPath
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
      this.window = {
        id: '0',
        type: 'friend',
        name: '智能客服',
        avatar: Default_Avatar
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
      this.im.getMessage({
        type: 'friend',
        system,
        username: senderName,
        id: this.window.id,
        content,
        timestamp: timestamp || _getTimestamp(),
        avatar: Default_Avatar
      })
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

  const Default_Avatar = 'http://tva3.sinaimg.cn/crop.0.0.180.180.180/7f5f6861jw1e8qgp5bmzyj2050050aa8.jpg'

  class ServiceIM extends IM {
    constructor(im, mine, config) {
      super(im, mine, config)

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

    queryUsers() {
      let ctx = this.contextPath,
        id = this.mine.id

      return fetch(`${ctx }/service/webimcust/cust/${id }`)
        .then(res => res.json())
        .then(res => res.data)
    }



    queryService() {
      let ctx = this.contextPath

      return fetch(`${ctx }/service/webimcust/listUser`)
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
                          avatar: Default_Avatar
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
                              avatar: Default_Avatar
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
      this.im.config({
        init: {
          mine: this.mine,
          friend: [
            this.users,
            this.services
          ]
        },uploadImage: {
                  url: `${ctx}/service/file/upload` //（返回的数据格式见下文）
                  //默认post
              }
              ,uploadFile: {
                  url: `${ctx}/service/file/upload`  //（返回的数据格式见下文）
                  //默认post
              }

        ,isgroup: false
        ,copyright: true
      })
    }
  }

  function _parsedata(list) {
    if (!list || !list.map) return list

    return list.map(d => $.extend(d, {
      id: d.userCode,
      username: d.userName,
      avatar: Default_Avatar
    })).sort((me, other) => me.lastActiveDate >= other.lastActiveDate ? -1: 1)
      .sort(me => 'O' === me.userState ? -1 : 1 )
  }

  global.ServiceIM = global.ServiceIM || ServiceIM
})(window, window.IM)
