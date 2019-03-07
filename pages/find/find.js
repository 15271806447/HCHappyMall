//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    categoryList: [{
        category: '免费',
        isActive: "no-active",
      },
      {
        category: '旅游',
        isActive: "no-active",
      },
      {
        category: '运动',
        isActive: "no-active",
      },
      {
        category: '亲子',
        isActive: "no-active",
      },
      {
        category: '教育',
        isActive: "no-active",
      }
    ],
    activity: [{
      productCovermap: 'http://47.107.183.112/img/tourism.png',
      productTitle: '厦门+鼓浪屿6日5晚半自助游(5钻)·双旦狂欢 9人小团 ',
      originalPrice: '免费',
      productSales: "9999"
    }],

    fisrtCategory: "active",
    searchinput: "",
    imageUrl: app.globalData.imageUrl,
    searchPageNum: 1, // 设置加载的页数，默认是第一页  
  },
  onLoad: function() {
    console.log('findIndex:' + app.globalData.findIndex);
    this.getSecondClassify(app.globalData.findIndex);
    this.searchProduct();
    if (community_id) {
      // 处理完成后，清空缓存值
      app.globalData.findIndex = null;
    }
  },
  onShow: function() {
    this.onLoad();
  },
  /**
   * 拿二级分类
   * index 当前的选择分类索引
   */
  getSecondClassify: function(index) {
    var that = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: app.globalData.url + '/api/product/getSecondClassify?sid=' + app.globalData.sid + "&firstClassifyId=" + app.globalData.firstClassifyList[4].id,
      method: "POST",
      header: {
        'X-Requested-With': 'APP'
      },
      success: function(res) {
        console.log(res);

        var SecondClassifyList = res.data.data.hcProductSecondClassifyList;
        var categoryList = [];
        for (let i = 0; i < SecondClassifyList.length; i++) {
          var SecondClassify = new Object;
          SecondClassify.category = SecondClassifyList[i].secondClassName;
          if (i == index) {
            SecondClassify.isActive = "active";
          } else {
            SecondClassify.isActive = "no-active";
          }
          SecondClassify.id = SecondClassifyList[i].id;
          categoryList.push(SecondClassify);
        }

        that.setData({
          'categoryList': categoryList
        })
        wx.hideLoading();
      }
    })
  },
  /**
   * 跳转活动详情
   */
  activityDetail: function(e) {
    var index = e.currentTarget.dataset.index;
    console.log(this.data.activity[index]);
    app.globalData.activeDetail = this.data.activity[index];
    console.log("987654321")
    console.log(app.globalData.activeDetail);
    console.log("987654321")
    wx.navigateTo({
      url: '../eventDetails/eventDetails'
    })
  },
  /**
   * 搜索
   */
  searchProduct: function(IsPush) {
    var that = this;
    var firstClassifyId = app.globalData.firstClassifyList[4].id;
    var page = this.data.searchPageNum;
    var activity = that.data.activity;
    var categoryList = this.data.categoryList;
    var categoryId = "";
    for (let i = 0; i < categoryList.length; i++) {
      if (categoryList[i].isActive == "active") {
        categoryId = categoryList[i].id;
      }
    }
    wx.request({
      url: app.globalData.url + '/api/product/searchProduct?sid=' + app.globalData.sid + "&firstClassifyId=" + firstClassifyId + "&secondClassifyId=" + categoryId + "&keyword=" + that.data.searchinput + "&minStr=0" + "&maxStr=0" + "&page=" + page + "&size=4",
      method: "POST",
      header: {
        'X-Requested-With': 'APP'
      },
      success: function(res) {
        console.log(res);
        console.log('=================');
        console.log(app.globalData.url + '/api/product/searchProduct?sid=' + app.globalData.sid + "&firstClassifyId=" + firstClassifyId + "&secondClassifyId=" + categoryId + "&keyword=" + that.data.searchinput + "&minStr=0" + "&maxStr=0" + "&page=1&size=4");
        var hcProductInfoList = res.data.data.hcProductInfoList;
        if (hcProductInfoList.length == 0) {
          wx.showModal({
            title: '提示',
            content: '没有内容！',
            showCancel: false,
            confirmColor: '#ff6666'
          })
          return;
        }
        for (let i = 0; i < hcProductInfoList.length; i++) {
          hcProductInfoList[i].productCovermap = app.globalData.url + '/common/file/showPicture.do?id=' + hcProductInfoList[i].productCovermap;
          if (IsPush) {
            activity.push(hcProductInfoList[i])
          }
        }
        if (IsPush) {
          that.setData({
            'activity': activity
          })
        } else {
          that.setData({
            'activity': hcProductInfoList
          })
        }
      }
    })
  },


  /*
  / 用户点击类别
  */
  chooseCategory: function(e) {
    //获取点击的索引
    var index = e.target.dataset.index;
    var categoryList = this.data.categoryList;
    for (var i = 0; i < categoryList.length; i++) {
      categoryList[i].isActive = "no-active";
    }
    categoryList[index].isActive = "active";
    this.searchProduct(false);
    this.setData({
      'categoryList': categoryList,
      'fisrtCategory': "no-active"
    })
  },
  /*
  / 用户点击推荐
  */
  firstchose: function() {
    var categoryList = this.data.categoryList;
    for (var i = 0; i < categoryList.length; i++) {
      categoryList[i].isActive = "no-active";
    }
    this.setData({
      'categoryList': categoryList,
      'fisrtCategory': "active"
    })
    this.searchProduct(false);
  },
  /*
  / 清空搜索内容
  */
  deleteSearch: function() {
    this.setData({
      'searchinput': ""
    });
  },
  /**
   * 输入内容同步
   */
  inputBind: function(e) {
    this.setData({
      'searchinput': e.detail.value
    })
  },
  query: function() {
    this.searchProduct(false);
  },
  /**
   * 加载更多
   */
  more: function() {
    // 调接口push进数组
    var searchPageNum = this.data.searchPageNum + 1;
    this.setData({
      searchPageNum: searchPageNum
    })
    this.searchProduct(true);
  }

})