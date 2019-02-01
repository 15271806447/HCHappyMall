//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    user: {
      userImg: 'http://47.107.183.112:90/img/userImg.jpg',
      userName: "南墙在哪",
      member: false
    },
    imageUrl: app.globalData.imageUrl
  },
  //--------------------------------扫码开始----------------------------------------
  click: function () {
    var that = this;
    wx.scanCode({
      success: (res) => {
        //获得扫码返回的值，推荐用户ID
        this.userId = res.result;
        console.log("userId:" + this.userId)
        //粉丝id，也就是当前扫码用户id
        this.refereesId = app.globalData.uid;
        console.log("refereesId:"+this.refereesId)
        that.setData({
          userId: this.userId,
          refereesId: this.refereesId
        })
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000,
          success: function () {
            //获得粉丝
            that.modalcnt()
          }
        })
      },
      fail: (res) => {
        wx.showToast({
          title: '失败',
          icon: 'success',
          duration: 2000
        })
      },
      complete: (res) => {
      }
    })
  },
  //扫码后推荐
  getFans: function () {
    var that = this;
    wx.request({
      url: app.globalData.url + '/apis/becomeFans?sid=' + app.globalData.sid + '&userId=' + app.globalData.uid,
      data: {
        //被推荐
        userId: this.data.refereesId,
        //推荐人
        refereesId: this.data.userId,
      },
      method: "POST",
      header: {
        'X-Requested-With': 'APP'
      },
      success: function (res) {
        console.log("res:"+res)
      }
    })
  },
  modalcnt: function () {
    var that = this
    wx.showModal({
      title: '关注',
      content: '是否关注该推荐人',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          console.log("扫码分享。。。。。。。。。")
          that.getFans()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //---------------------------------扫码结束------------------------------------------

  //检查是否是会员
cheakMember : function(){
  console.log(app.globalData.uid);
  var that = this;
  wx.request({
    url: app.globalData.url + '/api/personalCenter/getUserMember?sid=' + app.globalData.sid + '&userId=' + app.globalData.uid,
    method: "POST",
    header: {
      'X-Requested-With': 'APP'
    },
    success(res) {
      var memberTypeId = res.data.data.hcUserMember.memberTypeId;
      if (memberTypeId == null || memberTypeId == ""){
        that.data.user.member = false;
      }else{
        that.data.user.member = true;
      }
      console.log("是否会员：");
      console.log(that.data.user.member);
    }
  })
},
  onLoad: function () {
    var user = this.data.user;
    user.userImg = app.globalData.userInfo.avatarUrl;
    user.userName = app.globalData.userInfo.nickName;
    this.setData({
      'user':user
    })
    wx.request({
      url: app.globalData.url + '/api/personalCenter/checkAuthentication?sid=' + app.globalData.sid + '&userId=' + app.globalData.uid,
      method: "POST",
      header: {
        'X-Requested-With': 'APP'
      },
      success(res) {
        console.log(res);
        console.log(res.data.data.isAuthentication)
        if (!res.data.data.isAuthentication) {
          wx.showModal({
            title: '提示',
            showCancel: true,
            content: '请绑定手机号',
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  
                  url: '../authentication/authentication',
                });
              }
            }
          })
        }
      }
    })
    this.cheakMember();
  }
})
