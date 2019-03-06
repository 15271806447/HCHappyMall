var app = getApp();
Page({
  data: {

    //所有产品
    products: [],
    //书籍
    bookArr: [],
    //视频
    movieArr: [],
    //音频
    audioArr: [],
    //活动
    activeArr: [],
    //类型
    type: [],

    inputvalue: "",
    // height: 10000,
    // change:[],
    winWidth: 0,
    winHeight: 0,
    // tab切换
    currentTab: 1,
    state: false,
    first_click: false,
    //是否加载过页面
    isLoad: false,
    imageUrl: app.globalData.imageUrl
  },


  onLoad: function(e) {
    var that = this;
    /**
     * 获取系统信息
     */
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
    var book = [];
    var audio = [];
    var movie = [];
    var active = [];

    wx.request({
      url: app.globalData.url + '/api/collection/getAllCollection?sid=' + app.globalData.sid + '&userId=' + app.globalData.uid,
      method: "POST",
      header: {
        'X-Requested-With': 'APP'
      },
      success: function(res) {
        console.log(res);
        var products = res.data.data.hcCollectionVOList;
        for (let i = 0; i < products.length;i++){
          products[i].productCovermap = app.globalData.url + '/common/file/showPicture.do?id=' + products[i].productCovermap;
        }
        that.setData({
          products: res.data.data.hcCollectionVOList
        })
        var type = app.globalData.firstClassifyList;
        console.log(app.globalData.firstClassifyList);
        for (var i = 0; i < type.length; i++) {
          for (var j = 0; j < products.length; j++) {
            if (type[i].id == products[j].firstClassifyId && type[i].classNumber == 1) {
              book.push(products[j]);
            } else if (type[i].id == products[j].firstClassifyId && type[i].classNumber == 2) {
              audio.push(products[j]);
            } else if (type[i].id == products[j].firstClassifyId && type[i].classNumber == 3) {
              movie.push(products[j]);
            } else if (type[i].id == products[j].firstClassifyId && type[i].classNumber == 4) {
              active.push(products[j]);
            }
          }
        }
        that.setData({
          bookArr: book,
          movieArr: movie,
          audioArr: audio,
          activeArr: active,
          isLoad: true
        });
        console.log("===========================================================");
        console.log("书");
        console.log(that.data.bookArr);
        console.log("音频");
        console.log(that.data.audioArr);
        console.log("视屏");
        console.log(that.data.movieArr);
        console.log("活动");
        console.log(that.data.activeArr);
        console.log("===========================================================");
        
      }
      
    });

  },
  onHide:function(){
    if(this.data.isLoad == true)
    this.onLoad();
  },
  /**
   * 删除
   */
  delete: function(e) {
    var index = e.currentTarget.dataset.index;
    var type = e.currentTarget.dataset.type;
    var that = this;
    console.log(index);
    wx.showModal({
      title: '提示',
      content: '您确定要删除收藏么？',
      success(res) {
        if (res.confirm) {
          if (type == 'bookArr') {
            console.log(66666666666);
            console.log(that.data.bookArr[index]);
            console.log(66666666666);
            app.removeCollection(that.data.bookArr[index].id);
            var bookArr = that.data.bookArr;
            bookArr.splice(index, 1);
            that.setData({
              'bookArr': bookArr
            })
            
          } else if (type == 'movieArr') {
            app.removeCollection(that.data.movieArr[index].id);
            var movieArr = that.data.movieArr;
            movieArr.splice(index, 1);
            that.setData({
              'movieArr': movieArr
            })
            
          } else if (type == 'audioArr') {
            app.removeCollection(that.data.audioArr[index].id);
            var audioArr = that.data.audioArr;
            audioArr.splice(index, 1);
            that.setData({
              'audioArr': audioArr
            })
            
          } else if (type == 'activeArr') {
            app.removeCollection(that.data.activeArr[index].id);
            var activeArr = that.data.activeArr;
            activeArr.splice(index, 1);
            that.setData({
              'activeArr': activeArr
            })
            
          }
        }
      }
    })

  },

  /**
   * 滑动切换tab
   */
  bindChange: function(e) {

    var that = this;
    that.setData({
      currentTab: e.detail.current + 1
    });
    // this.getHeight(e);
  },
  /**
   * 点击tab切换
   */
  swichNav: function(e) {

    var that = this;

    if (this.data.currentTab === e.currentTarget.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.currentTarget.dataset.current,
        current: e.currentTarget.dataset.current - 1
      });
    }

    // console.log("******************************************")
    // console.log(that.data.bookArr);
    // this.getHeight(e);

  },

  /**
   * 详情页跳转
   */
  toGoods:function(e){
    //TODO 获取到索引
    var index = e.currentTarget.dataset.index;
    var type = e.currentTarget.dataset.type;
    var that = this;
    var productInfo = null;
    if (type == 'bookArr') {
      productInfo = that.data.bookArr[index];
      app.globalData.goodsInfo = productInfo;
    } else if (type == 'movieArr') {
      productInfo = that.data.movieArr[index];
      app.globalData.virtualCourse = productInfo;
    } else if (type == 'audioArr') {
      productInfo = that.data.audioArr[index];
      app.globalData.virtualCourse = productInfo;
    } else if (type == 'activeArr') {
      console.log("9999999999999999999999999999999999999999");
      productInfo = that.data.activeArr[index];
      app.globalData.activeDetail = productInfo;
      console.log(productInfo);
      console.log("9999999999999999999999999999999999999999");
    }
    //appdata接收
    
    if (type == 'bookArr'){
      wx.navigateTo({
        url: '../goods/goods?type=collection',
      })
    } else if (type == "activeArr"){
      wx.navigateTo({
        url: '../eventDetails/eventDetails?type=active',
      })
    }else{
      wx.navigateTo({
        url: '../virtualCourse/virtualCourse?type=search'
      })
    }
   
  }

})