var app = getApp();
var util = require('../../utils/util.js')
Page({
  data: {
    showCouponCount: 2,
    showCouponFlag: true,
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
      money: "",
      dikou: "",
      name: "",
      manjian: "",
      use: "",
      check: false
    }],
    integral: 0,
    TotalPrice: 0,
    TotalCount: 0,
    IsLoad: false,
    options: false,
    imageUrl: app.globalData.imageUrl,
    isMemberPay: false
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
        //console.log(res.data.data.isAuthentication)
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
    var that = this;
    //拿选择的索引
    var index = e.currentTarget.dataset.index;
    //拿到优惠券
    var coupon = this.data.coupon;

    if (!coupon[index].check) {

      if (this.data.TotalPrice >= coupon[index].prepaymentAmount) {
        for (let i = 0; i < coupon.length; i++) {
          if (coupon[i].isExpired == true && coupon[i].isUse == true) {
            coupon[i].check = false;
            coupon[i].flagType = '立即选择';
            coupon[i].bgColor = "#ea8b99"
          }
        }

        if (coupon[index].isUse == false) {
          //判断优惠券是否到达使用日期
          wx.showToast({
            title: '优惠券未到达使用日期',
            icon: 'none',
            duration: 2000
          })
        } else if (coupon[index].isExpired == false) {
          //判断优惠券是否过期
          wx.showToast({
            title: '优惠券已过期',
            icon: 'none',
            duration: 2000
          })
        } else if (that.data.flagCouponType[index] == true) {
          //判断优惠券类型是否匹配
          coupon[index].check = true;
          coupon[index].flagType = '已选择';
          coupon[index].bgColor = "#B0C4DE"
        } else {
          wx.showToast({
            title: '优惠券类型不匹配',
            icon: 'none',
            duration: 2000
          })
        }
      } else {
        wx.showToast({
          title: '未达到满足条件',
          icon: 'none',
          duration: 2000
        })
      }
    } else {
      coupon[index].check = false;
      coupon[index].flagType = '立即选择';
      coupon[index].bgColor = "#ea8b99"
    }

    that.TotalPrice();
    this.setData({
      'coupon': coupon
    })
  },

  //判断是否是会员
  flagMember: function () {
    var that = this;
    wx: wx.request({
      url: app.globalData.url + '/api/personalCenter/getUserMember?sid=' + app.globalData.sid + "&userId=" + app.globalData.uid,
      method: "POST",
      header: {
        'X-Requested-With': 'APP'
      },
      success: function (res) {
        if (res.data.data.hcUserMember.length > 0 || res.data.data.hcUserMember != null) {
          that.setData({
            'isMember': true
          })
        } else {
          that.setData({
            'isMember': false
          })
        }
      }
    })
  },

  onLoad: function(options) {
    var that = this;
    that.flagMember();    //判断是否是会员
    console.log(that.data.isMember);
    console.log("从商品页跳转");
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
    } else if (options.type == 'virtualGoods') { //虚拟课程
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
    } else if (options.type == 'activit') { //参加线下活动订单
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
        'isMemberPay': true
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
        id: "",
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
    } else { //拿到订单数据
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
  onShow(options) {
    if (this.data.IsLoad == true) {

      if (options.type == 'goods') {
        console.log("type=goods");
        var productInfo = JSON.parse(options.productInfo);
        var goodsList = [1];
        goodsList[0] = productInfo;
        console.log(goodsList);
        this.setData({
          'goodsList': goodsList
        })
        console.log('=============');
        console.log(this.data.goodsList);
      } else if (options.type == 'activit') { //参加线下活动订单
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
          options: '',
          memberPrice: ''
        };
        product.productTitle = productInfo.productTitle;
        product.oldprice = productInfo.price;
        product.productCovermap = productInfo.coverPath;
        product.price = productInfo.price;
        product.originalPrice = productInfo.price;
        product.memberPrice = productInfo.memberPrice;
        goodsList[0] = product;
        that.setData({
          'goodsList': goodsList,
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
          id: "",
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
          'goodsList': goodsList,
          'isMemberPay': true
        })
      } else { //拿到订单数据
        that.setData({
          'goodsList': app.globalData.productCartList
        })
      }
      //拿到可用优惠券
      this.showCoupon();
      this.getAddress();
      this.getWallet();
    }
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
        console.log('res');
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
            preferentialAmount: "",
            name: "",
            prepaymentAmount: "",
            couponType: "",
            flagType: "立即选择",
            check: false,
            couponId: "",
            bgColor: "#ea8b99",
            shouDiscount: 1,
            type: '',
            isExpired: '',
            endTime: '',
            isUse: '',
            startTime: ''
          };
          coupon.preferentialAmount = couponVOS[i].preferentialAmount;
          coupon.couponId = couponVOS[i].id;
          coupon.name = couponVOS[i].name;
          // coupon.type = couponVOS[i].usableRange;
          switch (couponVOS[i].usableRange) {
            case 0:
              coupon.type = "通用";
              break;
            case 1:
              coupon.type = "书籍";
              break;
            case 2:
              coupon.type = "声音课程";
              break;
            case 3:
              coupon.type = "视频课程";
              break;
            case 4:
              coupon.type = "线下活动";
              break;
          }
          coupon.prepaymentAmount = couponVOS[i].prepaymentAmount;
          if (couponVOS[i].couponsTypes == 2) {
            coupon.couponType = "折扣券";
            coupon.shouDiscount = coupon.preferentialAmount * 10;
          } else if (couponVOS[i].couponsTypes == 1) {
            coupon.couponType = "优惠券";
            coupon.shouDiscount = coupon.preferentialAmount;
          }
          coupon.manjian = couponVOS[i].name;

          coupon.endTime = couponVOS[i].expirationTime.split(' ')[0];
          coupon.isExpired = that.flagData(couponVOS[i].expirationTime, 'end');
          if (coupon.isExpired == false) {
            coupon.flagType = '已过期';
            coupon.bgColor = '#ccc';
          }

          coupon.startTime = couponVOS[i].effectiveTime.split(' ')[0];
          coupon.isUse = that.flagData(couponVOS[i].effectiveTime, 'start');
          if (coupon.isUse == false) {
            coupon.flagType = '无法使用';
            coupon.bgColor = '#ccc';
          }

          couponList[i] = coupon;
        }
        that.flagCouponType(couponList);

        that.setData({
          'coupon': couponList
        })

      }
    })
  },

  //判断优惠券日期
  flagData: function(time, flag) {
    var tempTime = time.split(' ')[0].split('-');
    var nowTime = util.formatTime(new Date).split(' ')[0].split('/');

    if (flag == 'start') {
      if (nowTime[0] > tempTime[0]) {
        return true;
      } else if (parseInt(nowTime[1]) > parseInt(tempTime[1])) {
        return true;
      } else if (parseInt(nowTime[2]) > parseInt(tempTime[2])) {
        return true;
      } else {
        return false;
      }
    } else if (flag == 'end') {
      if (nowTime[0] < tempTime[0]) {
        return true;
      } else if (parseInt(nowTime[1]) < parseInt(tempTime[1])) {
        return true;
      } else if (parseInt(nowTime[2]) < parseInt(tempTime[2])) {
        return true;
      } else {
        return false;
      }
    }


  },


  //判断优惠券类型是否匹配
  flagCouponType: function(coupon) {
    var that = this;
    var flag = new Array();
    var goodId = app.globalData.goodsInfo.id;
    var firstClassifyList = app.globalData.firstClassifyList;
    wx.request({
      url: app.globalData.url + '/api/product/getSecondClassifyFromProductId?sid=' + app.globalData.sid + '&productId=' + goodId,
      method: "POST",
      header: {
        'X-Requested-With': 'APP'
      },
      success: function(res) {
        console.log('firstClassifyList');
        console.log(firstClassifyList);
        var firstClassifyId = res.data.data.hcProductSecondClassifyList[0].firstClassifyId;
        var firstName;

        for (var x = 0; x < firstClassifyList.length; x++) {
          if (firstClassifyList[x].id == firstClassifyId) {
            firstName = firstClassifyList[x].firstClassName;
            break;
          }
        }

        for (var i = 0; i < coupon.length; i++) {
          if (firstName == coupon[i].type || coupon[i].type == '通用') {
            flag[i] = true;
          } else {
            flag[i] = false;
          }
        }
        that.setData({
          'flagCouponType': flag,
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
      TotalPrice += goodsList[i].count * (this.data.isMember ? goodsList[i].memberPrice: goodsList[i].originalPrice);
      console.log('goodsList[i].count:' + goodsList[i].count);
      console.log('goodsList[i].originalPrice:' + goodsList[i].originalPrice);
      TotalCount += goodsList[i].count
    }
    var couponMoney = 0;
    console.log("1:" + TotalPrice);
    for (let i = 0; i < coupon.length; i++) {
      if (coupon[i].check == true) {
        // 先算优惠券，再算积分，再算折扣
        TotalPrice -= (this.data.integral / 1000)
        if (coupon[i].couponType == "折扣券") {
          TotalPrice -= parseFloat(coupon[i].preferentialAmount);
        } else if (coupon[i].couponType == "优惠券") {
          TotalPrice *= coupon[i].preferentialAmount;
        }
      }
    }


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
        console.log("是否会员订单：");
        console.log(that.data.isMemberPay);
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
  },

  //优惠券显示更多按钮
  showCouponCount: function() {
    var showCouponFlag = this.data.showCouponFlag
    if (showCouponFlag == true) {
      this.setData({
        showCouponFlag: false,
        showCouponCount: this.data.coupon.length
      })
    } else if (showCouponFlag == false) {
      this.setData({
        showCouponFlag: true,
        showCouponCount: 2,
      })
    }
  }
})