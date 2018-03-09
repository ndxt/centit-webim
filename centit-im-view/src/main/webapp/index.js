(function(ng) {
  const app = ng.module('test', [])
  app.controller('TestController', TestController)

  const Default_Avatar = 'http://tva3.sinaimg.cn/crop.0.0.180.180.180/7f5f6861jw1e8qgp5bmzyj2050050aa8.jpg'

  const Avatars = [
    Default_Avatar,
    'http://tva1.sinaimg.cn/crop.219.144.555.555.180/0068iARejw8esk724mra6j30rs0rstap.jpg',
    'http://tva3.sinaimg.cn/crop.64.106.361.361.50/7181dbb3jw8evfbtem8edj20ci0dpq3a.jpg',
    'http://qlogo4.store.qq.com/qzone/992065607/992065607/100',
    'http://qlogo4.store.qq.com/qzone/330995827/330995827/100',
    'http://qlogo2.store.qq.com/qzone/516018613/516018613/100',
    'http://qlogo1.store.qq.com/qzone/781090036/781090036/100',
    'http://qlogo2.store.qq.com/qzone/770611657/770611657/100',
    'http://qlogo1.store.qq.com/qzone/546937252/546937252/100',
    'http://qlogo1.store.qq.com/qzone/282203444/282203444/100',
    'http://qlogo2.store.qq.com/qzone/564143101/564143101/100',
    'http://qlogo4.store.qq.com/qzone/513842343/513842343/100'
  ]

  function TestController($scope, $timeout) {
    let vm = this

    vm.generateUser = generateUser
    vm.addCustomService = addCustomService
    vm.beginTalk = beginTalk
    vm.beginService = beginService
    vm.beginSmartTalk = beginSmartTalk

    init()

    function init() {
      generateUser()
      queryCustomService()
    }

    /////////////////////////////

    /**
     * 与智能机器人聊天
     */
    function beginSmartTalk() {
      _openWindow(location.href + 'app.html')
    }

    /**
     * 开始和某人交谈
     * @param mine
     */
    function beginTalk(mine) {
        let params =  {
            userCode: mine.id,
            userName: mine.name,
            mode: 'askForService'
        },
         token = 'token=' + base64.encode(encodeURIComponent(JSON.stringify(params)));
         _openWindow(location.href + 'user.html', token)
    }

    /**
     * 开始客服服务
     * @param mine
     */
    function beginService(mine) {
      let params = angular.extend({}, {
        userCode: mine.id,
        userName: mine.name,
        switchServiceBtn: '123'
      }),
        token = 'token=' + base64.encode(encodeURIComponent(JSON.stringify(params)));
        queryCustomService(2000)
        _openWindow(location.href + 'kefu.html', token)
    }

    function _openWindow(url, token) {
      window.open(url + '?' + token)
    }

    /**
     * 查询客服列表
     */
    function queryCustomService(wait = 0) {
      let ctx = _getContextPath()

      $timeout(function() {
        fetch(`${ctx}/service/webimcust/listUser`)
          .then(res => res.json())
          .then(res => res.data.map(d => Object.assign(d, {
            id: d.userCode,
            name: d.userName,
            online: 'O' === d.userState,
            userType: 'S'
          })))
          .then(data => $scope.$apply(function() {
            vm.service = data
          }), wait)
      })


    }

    /**
     * 添加客服
     */
    function addCustomService() {
      vm.service.push({
        id: Mock.Random.id(),
        name: '客服-' + Mock.Random.cname(),
        online: false,
        avatar: Default_Avatar,
        userType: 'S'
      })
    }

    /**
     * 生成随机新用户
     * @returns {{id: number, name: string, avatar: string}}
     */
    function generateUser() {
      vm.user = {
        id: Mock.Random.id(),
        name: Mock.Random.cname(),
        avatar: Default_Avatar,
        userType: 'C'
      }
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
  }
})(angular)
