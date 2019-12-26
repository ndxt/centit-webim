
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

window.ctx = _getContextPath();

//一堆模式
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
const CONTENT_TYPE_CARD = "card";

const CONTENT_TYPE_OFFLINE = "offline";
const CONTENT_TYPE_ASKFORSERVICE = "askForService";
const CONTENT_TYPE_ASKROBOT = "askRobot";
const CONTENT_TYPE_NOTICE = "notice";
const CONTENT_TYPE_FORM = "form";
const CONTENT_TYPE_PUSH_FORM = "pushForm";
const CONTENT_TYPE_OVER = "over";
const CONTENT_TYPE_QUIT_GROUP = "quitGroup";
const UPLOADIMAGE_URL = `/im/service/file/upload`
const UPLOADFILE_URL = `/im/service/file/upload`

const USER_AVATAR = "./src/images/userdefalt.png"


const SELECT_UNIT_CRUMB = ['南大先腾']

let historyChatPageParam = {
  pageNo: 1,
  pageSize: 20,

}
let USER_LIST = []
let member_id_list = []
let member_name_list = []
let model = 'CREATE_MODE'
let chatList = function () {
  
}

// async upload(file) {
//   const upload = new Uploader(file, this.params, this.uploadCompleteCb);
//   const uploads = this.$refs.Upload.fileList;

//   uploads.unshift(upload);
//   this.uploads = uploads;
//   await upload.start();

