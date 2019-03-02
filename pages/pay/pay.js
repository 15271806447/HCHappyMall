var app = getApp();
var md5 = require('../utils/md5.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isMemberPay: false,
    isPaySuccess: false,
    TotalPrice: 0,
    showPayPwdInput: false, //是否展示密码输入层
    pwdVal: '', //输入的密码
    payFocus: true, //文本框焦点
    payMent: "balancePayment"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.isMemberPay != null && options.isMemberPay != "") {
      this.setData({
        isMemberPay: options.isMemberPay
      });
    }
    console.log("是否会员购买：");
    console.log(options.isMemberPay);
    console.log(this.data.isMemberPay);
    this.setData({
      memberTypeId: options.memberTypeId
    });
    //如果是从detail页跳转
    if (options.type == 'details') {
      var orderItemVOList = options.orderItemVOList;
      this.setData({
        'TotalPrice': options.TotalPrice,
        'orderId': options.orderId,
        'product': orderItemVOList.productTitle
      })
    }
    console.log(options);
    this.setData({
      'TotalPrice': options.TotalPrice,
      'orderId': options.orderId,
      'product': options.product
    })
    this.getOrderByOrderId();
  },

  /**
   * 显示支付密码输入层
   */
  showInputLayer: function() {
    this.setData({
      showPayPwdInput: true,
      payFocus: true
    });
  },
  /**
   * 隐藏支付密码输入层
   */
  hidePayLayer: function() {
    var pwdVal = this.data.pwdVal;
    var that = this;
    this.setData({
      showPayPwdInput: false,
      payFocus: false,
      pwdVal: ''
    }, function() {});
    if (pwdVal.length == 6) {
      //  钱包密码的加盐值
      var PasswordSalt = "602904194941511675975522089765";
      //  支付请求的加盐值
      var PayRequestSalt = "FmnYgg8Nmq1fhMZdP5C1cb8JiHkqy6";
      //  支付时间戳
      var timestamp = (new Date()).valueOf();
      //  支付请求 = MD5（支付加盐 + 用户输入的6位数字 + 密码加盐 + 时间戳 / 60000L）
      var payRequest = md5.hexMD5("" + PayRequestSalt + pwdVal + PasswordSalt + (parseInt(timestamp / 60000)));
      console.log('=========================');
      console.log('pwdVal:' + pwdVal);
      console.log('timestamp:' + (timestamp / 60000));
      console.log('payRequest:' + payRequest);
      
  
      wx.request({
        url: app.globalData.url + '/api/wallet/checkPayRequest?sid=' + app.globalData.sid + '&userId=' + app.globalData.uid + '&orderId=' + this.data.orderId + '&payRequest=' + payRequest,
        method: "POST",
        header: {
          'X-Requested-With': 'APP'
        },
        success: function(res) {
          console.log(res);
          if(res.data.success){
            wx.showModal({
              title: '提示',
              content: '支付成功!!!',
              showCancel: false,
              confirmColor: 'red',
              success(res){ 
                console.log(res);
                if(res.confirm)
                  wx.redirectTo({
                    url: '../orderdetail/orderdetail?orderDetail=' + JSON.stringify(that.data.orderDetail) + '&type=pay'
                  })
              }
            })
          }else{
            wx.showModal({
              title: '提示',
              content: '密码错误!!!',
              showCancel: false,
              confirmColor: 'red'
            })
          }
        }
      })
    }

  },
  /**
   * 获取焦点
   */
  getFocus: function() {
    this.setData({
      payFocus: true
    });
  },
  /**
   * 输入密码监听
   */
  inputPwd: function(e) {
    this.setData({
      pwdVal: e.detail.value
    });

    if (e.detail.value.length >= 6) {
      this.hidePayLayer();
    }
  },
  //密码输入框结束

  /**
   * 单选框change
   */
  radioChange: function(e) {
    console.log(e);
    this.setData({
      payMent: e.detail.value
    })
  },

  /**
   * 支付
   */
  pay: function() {
    var that = this;
    if (this.data.payMent == 'balancePayment') {
      //检验是否有密码
      wx.request({
        url: app.globalData.url + '/api/wallet/isUserHavePassword?sid=' + app.globalData.sid + '&userId=' + app.globalData.uid,
        method: "POST",
        header: {
          'X-Requested-With': 'APP'
        },
        success: function(res) {
          console.log(res);
          if (res.data.data.isUserHavePassword) {
            that.showInputLayer();
          } else {
            wx.showModal({
              title: '提示',
              content: '没有支付密码！',
              confirmText: '设置密码',
              success(res) {
                if (res.confirm) {
                  console.log('用户点击确定');
                  //TODO 跳到设置密码
                  wx.navigateTo({
                    url: '../passwordSettings/passwordSettings"',
                  })
                } else if (res.cancel) {
                  console.log('用户点击取消');
                }
              }
            })
          }
        }
      })

    } else if (this.data.payMent == 'weixinPayment') {
      var that = this;
      if (that.data.isMemberPay == true) {
        getApp().pay("同源梦商城-购买商品" + this.data.product, this.data.orderNum, this.data.TotalPrice, function() {
          that.setData({
            isPaySuccess: true
          })
        }, function() {
          that.setData({
            isPaySuccess: false
          })
        }, function() {
          wx.redirectTo({
            url: '../memberCenter/memberCenter?isPaySuccess=' + that.data.isPaySuccess + '&memberTypeId=' + that.data.memberTypeId,
          })
        });
      } else {
        console.log('money:' + this.data.TotalPrice);
        getApp().pay("同源梦商城-购买商品" + this.data.product, this.data.orderNum, this.data.TotalPrice, function() {
          wx.redirectTo({
            url: '../orderdetail/orderdetail?orderDetail=' + JSON.stringify(that.data.orderDetail) + '&type=pay',
          })
        }, function() {
          wx.showModal({
            title: '提示',
            content: '支付失败！',
            showCancel: false
          })
        }, function() {

        });
      }
    }

  },
  // 查询订单
  getOrderByOrderId: function() {
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    var that = this;
    wx.request({
      url: app.globalData.url + '/api/order/getOrderByOrderId?sid=' + app.globalData.sid + '&orderId=' + that.data.orderId,
      method: "POST",
      header: {
        'X-Requested-With': 'APP'
      },
      success: function(res) {
        console.log("=======================================")
        console.log(res);
        wx.hideLoading();
        var orderNum = res.data.data.orderVO.orderNum;
        that.setData({
          'orderNum': orderNum,
          'orderDetail': res.data.data
        })
      }
    })
  }
})