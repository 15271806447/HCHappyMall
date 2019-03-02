
let QRCode = require("../../utils/qrcode.js").default;


//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    qrtext: '',
    wallet: {
      money: "8000.00",
    }
  },
  //获得用户信息
  getUserInfo: function () {
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
  },
  recharge: function (e) {
    wx.navigateTo({
      url: '../OnlineRecharge/OnlineRecharge?url=recharge',
    })
  },
  getWallet: function () {
    var that = this;
    wx.request({
      url: app.globalData.url + '/api/wallet/getWallet?sid=' + app.globalData.sid + '&userId=' + app.globalData.uid,
      method: "POST",
      header: {
        'X-Requested-With': 'APP'
      },
      success: function (res) {
        console.log(res);
        var wallet = that.data.wallet;
        var money = res.data.data.hcWallet.balance;
        wallet.money = money;
        if (money == null) {
          wallet.money = 0;
        }
        that.setData({
          'money': money,
          'wallet': wallet
        });
      }
    })
  },
  account: function () {
    wx.navigateTo({
      url: '../account/account',
    })
  },
  onLoad: function () {
    this.getUserInfo();
    this.getWallet();
  },
})