var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    details: "",
    isFolded: true,
    rows: 3,
    activitiesList: {
      id: "",
      coverPath: "",
      productTitle: "",
      activitiPlace: "",
      beginTime: "",
      endTime: "",
      price: 0,
      activitiIntroduction: "",
      showColor: "#ff0000",
      imgArr: []
    },
    isClick: false
  },

  showActiveDetail: function(options) {
    var that = this;
    var activeDetail = app.globalData.activeDetail;
    var activitiesId = 'activitiesList.id';
    var activitiesCoverPath = 'activitiesList.coverPath';
    var activitiesTitle = 'activitiesList.productTitle';
    var activitiesPrice = 'activitiesList.price';
    if (activeDetail.price == 0) {
      activeDetail.price = "免费"
    };

    that.setData({
      [activitiesId]: activeDetail.id,
      [activitiesCoverPath]: activeDetail.productCovermap,
      [activitiesTitle]: activeDetail.productTitle,
      [activitiesPrice]: activeDetail.originalPrice
    });
    if (options.type == 'active') {
      that.setData({
        [activitiesId]: activeDetail.productId,
      });
    }



    console.log(77889911223345)
    console.log(this.data.activitiesList.id);
    console.log(activeDetail);
    console.log(77889911223345)
    this.verificationCollection(this.data.activitiesList.id);

  },
  /**
   * 收藏
   */
  collection: function() {
    console.log(this.data.activitiesList)


    if (!this.data.isClick == true) {
      wx.showToast({
        title: '已收藏',
      });
      app.collectionProduct(app.globalData.uid, this.data.activitiesList.id);
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
   * 设置图片数组
   */
  setImgArr: function() {
    var that = this;
    var activeDetail = this.data.activeDetailList;
    wx.request({
      url: app.globalData.url + '/api/product/getProductPicture?&sid=' + app.globalData.sid + '&id=' + activeDetail.id,
      header: {
        
        'X-Requested-With': 'APP'
      },
      method: 'POST',
      success: function(res) {
        var TotalList = res.data.data.hcProductPictureList;
        var imgArrList = new Array(TotalList.length);
        for (var i = 0; i < TotalList.length; i++) {
          var imgPath = TotalList[i].productImgPath
          imgArrList[i] = imgPath;
        }

        console.log(this)
        that.setData({
          'activitiesList.imgArr': imgArrList
        })

      }
    })
  },

  // 格式化日期
  dateSplite: function(date) {
    date = date.substring(0, 10);
    return date;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(1111111)
    console.log(options);
    console.log(1111111)
    this.getAllActivities();
    this.showActiveDetail(options);

  },


  change: function(e) {
    if (this.data.isFolded) {
      this.setData({
        isFolded: false,
        rows: 5000
      });
    } else {
      this.setData({
        isFolded: true,
        rows: 3
      });
    }
  },
  previewImg: function(e) {
    var index = e.currentTarget.dataset.index;
    var imgArr = this.data.activities.imgArr;
    wx.previewImage({
      current: this.data.activities.imgArr[index], //当前图片地址
      urls: this.data.activities.imgArr, //所有要预览的图片的地址集合 数组形式
    })


  },
  buyNow: function() {
    wx: wx.navigateTo({
      url: '../confirm/confirm?type=' + 'activit' + '&productInfo=' + encodeURIComponent(JSON.stringify(this.data.activitiesList)),
    })
  },


  //验证收藏
  verificationCollection: function(productId) {
    var that = this;
    wx.request({
      url: app.globalData.url + '/api/collection/isCollection?sid=' + app.globalData.sid + "&userId=" + app.globalData.uid + "&productId=" + productId,
      method: "POST",
      header: {
        'X-Requested-With': 'APP'
      },
      success: function(res) {
        console.log("888888888888888888888999999999999999999")
        console.log(res)
        console.log("88888888888888888888899999999999999999999999")
        that.setData({
          isClick: res.data.data.isCollection
        })
      }
    })
  },
  //取消收藏
  cancelCollection: function() {
    var that = this;
    wx.request({
      url: app.globalData.url + '/api/collection/getAllCollection?sid=' + app.globalData.sid + '&userId=' + app.globalData.uid,
      method: "POST",
      header: {
        'X-Requested-With': 'APP'
      },
      success: function(res) {
        console.log("5555555555555555");
        console.log(res);
        var collectionList = res.data.data.hcCollectionVOList;
        console.log(collectionList);
        console.log("5555555555555555");
        for (var i = 0; i < collectionList.length; i++) {
          if (collectionList[i].productId == that.data.activitiesList.id) {
            console.log(collectionList[i].id);
            that.deleteCollection(collectionList[i].id);
          }
        }
      }
    })
  },

  //删除收藏
  deleteCollection: function(collectionId) {
    wx.request({
      url: app.globalData.url + '/api/collection/removeCollection?sid=' + app.globalData.sid + "&collectionId=" + collectionId,
      method: "POST",
      header: {
        'X-Requested-With': 'APP'
      },
      success: function(res) {
        console.log(555555555555555666);
        console.log(res);
        console.log(555555555555555666);

      }
    })
  },


  getAllActivities: function() {
    var that = this;
    wx.request({
      url: app.globalData.url + '/api/activities/getAll?sid=' + app.globalData.sid,
      method: "POST",
      header: {
        'X-Requested-With': 'APP'
      },
      success: function(res) {
        console.log(555555555555555666);
        console.log(res);
        console.log(555555555555555666);
        var activitieArr = res.data.data.activitiesVOS;
        for (var i = 0; i < activitieArr.length; i++) {
          if (activitieArr[i].productId == that.data.activitiesList.id) {
            console.log("777777777777777777777");
            console.log(activitieArr[i]);
            console.log("777777777777777777777")
            var activitiesPlace = "activitiesList.activitiPlace";
            var activitiesListBeginTime = "activitiesList.beginTime";
            var activitiesListEndTime = "activitiesList.endTime";
            var activitiesIntroduction = "activitiesList.activitiIntroduction";
            that.setData({
              [activitiesPlace]: activitieArr[i].activitiPlace,
              [activitiesListBeginTime]: that.dateSplite(activitieArr[i].beginTime),
              [activitiesListEndTime]: that.dateSplite(activitieArr[i].endTime),
              [activitiesIntroduction]: activitieArr[i].courseIntroduce
            })
          }
        }
      }
    })
  }
})