
let QRCode = require("../../utils/qrcode.js").default;


//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    qrtext: ''
  },
  //生成分享二维码
  createQRcode: function () {
    this.setData({
      //将用户id写到二维码
      qrtext: app.globalData.uid
    })
    //打印uid
    console.log("uid:"+app.globalData.uid)
    this.QR.clear();
    this.QR.makeCode(this.data.qrtext);
  },
  //获得用户信息
  getUserInfo: function(){
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
  //初始化二维码
  getQrCode: function(){
    // console.log(QRCode);
    // 获取手机信息
    let sysinfo = wx.getSystemInfoSync();
    console.log(sysinfo)
    let qrcode = new QRCode('qrcode', {
      text: '',
      //获取手机屏幕的宽和长  进行比例换算
      width: 150,
      height: 150,
      //二维码底色尽量为白色， 图案为深色
      colorDark: '#000000',
      colorLight: '#ffffff',
      correctLevel: QRCode.correctLevel.H
    });
    //将一个局部变量共享
    this.QR = qrcode;
    //分享二维码
    this.createQRcode();
  },
  //--------------------------------扫码开始----------------------------------------
  //扫码后推荐
  getFans: function () {
    var that = this;
    console.log(that.data.refereesId)
    console.log(that.data.userId)
    wx.request({
      url: app.globalData.url + '/api/fans/becomeFans?sid=' + app.globalData.sid + '&userId=' + app.globalData.uid + '&refereesId=' + that.data.userId,
      method: "POST",
      header: {
        'X-Requested-With': 'APP'
      },
      success: function (res) {
        console.log("res:" + res)
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
  click: function () {
    var that = this;
    wx.scanCode({
      success: (res) => {
        //获得扫码返回的值，推荐用户ID
        console.log("userId:" + res.result)
        //粉丝id，也就是当前扫码用户id
        console.log("refereesId:" + app.globalData.uid)
        that.setData({
          userId: res.result,
          refereesId: app.globalData.uid
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
  //---------------------------------扫码结束------------------------------------------
  onLoad: function () {
    this.getUserInfo();
    this.getQrCode();
  },
})