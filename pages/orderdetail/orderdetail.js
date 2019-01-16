var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgHeader: app.globalData.url + '/common/file/showPicture.do?id=',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  getOrderform:function(){
    var that = this;
    wx.request({
      url: app.globalData.url + '/api/order/getOrderDetailByOrderId?sid=' + app.globalData.sid + "&orderId="+that.data.orderData.id,
      method: "POST",
      header: {
        'X-Requested-With': 'APP'
      },
      success: function (res) {
        that.setData({
          address: res.data.data.address,
          coupon: res.data.data.coupon
        })
        var addr = app.analysisCode(that.data.address.areaIdPath,that.data.address.userAddress,that);
        console.log("地址：");
        console.log(addr);
        that.setData({
          addr: addr
        })
        if (that.data.coupon.preferentialAmount < 1) {
          var preferentialAmount = that.data.coupon.preferentialAmount * that.data.orderData.allPayment;
          that.setData({
           preferentialAmount: preferentialAmount
          });
        } else {
          preferentialAmount: that.data.coupon.preferentialAmount
        }
      }
    })
  },
  toPay:function(){
    var that = this;
    var pace = this.data.orderData.actualPayment + this.data.orderData.freight
    wx.navigateTo({
      url: '../pay/pay?TotalPrice=' + pace + '&orderId=' + that.data.orderData.id + '&orderItemVOList=' + JSON.stringify(that.data.orderData.orderItemVOList)
    })
  },
  onLoad: function (options) {
    var orderData = options.orderData;
    this.setData({
      orderData: JSON.parse(orderData)
    })

    this.getOrderform();
    
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})