var app = getApp();
var tcity = require("../../utils/citys.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:'',
    addressId:['','','','','',''],
    show:true,
    province:'', 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.getAddress();
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

  },


  addAddress: function () {
    wx: wx.navigateTo({
      url: '../addAddress/addAddress',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  // 删除交互
  deletes: function (e) {
    var index = e.currentTarget.dataset.index;
    console.log(index);
    var that = this;
    var addressId = this.data.addressId[index];
    console.log(addressId);

    console.log(this.data.show);
    wx.request({
      url: app.globalData.url + '/api/userAddress/deleteAddress?sid=' + app.globalData.sid + '&Id=' + addressId ,
      method: "POST",
      header: {
        'X-Requested-With': 'APP'
      },
      success: function (res) {
        console.log("删除成功");
      }
    })

    wx: wx.navigateTo({
      url: '../address/address',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  /**获取地址 */
  getAddress: function (e) {
    var that = this;
    tcity.init(that);
    var cityData = this.data.cityData;

    wx.request({
      url: app.globalData.url + '/api/userAddress/getAddress?sid=' + app.globalData.sid + '&userId=' + app.globalData.uid,
      method: "POST",
      header: {
        'X-Requested-With': 'APP'
      },
      success: function (res) {
        console.log(res);
        var t =0
        var address = "", addressId = [];
        var addressList = res.data.data.hcUserAddressList;
        for (var i = 0; i < addressList.length; i++) {
          //拆分code
          var areaIdPath = addressList[i].areaIdPath;
          var codeList  = areaIdPath.split('-')
          console.log('codeList'+codeList);
          for (var a = 0; a < cityData.length;a++){
            if (codeList[0] == cityData[a].code) {
              console.log("省名称：" + cityData[a].name)
            }
            for (var b = 0; b < cityData[a].sub.length;b++){
              if (codeList[1] == cityData[a].sub[b].code) {
                console.log("市名称：" + cityData[a].sub[b].name)
                for (var c = 0; c < cityData[a].sub[b].sub.length;c++){
                  if (codeList[2] == cityData[a].sub[b].sub[c].code){
                    console.log("县名称：" + cityData[a].sub[b].sub[c].name)
                    addressList[i].userAddress = cityData[a].name + '-' + cityData[a].sub[b].name + '-' + cityData[a].sub[b].sub[c].name + '-' + addressList[i].userAddress 
                }
                }
              }
            }
          }
          if (addressList[i].isDefault == 1){
            address = addressList[i].userAddress;
          }
          addressId[i] = addressList[i].id;
       }
        that.setData({
          'addressList': addressList,
          'address': address,
          'addressId': addressId,
        });
      }
    })
  },

})