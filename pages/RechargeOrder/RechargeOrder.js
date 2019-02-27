var app = getApp();
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showCouponCount: 2,
    showCouponFlag: true,
    money: '',
    address: {
      username: "",
      telephone: "",
      address: "没有收货地址，请点击左边链接添加！",
      id: ""
    },
    goodsList: [{
      productName: "线性代数",
      oldprice: "66.00",
      productImage: "../image/math.jpg",
      count: 1,
      price: 0
    }],
    TotalPrice: '0',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.data)
    let item = JSON.parse(options.data)
    console.log(item)
    this.data.goodsList[0]={
      productName: item.productTitle,
      oldprice: item.money,
      productImage: "../image/math.jpg",
      count: 1,
      price: item.money - item.productDiscount
    }
    console.log(this.data.goodsList[0])
    this.getAddress();
  },
  /**
    * 存储订单到数据库 
    */
  payment: function () {
    var that = this;
    console.log(this.data.address.id);
    if (this.data.address.id == "") {
      wx.showModal({
        title: '出错',
        content: '请先添加收货地址',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定');
            that.address();
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      })
      return;
    }
    var hcOrderItemList = Array(1);
    var goodsList = this.data.goodsList;
    var OrderItem = new Object();
    OrderItem.product_id = goodsList[0].id;
    OrderItem.shop_number = goodsList[0].count;
    hcOrderItemList[0] = OrderItem;
    
    console.log(this.data.address.id);
    var hcOrder = new Object();
    hcOrder.user_id = app.globalData.uid;
    hcOrder.coupon_id = null;
    hcOrder.address_id = this.data.address.id;
    hcOrder.integral = this.data.integral;
    hcOrder.information = this.data.inputValue;
    hcOrder.payment_way = 1;
    hcOrder.freight = 0;
    hcOrder.actualPayment = 232323;
    hcOrder.allPayment = 1;
    var json = new Object();
    json.hcOrder = hcOrder;
    json.hcOrderItemList = hcOrderItemList;
    json.userId = app.globalData.uid;
    console.log('JSON:');
    console.log(json);
    console.log(JSON.stringify(json))
    wx.request({
      url: app.globalData.url + '/api/order/createOrder?sid=' + app.globalData.sid,
      method: "POST",
      data: json,
      header: {
        'X-Requested-With': 'APP',
      },
      success: function (res) {
        console.log("创建订单结果：")
        console.log(res);
        var productName = "";
        for (let i = 0; i < that.data.goodsList.length; i++) {
          productName += goodsList[i].productName + ',';
        }
        wx.navigateTo({
          url: '../pay/pay?TotalPrice=' + that.data.goodsList[0].price + '&orderId=' + res.data.data.orderId + '&product=' + productName + '&isMemberPay=' + that.data.isMemberPay + "&memberTypeId=" + that.data.goodsList[0].id,
        })
      }
    })
  },
  /**
   * 获取用户地址
   */
  getAddress: function (options) {
    var that = this;
    var address = that.data.address;
    var options = this.data.options
    if (!options) {
      wx.request({
        url: app.globalData.url + '/api/userAddress/getAddress?sid=' + app.globalData.sid + "&userId=" + app.globalData.uid,
        method: "POST",
        header: {
          'X-Requested-With': 'APP'
        },
        success: function (res) {
          console.log(res);
          var hcUserAddressList = res.data.data.hcUserAddressList;
          //没有收货就选择默认值
          if (hcUserAddressList.length == 0) {
            return;
          }
          for (let i = 0; i < hcUserAddressList.length; i++) {
            if (hcUserAddressList[i].isDefault == true) {
              address.username = hcUserAddressList[i].userName;
              address.telephone = hcUserAddressList[i].userPhone;
              address.address = hcUserAddressList[i].userAddress;
              address.id = hcUserAddressList[i].id;
            }
          }
          that.setData({
            'address': address
          })
        }
      })
    } else {
      console.log("没请求");
      return;
    }
  }
})