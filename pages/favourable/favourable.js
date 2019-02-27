var app = getApp();
var util = require('../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    couponVOS: []
    // discount:[
    //   {
    //     money:"￥40",
    //     dikou:"抵用券",
    //     name:"幸福学院通用优惠券",
    //     manjian:"满290可用",
    //     use:"立即使用"
    //   },
    //   {
    //     money: "￥40",
    //     dikou: "抵用券",
    //     name: "幸福学院通用优惠券",
    //     manjian: "满290可用",
    //     use: "立即使用"
    //   },
    //   {
    //     money: "￥40",
    //     dikou: "抵用券",
    //     name: "幸福学院通用优惠券",
    //     manjian: "满290可用",
    //     use: "立即使用"
    //   }http://hih5jg.natappfree.cchttp://hih5jg.natappfree.cchttp://hih5jg.natappfree.cchttp://hih5jg.natappfree.cchttp://4ek4ic.natappfree.cchttp://4ek4ic.natappfree.cchttp://4ek4ic.natappfree.cc

    // ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    var that = this;
    var type = options.type;
    this.setType(type);

    this.flagGet();
    this.favdata(type);


  },

  setType: function(type) {
    this.setData({
      'type': type,
    })
  },

  flagGet: function() {
    var that = this;
    wx.request({
      url: app.globalData.url + '/api/coupon/showCoupon?sid=' + app.globalData.sid + '&userId=' + app.globalData.uid,
      method: "POST",
      header: {
        'X-Requested-With': 'APP'
      },
      success: function(res) {
        that.setData({
          'couponRes': res.data.data.couponVOS
        })
      }
    })
  },

  favdata: function(type) {
    var that = this;
    if (type == 1) {
      //领券中心
      wx.request({
        url: app.globalData.url + '/api/coupon/getAll?sid=' + app.globalData.sid,
        method: "POST",
        header: {
          'X-Requested-With': 'APP'
        },
        success: function(res) {
          that.setCouponData(res.data.data.hcCouponInfoList, '立即领取', type);
        }
      })
    } else if (type == 2) {
      //我的优惠券
      wx.request({
        url: app.globalData.url + '/api/coupon/showCoupon?sid=' + app.globalData.sid + "&userId=" + app.globalData.uid ,
        method: "POST",
        header: {
          'X-Requested-With': 'APP'
        },
        success: function(res) {
          that.setCouponData(res.data.data.couponVOS, '立即使用', type);
        }
      })
    }
  },

  setCouponData: function(couponVOS, flagType, type) {
    var that = this;
    console.log(that);
    var couponList = new Array();
    for (var i = 0; i < couponVOS.length; i++) {
      var coupon = {
        preferentialAmount: "",
        name: "",
        prepaymentAmount: "",
        couponType: "",
        flagType: flagType,
        check: false,
        couponId: "",
        bgColor: "#ea8b99",
        type: '',
        shouDiscount: 1,
        id: '',
        isExpired: '',
        endTime:''
      };
      coupon.id = couponVOS[i].id;
      coupon.preferentialAmount = couponVOS[i].preferentialAmount;
      coupon.couponId = couponVOS[i].id;
      coupon.name = couponVOS[i].name;
      coupon.prepaymentAmount = couponVOS[i].prepaymentAmount;
      if (couponVOS[i].couponsTypes == 2) {
        coupon.couponType = "折扣券";
        coupon.shouDiscount = coupon.preferentialAmount * 10;
      } else if (couponVOS[i].couponsTypes == 1) {
        coupon.couponType = "优惠券";
        coupon.shouDiscount = coupon.preferentialAmount;
      }
      
      if (type == 1) {
        //判断是否已经领取
        var couponRes = that.data.couponRes;
        for (var j = 0; j < couponRes.length; j++) {
          if (couponRes[j].id == coupon.id) {
            coupon.flagType = '已领取';
            coupon.bgColor = '#B0C4DE';
          }
        }
      }
      
      coupon.endTime = couponVOS[i].expirationTime.split(' ')[0];
      coupon.isExpired = that.flagData(couponVOS[i].expirationTime);
      if (coupon.isExpired == false){
        coupon.flagType = '已过期';
        coupon.bgColor = '#ccc';
      }

      couponList[i] = coupon;
    }

    that.setData({
      'couponVOS': couponList,
    })
  },

  //领取优惠券
  getCoupon: function(e) {
    var type = this.data.type;
    var that = this;
    var index = JSON.stringify(e.currentTarget.dataset.index);
    var flagType = this.data.couponVOS[index].flagType;
    var id = this.data.couponVOS[index].id;
    if (type == 1) {
      if (flagType == '立即领取') {
        wx.request({
          url: app.globalData.url + '/api/coupon/receiveCoupon?sid=' + app.globalData.sid + "&userId=" + app.globalData.uid + '&couponId=' + id,
          method: "POST",
          header: {
            'X-Requested-With': 'APP'
          },
          success: function(res) {
            var flagType = 'couponVOS' + '[' + index + '].flagType';
            var bgColor = 'couponVOS' + '[' + index + '].bgColor';
            that.setData({
              [flagType]: "已领取",
              [bgColor]: "#B0C4DE"
            })
          }
        })
      } else if (flagType == '已领取') {
        wx.showModal({
          title: '提示',
          content: '已经领取过该优惠券了哦',
        })
      }
    } else if (type == 2) {
      wx.switchTab({
        url: '../index/index',
      })
    }
  },

  //判断是否到期
  flagData: function(time) {
    var tempTime = time.split(' ')[0].split('-');
    var nowTime = util.formatTime(new Date).split(' ')[0].split('/');
    // 优惠券 2018-11-11 现在 2019-1-31
    console.log("月")
    console.log(parseInt(nowTime[1]))
    console.log(parseInt(tempTime[1]))
    if (nowTime[0] < tempTime[0]) {
      return true;
    } else if (parseInt(nowTime[1]) < parseInt(tempTime[1])) {
      return true;
    } else if (parseInt(nowTime[2]) < parseInt(tempTime[2])) {
      return true;
    } else {
      return false;
    }
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})