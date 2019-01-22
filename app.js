//app.js
var md5 = require('pages/utils/md5.js');
App({
  onLaunch: function() {
    var that = this;
    // wx.login({
    //   success: res => {
    //     wx.request({
    //       // 这里的 url 是微信官方提供的可以在小程序中直接通过 code 来获取 openid 的
    //       // 根据解释，补上自己的 APPID 和 SECRET
    //       url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wx367133e42c719c35&secret=9dbc3a611ec5b2bcaecf4de25d6f1329&js_code=' + res.code + '&grant_type=authorization_code',
    //       success: res => {
    //         that.globalData.openid = res.data.openid;
    //       }
    //     })
    //   }
    // });
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    url: "https://www.xfxy.awcp.org.cn",
    userInfo: null,
    sid: null,
    uid: '',
    firstClassifyList: "",
    productCartList: null,
    activeDetail: null,
    ip: null,
    openid: null,
    imageUrl: "http://47.107.183.112:90/img/",
    findIndex: null,
    goodsInfo: null,//详情页商品
    goodsList: null,//订单页数据
    delivery: null,//订单页折扣
    integral: null,//订单页积分
  },
  /**解析地址Code值 */
  analysisCode: function(areaIdPath, userAddress, thatpage) {
    var tcity = require("./utils/citys.js");
    var that = thatpage;
    tcity.init(that);
    var cityData = that.data.cityData;
    var codeList = areaIdPath.split('-')
    for (var a = 0; a < cityData.length; a++) {
      if (codeList[0] == cityData[a].code) {
        console.log("省名称：" + cityData[a].name)
      }
      for (var b = 0; b < cityData[a].sub.length; b++) {
        if (codeList[1] == cityData[a].sub[b].code) {
          console.log("市名称：" + cityData[a].sub[b].name)
          for (var c = 0; c < cityData[a].sub[b].sub.length; c++) {
            if (codeList[2] == cityData[a].sub[b].sub[c].code) {
              console.log("县名称：" + cityData[a].sub[b].sub[c].name)
              var addressList = cityData[a].name + '-' + cityData[a].sub[b].name + '-' + cityData[a].sub[b].sub[c].name + '-' + userAddress
            }
          }
        }
      }
    }
    return addressList;
  },


  /**
   * 支付
   * body: 商品描述
   * orderid: 订单号
   * spbill_create_ip: 用户终端ip
   * money:总金额
   * callback:回调
   */
  pay: function(body, orderid, money,callback) {
    var app = getApp();
    console.log(app);
    var object = {
      "body": body, //商品描述
      "trade_type": "JSAPI",
      "out_trade_no": orderid, //订单号
      // "spbill_create_ip": app.globalData.ip,
      "total_fee": money,
      "openid": app.globalData.openid
    }

    console.log('支付接口参数===================');
    console.log(object);
    // 预下单
    wx.request({
      url: app.globalData.url + '/api/wechat/pay?sid=' + app.globalData.sid,
      method: "POST",
      data: object,
      header: {
        'X-Requested-With': 'APP'
      },
      success: function(res) {
        console.log(res);
        var result = res;
        // var sign = md5.hexMD5('appId=wx167f9676d1d7c380&nonceStr=' + result.data.data.nonce_str + '&package=prepay_id=' + result.data.data.prepay_id + '&signType=MD5&timeStamp=' + time + '& key=70bcafecff934c55bf6d6d90d75bce6c').toUpperCase();
        // console.log('sign加密前' + 'appId=wx167f9676d1d7c380&nonceStr=' + result.data.data.nonce_str + '&package=prepay_id=' + result.data.data.prepay_id + '&signType=MD5&timeStamp=' + time + '& key=70bcafecff934c55bf6d6d90d75bce6c');
        wx.requestPayment({
          timeStamp: result.data.data.timeStamp,
          nonceStr: result.data.data.nonceStr,
          package: result.data.data.package,
          signType: 'MD5',
          paySign: result.data.data.paySign,
          success(res) {
            console.log(res);
            console.log('支付成功')
          },
          fail(res) {
            console.log('支付失败');
            console.log(res);
          },
          complete(res){
            console.log('完成');
            //TODO 携带参数页面跳转到详情页
            callback();
          
          }
        })
      }
    })
  },

  /**
   * 返回awcp规定图片url
   */
  url: function(id) {
    return app.globalData.url + '/common/file/showPicture.do?id=' + id;
  },
  /**
   * 收藏商品
   */
  collectionProduct: function(userId, productId) {
    var that = this;
    var app = getApp();
    console.log('userId:' + userId);
    console.log('productId:' + productId);
    wx.request({
      url: app.globalData.url + '/api/collection/collectionProduct?sid=' + app.globalData.sid + '&userId=' + userId + '&productId=' + productId,
      method: "POST",
      header: {
        'X-Requested-With': 'APP'
      },
      success: function(res) {
        console.log(res);
        return res.data.data.collectionId;

      }
    })
  },
  /**
   * 删除收藏商品
   */
  removeCollection: function(collectionId) {
    var that = this;
    var app = getApp();
    wx.request({
      url: app.globalData.url + '/api/collection/removeCollection?sid=' + app.globalData.sid + '&collectionId=' + collectionId,
      method: "POST",
      header: {
        'X-Requested-With': 'APP'
      },
      success: function(res) {
        console.log(res);
      }
    })
  }
})