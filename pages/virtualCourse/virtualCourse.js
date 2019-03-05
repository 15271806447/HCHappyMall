var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    vritualCourse: {
      id: '',
      coverPath: '',
      productTitle: "",
      productAuthor: "",
      freeNum: "",
      totalNum: '',
      nowNum: '',
      productSales: '',
      productStock: '',
      price: '',
      memberPrice: '',
      courseIntroduce: "",
      // productCovermap:""
    },
    courseList: [],
    hidden: false,
    nocancel: false,
    isFolded: true,
    isClick: false,
    addCar: false,
    show: false,
    lock: false,
    rows: 4,
    // 长度列表
    time: 0,
    // 判断用户是否购买课程
    isHave: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var json = null;
    if (options.type == 'search') {
      console.log(app.globalData.virtualCourse);
      json = app.globalData.virtualCourse;
      // this.verificationCollection(json.productId);
    } else {
      json = JSON.parse(options.productInfo);
      // this.verificationCollection(json.id);
    }
    console.log(json);
    this.setData({
      'json': json
    })

    var vritualCourse = this.data.vritualCourse;
    console.log(json);
    vritualCourse.id = json.id;
    if (options.type != 'search') {
      vritualCourse.coverPath = app.globalData.url + '/common/file/showPicture.do?id=' + json.productCovermap;
    } else {
      vritualCourse.coverPath = json.productCovermap;
    }
    vritualCourse.productTitle = json.productTitle;
    vritualCourse.productAuthor = json.productAuthor;
    vritualCourse.price = json.originalPrice;
    vritualCourse.memberPrice = json.memberPrice;
    vritualCourse.productSales = json.productSales;
    vritualCourse.productStock = json.productStock;
    vritualCourse.courseIntroduce = json.courseIntroduce;
    // vritualCourse.productCovermap = json.productCovermap
    if (options.type == 'search') {
      vritualCourse.id = json.productId;
      vritualCourse.coverPath = json.productCovermap
    }
    this.setData({
      'vritualCourse': vritualCourse,
      goods: this.data.vritualCourse
    })

    this.getCourseInfo();
    this.flagVideoAndAudio(json);
    this.checkCourse();
    this.verificationCollection(this.data.vritualCourse.id);
    
  },
  /**
   * 跳转购买
   */
  addBuy: function() {
    app.globalData.goodsInfo = this.data.goods;
    wx.navigateTo({
      url: '../confirm/confirm?type=virtualGoods',
    })
  },
  /**
   * 简介展示
   */
  change: function(e) {
    if (this.data.isFolded) {
      this.setData({
        isFolded: false,
        rows: 5000
      });
    } else {
      this.setData({
        isFolded: true,
        rows: 4
      });
    }
  },

  /**
   * 点击收藏
   */
  addCollection: function() {
    if (!this.data.isClick == true) {
      wx.showToast({
        title: '已收藏',
      });
      app.collectionProduct(app.globalData.uid, this.data.vritualCourse.id);
      // var collectionId = 
      // this.setData({
      //   'collectionId': collectionId
      // })
    } else {
      wx.showToast({
        title: '已取消收藏',
      });
      // app.removeCollection(this.data.collectionId);
      this.cancelCollection();
    }
    this.setData({
      isClick: !this.data.isClick
    })
  },
  // 加入购物车
  addCar: function() {
    this.JoinShoppingCart();
  },

  /**列表数据表交互*/
  getCourseInfo: function() {
    var that = this;
    var temp = 0;
    console.log("列表数据表交互");
    var vritualCourse = this.data.vritualCourse;
    wx.request({
      url: app.globalData.url + '/api/course/getCourseInfo?sid=' + app.globalData.sid + '&productId=' + that.data.json.id,
      method: "POST",
      header: {
        'X-Requested-With': 'APP'
      },
      success: function(res) {
        console.log(res);
        var course = res.data.data.courseVO;
        var courseList = res.data.data.courseVO.hcFSectionInfoList;

        vritualCourse.freeNum = course.freeNum
        vritualCourse.totalNum = course.totalNum
        vritualCourse.nowNum = course.nowNum

        if (that.data.type == 'VideoItem') {
          for (var i = 0; i < courseList.length; i++) {
            temp++;

            var path = that.getFilePath(courseList[i].fileAddr, i);

            that.getVideoTime(path, i);
            if (temp > vritualCourse.freeNum) {
              that.data.lock = true
              console.log("********" + that.data.lock);
            }
          }
        } else if (that.data.type == 'AudioItem') {
          for (var i = 0; i < courseList.length; i++) {
            temp++;
            console.log(courseList[i].fileAddr);
            that.getVideoTime(that.getAudioPath(courseList[i].fileAddr), i);
            if (temp > vritualCourse.freeNum) {
              that.data.lock = true
            }
          }
        }
        vritualCourse.totalNum = course.totalNum
        vritualCourse.nowNum = course.nowNum


        that.setData({
          'vritualCourse': vritualCourse,
          'courseList': courseList
        });
      }
    })
  },

  /**判断用户是否购买交互 */
  checkCourse: function() {
    var that = this;
    var id = this.data.vritualCourse.id;
    var isHave = that.data.isHave
    wx.request({
      url: app.globalData.url + '/api/course/checkCourse?sid=' + app.globalData.sid + '&userId=' + app.globalData.uid + '&productId=' + id,
      method: "POST",
      header: {
        'X-Requested-With': 'APP'
      },
      success: function(res) {
        console.log("用户是否购买交互");
        console.log(res.data.data);
        isHave = res.data.data.isHave;
        that.setData({
          'isHave': isHave,
        });
      }
    })
  },
  /**
   * 加入购物车到数据库
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
          var id = that.data.vritualCourse.id;
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

  /* 跳转视频音频播放页面 */
  bounced: function(e) {
    console.log("免费观看的讲次：" + this.data.vritualCourse.freeNum);
    var index = e.currentTarget.dataset.index;
    console.log(index)
    var freeNum = this.data.vritualCourse.freeNum
    var that = this;
    var time = that.data.time;
    var type = that.data.type;
    console.log(type)
    var isHave = that.data.isHave
    if (index < freeNum || isHave == true) {
      if (type == 'VideoItem') {
        wx.navigateTo({
          url: '../videoPlay/videoPlay?type=1&videoDetail=' + encodeURIComponent(JSON.stringify(that.data.vritualCourse)) + '&index=' + index + "&time=" + JSON.stringify(time),
        })
      } else if (type == 'AudioItem') {
        wx.navigateTo({
          url: '../audioPlay/audioPlay?type=1&audioDetail=' + encodeURIComponent(JSON.stringify(that.data.vritualCourse)) + '&index=' + index + "&time=" + JSON.stringify(time),
        })
      }
    } else {
      wx.showModal({
        title: '收费课程',
        content: '请您购买',
        showCancel: false,
        confirmText: '取消',
      })
    }
  },

  /**判断视屏与音频交互*/
  flagVideoAndAudio: function(json) {
    var type = null;
    if (json.firstClassifyId == app.globalData.firstClassifyList[1].id) {
      // 音频
      type = 'AudioItem';
    } else if (json.firstClassifyId == app.globalData.firstClassifyList[3].id) {
      // 视频
      type = 'VideoItem';
    }
    this.setData({
      'type': type
    })
  },
  /**获取视频的长度 */
  getVideoTime: function(src, i) {
    var that = this;
    var playTime = "time" + "[" + i + "]";
    var timeList = this.data.timeList;
    const innerAudioContext = wx.createInnerAudioContext()  //初始化createInnerAudioContext接口
    //设置播放地址
    innerAudioContext.src = src;

    //音频进入可以播放状态，但不保证后面可以流畅播放
    innerAudioContext.onCanplay(() => {
      innerAudioContext.duration //类似初始化-必须触发-不触发此函数延时也获取不到
      setTimeout(function() {
        //在这里就可以获取到大家梦寐以求的时长了
        console.log('innerAudioContext.duration');
        console.log(innerAudioContext.duration); //延时获取长度 单位：秒
        var time = that.toTime(innerAudioContext.duration);
        timeList = that.toTime(innerAudioContext.duration);
        that.setData({
          [playTime]: time

        })
      }, 1000)  //这里设置延时1秒获取
    })
  },

  toTime: function(s) {
    var day = Math.floor(s / (24 * 3600)); // Math.floor()
    var hour = Math.floor((s - day * 24 * 3600) / 3600);
    var minute = Math.floor((s - day * 24 * 3600 - hour * 3600) / 60);
    var second = Math.floor(s - day * 24 * 3600 - hour * 3600 - minute * 60);
    var time = '00:00';
    if (hour > 0 && minute < 10) {
      time = hour + ":0" + minute + ":" + second;
    } else if (hour > 0 && minute > 10) {
      time = hour + ":" + minute + ":" + second;
    } else if (hour <= 0 && minute < 10) {
      time = "0" + minute + ":" + second;
    } else if (hour <= 0 && minute > 10) {
      time = minute + ":" + second;
    } else if (hour <= 0 && minute <= 0) {
      time = "00:" + second;
    }
    return time;
  },

  getAudioPath: function(id) {
    return app.globalData.url + '/common/file/showPicture.do?id=' + id;
  },

  //获取文件路径
  getFilePath: function(fileId, index) {
    var that = this;
    var myArray = new Array();
    var i = index;
    var videoUrl = "courseList" + "[" + index + "]" + ".videoUrl";
    wx.request({
      url: app.globalData.url + '/api/common/file/get?id=' + fileId,
      method: 'GET',
      success: function(res) {
        console.log('res');
        console.log(res);
        var index = res.data.data.storageId.indexOf("upload");
        var filePath = app.globalData.url + "/" + res.data.data.storageId.substring(index);
        that.getVideoTime(filePath, i);
        that.setData({
          [videoUrl]: filePath
        })
        var fileName = res.data.data.fileName.split(".")[0];
        console.log(fileName);
        myArray[0] = filePath;
        myArray[1] = fileName;
        return myArray;
      }
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
        console.log("888888888888888888888")
        console.log(res)
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
          if (collectionList[i].productId == that.data.vritualCourse.id) {
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

 
})