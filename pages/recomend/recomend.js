var app = getApp();
let QRCode = require("../../utils/qrcode.js").default;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qrtext: '',
    imageUrl: app.globalData.imageUrl
  },
  //生成分享二维码
  createQRcode: function() {
    this.setData({
      //将用户id写到二维码
      qrtext: app.globalData.uid
    })
    this.QR.clear();
    this.QR.makeCode(this.data.qrtext);
  },
  directfan: function() {
    var that = this;
    console.log(app.globalData.uid);
    wx.request({
      url: app.globalData.url + '/api/fans/getFansRecord?sid=' + app.globalData.sid + "&userId=" + app.globalData.uid,
      method: "POST",
      header: {
        'X-Requested-With': 'APP'
      },
      success: function(res) {
        if (res.data.data.fansVO.refereesNickName == null || res.data.data.fansVO.refereesNickName == '') {
          res.data.data.fansVO.refereesNickName = "无推荐人"
        }
        that.setData({
          refereesUserNickName: res.data.data.fansVO.refereesNickName,
          firstFansVOList: res.data.data.fansVO.firstFansVOList
        })
      }
    })
  },

  secfan: function() {
    wx.navigateTo({
      url: '../secfan/secfan?firfan=' + JSON.stringify(this.data.firstFansVOList)
    })
  },
  perdata: function() {
    var that = this;
    wx.getUserInfo({
      success(res) {
        that.setData({
          nickName: res.userInfo.nickName,
          avatarUrl: res.userInfo.avatarUrl
        })

      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.directfan();
    this.perdata();
    let sysinfo = wx.getSystemInfoSync();
    console.log(sysinfo)
    let qrcode = new QRCode('qrcode', {
      text: '',
      //获取手机屏幕的宽和长  进行比例换算
      width: 130,
      height: 130,
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
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  //--------------------------------扫码开始----------------------------------------
  //扫码后推荐
  getFans: function () {
    var that = this;
    wx.request({
      url: app.globalData.url + '/api/fans/becomeFans?sid=' + app.globalData.sid + '&userId=' + app.globalData.uid + '&refereesId=' + that.data.userId,
      method: "POST",
      header: {
        'X-Requested-With': 'APP'
      },
      success: function (res) {
        if (res.data.data.isSaveSuccess) {
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000,
          })
        } else {
          wx.showToast({
            title: '失败',
            icon: 'none',
            duration: 2000,
          })
        }
        console.log("扫码返回")
        console.log("res:" + res.data.data.isSaveSuccess)
      },
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
          wx.showToast({
            title: '失败',
            icon: 'none',
            duration: 2000
          })
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
        //获得粉丝
        that.modalcnt();
      }
    })
  },
  //---------------------------------扫码结束------------------------------------------
})