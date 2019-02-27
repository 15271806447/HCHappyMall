var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgHeader: app.globalData.url + '/common/file/showPicture.do?id=',
    imageUrl: app.globalData.imageUrl
  },


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
      url: '../pay/pay?TotalPrice=' + pace + '&orderId=' + that.data.orderData.id + '&orderItemVOList=' + JSON.stringify(that.data.orderData.orderItemVOList + '&type=details')
    })
  },
    /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /**
     * 从支付页跳转
     */
    if(options.type=='pay'){
      console.log(JSON.parse(options.orderDetail));
      var orderDetail = JSON.parse(options.orderDetail).orderVO;
      orderDetail.state = 2;
      this.setData({
        'orderData': orderDetail
      })
      this.getOrderform();
      return;
    }
    var orderData = options.orderData;
    console.log(orderData);
    this.setData({
      orderData: JSON.parse(orderData)
    })
    this.getOrderform();
    
  },
  /**
   * toIndex 跳转首页
   */
  toIndex:function(){
    wx.switchTab({
      url: '../index/index',
    })
  }
 
})