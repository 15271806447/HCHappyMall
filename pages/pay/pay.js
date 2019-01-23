var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TotalPrice: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      isMemberPay: options.isMemberPay
    });
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
  pay: function() {
    var that = this;
    if (that.data.isMemberPay) {
      getApp().pay("同源梦商城-购买商品" + this.data.product, this.data.orderNum, this.data.TotalPrice, function () {
        wx.redirectTo({
          url: '../memberCenter/memberCenter?isPaySuccess=' + 'true' + '&memberTypeId=' + that.data.memberTypeId,
        })
      });
    } else {
      console.log('money:' + this.data.TotalPrice);
      getApp().pay("同源梦商城-购买商品" + this.data.product, this.data.orderNum, this.data.TotalPrice, function() {
        wx.navigateTo({
          url: '../orderdetail/orderdetail?orderDetail=' + JSON.stringify(that.data.orderDetail) + '&type=pay',
        })
      });
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