(function(layui) {
  'use strict'

  const Avatar = 'http://tva3.sinaimg.cn/crop.0.0.180.180.180/7f5f6861jw1e8qgp5bmzyj2050050aa8.jpg'

  const Mine = {
    username: '我',
    id: new Date().getTime(),
    status: 'online',
    avatar: Avatar
  }

  const KeFu = {
    name: '在线客服-小苍'
    , type: 'kefu'
    , avatar: Avatar
    , id: '100100100'
  }

  layui.use('layim', init)

  /////////////////////////////////////

  /**
   * 初始化
   * @param im
   */
  function init(im) {
    im.config({
      init: {
        mine: Mine
      },
      brief: true
    })

    // 打开客服窗口
    im.chat(KeFu)

    sendWelcome(im)

    // 监听发送消息
    im.on('sendMessage', function(data){
      console.log(data)
      let to = data.to, mine = data.mine
      sendMessage(im, mine.content, to)
        .then(res => getMessage(im, res.text, to))
    })
  }

  /**
   * 获取信息显示在面板上
   * @param im
   * @param msg
   * @param from
   */
  function getMessage(im, msg, from) {
    im.getMessage(Object.assign({
      timestamp: new Date().getTime(),
      username: from.name,
      fromid: from.id,
      content: msg
    }, from))
  }

  /**
   * 从图灵api接口获取返回内容
   * @param im
   * @param msg
   * @param to
   * @returns {Promise.<TResult>|*}
   */
  function sendMessage(im, msg, to) {
    const key = '08b46ba1b31d4c69b5701b6c17326fc8'

    return fetch(`http://www.tuling123.com/openapi/api?key=${key}&info=${msg}&userid=${to.id}`, {
      method: 'POST',
      type: 'cors'
    }).then(res => res.json())
  }

  /**
   * 发送欢迎信息
   * @param im
   */
  function sendWelcome(im) {
    let name = KeFu.name
    const WELCOME = `欢迎使用南大先腾客服系统，这里是“${name}”在为您服务，请问有什么需要帮助的吗？`
    getMessage(im, WELCOME, KeFu)
  }

})(layui);
