var app = getApp();
Page({
  data: {
    info: "",
    audioInformation: {
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
    isPlayAudio: false,
    // 音频跳转
    audioSeek: 0,
    //持续时间
    audioDuration: 0,
    showTime1: '00:00',
    showTime2: '00:00',
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
    // 学习时间
    learnTime: [],
    // 学习情况
    learnDataList: [],
    //前一个播放视频的index值
    beforeIndex: 0,
    // 视频实时时间
    currentTime:0,
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

  /**获取当前视频进度 */
  funtimeupdate: function (u) {
    console.log("获取当前视频进度");
    var currentTime = this.data.currentTime;
    currentTime = u.detail.currentTime;
    this.setData({
      "currentTime": currentTime,
    });
  },

  /*
  / 选择视频
  */
  choosevideo: function(e) {
    //获取点击的索引
    var index = e.currentTarget.dataset.index;
    var videoInformation = this.data.videoInformation;
    beforeIndex = audioInformation.thisindex;
    console.log("前一个正在播放的index值");
    videoInformation.thisindex = index;
    var beforeIndex = this.data.beforeIndex;
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
        rows: 0
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
      url: app.globalData.url + '/api/course/getCourseInfo?sid=' + app.globalData.sid + "&productId=" + videoId,
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
            //videoTime: "加载中..."
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
        console.log("获取文件路径")
        console.log(res);
        var index = res.data.data.storageId.indexOf("upload");
        // var filePath = 'https://www.xfxy.awcp.org.cn/api/common/file/upload?id=692073d505ac874d420f3fefe1ed0f7d';
        var filePath = app.globalData.url + "/" + res.data.data.storageId.substring(index);
        console.log('filePath')
        console.log(filePath)
        //that.getVideoTime(filePath, i);
        that.setData({
          [videoUrl]: filePath
        })
        var fileName = res.data.data.fileName.split(".")[0];
        myArray[0] = filePath;
        myArray[1] = fileName;
        return myArray;
      }
    })
  },


  setTime: function(options) {
    console.log(JSON.parse(options.time))
    this.setData({
      time: JSON.parse(options.time)
    })
  },


  onLoad: function(options) {
    var that = this;
    this.setTime(options)
    var videoDetail = JSON.parse(decodeURIComponent(options.videoDetail));
    that.getChapterInfo(videoDetail.id);
    // 获取用户学习情况
    that.getLearnSituate(videoDetail.id);
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


  /**根据用户id和商品id查询课程学习情况 */
  getLearnSituate: function (productId) {

    var that = this;
    var learnTime = this.data.learnTime;
    var learnDataList = this.data.learnDataList;

    wx.request({
      url: app.globalData.url + '/api/course/getLearnSituate?userId=' + app.globalData.uid + '&sid=' + app.globalData.sid + "&productId=" + productId,
      method: 'POST',
      header: {
        'X-Requested-With': 'APP'
      },
      success: function (res) {

        learnDataList = res.data.data.hcFLearnSituateList;


        for (var i = 0; i < learnDataList.length; i++) {
          if (learnDataList.length == 0) {
            learnDataList[i] = '00:00'
          } else {
            learnTime[i] = learnDataList[i].courseSchedule
            if ((learnTime[i] / 60) < 10) {
              if ((learnTime[i] % 60 < 10)) {
                learnTime[i] = "0" + Math.floor(learnTime[i] / 60) + ":" + "0" + (learnTime[i] % 60)
              } else {
                learnTime[i] = "0" + Math.floor(learnTime[i] / 60) + ":" + (learnTime[i] % 60)
              }
            } else {
              if ((learnTime[i] % 60 < 10)) {
                learnTime[i] = "0" + Math.floor(learnTime[i] / 60) + ":" + "0" + (learnTime[i] % 60)
              } else {
                learnTime[i] = "0" + Math.floor(learnTime[i] / 60) + ":" + (learnTime[i] % 60)
              }
            }

          }
        }
        that.setData({
          'learnTime': learnTime,
          'learnDataList': learnDataList
        })
      }
    })
  },

  /**根据虚拟商品更新保存学习信息 */
  saveOrUpdateLearnSituate: function (productId) {
    var that = this;
    // 商品的id
    var productId = productId;
    // 用户的id 
    var uid = app.globalData.uid;
    // 用户之前的学习时间
    var learnTime = this.data.learnTime;
    // 用户当前学习节索引
    var beforeIndex = this.data.beforeIndex;
    //学习情况表中的id
    var learnSituateId = "";
    // 视频停止时间
    var duration = this.data.currentTime;
    // 学习情况列表
    var hcFLearnSituateList = this.data.learnDataList;
    // 节的列表
    var audiolist = this.data.audiolist;
    var courseChapterId = audiolist[beforeIndex].id;

    if (learnTime[beforeIndex] != 0) {
      learnSituateId = hcFLearnSituateList[beforeIndex].id
    } else {
      learnSituateId = "";
    }

    var formdata = {
      learnSituateId: learnSituateId,
      productId: productId,
      courseChapterId: courseChapterId,
      userId: app.globalData.uid,
      courseSchedule: duration
    }
    wx.request({
      url: app.globalData.url + '/api/course/saveOrUpdateLearnSituate?sid=' + app.globalData.sid,
      method: "POST",
      header: {
        'X-Requested-With': 'APP',
      },
      data: JSON.stringify(formdata),
      success: function (data) {
        console.log("保存成功");
      }
    })
  },



})

