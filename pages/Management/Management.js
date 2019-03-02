//index.js
//获取应用实例
var app = getApp()



Page({

  /**
   * 页面的初始数据
   */
  data: {
    Img: [],
    phoneNum: "",
    index: 1,
    index1: 1
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
            index1: 0
          });
        } else {
          that.setData({
            'phoneNum': "未绑定",
            index1: 1
          });
        }
        if (res.data.data.isAuthentication) {
          that.setData({
            'isRealName': "已实名",
            index: 0
          });
        } else {
          that.setData({
            'isRealName': "未实名",
            index: 1
          });
        }
        console.log(res)
      }
    })
  },

  jumpPhoneBinding: function (e) {
    if (e.currentTarget.dataset.index == 0) {
      wx.navigateTo({
        url: '../phoneBinding/success/success?phoneNum=' + this.data.phoneNum,
      })
    } else if (e.currentTarget.dataset.index == 1) {
      wx.navigateTo({
        url: '../phoneBinding/phoneBinding',
      })
    }
  },

  jumpAuthentication: function (e) {
    if (e.currentTarget.dataset.index == 0) {
      wx.navigateTo({
        url: '../authentication/success/success'
      })
    } else if (e.currentTarget.dataset.index == 1) {
      wx.navigateTo({
        url: '../authentication/authentication',
      })
    }
  },

   //查看用户是否已经有支付密码了
  checkUserHasPassword: function () {
    var that = this;
    console.log(77777777777777777777777777);
    console.log(app.globalData.uid);
    wx.request({
      url: app.globalData.url + '/api/wallet/isUserHavePassword?sid=' + app.globalData.sid + "&userId=" + app.globalData.uid,
      method: "POST",
      header: {
        'X-Requested-With': 'APP'
      },
      success: function (res) {
        console.log(res);
        if (!res.data.data.isUserHavePassword) {
          wx.showModal({
            title: '提示',
            content: '请设置您的密码',
            success(res1) {
              if (res1.confirm) {
                wx.navigateTo({
                  url: '../passwordSettings/passwordSettings?phoneNum=' + that.data.phoneNum,
                })
              } else if (res1.cancel) {
                // wx.navigateBack({
                //   delta: 1
                // })
              }
            }
          })
        }else {
          wx.navigateTo({
            url: '../passwordSettings/passwordSettings?phoneNum=' + that.data.phoneNum,
          })
        }
      }
    })
  },
  judge:function(){
    if(this.data.phoneNum == ""){
      wx.showModal({
        title: '提示',
        content: '请先绑定手机号',
        success(res1) {
          if (res1.confirm) {
            wx.navigateTo({
              url: '../phoneBinding/phoneBinding',
            })
          } else if (res1.cancel) {
            // wx.navigateBack({
            //   delta: 1
            // })
          }
        }
      })
    }else {
      this.checkUserHasPassword();
      console.log("7777777777777777")
      console.log(app.globalData.uid); 
      console.log("7777777777777777");
    }
  }



})