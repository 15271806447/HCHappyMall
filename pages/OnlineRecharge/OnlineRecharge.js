var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeIndex: '0',
    RechargeCardInfo: [{
        id: "",
        numArray: "10",
        productTitle: "充值卡", //标题
        productDiscount: "0.01", //折扣
        memberPrice: "0.01", //会员价
        productCovermap: "",
        url: ""
      },
      {
        id: "",
        numArray: "10",
        productTitle: "充值卡", //标题
        productDiscount: "0.01", //折扣
        memberPrice: "0.01", //会员价
        productCovermap: "",
        url: ""
      },
      {
        id: "",
        numArray: "10",
        productTitle: "充值卡", //标题
        productDiscount: "0.01", //折扣
        memberPrice: "0.01", //会员价
        productCovermap: "",
        url: ""
      },
      {
        id: "",
        numArray: "10",
        productTitle: "充值卡", //标题
        productDiscount: "0.01", //折扣
        memberPrice: "0.01", //会员价
        productCovermap: "",
        url: ""
      },
      {
        id: "",
        numArray: "10",
        productTitle: "充值卡", //标题
        productDiscount: "0.01", //折扣
        memberPrice: "0.01", //会员价
        productCovermap: "",
        url: ""
      },
      {
        id: "",
        numArray: "10",
        productTitle: "充值卡", //标题
        productDiscount: "0.01", //折扣
        memberPrice: "0.01", //会员价
        productCovermap: "",
        url: ""
      },
      {
        id: "",
        numArray: "10",
        productTitle: "充值卡", //标题
        productDiscount: "0.01", //折扣
        memberPrice: "0.01", //会员价
        productCovermap: "",
        url: ""
      },
      {
        id: "",
        numArray: "10",
        productTitle: "充值卡", //标题
        productDiscount: "0.01", //折扣
        memberPrice: "0.01", //会员价
        productCovermap: "",
        url: ""
      },
      {
        id: "",
        numArray: "10",
        productTitle: "充值卡", //标题
        productDiscount: "0.01", //折扣
        memberPrice: "0.01", //会员价
        productCovermap: "",
        url: ""
      },
    ]

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var delta="";
    if (options.delta == null || options.delta==""){
      delta=1;
    }else{
      delta = options.delta;
    }
    this.setData({
      delta: delta
    })
    //充值卡信息
    this.RechargeCardInfo();
  },
  activethis: function(event) { //点击选中事件
    var thisindex = event.currentTarget.dataset.thisindex; //当前index
    this.setData({
      activeIndex: thisindex
    })
  },
  //json数组比较
  compare: function(property) {
    return function(a, b) {
      var value1 = a[property];
      var value2 = b[property];
      return value1 - value2
    }
  },
  //充值卡信息
  RechargeCardInfo: function() {
    var that = this;
    wx.request({
      url: app.globalData.url + '/api/product/getAllPrepaidCards?sid=' + app.globalData.sid,
      method: "POST",
      header: {
        'X-Requested-With': 'APP',
      },
      success: function(res) {
        var data = res.data.data.prepaidCards;
        data.sort(that.compare("originalPrice"));
        console.log("data:", data)
        for (var i = 0; i < data.length; i++) {
          var numArray = "RechargeCardInfo[" + i + "].numArray";
          var productTitle = "RechargeCardInfo[" + i + "].productTitle";
          var productDiscount = "RechargeCardInfo[" + i + "].productDiscount";
          var memberPrice = "RechargeCardInfo[" + i + "].memberPrice";
          var productCovermap = "RechargeCardInfo[" + i + "].productCovermap";
          var id = "RechargeCardInfo[" + i + "].id";
          that.setData({
            [numArray]: data[i].originalPrice,
            [productTitle]: data[i].productTitle,
            [productDiscount]: data[i].productDiscount,
            [memberPrice]: data[i].memberPrice,
            [productCovermap]: data[i].productCovermap,
            [id]: data[i].id
          });
          console.log(that.data.RechargeCardInfo[i]);
        }
      }
    })
  },
  Refill: function() {
    var that = this
    //获取指定充值卡
    console.log("获取指定充值卡:", this.data.RechargeCardInfo[this.data.activeIndex])
    //创建订单所需信息
    let data = JSON.stringify(this.data.RechargeCardInfo[this.data.activeIndex])
    wx.navigateTo({
      url: '../RechargeOrder/RechargeOrder?data=' + data + '&delta=' + that.data.delta,
    })
  },
})