//   this.$nextTick(() => {
//     this.$root.$emit("reload");
//   });
// }
//想办法改变其加载方式
layui.config({
    version: true
  }).use('mobile', function(){


window.$ = layui.$
const mobile = layui.mobile
const layim = mobile.layim
const layer = mobile.layer

let TOTAL_UNIT_NAME = ''
 //演示自动回复


/**
     * 工具函数：获取时间戳
     * @returns {number}
     * @private
     */
    function _getTimestamp() {
      return new Date().getTime()
  }

  function getLocalChatLog(id) {
    return JSON.parse(localStorage.getItem('layim-mobile'))[id]
  }
  /**
   * 
   * @param {*} id 
   * @param {*} target 
   * @param {*} unitName 
   */


  function addFriendList(id, target, unitName) {
    let userList = getUnitUser(id)
    
    data1 = {
      users: userList,
      renderNull: function() {
        return userList.length === 0
      }
    }
    
    layim.panel({
      title: `选择群成员` //标题
      ,tpl:Mustache.render(`
      <div class="search-list">
      <div class="crumb-container"></div>
      <div class="cut-line"></div>
      <ul class="member-list unit-user-list layui-layim-list  layui-show">
      {{#users}}
      <li layim-event="chat" data-id="{{userCode}}" data-type="groupmember" data-index="0" class="custom-group layim-friend{{userCode}}">
      <div>
      <div class="avatar-container">
      <img src="${USER_AVATAR}">
      </div>
      </div>
      <span class="username">
      {{userName}}</span>
      <p></p><span class="layim-msg-status">new</span>
      </li>
      {{/users}}
      {{#renderNull}}
      <li class="layim-null">暂无联系人</li>'
      {{/renderNull}}
      </ul>

      </div>
      ` , data1),
   });
   createCrumb()
  }

  function createCrumb() {
    let crumb = SELECT_UNIT_CRUMB.slice(SELECT_UNIT_CRUMB.length -2, SELECT_UNIT_CRUMB.length)
    let tpl = ''
    for(let i = 0; i < crumb.length - 1; i++) {
           tpl += `<span class="non-last-crumb">${crumb[i]}</span>`
           tpl += `<span>></span>`
         }
         tpl += `<span class="last-crumb">${crumb[crumb.length - 1]}</span>`
        $(".crumb-container").html(tpl)
  }

  function addSubunitList(subunits, id) {
    let userList = getUnitUser(id)
    let data1 = {
      units: subunits,
      users: userList
    }
    
    layim.panel({
      title: `选择群组` //标题
      ,tpl:Mustache.render(`
      <div class="search-list">
      <div class="crumb-container"></div>
      <div class="cut-line"></div>
      <ul class="layui-layim-list layim-tab-content layui-show layim-list-friend">
      {{#users}}
      <li layim-event="chat" data-id="{{userCode}}" data-type="groupmember" data-index="0" class="custom-group layim-friend{{userCode}}">
      <div>
      <div class="avatar-container">
      <img src="${USER_AVATAR}">
      </div>
      </div>
      <span class="username">
      {{userName}}</span>
      <p></p><span class="layim-msg-status">new</span>
      </li>
      {{/users}}
      <div class="cut-line"></div>
      {{#units}}
      <li data-groupname="{{unitName}}" style="padding-left:0px;border:none;" data-id="{{unitCode}}" data-type="group" data-index="0" class="im-unit">
      
      <h5 style="width:94%;" data-id="{{unitCode}}" lay-type="false">
      <span class="im-unit-name">{{ unitName}}</span>
      <span class="right-icon">＞</span>
      </h5>
      </li>
      {{/units}}
      
      
      </ul>
      
      </div>
      ` , data1),
   });
   createCrumb()
  }

  function searchSubUnit(id) {
    let subunits = []
    $.ajax({
      type: "GET",
      //后面优化可以改为true
      async: false,
      url: `/im/webimcust/subUnit/${id}`,
      dataType: "json",
      success: (data) =>{
        subunits = data.data
      }
   })
   return subunits
  }

  function getGoodsInfo(goodsId, storeId) {
    let goodsInfo
    $.ajax({
      type: "GET",
      //后面优化可以改为true
      async: false,
      url: `http://www.czcycx.com/api/servicemart/goodsInfo/goodsInfo_detailByGoodsId?pageSize=10&goodsId=${goodsId}&belongStoreId=${storeId}`,
      dataType: "json",
      success: function(data){
        
        goodsInfo = data.data
      }
   })
   return goodsInfo
  }


  

function getMineUnit(id) {
    // 目前写死group，后面会根据id获取的部门名找到部门id等其他信息
    let group = []
      $.ajax({
        type: "GET",
        //后面优化可以改为true
        async: false,
        url: `/im/webimcust/userUnits/${id}`,
        dataType: "json",
        success: function(data){
          if(data.data) {
            for(let i = 0; i < data.data.length; i++) {
              group[i] = {
                "groupname": data.data[i].unitName
                ,"id": data.data[i].unitCode
                ,realType: "unit"
                ,"avatar": USER_AVATAR
              }
            }
          }
         
        }
     })
    return group  
}


function getUserGroups(id) {
  let group = []
      $.ajax({
        type: "GET",
        //后面优化可以改为true
        async: false,
        url: `/im/webimcust/userGroups/${id}`,
        dataType: "json",
        success: function(data){
          for(let i = 0; i < data.data.length; i++) {
            group[i] = {
              "groupname": data.data[i].groupName
              ,"id": data.data[i].groupId
              ,realType: 'group'
              ,"avatar": USER_AVATAR
            }
          }
        }
     })
     return group
}

function getUnitUser(unitId) {
  let users = []
  $.ajax({
    type: "GET",
    //TODO后面优化可以改为true
    async: false,
    url: `/im/webimcust/unitUsers/${unitId}`,
    dataType: "json",
    success: function(data) {
      users = data.data
    }
 })
 return users
}

function getHistoryChat(receiver, sender) {
  let chatInfo = {}
  $.ajax({
    type: "GET",
    //后面优化可以改为true
    async: false,
    url: `/im/webimmsg/historyMessage/${receiver}/${sender}`,
    dataType: "json",
    contentType: "application/json",
    data: historyChatPageParam,
    success: (data) => {
      
      chatInfo = data.data
      
    }
 })
 return chatInfo
}


function getCustomFriendList(unitId) {
  let units = searchSubUnit(unitId)
  return units.map((item) => {
    return {
      "groupname": item.unitName
            ,"id": item.unitCode
            ,"avatar": USER_AVATAR
            ,"list": []
    }
  })
}

function getMineFriendList(id) {
    // 目前写死friend，后面会根据id获取的部门名找到部门id等其他信息
    let friendGroup = []

    $.ajax({
      type: "GET",
      //后面优化可以改为true
      async: false,
      url: "/im/webimcust/allUnit",
      dataType: "json",
      success: function(data){
        for(let i = 0; i < data.data.length; i++) {
          friendGroup[i] = {
            "groupname": data.data[i].unitName
            ,"id": data.data[i].unitCode
            ,"avatar": USER_AVATAR
            ,"list": []
          }
        }
      }
   })
   
     
     return friendGroup
}


// function showLargeImg (){
//   $('body').on('click', '.layui-layim-photos', function(){
//     $(this).css( { 'width': '160px' })
//   })
// }

// showLargeImg()

const TEST_USER1 = {
  "osId": "WebIM",
  "userCode": "345",
  "userName": "陆鸿博",
  "userState": "F",
  "userType": "U"
  }

const TEST_USER2 = {
  "osId": "WebIM",
  "userCode": "182",
  "userName": "陶荣",
  "userState": "F",
  "userType": "U"
  }

  const TEST_USER3 = {
    "osId": "WebIM",
    "userCode": "6278",
    "userName": "谢绍水",
    "userState": "F",
    "userType": "U"
    }

    const TEST_USER4 = {
      "osId": "WebIM",
      "userCode": "592",
      "userName": "胡知非",
      "userState": "F",
      "userType": "U"
      }
class User {
    constructor() {
        let USER1 = TEST_USER4
        // let USER1 = TEST_USER1
        this.closeHandler
        this.hasOpenWs = false
        this.mine = $.extend(
          {"avatar": USER_AVATAR,
          "sign": "",
          "username": USER1.userName,
           id: USER1.userCode}, USER1)
        //这里需要同步执行
        this.im = layim
        this.group = getMineUnit(this.mine.id).concat(getUserGroups(this.mine.id))
        this.friend = getMineFriendList(this.mine.id)
        // this.friend =  getCustomFriendList(1)
        // this.createGroup()
        this.afterInit()
    }
    
    onpenChat(user) {
      layim.chat({
        name: user.name //名称
        ,type: 'friend' //聊天类型
        ,avatar: USER_AVATAR //头像
        ,id: user.userId //定义唯一的id方便你处理信息
      });
    }

    createSelectList2(subUnits, customClassName, groupId) {
      let className = 'select_member_btn'
      
      if(customClassName) {
        className = customClassName
      }
      let allFriendList = subUnits
                
      let list = getUnitUser(groupId)
                let data1 = {
                 groups: allFriendList,
                 users: list,
                 classFn: function() {
                   
                   if(member_id_list.indexOf(this.userCode) > -1) {
                     return 'member_select'
                   } else {
                     return ''
                   }
                 },
                 crumb: SELECT_UNIT_CRUMB,
                 hasMembers: function() {
                   return !list.length
                 },
                 imgSrc: function() {
                   
                   if(member_id_list.indexOf(this.userCode) > -1) {
                     return './src/images/selected.png'
                   } else {
                     return ''
                   }
                 }
                }
                
                $("body").off("mouseup", ".selectMember")
                $('body').on('mouseup', '.selectMember', function(){
                  let id = $(this).data('id')
                  let name = $(this).data('name')
                  
                  if($(this).hasClass("member_select")) {
                    $(this).find(".member-checkbox img").attr('src', '')
                    $(this).removeClass("member_select")
                    let index = member_id_list.indexOf(id)
                    if(index > -1) {
                      member_id_list.splice(index, 1)
                      member_name_list.splice(index, 1)
                    }
                  } else {
                    member_name_list.push(name)
                    member_id_list.push('' + id)
                    $(this).addClass("member_select")
                    $(this).find(".member-checkbox img").attr('src', './src/images/selected.png')
                  }
                  
                })
  
                $("body").off("input", "#search-group")
                $('body').on('input', '#search-group', function(e){
                  let search_text = $("#search-group").val()
                  $("[data-type=group]").each((index, item) => {
                    let name = $(item).find("span").html()
                    
                    if(name.indexOf(search_text) > -1) {
                      $(item).css("display", "block")
                    } else {
                      $(item).css("display", "none")
                    }


                  })


                })
                
  
                $("body").off("input", "#search-member")
                $('body').on('input', '#search-member', function(e){
                  
                  let search_text = $("#search-member").val()
                  $("[data-type=groupmember]").each((index, item) => {
                    let name = $(item).find("span").html()
                    
                    if(name.indexOf(search_text) > -1) {
                      $(item).css("display", "block")
                    } else {
                      $(item).css("display", "none")
                    }
                  })
                })
  
                let data2 = {
                  groups: this.friend
                }
                
                $("body").off("mouseup", ".selectGroup")
                $("body").on("mouseup", ".selectGroup", (e) => {
                  let unitId = $(e.currentTarget).data('id')
                  let unitName = $(e.currentTarget).data('name')
                  let subunits = searchSubUnit(unitId)
                  SELECT_UNIT_CRUMB.push(unitName)
                  if(subunits.length !== 0) {
                    if(model === "ADD_MODE") {
                      this.createSelectList2(subunits, 'add-group-member', unitId)
                    } else {
                      this.createSelectList2(subunits, false, unitId)
                    }
                    
                  } else {
                    this.createGroupMemberPanel(unitId)
                  }
                })
                layim.panel({
                  title: '选择群组' //标题
                  ,tpl:Mustache.render(`
                  <div class="search-list">
                  <div class="input-container">
                  <img class="search-icon" src="./src/images/search.png"/>
                  <input class="search-input" placeholder="搜索" id="query-member"/>
                  </div>
                  <div class="crumb-container"></div>
                  <div class="cut-line"></div>
                  <ul class="member-list layui-layim-list  layui-show">
                  {{#users}}
            <li data-name="{{userName}}" data-id="{{userCode}}" data-type="groupmember" data-index="0" class="layim-friend{{userCode}} selectMember {{classFn}}">
            <div>
            <div class="avatar-container">
            <img src="${USER_AVATAR}">
            </div>
            </div>
            <span class="username">
            {{userName}}</span>
            <p></p><span class="layim-msg-status">new</span>
            <span class="member-checkbox">
            <img src="{{imgSrc}}"/>
            </span>
            </li>
            {{/users}}
            <div class="cut-line"></div>
                  {{#groups}}
                  <li style="padding-left:25px;" data-name="{{unitName}}" data-id="{{unitCode}}" data-type="group" data-index="0" class="layim-friend{{unitCode}} selectGroup">
                  <h5 style="display:block">
                  <span>{{ unitName }}</span>
                  <span class="right-icon">＞</span>
                  </h5>
                  </li>
                  {{/groups}}
                  
                  </ul>
                  <div class="static_bottom_btn ${className}">确认</div>
                  </div>
                  ` , data1),
               });
               createCrumb()
  
                
    }

    createSelectList(customClassName) {
      let className = 'select_member_btn'
      
      if(customClassName) {
        className = customClassName
      }
      let allFriendList = []
                
      if(USER_LIST.length === 0) {
        $.ajax({
          type: "GET",
          //后面优化可以改为true
                    async: false,
                    url: `/im/webimcust/listUser`,
                    dataType: "json",
                    success: function(data){
                      USER_LIST = data.data
                      allFriendList = USER_LIST
                    }
                 })
                } else {
                  allFriendList = USER_LIST
                }
                
                
                let data1 = {
                 users: allFriendList
                }
                let _this = this
                $("body").off("mouseup", ".selectMember")
                $('body').on('mouseup', '.selectMember', function(){
                  let id = $(this).data('id')
                  let name = $(this).data('name')
                  if(name === _this.mine.username) {
                    return
                  }
                  if($(this).hasClass("member_select")) {
                    $(this).find(".member-checkbox img").attr('src', '')
                    $(this).removeClass("member_select")
                    let index = member_id_list.indexOf(id)
                    if(index > -1) {
                      member_id_list.splice(index, 1)
                      member_name_list.splice(index, 1)
                    }
                  } else {
                    member_id_list.push('' + id)
                    member_name_list.push(name)
                    $(this).addClass("member_select")
                    $(this).find(".member-checkbox img").attr('src', './src/images/selected.png')
                  }
                  
                })
  
                $("body").off("input", "#search-group")
                $('body').on('input', '#search-group', function(e){
                  
                  let search_text = $("#search-group").val()
                  $("[data-type=group]").each((index, item) => {
                    let name = $(item).find("span").html()
                    
                    if(name.indexOf(search_text) > -1) {
                      $(item).css("display", "block")
                    } else {
                      $(item).css("display", "none")
                    }
                  })

                  $.ajax({
                    type: "GET",
                    //后面优化可以改为true
                    async: false,
                    url: "/im/webimcust/queryUser",
                    dataType: "json",
                    contentType: "application/json",
                    data: {
                      name: search_text,
                      pageNo: 1,
                      pageSize: 50
                    },
                    success: (data)=>{
                      let list = data.data.objList
                      
                      let data1 = {
                        users: list,
                        classFn: function() {
                          
                          if(member_id_list.indexOf(this.userCode) > -1) {
                            return 'member_select'
                          } else {
                            return ''
                          }
                        },
                        hasMembers: function() {
                          return !list.length
                        },
                        imgSrc: function() {
                          
                          if(member_id_list.indexOf(this.userCode) > -1) {
                            return './src/images/selected.png'
                          } else {
                            return ''
                          }
                        }
                      }
                      
                      $("#add-memeber-search-list").html(
                        Mustache.render(`
                        {{#users}}
                        <li data-name="{{userName}}" data-id="{{userCode}}" data-type="groupmember" data-index="0" class="layim-friend{{userCode}} selectMember {{classFn}}">
            <div>
            <div class="avatar-container">
            <img src="${USER_AVATAR}">
            </div>
            </div>
            <span class="username">
            {{userName}}</span>
            <p></p><span class="layim-msg-status">new</span>
            <span class="member-checkbox">
            <img src="{{imgSrc}}"/>
            </span>
            </li>
                      {{/users}}
                        `, data1)
                      )
                      // this.onEventListener()
                    }
                 })
                })
                
  
                $("body").off("input", "#search-member")
                $('body').on('input', '#search-member', function(e){
                  
                  let search_text = $("#search-member").val()
                  $("[data-type=groupmember]").each((index, item) => {
                    let name = $(item).find("span").html()
                    
                    if(name.indexOf(search_text) > -1) {
                      $(item).css("display", "block")
                    } else {
                      $(item).css("display", "none")
                    }
                  })
                })
  
                let data2 = {
                  groups: this.friend
                }
                
                $("body").off("mouseup", ".selectGroup")
                $("body").on("mouseup", ".selectGroup", (e) => {
                  let unitId = $(e.currentTarget).data('id')
                  let unitName = $(e.currentTarget).data('name')
                  SELECT_UNIT_CRUMB.push(unitName)
                  let subunits = searchSubUnit(unitId)
                  if(subunits.length !== 0) {
                    if(model === "ADD_MODE") {
                      this.createSelectList2(subunits, 'add-group-member', unitId)
                    } else {
                      this.createSelectList2(subunits, false, unitId)
                    }
                  } else {
                    this.createGroupMemberPanel(unitId)
                  }
                })
                
                layim.panel({
                  title: '选择群组' //标题
                  ,tpl:Mustache.render(`
                  <div class="search-list">
                  <div class="input-container">
                  <img class="search-icon" src="./src/images/search.png"/>
                  <input class="search-input" placeholder="搜索" id="search-group"/>
                  </div>
                  <div class="crumb-container"></div>
                  <div class="cut-line"></div>
                  <ul class="member-list layui-layim-list  layui-show">
                  {{#groups}}
                  <li style="padding-left:25px;" data-name="{{groupname}}" data-id="{{id}}" data-type="group" data-index="0" class="layim-friend{{id}} selectGroup">
                  <h5 style="display:block">
                  <span>{{ groupname }}</span>
                  <span class="right-icon">＞</span>
                  </h5>
                  </li>
                  {{/groups}}
                  <ul id="add-memeber-search-list">
                  
                  </ul>
                  </ul>
                  <div class="static_bottom_btn ${className}">确认</div>
                  </div>
                  ` , data2),
               });
               createCrumb()
  
                
    }

    createGroupMemberPanel(groupId, customClassName) {
      let className = 'select_member_btn'
      
      if(model === "ADD_MODE") {
        className = 'add-group-member'  
      }

      let list = getUnitUser(groupId)
      let dataJson = JSON.parse(sessionStorage.getItem('tmpList'))

      function differenceList(unionArr,subsetArr) {
        let tmp = new Array();
          for(let i = 0; i < unionArr.length; i++){
            let flag = true;
            for(let j = 0;j < subsetArr.length; j++){
              if(unionArr[i].userCode === subsetArr[j].userCode){
                flag = false;
              }
            }
            if(flag){
              tmp.push(unionArr[i]);
            }
          }
        return tmp;
      }
      
      let users = differenceList(list,dataJson);

      let data1 = {
        users,
        classFn: function() {
          
          if(member_id_list.indexOf(this.userCode) > -1) {
            return 'member_select'
          } else {
            return ''
          }
        },
        crumb: SELECT_UNIT_CRUMB,
        hasMembers: function() {
          return !list.length
        },
        imgSrc: function() {
          
          if(member_id_list.indexOf(this.userCode) > -1) {
            return './src/images/selected.png'
          } else {
            return ''
          }
        }
      }

          layim.panel({
            title: '选择群组成员' //标题
            ,tpl:Mustache.render(`
            <div class="search-list">
            <div class="input-container">
            <img class="search-icon" src="./src/images/search.png"/>
            <input class="search-input" placeholder="搜索" id="search-member"/>
            </div>
            <div class="crumb-container"></div>
            <div class="cut-line"></div>
            <ul class="member-list layui-layim-list  layui-show">
              {{#users}}
              <li data-name="{{userName}}" data-id="{{userCode}}" data-type="groupmember" data-index="0" class="layim-friend{{userCode}} selectMember {{classFn}}">
              <div>
              <div class="avatar-container">
              <img src="${USER_AVATAR}">
              </div>
              </div>
              <span class="username">
              {{userName}}</span>
              <p></p><span class="layim-msg-status">new</span>
              <span class="member-checkbox">
              <img src="{{imgSrc}}"/>
              </span>
              </li>
              {{/users}}
            </ul>
            {{#hasMembers}}
            <li class="layim-null">暂无联系人</li>
            {{/hasMembers}}
            <div class="static_bottom_btn ${className}">确认</div>
            </div>
            ` , data1),
         });
         createCrumb()
      
    }

   //创建卡片
   createCard(data) {
     
  var baseUrl = 'https://cxcypt-1259283319.cos.ap-shanghai.myqcloud.com/';
  // data.content.picSrc = baseUrl + data.content.picSrc
	data.senderName = data.receiverName
	console.log(data);
	// "a({{href}})[{{href}}]" +
	if (data.content.price === undefined) {
		if (data.content.picSrc.indexOf("mov") != -1 ||
			data.content.picSrc.indexOf("mkv") != -1 ||
			data.content.picSrc.indexOf("m2v") != -1 ||
			data.content.picSrc.indexOf("mp4") != -1 ||
			data.content.picSrc.indexOf("MOV") != -1 ||
			data.content.picSrc.indexOf("MKV") != -1 ||
			data.content.picSrc.indexOf("M2V") != -1 ||
			data.content.picSrc.indexOf("MP4") != -1) {

			data.content.picSrc = "../image/video.png";
			const template =
				"a({{href}})" +
				"[p class=card-container data-href={{href}}]" +
				"img[{{picSrc}}]" +
				"[p class=card-goodname]&#12288;商品名称: {{goodsName}}[/p]" +
				"[p class=card-des]价格: 面议[/p]" +
				"[/p]"
			const content = Mustache.render(template, data.content);

			this.showChatMessage($.extend({
				id: data.receiver
			}, data, {
				content,
			}))
		} else {

			data.content.picSrc = baseUrl + data.content.picSrc;
			const template =
				"a({{href}})[{{href}}]" +
				"[span class=card-container data-href={{href}}]" +
				"img[{{picSrc}}]" +
				"[p class=card-goodname]&#12288;商品名称: {{goodsName}}[/p]" +
				"[span class=card-des]价格: 面议[/span]" +
				"[/span]"
			const content = Mustache.render(template, data.content);

			this.showChatMessage($.extend({
				id: data.receiver
			}, data, {
				content,
			}))
		}
	} else if (data.content.price === 0) {
		if (data.content.picSrc.indexOf("mov") != -1 ||
			data.content.picSrc.indexOf("mkv") != -1 ||
			data.content.picSrc.indexOf("m2v") != -1 ||
			data.content.picSrc.indexOf("mp4") != -1 ||
			data.content.picSrc.indexOf("MOV") != -1 ||
			data.content.picSrc.indexOf("MKV") != -1 ||
			data.content.picSrc.indexOf("M2V") != -1 ||
			data.content.picSrc.indexOf("MP4") != -1) {

			data.content.picSrc = "../image/video.png";
			const template =
				"a({{href}})[{{href}}]" +
				"[span class=card-container data-href={{href}}]" +
				"img[{{picSrc}}]" +
				"[p class=card-goodname]&#12288;商品名称: {{goodsName}}[/p]" +
				"[span class=card-des]价格: 免费[/span]" +
				"[/span]"
			const content = Mustache.render(template, data.content);

			this.showChatMessage($.extend({
				id: data.receiver
			}, data, {
				content,
			}))
		} else {

			data.content.picSrc = baseUrl + data.content.picSrc;
			const template =
				"a({{href}})[{{href}}]" +
				"[span class=card-container data-href={{href}}]" +
				"img[{{picSrc}}]" +
				"[p class=card-goodname]&#12288;商品名称: {{goodsName}}[/p]" +
				"[span class=card-des]价格: 免费[/span]" +
				"[/span]"
			const content = Mustache.render(template, data.content);

			this.showChatMessage($.extend({
				id: data.receiver
			}, data, {
				content,
			}))
		}
	} else {
		if (data.content.picSrc.indexOf("mov") != -1 ||
			data.content.picSrc.indexOf("mkv") != -1 ||
			data.content.picSrc.indexOf("m2v") != -1 ||
			data.content.picSrc.indexOf("mp4") != -1 ||
			data.content.picSrc.indexOf("MOV") != -1 ||
			data.content.picSrc.indexOf("MKV") != -1 ||
			data.content.picSrc.indexOf("M2V") != -1 ||
			data.content.picSrc.indexOf("MP4") != -1) {
				if(data.content.isDiscount === '1'){
					data.content.picSrc = baseUrl + data.content.picSrc;
					const template =
						"a({{href}})[{{href}}]" +
						"[span class=card-container data-href={{href}}]" +
						"img[{{picSrc}}]" +
						"[p class=card-goodname]&#12288;商品名称: {{goodsName}}[/p]" +
						"[span class=card-des]促销价: {{discountPrice}} 元[/span]" +
						"[/span]"
					const content = Mustache.render(template, data.content);
					
					this.showChatMessage($.extend({
						id: data.receiver
					}, data, {
						content,
					}))
				}else{
					data.content.picSrc = "../image/video.png";
					const template =
						"a({{href}})[{{href}}]" +
						"[p class=card-container data-href={{href}}]" +
						"img[{{picSrc}}]" +
						"[p class=card-goodname]&#12288;商品名称: {{goodsName}}[/p]" +
						"[p class=card-des]价格: {{price}} 元[/p]" +
						"[/p]"
					const content = Mustache.render(template, data.content);
					
					this.showChatMessage($.extend({
						id: data.receiver
					}, data, {
						content,
					}))
				}

			
		} else {
			console.log(data.content.isDiscount);
			if(data.content.isDiscount === '1'){
				data.content.picSrc = baseUrl + data.content.picSrc;
				const template =
					"a({{href}})[{{href}}]" +
					"[span class=card-container data-href={{href}}]" +
					"img[{{picSrc}}]" +
					"[p class=card-goodname]&#12288;商品名称: {{goodsName}}[/p]" +
					"[span class=card-des]促销价: {{discountPrice}} 元[/span]" +
					"[/span]"
				const content = Mustache.render(template, data.content);
				
				this.showChatMessage($.extend({
					id: data.receiver
				}, data, {
					content,
				}))
			}else{
				data.content.picSrc = baseUrl + data.content.picSrc;
				const template =
					"a({{href}})[{{href}}]" +
					"[p class=card-container data-href={{href}}]" +
					"img[{{picSrc}}]" +
					"[p class=card-goodname]&#12288;商品名称: {{goodsName}}[/p]" +
					"[p class=card-des]价格: {{price}} 元[/p]" +
					"[/p]"
				const content = Mustache.render(template, data.content);
				
				this.showChatMessage($.extend({
					id: data.receiver
				}, data, {
					content,
				}))
			}
			
		}
	}

}

queryHistoryMsg(data) {
  
  $.ajax({
    type: "GET",
    //后面优化可以改为true
    async: false,
    url: `/im/webimmsg/historyMessage/${data.receiver}/${data.sender}`,
    dataType: "json",
    data: {
      pageNo: 1,
      pageSize: data.unreadSum
    },
    success: (res) =>{
      let msgList = res.data.objList.reverse()
      
      for(let i = 0; i < msgList.length; i++) {
        msgList[i].id = msgList[i].sender
        msgList[i].timestamp = msgList[i].sendTime
        msgList[i].content = msgList[i].content.msg
        this.showChatMessage(msgList[i])
      }
      this.setMsgState(data)
    }
 })
}

setMsgState(data) {
  $.ajax({
    type: "POST",
    //后面优化可以改为true
    async: false,
    url: `/im/webimmsg/setGroupReadState/${data.receiver}/${data.sender}`,
    dataType: "json",
    success: (res) =>{
    }
 })
}

queryGroupMsg() {
  $.ajax({
    type: "GET",
    //后面优化可以改为true
    async: false,
    url: `/im/webimmsg/statGroupUnread/${this.mine.id}`,
    dataType: "json",
    success: (data) =>{
      
      for(let i = 0; i < data.data.length; i++) {
        this.queryHistoryMsg (data.data[i])
      }
    }
 })
}

queryUnreadMsg() {
  $.ajax({
    type: "GET",
    //后面优化可以改为true
    async: false,
    url: `/im/webimmsg/getUnreadLastMsg/${this.mine.id}`,
    dataType: "json",
    success: (data) =>{
      for(let i = 0; i < data.data.length; i++) {
        this.queryHistoryMsg (data.data[i])
      }
    }
 })
}
//创建群组
    createGroup(groupInfo) {
      /**
       * 用户登录后，根据用户部门信息，加群，若群不存在，则创建群
       */
      //TODO先查询是否存在此群，根据部门id获取此群
      if (groupInfo.members.length > 1) {
        $.ajax({
          type: "POST",
          //后面优化可以改为true
          async: false,
          url: "/im/webimcust/group",
          dataType: "json",
          contentType: "application/json",
          data: JSON.stringify(groupInfo),
          success: (data)=>{
            this.group = getMineUnit(this.mine.id).concat(getUserGroups(this.mine.id))
            this.createUserPanel()
  
            layim.chat({
              name: data.data.groupName //名称
              ,type: 'group' //聊天类型
              ,avatar: USER_AVATAR //头像
              ,id: this.mine.id//定义唯一的id方便你处理信息
            });
            
            // this.onEventListener()
          }
       })
      }else {
        layui.use('layer', function(){
          var layer = layui.layer;
          
          layer.msg('请选择群聊成员');
        }); 
      }
    }
/**
         * 显示系统消息
         * @param params
         */
        showSystemMessage(params) {
          params.system = true
          params.userType = 'system'
          this.showChatMessage(params)
      }
    /**
         * 显示收到的聊天信息
         * @param id
         * @param content
         * @param senderName
         * @param system
         * @param timestamp
         */
        showChatMessage({id, userType = "friend", content, timestamp, senderName, system = false}) {
          
          if(system) {
          //   layer.open({
          //     title: '系统通知'
          //     ,
          //     content: Mustache.render(content)
          // });
          } else {
            this.im.getMessage({
              type: userType,
              system,
              username: senderName,
              //FIXME
              id: id,
              content,
              timestamp: timestamp || _getTimestamp(),
              avatar: USER_AVATAR
            })
          }
         
         
          
      }


        /**
         * WebSocket通道打开事件
         */
      onWSOpen() {
        this.hasOpenWs = true
        this.sendRegisterCommand()   
        this.queryUnreadMsg()
        this.queryGroupMsg()
      }

    /**
     * 发送注册（上线）指令
     */
        sendRegisterCommand() {
          let data = {
            type: MSG_TYPE_COMMAND,
            contentType: CONTENT_TYPE_REGISTER,
            content: this.mine,
            receiver:this.mine.id,
            sender: this.mine.id,
            sendTime: _getTimestamp()
        }
        this.sendWSMessage(data)
      }

    createUserPanel() {
      layim.config({
      
        
        //上传图片接口
        uploadImage: {
          url: UPLOADIMAGE_URL
          ,type: '' //默认post
        }
        
        //上传文件接口
        ,uploadFile: {
          url: UPLOADIMAGE_URL
          ,type: '' //默认post
        }
        
        //,brief: true
    
        ,init: {
          //我的信息
          mine: this.mine
          //我的好友列表
          ,friend: this.friend
          ,"group": this.group
        }
        
        //扩展聊天面板工具栏
        // ,tool: [{
        //   alias: 'code'
        //   ,title: '代码'
        //   ,iconUnicode: '&#xe64e;'
        // }]
        
        //扩展更多列表
        // ,moreList: [{
        //   alias: 'find'
        //   ,title: '发现'
        //   ,iconUnicode: '&#xe628;' //图标字体的unicode，可不填
        //   ,iconClass: '' //图标字体的class类名
        // },{
        //   alias: 'share'
        //   ,title: '分享与邀请'
        //   ,iconUnicode: '&#xe641;' //图标字体的unicode，可不填
        //   ,iconClass: '' //图标字体的class类名
        // }]
        
        //,tabIndex: 1 //用户设定初始打开的Tab项下标
        ,isNewFriend: false //是否开启“新的朋友”
        ,isgroup: true //是否开启“群聊”
        //,chatTitleColor: '#c00' //顶部Bar颜色
        ,title: this.mine.username + '的IM' //应用名，默认：我的IM
      })
    }

     /**
         * 创建WS链接
         */
        createWSConnection() {
          let contextPath = _getContextPath()
              , id = this.mine.id
              , wsHost

         
              wsHost = 'ws://localhost:8080'
              wsHost = `${wsHost}/im/im/${id}`
          

          let socket = this.socket = new WebSocket(wsHost)

          socket.onopen = this.onWSOpen.bind(this)

          socket.onmessage = this.onWSMessage.bind(this)

          socket.onclose = this.onWSClose.bind(this)
      }

        /**
         * WebSocket关闭打开事件
         */
        onWSClose() {
          this.hasOpenWs = false
          if(this.closeHandler) {
            clearTimeout(this.closeHandler)
          }
          // this.closeHandler = setTimeout(() => {
          //   window.location.reload();
          //     layer.open({
          //         title: '系统通知'
          //         ,
          //         content: Mustache.render('您已掉线，请<a onmouseup="window.location.reload();" style="color: RGB(98, 158, 229);cursor: pointer">刷新</a>重新连接')
          //     });
          // }, 3000)
          
      }


    onSendMessage(res) {
      
      let mine = res.mine,
                to = res.to

            // 用户时修改发送id
            to.id = this.to ? this.to.id : to.id
           
            this.sendChatMessage({mine, to})
    }

    /**
         * 发送聊天信息
         * @param mine
         * @param to
         */
        sendChatMessage({mine, to}) {
          let msgType = MSG_TYPE_CHAT
          if(to.type === "group") {
            msgType = MSG_TYPE_GROUP
          }

          let data = {
              type: msgType,
              contentType: CONTENT_TYPE_TEXT,
              content: {
                  msg: mine.content || mine
              },
              sender: mine.id,
              senderName: this.mine.username,
              receiver: to.userCode || to.id,
              sendTime: _getTimestamp()
          }
              this.sendWSMessage(data);
      }

        /**
         * WebSocket通道收到信息事件,至关重要
         * @param res
         */
        onWSMessage(res) {
            
            let data = res.data
            if (!this.messageHandler) {
                clearTimeout(this.messageHandler);
            }
            try {
                data = JSON.parse(res.data)
                console.log(data)
            }
            catch (e) {
                // console.info(e)
            }
            if (data.contentType == "offline" && this.mine.userType == "S") {

              layer.open({
                title: '下线通知'
                , content: data.content.msg
              });
            }
            
            switch (data.type) {
                case MSG_TYPE_GROUP:
                    this.showChatMessage($.extend({id: data.receiver, userType: "group"}, data, {content: data.content.msg}))
                    break
                case MSG_TYPE_CHAT :
                    this.showChatMessage($.extend({id: data.sender, userType: "friend"}, data, {content: data.content.msg}))
                    break
                case MSG_TYPE_SYSTEM:
                    this.showSystemMessage($.extend({id: '0'}, data, {
                        content: data.content.msg,
                        id: data.content.id,
                        data: data.content
                    }))
                    break
                case MSG_TYPE_COMMAND:
                    this.onCommandMessage(data, data.content)
                    break;
                // case MSG_TYPE_QUESTION:
                //     this.createProblemList(data.content, data);
                //     break;

                case MSG_TYPE_BROADCAST:
                    // this.onBroadcastMessage(datdea);
                    break
                default:
                    console.warn(`未知的数据类型：${data.type}`)
            }
        }


    sendWSMessage(data) {//CF
      if (this.socket.readyState == '3') {
        this.socket.send(JSON.stringify(data))
      } else if (this.socket.readyState == '1') {
          console.log(data);
          this.socket.send(JSON.stringify(data))
      }
  }

    onCommandMessage (data, content) {
      switch (data.contentType) {
        case CONTENT_TYPE_QUIT_GROUP:
          layer.open({
            title:"警告",
            content: `<div>${content.msg}</div>`,
            btn: ['确认'],
            cancel: (index, layero) =>{
              //do something
              this.group = getMineUnit(this.mine.id).concat(getUserGroups(this.mine.id))
              this.createUserPanel()
              layer.close(index); //如果设定了yes回调，需进行手工关闭
            },
            yes: (index, layero) =>{
              let chatLog = getLocalChatLog(this.mineId)
              // chatLog.histroy[`group${}`]
              this.group = getMineUnit(this.mine.id).concat(getUserGroups(this.mine.id))
              this.createUserPanel()
              layer.close(index);
            }
          })
            break
        default:
            console.warn(`未知的数据类型：${data.type}`)
    }
    }

    onEventListener() {


      $("body").off("mouseup", ".crumb-container")
      $("body").on("mouseup", ".crumb-container", (e) => {
        
      let currentPanelBackBtn = $(e.currentTarget).parent().parent().parent().find("[layim-event=back]")[0]
        
      layim.emit(currentPanelBackBtn)
      })

      $("body").off("input",  "#query-member")
      $("body").on("input", "#query-member", (e) => {
        let search_text = $("#query-member").val()
        
        if(search_text === "") {
          $(".layim-list-friend").show()
          $(".search-list-container").hide()
        } else {
          $(".layim-list-friend").hide()
          $(".search-list-container").show()
        }
        
        $.ajax({
          type: "GET",
          //后面优化可以改为true
          async: false,
          url: "/im/webimcust/queryUser",
          dataType: "json",
          contentType: "application/json",
          data: {
            name: search_text,
            pageNo: 1,
            pageSize: 50
          },
          success: (data)=>{
            let userList = data.data.objList
            let data1 = {
              users: userList,
              renderNull: function() {
                return userList.length === 0
              }
            }
            $(".search-list-container").html(
              Mustache.render(`
      <div class="search-list">
      <div class="crumb-container"></div>
      <div class="cut-line"></div>
      <ul style="position: static;" class="member-list unit-user-list layui-layim-list  layui-show">
      {{#users}}
      <li layim-event="chat" data-id="{{userCode}}" data-type="groupmember" data-index="0" class="custom-group layim-friend{{userCode}}">
      <div>
      <div class="avatar-container">
      <img src="${USER_AVATAR}">
      </div>
      </div>
      <span class="username">
      {{userName}}</span>
      <p></p><span class="layim-msg-status">new</span>
      </li>
      {{/users}}
      {{#renderNull}}
      <li class="layim-null">暂无联系人</li>'
      {{/renderNull}}
      </ul>
      </div>
      ` , data1),
            )
            // this.onEventListener()
          }
       })
      })
      $("body").off("click", ".im-unit")
      $("body").on("click", ".im-unit", (e) => {
        let id = $(e.currentTarget).data('id')
        let groupName = $(e.currentTarget).data('groupname')
        let subunits = searchSubUnit(id)
        SELECT_UNIT_CRUMB.push(groupName)
        if(subunits.length === 0) {
          addFriendList(id, e.currentTarget)
        } else {
          addSubunitList(subunits, id)
        }
      })
      //查看聊天信息
      let data1 = {
        users:  []
      }
      layim.on('detail', (data) => {
        let tempFriendList = []
        console.log(data); //获取当前会话对象
        
        let UNIT_TPL = `<div class="search-list">
        <div class="input-container">
        <img class="search-icon" src="./src/images/search.png"/>
        <input class="search-input" placeholder="搜索" id="search-delete-member"/>
        </div>
        <div class="cut-line"></div>
        <ul class="group-member-list member-list layui-layim-list  layui-show unit-list">
        {{#users}}
        <li layim-event="chat" data-id="{{userCode}}" data-type="groupmember" data-index="0" class="custom-group layim-friend{{userCode}}">
        <div>
        <div class="avatar-container">
        <img src="http://tvax1.sinaimg.cn/crop.0.0.300.300.180/006Iv8Wjly8ff7ghbigcij308c08ct8i.jpg">
        </div>
        </div>
        <span class="username">
        {{userName}}</span>
       
        <p></p><span class="layim-msg-status">new</span></li>
        
        {{/users}}
        </ul>
        
        </div>`

        let GROUP_TPL = `<div class="search-list">
        <div class="input-container">
        <img class="search-icon" src="./src/images/search.png"/>
        <input class="search-input" placeholder="搜索" id="search-delete-member"/>
        </div>
        <div class="cut-line"></div>
        <ul class="group-member-list member-list layui-layim-list  layui-show">
        {{#users}}
        <li layim-event="chat" data-id="{{userCode}}" data-type="groupmember" data-index="0" class="custom-group layim-friend{{userCode}}">
        <div>
        <div class="avatar-container">
        <img src="http://tvax1.sinaimg.cn/crop.0.0.300.300.180/006Iv8Wjly8ff7ghbigcij308c08ct8i.jpg">
        </div>
        </div>
        <span class="username">
        {{userName}}</span>
       
        <p></p><span class="layim-msg-status">new</span></li>
        <span data-id="{{userCode}}" class="delete-group-member">移除</span>
        {{/users}}
        </ul>
          <div class="btn-container">
          <div class="static_bottom_btn add-member">添加新成员</div>
          
        <div class="static_bottom_btn delete_group_btn">删除该群</div>
          </div>
        
        </div>`
        let TPL = UNIT_TPL
        const GROUP_ID = data.id
        
        $("body").off('mouseup', ".change-group-btn")
        $("body").on('mouseup', ".change-group-btn", () =>{
          
          let groupname = $("#change-groupname-input").val()
          if(groupname === "") {
            groupname === data.groupname
          }
            let tempinfo = $.extend(data, {groupname, name: groupname})
            let groupInfo = {
              groupId: data.id,
              groupName: data.groupname,
              groupNotice: '',
            }
            $.ajax({
              type: "PUT",
              //后面优化可以改为true
              async: false,
              url: "/im/webimcust/group",
              dataType: "json",
              contentType: "application/json",
              data: JSON.stringify(groupInfo),
              success: (data)=>{
                this.group = getMineUnit(this.mine.id).concat(getUserGroups(this.mine.id))
                this.createUserPanel()
                // this.onEventListener()
              }
           })
          
        })
        //修改群消息
      $("body").off('mouseup', ".change-group")
      $("body").on('mouseup', ".change-group", () =>{
        layim.panel({
          title: `修改群${data.groupname}的信息` //标题
          ,tpl:Mustache.render(`
          <div class="search-list">
          <div>
          <span>群名称：</span>
          <input id="change-groupname-input" style="float:right;" class="search-input"/>
          </div>
          <div class="static_bottom_btn change-group-btn">确认</div>
          </div>
          ` , data1),
       });
      })
      //监听删除群操作
        $("body").off('mouseup', '.delete_group_btn')
        $("body").on('mouseup', '.delete_group_btn', (e) =>{
          let userCode = $(e.currentTarget).data("id")
          layer.open({
            title:"警告",
            content: "<div>确认删除该群？</div>",
            btn: ['确认', '取消'],
            cancel: function(index, layero){
              //do something
              
              layer.close(index); //如果设定了yes回调，需进行手工关闭
            },
            yes: (index, layero) =>{
              $.ajax({
                type: "DELETE",
                //后面优化可以改为true
                async: false,
                url: `/im/webimcust/deleteGroup/${GROUP_ID}/${this.mine.id}`,
                dataType: "json",
                success: (data) =>{
                  
                  if(data.data.flag == 1) {
                    
                    // layer.open({
                    //   title:"提示",
                    //   content: "<div>删除成功</div>"
                    // })
                    this.group = getMineUnit(this.mine.id).concat(getUserGroups(this.mine.id))
                    this.createUserPanel()
                    // this.onEventListener()
                    // layer.close(index)
                  } else {
                    layer.open({
                      title:"提示",
                      content: `<div>删除失败,${data.data.message}</div>`
                    })
                  }
                  
                }
             })


             
            }
          })
          
        })
        //监听添加群成员
        $("body").off('mouseup', '.add-group-member')
        $("body").on('mouseup', '.add-group-member', (e) => {

          
          let allMemberId = []
          allMemberId = tempFriendList.map((item) => {
            return item.id
          })
          let userCode = $(e.currentTarget).data("id")




          allMemberId = allMemberId.concat(member_id_list)

          allMemberId = Array.from(new Set(allMemberId))
          
          $.ajax({
            type: "PUT",
            //后面优化可以改为true
            async: false,
            url: `/im/webimcust/member/${data.id}`,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(allMemberId),
            success: (data) =>{
              
              if(data.message === "OK") {
                // $(e.currentTarget).css("display", "none")
                this.createUserPanel()
              } else {
                layer.open({
                  title:"提示",
                  content: `<div>添加失败</div>`
                })
              }
              member_id_list = []
              member_name_list = []
            }
         })
        })
        //监听添加群成员
        $("body").off('mouseup', '.add-member')
        $("body").on('mouseup', '.add-member', (e) => {
          model = 'ADD_MODE'
          this.createSelectList('add-group-member')
        })
        //监听删除群成员
        $("body").off('mouseup', '.delete-group-member')
        $("body").on('mouseup', '.delete-group-member', (e) =>{
          console.log('event is', e)
          let allMemberId = []
          allMemberId = tempFriendList.map((item) => {
            return item.id
          })
          let userCode = $(e.currentTarget).data("id")
          let memberIndex = allMemberId.indexOf(String(userCode))
          if(memberIndex >= -1) {
            allMemberId.splice(memberIndex, 1)
            tempFriendList.splice(memberIndex, 1)
          }
          
          $.ajax({
            type: "PUT",
            //后面优化可以改为true
            async: false,
            url: `/im/webimcust/quitGroup/${GROUP_ID}/${userCode}`,
            dataType: "json",
            contentType: "application/json",
            // data: JSON.stringify(allMemberId),
            success: function(data){
              
              if(data.message === "OK") {
                $(`[data-id=${userCode}].custom-group`).remove()
                $(`[data-id=${userCode}].delete-group-member`).remove()
              } else {
                layer.open({
                  title:"提示",
                  content: `<div>删除失败</div>`
                })
              }
            }
         })
         
         if(allMemberId.length === 0) {
          $.ajax({
            type: "DELETE",
            //后面优化可以改为true
            async: false,
            url: `/im/webimcust/deleteGroup/${GROUP_ID}/${this.mine.id}`,
            dataType: "json",
            success: (data) =>{
              if(data.data.flag == 1) {
                
                // layer.open({
                //   title:"提示",
                //   content: "<div>删除成功</div>"
                // })
                this.group = getMineUnit(this.mine.id).concat(getUserGroups(this.mine.id))
                this.createUserPanel()
                // this.onEventListener()
                // layer.close(index)
              } else {
                layer.open({
                  title:"提示",
                  content: `<div>删除失败,${data.data.message}</div>`
                })
              }
              
            }
         })
         }
        })
        
        let url = "unitUsers"
        let key = "userName"
        
        if(data.realType === "group") {
          url = "member"
          key = "groupAlias"
          TPL = GROUP_TPL
        }
        
        $.ajax({
          type: "GET",
          //后面优化可以改为true
          async: false,
          url: `/im/webimcust/${url}/${data.id}`,
          dataType: "json",
          success: function(data){
            sessionStorage.setItem('tmpList', JSON.stringify(data.data))
            for(let i = 0; i < data.data.length; i++) {
              
              tempFriendList.push($.extend({
                "avatar": USER_AVATAR,
                "sign": "",
                username: data.data[i][key],
                userName: data.data[i][key],
                id: data.data[i].userCode
              }, data.data[i]))
            }
          }
       })
       $("body").off("input", "#search-delete-member")
              $('body').on('input', '#search-delete-member', function(e){
                
                let search_text = $("#search-delete-member").val()
                $("[data-type=groupmember]").each((index, item) => {
                  
                  let name = $(item).find("span").html()
                  let code = $(item).data("id")
                  if(name.indexOf(search_text) > -1) {
                    $(item).css("display", "block")
                    $(`[data-id=${code}]`).css("display", "inline-block")
                  } else {
                    $(item).css("display", "none")
                    $(`[data-id=${code}]`).css("display", "none")
                  }
                })
                
              })
       data1.users = tempFriendList
            layim.panel({
            title: data.name + '群成员' //标题
            ,tpl:Mustache.render(TPL, data1),
            
            // <div class="static_bottom_btn change-group">修改群信息</div>
            
         });
        });
//监听自定义工具栏code点击
        // layim.on('tool(code)', (insert, send, obj) => { //事件中的tool为固定字符，而code则为过滤器，对应的是工具别名（alias）
        //   let receiver = obj.data.id
        //   let sender = this.mine.id
        //   let chat = getHistoryChat(receiver, sender)

        // }); 
        //监听点击“新的朋友”
    layim.on('newFriend', function(){
    layim.panel({
      title: '新的朋友' //标题
      ,tpl: '<div style="padding: 10px;">自定义模版，{{d.data.test}}</div>' //模版
      ,data: { //数据
        test: '么么哒'
      }
      });
    });

//修改群信息
layim.on('newFriend', function(){

  
  layim.panel({
    title: '新的朋友' //标题
    ,tpl: '<div style="padding: 10px;">自定义模版，{{d.data.test}}</div>' //模版
    ,data: { //数据
      test: '么么哒'
    }
    });
  });

      
    
        $("body").off('mouseup', ".select_member_btn")
        $("body").on('mouseup', ".select_member_btn", () =>{
          
          let groupInfo = {
            members: member_id_list,
            groupName: member_name_list.slice(0, 4).join(),
            creator: this.mine.id,
            groupNotice: '',
            osId: ''
          }
          this.createGroup(groupInfo)
        })
        
        layim.on('newGroup', () =>{
          member_id_list = [this.mine.id]
          member_name_list = [this.mine.userName]
          
          model = 'CREATE_MODE'
          this.createSelectList()

          return

        });



      //监听点击更多列表
      layim.on('moreList', function(obj){
        switch(obj.alias){
          case 'find':
            layer.msg('自定义发现动作');
            
            //模拟标记“发现新动态”为已读
            layim.showNew('More', false);
            layim.showNew('find', false);
          break;
          case 'share':
            layim.panel({
              title: '邀请好友' //标题
              ,tpl: '<div style="padding: 10px;">自定义模版，{{d.data.test}}</div>' //模版
              ,data: { //数据
                test: '么么哒'
              }
            });
          break;
        }
      });

      //监听返回
    layim.on('back', function(e){
      if(SELECT_UNIT_CRUMB.length > 1) {
        SELECT_UNIT_CRUMB.pop()
      }
      createCrumb()
      //如果你只是弹出一个会话界面（不显示主面板），那么可通过监听返回，跳转到上一页面，如：history.back();
    });



    //监听发送消息
    layim.on('sendMessage', this.onSendMessage.bind(this));

    //监听查看更多记录
    layim.on('chatlog', (data, ul) => {
      console.log(data)
      let mineId = this.mine.id
      let receiver = data.id
      let chatLogInfo  = getHistoryChat(receiver, mineId)
      let chatLog = chatLogInfo.objList.reverse()
      //根据返回的页数信息，修改
      
      let tpl = `<div class="layim-chat-main" style="bottom:0px !important">
      <ul id="chatlog-container">`
      let currentPageInfo = chatLogInfo.pageDesc
      let currentNum = currentPageInfo.pageNo * currentPageInfo.pageSize
      
      if(currentNum < currentPageInfo.totalRows ) {
        historyChatPageParam.pageNo += 1
        tpl += `<li id="moreChatList" class="layim-chat-system"><span>查看更多聊天记录</span></li>`
      } else {
        $("#moreChatList").remove()
      }

      $('body').off("click", '#moreChatList')
      $('body').on("click", '#moreChatList', () => {
       let chatLogInfo  = getHistoryChat(receiver, mineId)
       let currentPageInfo = chatLogInfo.pageDesc
       let chatLog = chatLogInfo.objList.reverse()
      let currentNum = currentPageInfo.pageNo * currentPageInfo.pageSize
      
      for(let i = 0; i < chatLog.length; i++) {
        let className = ""
        let thisLog = chatLog[i]
        let sender = chatLog.sender
        if(thisLog.sender == mineId) {
          className = "layim-chat-mine"
        }
        let content = layim.content(thisLog.content.msg)
      
       $("#chatlog-container").prepend(`<li class="layim-chat-li ${className}">
        <div class="layim-chat-user">
        <img src="${USER_AVATAR}" alt="${sender}">
        <cite>${thisLog.senderName}</cite>
        </div>
        <div class="layim-chat-text">${content}</div>
        </li>`)
        $("#chatlog-container").prepend(`<li class="layim-chat-system"><span>${thisLog.sendTime}</span></li>`) 
      }

      if(currentNum < currentPageInfo.totalRows ) {
        historyChatPageParam.pageNo += 1
        $("#moreChatList").remove()
        $("#chatlog-container").prepend(`<li id="moreChatList" class="layim-chat-system"><span>查看更多聊天记录</span></li>`)
      } else {
        $("#moreChatList").remove()
      }
      })

      for(let i = 0; i < chatLog.length; i++) {
        let className = ""
        let thisLog = chatLog[i]
        let sender = chatLog.sender
        if(thisLog.sender == mineId) {
          className = "layim-chat-mine"
        }
        let content = layim.content(thisLog.content.msg)
        tpl += `<li class="layim-chat-system"><span>${thisLog.sendTime}</span></li>`
        tpl += `<li class="layim-chat-li ${className}">
        <div class="layim-chat-user">
        <img src="${USER_AVATAR}" alt="${sender}">
        <cite>${thisLog.senderName}</cite>
        </div>
        <div class="layim-chat-text">${content}</div>
        </li>`
      }
      tpl += '</ul></div>'
      layim.panel({
        title: '与 '+ data.name +' 的聊天记录' //标题
        ,tpl: tpl,
      });
     
    });
    
    //模拟"更多"有新动态
    layim.showNew('More', true);
    layim.showNew('find', true);
    }


    sendPageCard(goodsDetail) {
      var cardInfo = {
        href: window.location.href,
        goodsName: goodsDetail.goodsName,
        des: goodsDetail.goodsBriefDescription ? goodsDetail.goodsBriefDescription : '',
        picSrc: goodsDetail.img,
        price: goodsDetail.price,
        discountPrice: goodsDetail.discountPrice,
        isDiscount: goodsDetail.isDiscount
      };
      var mine = this.mine;
      var data = {
        type: MSG_TYPE_COMMAND,
        contentType: CONTENT_TYPE_CARD,
        content: cardInfo,
        sender: mine.id,
        senderName: mine.username,
        receiver: goodsDetail.storeInfo.userId,
        receiverName: goodsDetail.storeInfo.name,
        sendTime: _getTimestamp()
      };
      this.sendWSMessage(data);
      return data;
    };

    afterInit() {
        this.createUserPanel()
        this.createWSConnection()
        this.onEventListener()
        // this.queryUnreadMsg()
        //TODO查询未读消息
      //非核心功能：商店客服聊天
      // let goodsInfo = getGoodsInfo('g1557477872969', 's1557477653398')
      // let cardInfo = this.sendPageCard(goodsInfo)
      //  this.createCard(cardInfo)
    }
}
    
    

    chatList = function () {
      let user = new User()
      
      // var midTab = $("#LAY_layimNewList").parent()[0]
     
      // if(true) {
      //   layim.emit(midTab)
      // }
      // if(true) {
      //   layim.emit($("[layim-event=newGroup]")[0])
      // }
      $("body").on("click", '[layim-event=chat]', function(e){
      })
      // layim.chat({
      //   name: 111 //名称
      //   ,type: 'friend' //聊天类型
      //   ,avatar: USER_AVATAR + 1 //头像
      //   ,id: 1//定义唯一的id方便你处理信息
      // });
    }
    
    chatList()

  });
  