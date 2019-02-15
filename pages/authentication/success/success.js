
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:{
      name:"",
      sex:"",
      IdType:"",
      IdNumber:""
    }
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   var that = this;
   var userName = "user.name";
    var userSex = "user.sex";
    var userIdType = "user.IdType";
    var userIdNumber = "user.IdNumber";

    wx.request({
      url: app.globalData.url + '/api/personalCenter/checkBindingInfo?sid=' + app.globalData.sid + "&userId=" + app.globalData.uid,
      method: "POST",
      header: {
        'X-Requested-With': 'APP'
      },
      success: function (res) {
        console.log(res);
        that.setData({
          [userName]: res.data.data.HcPUnUserRealInfo.realName,
          [userSex]: res.data.data.HcPUnUserRealInfo.sex,
          [userIdType]: res.data.data.HcPUnUserRealInfo.documentType,
          [userIdNumber]: res.data.data.HcPUnUserRealInfo.provinceCardNumber,
        })

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