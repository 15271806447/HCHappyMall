Page({

  /**
   * 页面的初始数据
   */
  data: {
    TotalPrice:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      'TotalPrice':options.TotalPrice,
      'orderId': options.orderId,
      'product': options.product
    }) 
  },
  pay:function(){
    
    // this.setData({
    //   'TotalPrice':1.00
    // })
    console.log('money:' + this.data.TotalPrice);
    getApp().pay("同源梦商城-购买商品" + this.data.product, 2332456401237399, this.data.TotalPrice);
    // TODO 查订单
    // 2332456401237399
  }
})