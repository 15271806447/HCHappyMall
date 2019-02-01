var app = getApp();
Page({
  data: {
    info: "",
    videoInformation: {
      name: "",
      thisindex: 0,
      desption: "",
      // 评分
      sales: 0,
      category: "",
      // 当前更新集数
      nowEpisodes: "",
      // 全部更新集数
      allEpisodes: ""
    },

    video: [
      //      videoName: "面对孩子的问题父母怎么处理",
      //      videoUrl: "http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400"
      //    }, {
      //      videoName: "梦想的界定",
      //      videoUrl: "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4"
      //    }, {
      //      videoName: "孩子要怎样获得正能量",
      //     videoUrl: "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4"
      //    }, {
      //      videoName: "孩子成长中的动力和阻力",
      //      videoUrl: "http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400"
      //   }
    ],
    //当前播放的视频索引
    IsHidden: true,
    state: true,
    first_click: false,

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady(res) {
    this.videoContext = wx.createVideoContext('myVideo');
  },
  inputValue: '',
  bindInputBlur(e) {
    this.inputValue = e.detail.value
  },
  /*
  / 选择视频
  */
  choosevideo: function(e) {
    //获取点击的索引
    var index = e.currentTarget.dataset.index;
    var videoInformation = this.data.videoInformation;
    videoInformation.thisindex = index;
    this.setData({
      'videoInformation': videoInformation
    });
    this.videoContext.play();
  },

  /**
   * 下拉按钮
   */
  toggle: function() {
    var list_state = this.data.state,
      first_state = this.data.first_click;
    if (!first_state) {
      this.setData({
        first_click: true
      });
    }
    if (list_state) {
      this.setData({
        state: false,
        rows:0
      });
    } else {
      this.setData({
        state: true,
        rows: 5000
      });
    }
  },
  //获取节的信息
  getChapterInfo: function(videoId) {
    var that = this;
    var videoNowEpisodes = "videoInformation.nowEpisodes";
    var videoAllEpisodes = "videoInformation.allEpisodes";

    var video = [];
    var fileId = [];
    wx.request({
      url: app.globalData.url + '/api/course/getCourseInfo?sid=' + app.globalData.sid + "&id=" + videoId,
      method: "POST",
      header: {
        'X-Requested-With': 'APP'
      },
      success: function(res) {
        console.log(res);

        var courseVO = res.data.data.courseVO;
        that.setData({
          [videoNowEpisodes]: courseVO.nowNum,
          [videoAllEpisodes]: courseVO.totalNum
        });
        for (var i = 0; i < courseVO.hcFSectionInfoList.length; i++) {
          var videochapter = {
            videoName: "",
            videoUrl: "",
            videoTime: "加载中..."
          };
          var hcFSectionInfo = courseVO.hcFSectionInfoList[i];

          videochapter.videoName = hcFSectionInfo.chapterName;
          that.getFilePath(hcFSectionInfo.fileAddr, i);
          fileId.push(hcFSectionInfo.fileAddr);
          video.push(videochapter);
        }
        that.setData({
          video: video,
          fileId: fileId,
        });
      }


    });
  },
  getVideoTime: function(src, i) {
    var that = this;
    var videoTime = "video" + "[" + i + "]" + ".videoTime";
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

        that.setData({
          [videoTime]: time
        })
      }, 1000)  //这里设置延时1秒获取
    })
  },
  toTime: function(s) {
    var day = Math.floor(s / (24 * 3600)); // Math.floor()向下取整 
    var hour = Math.floor((s - day * 24 * 3600) / 3600);
    var minute = Math.floor((s - day * 24 * 3600 - hour * 3600) / 60);
    var second = Math.floor(s - day * 24 * 3600 - hour * 3600 - minute * 60);
    var time = '00:00';
    if (hour > 0 && minute < 10) {
      time = hour + ":0" + minute + ":" + second;
    } else if(hour > 0 && minute > 10){
      time = hour + ":" + minute + ":" + second;
    } else if(hour <=0 && minute <10){
      time = "0" + minute + ":" + second;
    } else if (hour <= 0 && minute > 10){
      time = minute + ":" + second;
    } else if (hour <= 0 && minute <= 0){
      time = "00:" + second;
    } 
    return time;
  },


  //获取文件的拓展名
  // getFilePath: function (fileId, index) {
  //   var that = this;
  //   var fileName;
  //   var videoUrl = "video" + "[" + index + "]" + ".videoUrl";
  //   wx.request({
  //     url: app.globalData.url + '/api/common/file/get?sid=' + app.globalData.sid + "&id=" + fileId,
  //     method: 'GET',
  //     success: function (res) {
  //       console.log(res);
  //       var fileLoadArray = res.data.data.storageId.split("/");
  //       fileName = fileLoadArray[fileLoadArray.length - 1];
  //       console.log(fileName);
  //       that.setData({
  //         [videoUrl]: app.globalData.url + '/upload/' + fileName
  //       })


  //     }
  //   })
  //   return fileName;
  // },
  //获取文件路径
  getFilePath: function(fileId, index) {
    var that = this;
    var myArray = new Array();
    var i = index;
    var videoUrl = "video" + "[" + index + "]" + ".videoUrl";
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



  onLoad: function(options) {
    var that = this;

    var videoDetail = JSON.parse(decodeURIComponent(options.videoDetail));
    that.getChapterInfo(videoDetail.id);
    var videoName = "videoInformation.name";
    var videoDesption = "videoInformation.desption";
    var videoSales = "videoInformation.sales";
    that.setData({
      [videoName]: videoDetail.productTitle,
      [videoDesption]: videoDetail.courseIntroduce,
      [videoSales]: videoDetail.productStock
    });


    that.getSecondClassifyName(videoDetail);
    console.log('that');
    console.log(that);
  },

  //获取二级分类名称
  getSecondClassifyName: function(videoDetail) {
    var that = this;
    var videoCategory = "videoInformation.category";
    wx.request({
      url: app.globalData.url + '/api/product/getSecondClassifyFromProductId?sid=' + app.globalData.sid + "&productId=" + videoDetail.id,
      method: 'POST',
      header: {
        'X-Requested-With': 'APP'
      },
      success: function(res) {
        console.log(res);
        that.setData({
          [videoCategory]: res.data.data.hcProductSecondClassifyList[0].secondClassName
        })
      }
    })
  },




})