//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    user: {
      userImg: 'http://47.107.183.112/img/userImg.jpg',
      userName: "南墙在哪",
      member: false
    }
    
  },
  //扫码开始-------------------------------------------------------------------
  //扫码开始-------------------------------------------------------------------
  click: function () {
    var that = this;
    var show;
    wx.scanCode({
      success: (res) => {
        //获得扫码返回的值，推荐用户ID
        this.show = res.result;
        console.log(this.show)
        that.setData({
          show: this.show
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
        userId: app.globalData.uid,
        //推荐人
        refereesId: that.data.show,
      },
      method: "POST",
      header: {
        'X-Requested-With': 'APP'
      },
      success: function (res) {
        console.log(res)
      }
    })
  },
  modalcnt: function () {
    wx.showModal({
      title: '关注',
      content: '是否关注该推荐人',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          this.getFans()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //扫码结束

  onLoad: function () {
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
  }
})
