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
      var memberType = res.data.data.hcUserMember;
      if (memberType.length >= 0) {
        that.setData({
          member: true
        })
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
  },
  qr: function (e) {
    wx.navigateTo({
      url: '/pages/ShareCode/ShareCode',
    })
  },
})
