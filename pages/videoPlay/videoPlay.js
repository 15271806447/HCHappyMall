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

  onShow: function () {
    this.Initialization();
  },

  // TODO 切换章节 调整数据
  //初始化播放器，获取duration
  Initialization() {
    var t = this;
    //当前点击的视频播放的index
    var index = this.data.audioInformation.thisindex;
    if (this.data.audiolist[index].audiosrc.length != 0) {
      //设置src
      innerAudioContext.src = t.data.audiolist[index].audiosrc;
      //运行一次
      innerAudioContext.play();
      innerAudioContext.pause();
      innerAudioContext.onCanplay(() => {
        //初始化duration
        innerAudioContext.duration
        setTimeout(function () {
          //延时获取音频真正的duration(总时长)
          var duration = innerAudioContext.duration;
          // 分钟
          var min = parseInt(duration / 60);
          // 秒
          var sec = parseInt(duration % 60);
          if (min.toString().length == 1) {
            // 正则
            min = `0${min}`;
          }
          if (sec.toString().length == 1) {
            sec = `0${sec}`;
          }
          t.setData({
            audioDuration: innerAudioContext.duration,
            showTime2: `${min}:${sec}`
          });
        }, 1000)
      })
    }
    //重置时间,把isPlayAudio改成false
    this.setData({
      audioSeek: 0,
      audioTime: 0,
      isPlayAudio: false,
      showTime1: '00:00',
      isPlayAudio: false
    });
  },

  /*video
   / 点击列表视频切换数据
   */
  choosevideo: function (e) {
    this.duration
    var that = this;
    var index = e.currentTarget.dataset.index;
    var audioInformation = this.data.audioInformation;
    var beforeIndex = this.data.beforeIndex;
    // 前一个正在播放的index值
    beforeIndex = audioInformation.thisindex;
    console.log("前一个正在播放的index值");
    console.log(beforeIndex)
    audioInformation.thisindex = index;

    var audioDetail = this.data.audioDetail;
    that.saveOrUpdateLearnSituate(audioDetail);

    this.setData({
      'audioInformation': audioInformation
    });
    this.Initialization();
    this.videoContext.play();
  },



  // /*
  // / 选择视频
  // */
  // choosevideo: function(e) {
  //   //获取点击的索引
  //   var index = e.currentTarget.dataset.index;
  //   var videoInformation = this.data.videoInformation;
  //   videoInformation.thisindex = index;
  //   this.setData({
  //     'videoInformation': videoInformation
  //   });
  //   this.videoContext.play();
  // },

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