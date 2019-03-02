//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    sourceType: ['充值', '订单消费', '订单返回消费', '提现','佣金'], //充值类型
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },
  accountDetails: function () {
    var that = this;
    wx.request({
      url: app.globalData.url + '/api/wallet/getWallet?sid=' + app.globalData.sid + '&userId=' + app.globalData.uid,
      method: "POST",
      header: {
        'X-Requested-With': 'APP'
      },
      success: function (res) {
    
      }
    })
  },
})