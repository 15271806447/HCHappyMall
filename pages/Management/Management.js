//index.js
//获取应用实例
var app = getApp()



Page({

  /**
   * 页面的初始数据
   */
  data: {
    Img: []
  },

  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    //获得该用户的绑定信息
    this.grtBindingInfo();

  },
  getBigImg: function() {
    console.log(this.data.userInfo.avatarUrl)
    this.data.Img[0] = this.data.userInfo.avatarUrl
    wx.previewImage({
      urls: this.data.Img,
    })
  },
  grtBindingInfo: function(){
    var that = this;
    console.log('uid' + app.globalData.uid);
    wx.request({
      url: app.globalData.url + '/api/personalCenter/checkBindingInfo?sid=' + app.globalData.sid +'&userId='+app.globalData.uid,
      method: "POST",
      header: {
        'X-Requested-With': 'APP'
      },
      success: function(res) {
        if (res.data.data.hcPhoneBinding.phoneNumber!=null) {
          that.setData({
            'phoneNum': res.data.data.hcPhoneBinding.phoneNumber,
          });
        } else {
          that.setData({
            'phoneNum': "未绑定",
          });
        }
        if (res.data.data.isAuthentication) {
          that.setData({
            'isRealName': "已实名",
          });
        } else {
          that.setData({
            'isRealName': "未实名",
          });
        }
        console.log(res)
      }
    })
  }
})