var md5 = require('../utils/md5.js');
var base64 = require('../../utils/base64.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showView: true,
    beginTime: 60,
    phoneNumber:"",
    timeset: null,
    firstPassword:"",
    secondPassword:"",
    code:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      phoneNumber:options.phoneNum
    })
  },

  //获取输入框中的密码值
  getValue:function(e){
    console.log(e.currentTarget.dataset.index);
    console.log(e.detail.value);
    console.log(e.detail.maxlength);
    if (e.currentTarget.dataset.index == 1){
      this.setData({
        firstPassword: e.detail.value
      })
    } else if (e.currentTarget.dataset.index == 2){
      this.setData({
        secondPassword: e.detail.value
      })
    } else if (e.currentTarget.dataset.index == 3){
      this.setData({
        code: e.detail.value
      })
    }
  },

  //定时器
  settime: function () {
    var that = this;
    this.data.timeset = setInterval(function () {
      that.setData({
        beginTime: --that.data.beginTime
      })
      if (that.data.beginTime == 0) {
        that.setData({
          beginTime: 60,
          showView: (!that.data.showView)
        })
        clearInterval(that.data.timeset)
        return;
      }
    }, 1000);
  },


  //获取手机验证码
  getCode: function (e) {
    var that = this;
    var SMS_CODE_SALT = "sljksdf@34#s51";
    var currentTimeMillis = new Date();
    var key = SMS_CODE_SALT + this.data.phoneNumber + parseInt((currentTimeMillis.getTime() / 60000));
    var type = 0
    key = md5.hexMD5(key);
    if (that.data.phoneNumber == "") {
      wx.showToast({
        title: '请填写手机号码',
        duration: 2000,
        icon: 'none'
      });
      return false;
    }
    if (!(/^1[34578]\d{9}$/.test(that.data.phoneNumber))) {
      wx.showToast({
        title: '手机号码有误',
        duration: 2000,
        icon: 'none'
      });
      return false;
    } else {
      that.settime();
      that.setData({
        showView: (!that.data.showView)
      });
      //向后台发起请求
      wx.request({
        url: app.globalData.url + '/api/anon/sendCode?sid=' + app.globalData.sid + '&type=' + type + '&key=' + key + '&to=' + that.data.phoneNumber,
        method: "POST",
        header: {
          'X-Requested-With': 'APP'
        },
        success(res) {
          console.log(res.data);
          console.log("成功");
          var codeSendTime = Date.now();
          that.setData({
            codeSendTime: codeSendTime
          })
        }
      })
    }
  },
  submit:function(){
    var that = this;
    console.log(this.data.firstPassword.length);
    console.log(this.data.firstPassword)
    console.log(this.data.secondPassword)
    console.log(this.data.code)
    if (this.data.firstPassword.length < 6 || this.data.secondPassword.length < 6 || this.data.code == "" || this.data.code == null){
      wx.showToast({
        title: '请填写完整信息',
        icon: "none"
      })
    } else if (this.data.firstPassword != this.data.secondPassword) {
      wx.showToast({
        title: '您输入的两次密码不一致',
        icon: "none"
      })
    }

    var secondPassword = base64.encode(this.data.secondPassword);
    wx.request({
      url: app.globalData.url + '/api/wallet/initOrUpdatePassword?sid=' + app.globalData.sid + "&userId=" + app.globalData.uid + "&base64PassWord=" + secondPassword + "&code=" + that.data.code + "&to=" + that.data.phoneNumber,
      method: "POST",
      header: {
        'X-Requested-With': 'APP'
      },
      success:function(res){
        console.log("777777777777777777777777777777777777");
        console.log(res);
        console.log("777777777777777777777777777777777777");
        if (res.data.data.isSuccess){
          wx.showToast({
            title: '密码设置成功',
          })
          wx.navigateBack({
            delta:1
          })
        }
      }
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

 





})