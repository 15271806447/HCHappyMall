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

})