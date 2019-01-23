var app = getApp();
Page({
  data: {
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
    }, {
      productName: "线性代数",
      oldprice: "66.00",
      productImage: "../image/math.jpg",
      count: 1,
      price: 0
    }],
    delivery: {
      discount: 0.8,
      integral: "2000"
    },
    inputValue: "",
    coupon: [{
        money: "40",
        dikou: "抵用券",
        name: "通用",
        manjian: "290",
        use: "立即选择",
        check: false
      },
      {
        money: "40",
        dikou: "抵用券",
        name: "通用",
        manjian: "290",
        use: "立即选择",
        check: false
      }
    ],
    integral: 0,
    TotalPrice: 0,
    TotalCount: 0,
    IsLoad: false,
    options: false,
    imageUrl: app.globalData.imageUrl,
    isMemberPay:false
  },
  pay: function() {
    var that = this
    wx.request({
      url: app.globalData.url + '/api/personalCenter/checkAuthentication?sid=' + app.globalData.sid + '&userId=' + app.globalData.uid,
      method: "POST",
      header: {
        'X-Requested-With': 'APP'
      },
      success: function(res) {
        console.log(res);
        console.log("**********************************************");
        console.log(res.data.data.isAuthentication)
        console.log("**********************************************");
        if (!res.data.data.isAuthentication) {
          wx.showModal({
            title: '提示',
            showCancel: true,
            content: '请绑定手机号',
            success: function(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../authentication/authentication',
                });
              }

            }
          })
        } else {
          //支付成功存储订单
          that.createOrder();
        }
      }
    })


  },
  /**
   * 选择优惠券
   */
  chooseCoupon: function(e) {
    //拿选择的索引
    var index = e.currentTarget.dataset.index;
    //拿到优惠券
    var coupon = this.data.coupon;


    if (!coupon[index].check) {
      if (this.data.TotalPrice >= coupon.manjian) {
        for (let i; i < coupon.length; i++) {
          coupon[index].check = false;
        }
        coupon[index].check = true;
        coupon[index].use = '已选择';
      } else {
        wx.showToast({
          title: '未达到满足条件',
          icon: 'none',
          duration: 2000
        })
      }
    } else {
      coupon[index].check = false;
      coupon[index].use = '立即选择';
    }
    this.setData({
      'coupon': coupon
    })
  },
  onLoad: function(options) {
    var that = this;
    if (options.type == 'goods') {
      var productInfo = app.globalData.goodsInfo;
      console.log(productInfo);
      productInfo.count = 1;
      productInfo.productCovermap = app.globalData.url + '/common/file/showPicture.do?id=' + productInfo.productCovermap;
      var goodsList = [1];
      goodsList[0] = productInfo;
      console.log(goodsList);
      that.setData({
        'goodsList': goodsList
      })
    } if (options.type == 'virtualGoods') {//虚拟课程
      var productInfo = app.globalData.goodsInfo;
      console.log(productInfo);
      productInfo.count = 1;
      productInfo.productCovermap = app.globalData.url + '/common/file/showPicture.do?id=' + productInfo.productCovermap;
      productInfo = JSON.parse(JSON.stringify(productInfo).replace(/price/g, "originalPrice"));
      var goodsList = [1];
      goodsList[0] = productInfo;
      console.log(goodsList);
      that.setData({
        'goodsList': goodsList
      })
    }else if (options.type == 'activit') { //参加线下活动订单
      var productInfo = JSON.parse(decodeURIComponent(options.productInfo));
      console.log(productInfo);
      var goodsList = [1];
      var product = {
        productTitle: "",
        oldprice: "",
        originalPrice: "",
        productCovermap: "",
        count: 1,
        price: 0,
        productInfo: '',
        options: ''
      };
      product.productTitle = productInfo.productTitle;
      product.oldprice = productInfo.price;
      product.productCovermap = productInfo.coverPath;
      product.price = productInfo.price;
      product.originalPrice = productInfo.price;
      goodsList[0] = product;
      that.setData({
        'goodsList': goodsList,
        'isMemberPay':true
      })
    } else if (options.type == 'address') {
      this.setData({
        options: true
      })
      //这个地方不做逻辑，逻辑要写在下面，否则会被覆盖
    } else if (options.type == 'member') { //充值会员的订单
      var productInfo = JSON.parse(decodeURIComponent(options.productInfo));
      console.log(productInfo);
      var goodsList = [1];
      var product = {
        id:"",
        productTitle: "",
        oldprice: "",
        originalPrice: "",
        productCovermap: "",
        count: 1,
        price: 0
      };
      product.id = productInfo.id;
      product.productTitle = productInfo.memberCategoryName;
      product.oldprice = productInfo.price;
      product.productCovermap = productInfo.coverPath;
      product.price = productInfo.price;
      product.originalPrice = productInfo.price;
      goodsList[0] = product;
      that.setData({
        'goodsList': goodsList

      })
    } 
    else { //拿到订单数据
      var data = this.change(app.globalData.productCartList);
      that.setData({
        'goodsList': data
      })
    }
    //拿到可用优惠券
    this.showCoupon();
    this.getAddress();
    this.getWallet();

    if (options.type == 'address') { //从地址页来的
      var hcUserAddressList = JSON.parse(options.address);
      var address = {
        username: null,
        telephone: null,
        address: null,
        id: null,
      };
      address.username = hcUserAddressList.userName;
      address.telephone = hcUserAddressList.userPhone;
      address.address = hcUserAddressList.userAddress;
      address.id = hcUserAddressList.id;
      this.setData({
        goodsList: app.globalData.goodsList,
        delivery: app.globalData.delivery,
        coupon: app.globalData.coupon,
        integral: app.globalData.integral,
        address: address
      })
      console.log(options.address);
    }
  },
  onShow: function(options) {
    this.onLoad(options);
  },
  /**
   * 把购物车传来的数据属性名转换一下
   */
  change: function(obejct) {
    var data = obejct.map(function(item) {
      return {
        productTitle: item.productName,
        originalPrice: item.price,
        productDiscount: item.discount,
        id: item.productId,
        productCovermap: item.productImage,
        count: item.count, //数量
      }
    })
    return data; 
  },
  /**
   * 获取积分总额
   */
  getWallet: function() {
    var that = this;
    wx.request({
      url: app.globalData.url + '/api/personalCenter/getWallet?sid=' + app.globalData.sid + "&userId=" + app.globalData.uid,
      method: "POST",
      header: {
        'X-Requested-With': 'APP'
      },
      success: function(res) {
        console.log(res);
        var integral = 0;
        if (res.data.data.hcWallet.integral) {
          integral = res.data.data.hcWallet.integral;
        }
        that.setData({
          'integral': integral
        })
        wx.showLoading({
          title: '加载中',

        })
        setTimeout(function() {
          that.TotalPrice();
          wx.hideLoading()
        }, 1500);

      }
    })
  },
  /**
   * 查询优惠券
   */
  showCoupon: function() {
    var that = this;
    wx.request({
      url: app.globalData.url + '/api/coupon/showCoupon?sid=' + app.globalData.sid + "&userId=" + app.globalData.uid,
      method: "POST",
      header: {
        'X-Requested-With': 'APP'
      },
      success: function(res) {
        console.log(res);
        var couponVOS = res.data.data.couponVOS;
        var couponList = [];
        for (let i = 0; i < couponVOS.length; i++) {
          var coupon = {
            money: "40",
            dikou: "抵用券",
            name: "通用",
            manjian: "满300减20",
            use: "立即选择",
            check: false,
            couponId: ""
          };
          coupon.money = couponVOS[i].preferentialAmount;
          coupon.couponId = couponVOS[i].id;
          switch (couponVOS[i].usableRange) {
            case 0:
              coupon.name = "通用";
              break;
            case 1:
              coupon.name = "实体商品 ";
              break;
            case 2:
              coupon.name = "声音课程";
              break;
            case 3:
              coupon.name = "视频课程";
              break;
            case 4:
              coupon.name = "活动";
              break;
          }
          if (couponVOS[i].couponsTypes == 2) {
            coupon.dikou = "折扣";
          }
          coupon.manjian = couponVOS[i].name;
          couponList[i] = coupon;
        }
        that.setData({
          'coupon': couponList
        })

      }
    })
  },
  /**
   * 计算总金额和总数量
   */
  TotalPrice: function() {
    var goodsList = this.data.goodsList;
    var TotalPrice = 0;
    var TotalCount = 0;
    var coupon = this.data.coupon;
    for (let i = 0; i < goodsList.length; i++) {
      TotalPrice += goodsList[i].count * goodsList[i].originalPrice;
      console.log('goodsList[i].count:' + goodsList[i].count);
      console.log('goodsList[i].originalPrice:' + goodsList[i].originalPrice);
      TotalCount += goodsList[i].count
    }
    var couponMoney = 0;
    console.log("1:" + TotalPrice);
    for (let i = 0; i < coupon.length; i++) {
      if (coupon[i].check == true) {
        couponMoney = parseFloat(coupon[i].money);
      }
    }
    // 先算优惠券，再算积分，再算折扣
    TotalPrice -= couponMoney;
    TotalPrice -= (this.data.integral / 1000)
    TotalPrice *= this.data.delivery.discount;

    this.setData({
      'TotalPrice': TotalPrice.toFixed(2),
      'TotalCount': TotalCount
    })
  },

  /**
   * 存储订单到数据库 
   */
  createOrder: function() {
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
    var hcOrderItemList = Array(this.data.goodsList.length);
    var goodsList = this.data.goodsList;
    for (var i = 0; i < goodsList.length; i++) {
      var OrderItem = new Object();
      OrderItem.product_id = goodsList[i].id;
      OrderItem.shop_number = goodsList[i].count;
      hcOrderItemList[i] = OrderItem;
    }
    var thisCouponId = null;
    for (let i = 0; i < this.data.coupon.length; i++) {
      if (this.data.coupon[i].check == true) {
        console.log(this.data.coupon[i]);
        thisCouponId = this.data.coupon[i].couponId;
      }
    }
    console.log(this.data.address.id);
    var hcOrder = new Object();
    hcOrder.user_id = app.globalData.uid;
    hcOrder.coupon_id = thisCouponId;
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
      success: function(res) {
        console.log("创建订单结果：")
        console.log(res);
        var productName = "";
        for (let i = 0; i < that.data.goodsList.length; i++) {
          productName += goodsList[i].productTitle + ',';
        }
        wx.navigateTo({
          url: '../pay/pay?TotalPrice=' + that.data.TotalPrice + '&orderId=' + res.data.data.orderId + '&product=' + productName + '&isMemberPay=' + that.data.isMemberPay + "&memberTypeId=" + that.data.goodsList[0].id,
        })
      }
    })
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


  /**
   * 获取买家留言
   */
  bindKeyInput(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  address: function() {
    app.globalData.goodsList = this.data.goodsList;
    app.globalData.delivery = this.data.delivery;
    app.globalData.coupon = this.data.coupon;
    app.globalData.integral = this.data.integral;
    wx.reLaunch({
      url: '../address/address?type=goods'
    })
  }


})