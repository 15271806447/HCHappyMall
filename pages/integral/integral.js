var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {
      nickname: "",
      jifenTotal: 0,
      headImg: "",
      jifenDetail: []
    },
    showMessage: [{
      imgPath: app.globalData.imageUrl + "integral-mony.png",
      title: "购物得积分",
      message: "指买家通过付款购买商品交易成功后所获得的促销活动费用，买家可按本规则在下次商品交易中使用该积分付款，买家的积分情况以会“我的积分”记录为准"
    }, ],
    isShow: false
  },

  getIntegralList: function() {
    var that = this;
    var user = that.data.user;
    wx: wx.request({
      url: app.globalData.url + '/api/wallet/getIntegralRecord?userId=' + app.globalData.uid + '&sid=' + app.globalData.sid,
      header: {
        'X-Requested-With': 'APP'
      },
      method: 'POST',
      success: function(res) {
        console.log(res);

        var TotalList = res.data.data.hcIntegralRecordList;
        var jifenList = new Array(TotalList.length);
        var userInfo = app.globalData.userInfo;

        //获取nickname
        user.nickname = userInfo.nickName;

        //获取用户对象
        user.headImg = userInfo.avatarUrl;

        if (TotalList.length == 0) {
          that.setData({
            'isShow': true
          })
        }

        //填写jifenDetail 积分详情
        for (var i = 0; i < TotalList.length; i++) {
          var jifen = {
            jifenName: "",
            jifenType: "",
            jifenNumber: 0,
            jifenDate: ""
          };
          // 积分类型判断
          if (TotalList[i].type == 1) {
            jifen.jifenType = "收入";
            jifen.jifenNumber = "+" + TotalList[i].integralQuantity;
          } else if (TotalList[i].type == 2) {
            jifen.jifenType = "支出";
            jifen.jifenNumber = "-" + TotalList[i].integralQuantity;
          }
          // 积分来源类型
          // 1 - 订单使用积分 2 - 订单结算得积分 3 - 订单取消返还 4 - 签到
          if (TotalList[i].integralSourceType == 1) {
            jifen.jifenName = "订单使用积分";
          } else if (TotalList[i].integralSourceType == 2) {
            jifen.jifenName = "订单结算积分";
          } else if (TotalList[i].integralSourceType == 3) {
            jifen.jifenName = "订单取消返还";
          } else if (TotalList[i].integralSourceType == 4) {
            jifen.jifenName = "签&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;到";
          }

          //设置积分日期
          jifen.jifenDate = that.dateSplite(TotalList[i].createTime);

          jifenList[i] = jifen;
        }
        user.jifenDetail = jifenList;
        that.setData({
          'user': user
        })

      },
    })
  },

  dateSplite: function(date) {
    date = date.substring(0, 16);
    return date;
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getIntegralList();
    this.getTotalScore()
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
  //获取总积分
  getTotalScore: function() {
    var that = this;
    wx: wx.request({
      url: app.globalData.url + '/api/wallet/getWallet?userId=' + app.globalData.uid + '&sid=' + app.globalData.sid,
      header: {
        'X-Requested-With': 'APP'
      },
      method: 'POST',
      success: function(res) {
        //总积分
        var TotalScore = res.data.data.hcWallet.integral;
        that.setData({
          jifenTotal: TotalScore,
        })
      },
    })
  },
})