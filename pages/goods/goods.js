var app = getApp();
Page({

  data: {
    imgUrls: [
      '../image/book.jpg',
      '../image/book2.jpg'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    collectionId:"",
    productId:"",
    goods: {
      productTitle: "那莲  那禅 那光阴",
      memberPrice: "66",
      originalPrice: "128",
      productSales: "96969",
    },
    appraiseInfo: {
      name: "墨刀用户",
      info: "书本不错 ，包装很好，没有破损 ，快递很快。翻了一下，字体打印很清楚。"
    },
    appraiseList: [{
        appraise: "不错",
        count: 12,
      },
      {
        appraise: "追加",
        count: 12,
      },
      {
        appraise: "有图",
        count: 12,
      },
      {
        appraise: "物流快",
        count: 12,
      },
      {
        appraise: "很划算",
        count: 12,
      },
      {
        appraise: "质量好",
        count: 12,
      },
    ],
    isClick: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("7777777777777777777777777");
    console.log(options)
    if (options.type == "collection" || options.type == "search" || options.type == "shoppingCart") {
      //TODO
      this.setData({
        'goods': app.globalData.goodsInfo,
        productId: app.globalData.goodsInfo.productId
      })
    }else {
      var productInfo = JSON.parse(options.productInfo);
      console.log("7777777777777777777777777");
      console.log(productInfo);
      console.log("7777777777777777777777777");
      this.setData({
        'goods': productInfo,
        productId: productInfo.id
      })
    }
    console.log("777777777777777777777777788");
    console.log(this.data.goods);
    console.log("777777777777777777777777788");
    this.getProductPicture();
    this.verificationCollection(this.data.productId);
  },
  /**
   * 请求商品配图
   */
  getProductPicture: function() {
    var that = this;
    console.log('首页sid' + app.globalData.sid);
    wx.request({
      url: app.globalData.url + '/api/product/getProductPicture?sid=' + app.globalData.sid + "&id=" + that.data.goods.id,
      method: "POST",
      header: {
        'X-Requested-With': 'APP'
      },
      success: function(res) {
        console.log(res.data.data.hcProductPictureList);
        var imgUrls = that.data.imgUrls;
        for (var i = 0; i < res.data.data.hcProductPictureList.length; i++) {
          imgUrls[i] = app.globalData.url + '/common/file/showPicture.do?id=' + res.data.data.hcProductPictureList[i].productImgPath;
        }
        that.setData({
          'imgUrls': imgUrls
        })
      }
    })
  },
  /**
   * 收藏
   */
  collection: function() {
    var that = this;
    if (!this.data.isClick) {
      wx.showToast({
        title: '已收藏',
      });
      
      app.collectionProduct(app.globalData.uid, this.data.goods.id);
      // var collectionId = app.collectionProduct(app.globalData.uid, this.data.goods.id);
      // console.log("7777777777777777777");
      // console.log(collectionId);
      // console.log(Promise.resolve(collectionId));
      // Promise.all([collectionId]).then(function (values) {
      //   console.log(values[0]);
      //   that.setData({
      //     collectionId: values[0]
      //   })
      // });
  
      console.log("7777777777777777777");

    } else {
      wx.showToast({
        title: '已取消收藏',
      });
      this.cancelCollection();
    }
    this.setData({
      isClick: !this.data.isClick
    })

  },
  /**
   * 加入购物车
   */
  JoinShoppingCart: function() {
    var that = this;
    wx.showModal({
      title: '成功添加购物车！！！',
      content: '可在购物车中修改商品数量！',
      showCancel: false,
      confirmText: '返回',
      success: function(res) {
        if (res.confirm) {
          //商品添加购物车接口
          var id = that.data.goods.id;
          console.log("id:" + id);
          console.log("userId:" + app.globalData.uid);
          wx.request({
            url: app.globalData.url + '/api/productCart/addToProductCart?sid=' + app.globalData.sid + "&userId=" + app.globalData.uid + "&productId=" + id + "&num=1",
            method: "POST",
            header: {
              'X-Requested-With': 'APP'
            },
            success: function(res) {
              console.log(res);
              console.log('url:' + app.globalData.url + '/api/productCart/addToProductCart?sid=' + app.globalData.sid + "&userId=" + app.globalData.uid + "&productId=" + id);
            }
          })
        }
      }
    })
  },
  /**
   * 立即购买
   */
  buyNow: function() {
    app.globalData.goodsInfo = this.data.goods;
    wx: wx.navigateTo({
      url: '../confirm/confirm?type=goods',
    })
  },

  //验证收藏
  verificationCollection:function(productId){
    var that = this;
    wx.request({
      url: app.globalData.url + '/api/collection/isCollection?sid=' + app.globalData.sid + "&userId=" + app.globalData.uid + "&productId=" + productId,
      method:"POST",
      header: {
        'X-Requested-With': 'APP'
      },
      success:function(res){
        console.log("888888888888888888888")
        console.log(res)
        that.setData({
          isClick: res.data.data.isCollection
        })
      }
    })
  },

  //取消收藏
  cancelCollection:function(){
    var that = this;
    wx.request({
      url: app.globalData.url + '/api/collection/getAllCollection?sid=' + app.globalData.sid + '&userId=' + app.globalData.uid,
      method: "POST",
      header: {
        'X-Requested-With': 'APP'
      },
      success: function (res) {
        console.log("5555555555555555");
        console.log(res);
        var collectionList = res.data.data.hcCollectionVOList;
        console.log(collectionList);
        console.log("5555555555555555");
        for (var i = 0; i < collectionList.length; i++){
          if (collectionList[i].productId == that.data.productId){
            console.log(collectionList[i].id);
            that.deleteCollection(collectionList[i].id);
          }
        }
        
      }

    })
  },

  //删除收藏
  deleteCollection: function (collectionId){
    wx.request({
      url: app.globalData.url + '/api/collection/removeCollection?sid=' + app.globalData.sid + "&collectionId=" + collectionId,
      method: "POST",
      header: {
        'X-Requested-With': 'APP'
      },
      success:function(res){
        console.log(555555555555555666);
        console.log(res);
        console.log(555555555555555666);

      }

    })
  }


})