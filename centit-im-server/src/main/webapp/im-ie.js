'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

;(function (global) {
  'use strict';

  var Default_Avatar = 'http://tva3.sinaimg.cn/crop.0.0.180.180.180/7f5f6861jw1e8qgp5bmzyj2050050aa8.jpg';

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

  // 默认IM配置
  var Default_IM_Config = {
    mode: MODE_QUESTION
  };

  var IM = function () {
    function IM(im, mine, config) {
      _classCallCheck(this, IM);

      this.im = im;
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
      key: 'beforeInit',
      value: function beforeInit() {
        return new Promise(function (resolve) {
          return resolve();
        });
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
            avatar: Default_Avatar
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
          avatar: Default_Avatar
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
      }

      //创造问题消息列表

    }, {
      key: 'createProblemList',
      value: function createProblemList(problems, data) {
        this.showChatMessage($.extend({ id: '0' }, data, { content: Mustache.render("[span class=hintMsg]{{msg}}[/span][ul]{{#options}} [li class=question id={{value}} data-type={{type}}][a]{{label}}[/a][/li]{{/options}} [/ul]", problems) }));
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
        this.socket.send(JSON.stringify(data));
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
            this.showSystemMessage($.extend({ id: '0' }, data, { content: data.content.msg }));
            break;
          case MSG_TYPE_COMMAND:
            this.onCommandMessage(data, data.content);
            break;
          case MSG_TYPE_QUESTION:
            this.createProblemList(data.content, data);
            break;
          case MSG_TYPE_BROADCAST:
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
        console.log('WebSocket connection is closed.');
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
})(window);(function (global, IM) {
  'use strict';

  var Default_Avatar = 'http://tva3.sinaimg.cn/crop.0.0.180.180.180/7f5f6861jw1e8qgp5bmzyj2050050aa8.jpg';
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
        this.window = {
          id: '0',
          type: 'friend',
          name: '智能客服',
          avatar: Default_Avatar
        };
        var that = this;
        this.im.on('tool(robot)', function () {
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

    }, {
      key: 'showChatMessage',
      value: function showChatMessage(_ref4) {
        var content = _ref4.content,
            timestamp = _ref4.timestamp,
            senderName = _ref4.senderName,
            _ref4$system = _ref4.system,
            system = _ref4$system === undefined ? false : _ref4$system;

        this.im.getMessage({
          type: 'friend',
          system: system,
          username: senderName,
          id: this.window.id,
          content: content,
          timestamp: timestamp || _getTimestamp(),
          avatar: Default_Avatar
        });
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

  var Default_Avatar = 'http://tva3.sinaimg.cn/crop.0.0.180.180.180/7f5f6861jw1e8qgp5bmzyj2050050aa8.jpg';

  var ServiceIM = function (_IM2) {
    _inherits(ServiceIM, _IM2);

    function ServiceIM(im, mine, config) {
      _classCallCheck(this, ServiceIM);

      var _this2 = _possibleConstructorReturn(this, (ServiceIM.__proto__ || Object.getPrototypeOf(ServiceIM)).call(this, im, mine, config));

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
      key: 'queryUsers',
      value: function queryUsers() {
        var ctx = this.contextPath,
            id = this.mine.id;

        return fetch(ctx + '/service/webimcust/cust/' + id).then(function (res) {
          return res.json();
        }).then(function (res) {
          return res.data;
        });
      }
    }, {
      key: 'queryService',
      value: function queryService() {
        var ctx = this.contextPath;

        return fetch(ctx + '/service/webimcust/listUser').then(function (res) {
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
      key: 'renderHistoryMessage',
      value: function renderHistoryMessage(sender, im, receiver, ctx) {
        var lastReadDate = new Date();
        lastReadDate.setDate(lastReadDate.getDate() + 1);
        var dateStr = lastReadDate.getFullYear() + '-' + (lastReadDate.getMonth() + 1) + '-' + lastReadDate.getDate();
        var pageNo = $(".layim-chat-username").data('pageNo' + sender);
        $.ajax({ url: ctx + '/service/webim/historyMessage/' + receiver + '/' + sender,
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
                }, true);
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

          var userCode = $(this).attr('class').substr(12);
          $(".layim-chat-username").attr('userCode', userCode);
          $(".layim-chat-username").data('pageNo' + userCode, 1);

          // renderHistoryMessage(userCode,im,receiver,ctx);(在layim的popchat函数中还会render一次)
        });

        $("body").on("click", '*[layim-event="chatLog"]', function () {
          var userCode = $(".layim-chat-username").attr('userCode');

          renderHistoryMessage(userCode, im, receiver, ctx);
        });
      }
    }, {
      key: 'afterInit',
      value: function afterInit() {
        var _this4 = this;

        var users = this.users.list,
            services = this.services.list;

        this.bindEvent(this.im, this.mine.userCode);

        ;[].concat(users, services).forEach(function (d) {
          if ('F' === d.userState) {
            _this4.im.setFriendStatus(d.userCode, 'offline');
          }
        });
        $('#layui-layer1').css('top', '0px'); //在右上角显示窗体
        this.queryUnread();
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

        $.ajax({ url: ctx + '/service/webim/statUnread/' + userCode,
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

          $.ajax({ url: ctx + '/service/webim/historyMessage/' + userCode + '/' + arr[i],
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
                    avatar: Default_Avatar
                  }, true);
                } else {
                  im.showMineMessage({ content: JSON.parse(message.content).msg, timestamp: message.sendTime });
                }
              }
            }
          });
        };

        for (var i = 0, length = arr.length; i < length; i++) {
          _loop(i, length);
        }
      }
    }, {
      key: 'initIM',
      value: function initIM() {
        var ctx = this.contextPath;
        this.im.config({
          init: {
            mine: this.mine,
            friend: [this.users, this.services]
          }, uploadImage: {
            url: ctx + '/service/file/upload' //（返回的数据格式见下文）
            //默认post
          },
          uploadFile: {
            url: ctx + '/service/file/upload' //（返回的数据格式见下文）
            //默认post
          },

          isgroup: false,
          copyright: true
        });
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
        avatar: Default_Avatar
      });
    }).sort(function (me, other) {
      return me.lastActiveDate >= other.lastActiveDate ? -1 : 1;
    }).sort(function (me) {
      return 'O' === me.userState ? -1 : 1;
    });
  }

  global.ServiceIM = global.ServiceIM || ServiceIM;
})(window, window.IM);