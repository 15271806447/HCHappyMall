var app = getApp();
var util = require('../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    navbar: [],
    couponVOS: [],
    currentTab: 0,
    allCouponList: [],
    unaccalimedCouponList: [],
    unuseCouponList: [],
    usedCouponList: [],
    expiredCouponList: []
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
    var type = app.globalData.couponPage;
    that.setType(type);
    that.flagPageType(that.data.type);
    setTimeout(function () {
      that.flagCouponType(type, that.data.currentTab);
    }, 100) //延迟时间 这里是1秒
    if (type == 1) {
      that.findUsedCoupon();
      that.findExpiredCoupon();
      that.findUnuseCoupon();
      that.finAllCoupon();
    } else if (type == 2) {
      that.findUnuseCoupon();
      that.findUsedCoupon();
    }

    
    
  },

  setType: function(type) {

    this.setData({
      'type': type,
    })
  },

  flagPageType(type) {
    var typeArr;
    if (type == 1) {
      typeArr = ["未领取", "未使用", "已使用", "已过期"];
    } else if (type == 2) {
      typeArr = ["未使用", "已使用"];
    }
    this.setData({
      'navbar': typeArr
    })
  },


  //顶部tab切换
  navbarTap: function(e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    });
    var options = {
      state: JSON.stringify(e.currentTarget.dataset.idx)

    }
    this.onLoad(options);
  },

  // flagGet: function() {
  //   var that = this;
  //   wx.request({
  //     url: app.globalData.url + '/api/coupon/showCoupon?sid=' + app.globalData.sid + '&userId=' + app.globalData.uid,
  //     method: "POST",
  //     header: {
  //       'X-Requested-With': 'APP'
  //     },
  //     success: function(res) {
  //       that.setData({
  //         'couponRes': res.data.data.couponVOS
  //       })
  //     }
  //   })
  // },

  // favdata: function(type) {
  //   var that = this;
  //   if (type == 1) {
  //     //领券中心
  //     wx.request({
  //       url: app.globalData.url + '/api/coupon/getAll?sid=' + app.globalData.sid,
  //       method: "POST",
  //       header: {
  //         'X-Requested-With': 'APP'
  //       },
  //       success: function(res) {
  //         that.setCouponData(res.data.data.hcCouponInfoList, '立即领取', type);
  //       }
  //     })
  //   } else if (type == 2) {
  //     //我的优惠券
  //     wx.request({
  //       url: app.globalData.url + '/api/coupon/showCoupon?sid=' + app.globalData.sid + "&userId=" + app.globalData.uid + "&couponType=" + 1,
  //       method: "POST",
  //       header: {
  //         'X-Requested-With': 'APP'
  //       },
  //       success: function(res) {
  //         that.setCouponData(res.data.data.couponVOS, '立即使用', type);
  //       }
  //     })
  //   }
  // },


  setCouponData: function(couponVOS, className, flagType, type) {
    var that = this;
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
        endTime: ''
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

      if (flagType == "已领取") {
        coupon.bgColor = "#5F9EA0";
      } else if (flagType == "已使用") {
        coupon.bgColor = "#00FF00";
      } else if (flagType == "已过期") {
        coupon.bgColor = "#C0C0C0";
      }
      coupon.endTime = couponVOS[i].expirationTime.split(' ')[0];
      couponList[i] = coupon;
    }

    that.setData({
      [className]: couponList,
    })
  },

  /**
   * 判断优惠券类型，并设置
   */
  flagCouponType: function(type, currentTab) {
    if (type == 1) {
      if (currentTab == 0) {
        this.setCouponData(this.data.unaccalimedCouponList, 'unaccalimedCouponList', '立即领取', currentTab);
        this.setData({
          'couponVOS': this.data.unaccalimedCouponList
        })
      } else if (currentTab == 1) {
        this.setCouponData(this.data.unuseCouponList, 'unuseCouponList', '已领取', currentTab);
        this.setData({
          'couponVOS': this.data.unuseCouponList
        })
      } else if (currentTab == 2) {
        this.setCouponData(this.data.usedCouponList, 'usedCouponList', '已使用', currentTab);
        this.setData({
          'couponVOS': this.data.usedCouponList
        })
      } else if (currentTab == 3) {
        this.setCouponData(this.data.expiredCouponList, 'expiredCouponList', '已过期', currentTab);
        this.setData({
          'couponVOS': this.data.expiredCouponList
        })
      }
    } else if (type == 2) {
      if (currentTab == 0) {
        this.setData({
          'couponVOS': this.data.unuseCouponList
        })
      } else if (currentTab == 1) {
        this.setData({
          'couponVOS': this.data.usedCouponList
        })
      }
    }

  },


  /**
   * 未领取的优惠券
   */
  unaccalimedCoupon: function(couponList) {

    var that = this;

    var unuseCouponList = this.data.unuseCouponList;
    var usedCouponList = this.data.usedCouponList;
    var expiredCouponList = this.data.expiredCouponList;

    var maxLength = unuseCouponList.length;
    if (maxLength < usedCouponList.length) {
      maxLength = usedCouponList.length;
    }
    if (maxLength < expiredCouponList.length) {
      maxLength = expiredCouponList.length;
    }


    var tempList = new Array();
    var n = 0;
    //未领取的优惠券
    for (var i = 0; i < couponList.length; i++) {
      var flag = true;
      for (var j = 0; j < maxLength; j++) {
        if (unuseCouponList.length - 1 > j && couponList[i].id == unuseCouponList[j].id) {
          flag = false;
          continue;
        }
        if (usedCouponList.length - 1 > j && couponList[i].id == usedCouponList[j].id) {
          flag = false;
          continue;
        }
        if (expiredCouponList.length - 1 > j && couponList[i].id == expiredCouponList[j].id) {
          flag = false;
          continue;
        }
      }
      if (flag == true) {
        tempList[n++] = couponList[i];
      }
    }

    var currentTab = that.data.currentTab
    if (currentTab == 0 && app.globalData.couponPage == 1) {
      that.setCouponData(tempList, 'couponVOS', '立即领取', that.data.currentTab);
    }


    this.setData({
      'unaccalimedCouponList': tempList
    })
  },

  /**
   * 查询所有优惠券
   */
  finAllCoupon: function() {
    var that = this;
    wx.request({
      url: app.globalData.url + '/api/coupon/getAll?sid=' + app.globalData.sid,
      method: "POST",
      header: {
        'X-Requested-With': 'APP'
      },
      success: function(res) {
        that.unaccalimedCoupon(res.data.data.hcCouponInfoList);
        that.setData({
          'allCouponList': res.data.data.hcCouponInfoList
        })
      }
    })
  },

  /**
   * 查询未使用的优惠券
   */
  findUnuseCoupon: function() {
    var that = this;
    wx.request({
      url: app.globalData.url + '/api/coupon/showCoupon?sid=' + app.globalData.sid + '&userId=' + app.globalData.uid + '&couponType=' + 1,
      method: "POST",
      header: {
        'X-Requested-With': 'APP'
      },
      success: function(res) {
        var currentTab = that.data.currentTab
        if (currentTab == 0 && app.globalData.couponPage == 2) {
          that.setCouponData(res.data.data.couponVOS, 'couponVOS', '立即使用', that.data.currentTab)
        }

        that.setData({
          'unuseCouponList': res.data.data.couponVOS
        })
      }
    })
  },

  /**
   * 查询已使用的优惠券
   */
  findUsedCoupon: function() {
    var that = this;
    wx.request({
      url: app.globalData.url + '/api/coupon/showCoupon?sid=' + app.globalData.sid + '&userId=' + app.globalData.uid + '&couponType=' + 2,
      method: "POST",
      header: {
        'X-Requested-With': 'APP'
      },
      success: function(res) {

        that.setData({
          'usedCouponList': res.data.data.couponVOS
        })
      }
    })
  },

  /**
   * 查询已过期的优惠券
   */
  findExpiredCoupon: function() {
    var that = this;
    wx.request({
      url: app.globalData.url + '/api/coupon/showCoupon?sid=' + app.globalData.sid + '&userId=' + app.globalData.uid + '&couponType=' + 3,
      method: "POST",
      header: {
        'X-Requested-With': 'APP'
      },
      success: function(res) {

        that.setData({
          'expiredCouponList': res.data.data.couponVOS
        })
      }
    })
  },

  // setCouponData: function(couponVOS, flagType, type) {
  //   var that = this;
  //   console.log(that);
  //   var couponList = new Array();
  //   for (var i = 0; i < couponVOS.length; i++) {
  //     var coupon = {
  //       preferentialAmount: "",
  //       name: "",
  //       prepaymentAmount: "",
  //       couponType: "",
  //       flagType: flagType,
  //       check: false,
  //       couponId: "",
  //       bgColor: "#ea8b99",
  //       type: '',
  //       shouDiscount: 1,
  //       id: '',
  //       isExpired: '',
  //       endTime: ''
  //     };
  //     coupon.id = couponVOS[i].id;
  //     coupon.preferentialAmount = couponVOS[i].preferentialAmount;
  //     coupon.couponId = couponVOS[i].id;
  //     coupon.name = couponVOS[i].name;
  //     coupon.prepaymentAmount = couponVOS[i].prepaymentAmount;
  //     if (couponVOS[i].couponsTypes == 2) {
  //       coupon.couponType = "折扣券";
  //       coupon.shouDiscount = coupon.preferentialAmount * 10;
  //     } else if (couponVOS[i].couponsTypes == 1) {
  //       coupon.couponType = "优惠券";
  //       coupon.shouDiscount = coupon.preferentialAmount;
  //     }

  //     if (type == 1) {
  //       //判断是否已经领取
  //       var couponRes = that.data.couponRes;
  //       for (var j = 0; j < couponRes.length; j++) {
  //         if (couponRes[j].id == coupon.id) {
  //           coupon.flagType = '已领取';
  //           coupon.bgColor = '#B0C4DE';
  //         }
  //       }
  //     }

  //     coupon.endTime = couponVOS[i].expirationTime.split(' ')[0];
  //     coupon.isExpired = that.flagData(couponVOS[i].expirationTime);
  //     if (coupon.isExpired == false) {
  //       coupon.flagType = '已过期';
  //       coupon.bgColor = '#ccc';
  //     }

  //     couponList[i] = coupon;
  //   }

  //   that.setData({
  //     'couponVOS': couponList,
  //   })
  // },

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
              [bgColor]: "#5F9EA0"
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
  // flagData: function(time) {
  //   var tempTime = time.split(' ')[0].split('-');
  //   var nowTime = util.formatTime(new Date).split(' ')[0].split('/');
  //   // 优惠券 2018-11-11 现在 2019-1-31
  //   console.log("月")
  //   console.log(parseInt(nowTime[1]))
  //   console.log(parseInt(tempTime[1]))
  //   if (nowTime[0] < tempTime[0]) {
  //     return true;
  //   } else if (parseInt(nowTime[1]) < parseInt(tempTime[1])) {
  //     return true;
  //   } else if (parseInt(nowTime[2]) < parseInt(tempTime[2])) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // },


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