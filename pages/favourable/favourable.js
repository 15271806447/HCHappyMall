var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    flagType: [],
    couponType: [],
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
    this.favdata(type);
    if (type == 1) {
      this.flagGet();
    }

    that.flagCouponType();
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
        for (var i = 0; i < that.data.couponVOS.length; i++) {
          for (var j = 0; j < res.data.data.couponVOS.length; j++) {
            if (res.data.data.couponVOS[j].id == that.data.couponVOS[i].id) {
              var flagType = 'flagType[' + i + ']';
              var bgColor = 'bgColor' + '[' + i + ']';
              that.setData({
                [flagType]: "已领取",
                [bgColor]: "#ccc"
              })
            }
          }
        }
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
          for (var i = 0; i < res.data.data.hcCouponInfoList.length; i++) {
            var flagType = 'flagType[' + i + ']';
            var bgColor = 'bgColor' + '[' + i + ']';
            that.setData({
              [flagType]: "领取",
              [flagType]: "立即领取",
              [bgColor]: "#ea8b99"
            })
          }

          that.flagCouponType(res.data.data.hcCouponInfoList);
          that.setData({
            'couponVOS': res.data.data.hcCouponInfoList,
          })
        }
      })
    } else if (type == 2) {
      //我的优惠券
      wx.request({
        url: app.globalData.url + '/api/coupon/showCoupon?sid=' + app.globalData.sid + "&userId=" + app.globalData.uid,
        method: "POST",
        header: {
          'X-Requested-With': 'APP'
        },
        success: function(res) {
          for (var i = 0; i < res.data.data.couponVOS.length; i++) {
            var flagType = 'flagType' + '[' + i + ']';
            that.setData({
              [flagType]: "立即使用",
            })
          }

          that.flagCouponType(res.data.data.couponVOS);
          that.setData({
            'couponVOS': res.data.data.couponVOS,
          })
        }
      })
    }
  },
  //领取优惠券
  getCoupon: function(e) {
    var type = this.data.type;
    var that = this;
    var index = JSON.stringify(e.currentTarget.dataset.index);
    var flagType = this.data.flagType[index];
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
            var flagType = 'flagType' + '[' + index + ']';
            var bgColor = 'bgColor' + '[' + index + ']';
            that.setData({
              [flagType]: "已领取",
              [bgColor]: "#ccc"
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

  //判断优惠券类型
  flagCouponType: function (couponVOS) {
    var that = this;
    var tempyArr = new Array();
    for (var i = 0; i < couponVOS.length; i++) {
      if (couponVOS[i].couponsTypes == 2) {
        tempyArr[i] = "优惠券";
      } else if (couponVOS[i].couponsTypes == 1) {
        tempyArr[i] = "折扣券";
      }
    }
    console.log(tempyArr);
    that.setData({
      couponType: tempyArr
    })
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