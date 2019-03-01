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
      id: "",
      productName: "线性代数",
      oldprice: "66.00",
      productImage: "../image/math.jpg",
      count: 1,
      price: 0,
    }],
    getUrl:"",
    orderNum: "",
    TotalPrice: '0',
  },
  /**
   * 获取用户地址
   */
  getAddress: function(options) {
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
        success: function(res) {
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
  },
  // 查询订单
  getOrderByOrderId: function() {
    var that = this;
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    // var that = thats;
    console.log("id======================:",that.data.goodsList[0].id)
    wx.request({
      url: app.globalData.url + '/api/order/getOrderByOrderId?sid=' + app.globalData.sid + '&orderId=' + that.data.orderNum,
      method: "POST",
      header: {
        'X-Requested-With': 'APP'
      },
      success: function(res) {
        wx.hideLoading();
        var orderId = res.data.data.orderVO.orderNum;
        console.log("查询订单:orderId:====================================", orderId)
        that.setData({
          orderNum: orderId
        })
        console.log("==============")
        console.log("that.data.getUrl:===============",that.data.getUrl)
        getApp().pay("同源梦商城-" + that.data.goodsList[0].productName, that.data.orderNum, that.data.goodsList[0].price, function () { }, function () { }, function () {
          wx.redirectTo({
            url: '../' + that.data.getUrl + '/' + that.data.getUrl,
          })
        });
      }
    })
    console.log(this.data.orderNum);
  },
  jump: function () {
    wx.navigateBack({
      delta: 2
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    console.log(options.data)
    let item = JSON.parse(options.data)
    console.log(item)
    var oldprice = "goodsList[0].oldprice";
    var productName = "goodsList[0].productName";
    var price = "goodsList[0].price";
    var memberPrice = "goodsList[0].memberPrice";
    var productImage = "goodsList[0].productImage";
    var id = "goodsList[0].id";
    var urls = item.url;
    console.log("============================")
    console.log("url:=======",item.url)
    this.setData({
      [oldprice]: item.numArray,
      [productName]: item.productTitle,
      [price]: item.numArray * item.productDiscount,
      [memberPrice]: item.memberPrice,
      [productImage]: item.productCovermap,
      [id]: item.id,
      count: 1,
      getUrl:urls,
    });

    console.log("goodsList:", this.data.goodsList[0])
    this.getAddress();
  },
  /**
   * 存储订单到数据库 
   */
  payment: function() {
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
    hcOrder.integral = 0;
    hcOrder.information = null;
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
      success: function(res) {
        console.log("创建订单结果：")
        console.log(res);
        console.log("id:", that.data.goodsList[0].id)
        that.setData({
          orderNum: res.data.data.orderId
        })
        that.getOrderByOrderId();
        console.log("返回订单orderNum======================:", that.data.orderNum)
      }
    })
  },
})