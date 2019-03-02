const app = getApp()
const innerAudioContext = wx.createInnerAudioContext();
Page({
  data: {
    audioInformation: {
      name: "",
      //当前播放的视频索引
      thisindex: 0,
      coverimg: "",
      desption: "",
      // 评分
      sales: 0.0,
      category: "",
      // 当前更新集数
      nowEpisodes: "",
      // 全部更新集数
      allEpisodes: ""
    },
    IsHidden: true,
    state: true,
    first_click: false,
    //音频封面图
    audiolist: [
      {
        audiosrc: '',
        audioName: "",
        audioTime:0,
        id:""
      },
       {
        audiosrc: '',
        audioName: "",
        audioTime: 0,
         id: ""
      },
        {
        audiosrc: '',
        audioName: "",
        audioTime: 0,
        id: ""
      },
    ],
    isPlayAudio: false,
    // 音频跳转
    audioSeek: 0,
    //持续时间
    audioDuration: 0,
    showTime1: '00:00',
    showTime2: '00:00',
    imageUrl: app.globalData.imageUrl,
    //audioTime: 0
    // 学习时间
    learnTime:[],
    // 学习情况
    learnDataList:[],
    //记录传参
    audioDetail:"",
    //前一个播放视频的index值
    beforeIndex:0,
  },
  onReady(res) {

  },
  onShow: function() {
    this.Initialization();
    this.loadaudio();
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
        setTimeout(function() {
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
  /**
   * 拖动进度条事件
   */
  sliderChange(e) {
    var that = this;
    var index = this.data.audioInformation.thisindex;
    innerAudioContext.src = this.data.audiolist[index].audiosrc;
    //获取进度条百分比
    var value = e.detail.value;
    //更新进度条进度
    this.setData({
      audioTime: value
    });
    var duration = this.data.audioDuration;
    //根据进度条百分比及歌曲总时间，计算拖动位置的时间
    value = parseInt(value * duration / 100);
    //更改状态
    this.setData({
      audioSeek: value,
      isPlayAudio: true
    });
    //调用seek方法跳转歌曲时间
    innerAudioContext.seek(value);
    // 
    innerAudioContext.play();
  },


  /**
   * 播放、暂停按钮
   */
  playAudio() {
    var index = this.data.audioInformation.thisindex;
    var beforeIndex = this.data.beforeIndex;
    //获取播放状态和当前播放时间
    var isPlayAudio = this.data.isPlayAudio;
    var seek = this.data.audioSeek;
    innerAudioContext.pause();
    //更改播放状态
    this.setData({
      isPlayAudio: !isPlayAudio
    })
    if (isPlayAudio) {
      //如果在播放则记录播放的时间seek，暂停
      this.setData({
        audioSeek: innerAudioContext.currentTime
      });
    } else {
      //如果在暂停，获取播放时间并继续播放
      innerAudioContext.src = this.data.audiolist[beforeIndex].audiosrc;
      if (innerAudioContext.duration != 0) {
        this.setData({
          audioDuration: innerAudioContext.duration
        });
      }
      //跳转到指定时间播放
      innerAudioContext.seek(seek);
      innerAudioContext.play();
    }
  },

  /**
   * 计时器每秒更新进度条进度
   */
  loadaudio() {
    var that = this;
    //设置一个计步器
    this.data.durationIntval = setInterval(function() {
      //当歌曲在播放时执行
      if (that.data.isPlayAudio == true) {
        //获取歌曲的播放时间，进度百分比
        var seek = that.data.audioSeek;
        var duration = innerAudioContext.duration;
        var time = that.data.audioTime;
        time = parseInt(100 * seek / duration);
        //当歌曲在播放时，每隔一秒歌曲播放时间+1，并计算分钟数与秒数
        var min = parseInt((seek + 1) / 60);
        var sec = parseInt((seek + 1) % 60);
        //填充字符串，使3:1这种呈现出 03：01 的样式
        if (min.toString().length == 1) {
          min = `0${min}`;
        }
        if (sec.toString().length == 1) {
          sec = `0${sec}`;
        }
        var min1 = parseInt(duration / 60);
        var sec1 = parseInt(duration % 60);
        if (min1.toString().length == 1) {
          min1 = `0${min1}`;
        }
        if (sec1.toString().length == 1) {
          sec1 = `0${sec1}`;
        }
        //当进度条完成，停止播放，并重设播放时间和进度条
        if (time >= 100) {
          innerAudioContext.stop();
          that.setData({
            audioSeek: 0,
            audioTime: 0,
            audioDuration: duration,
            isPlayAudio: false,
            showTime1: `00:00`
          });
          return false;
        }
        //正常播放，更改进度信息，更改播放时间信息
        that.setData({
          audioSeek: seek + 1,
          audioTime: time,
          audioDuration: duration,
          showTime1: `${min}:${sec}`,
          showTime2: `${min1}:${sec1}`
        });
      }
    }, 1000);
  },
  onUnload: function() {
    //卸载页面，清除计步器
    clearInterval(this.data.durationIntval);
    innerAudioContext.stop();
  },

  /*video
  / 点击列表视频切换数据
  */
  choosevideo: function(e) {
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
        state: false
      });
    } else {
      this.setData({
        state: true
      });
    }
  },

  //获取节的信息
  getChapterInfo: function(audioId) {
    var that = this;
    var audioNowEpisodes = "audioInformation.nowEpisodes";
    var audioAllEpisodes = "audioInformation.allEpisodes";
    var audio = [];
    var fileId = [];
    wx.request({
      url: app.globalData.url + '/api/course/getCourseInfo?sid=' + app.globalData.sid + "&productId=" + audioId,
      method: "POST",
      header: {
        'X-Requested-With': 'APP'
      },
      success: function(res) {
        
        var courseVO = res.data.data.courseVO;
        console.log("节的信息")
        console.log(res);
        that.setData({

          [audioNowEpisodes]: courseVO.nowNum,
          [audioAllEpisodes]: courseVO.totalNum
        });

        for (var i = 0; i < courseVO.hcFSectionInfoList.length; i++) {
          var audiochapter = {
            audioName: "",
            audiosrc: "",
            //audioTime: '加载中...',
          };
          var hcFSectionInfo = courseVO.hcFSectionInfoList[i];

          audiochapter.audioName = hcFSectionInfo.chapterName;
          audiochapter.audiosrc = that.getAudioPath(hcFSectionInfo.fileAddr);
          audiochapter.id = hcFSectionInfo.id;

          fileId.push(hcFSectionInfo.fileAddr);
          audio.push(audiochapter);
        }
        that.setData({
          audiolist: audio,
          fileId: fileId,
        });
      }


    });
  },
  
  getAudioPath:function(id){
    return app.globalData.url + '/common/file/showPicture.do?id=' + id;
  },

  setTime: function (options) {
    console.log("传参options为")
    console.log(options);
    this.setData({
      time: JSON.parse(options.time),
      thisindex: JSON.parse(options.index)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    var that = this;
    this.setTime(e);

    var audioDetail = JSON.parse(decodeURIComponent(e.audioDetail));
    this.data.audioDetail = audioDetail

    that.getChapterInfo(audioDetail.id);
    that.getLearnSituate(audioDetail);

    var audioName = "audioInformation.name";
    var audioDesption = "audioInformation.desption";
    var audioSales = "audioInformation.sales";
    var audioCoverimg = "audioInformation.coverimg";
    that.setData({
      [audioName]: audioDetail.productTitle,
      [audioDesption]: audioDetail.courseIntroduce,
      [audioSales]: audioDetail.productStock,
      [audioCoverimg]: audioDetail.coverPath
    })


    that.getSecondClassifyName(audioDetail);    
  },


  getSecondClassifyName: function(audioDetail) {
    var that = this;
    var audioCategory = "audioInformation.category";
    wx.request({
      url: app.globalData.url + '/api/product/getSecondClassifyFromProductId?sid=' + app.globalData.sid + "&productId=" + audioDetail.id,
      method: 'POST',
      header: {
        'X-Requested-With': 'APP'
      },
      success: function(res) {
        console.log(res);
        that.setData({
          [audioCategory]: res.data.data.hcProductSecondClassifyList[0].secondClassName
        })
      }
    })
  },

/**根据用户id和商品id查询课程学习情况 */
  getLearnSituate: function (audioDetail){

    var that = this;
    var productId = audioDetail.id;
    var learnTime = this.data.learnTime;
    var learnDataList = this.data.learnDataList;

    wx.request({
      url: app.globalData.url + '/api/course/getLearnSituate?userId=' + app.globalData.uid + '&sid=' + app.globalData.sid+"&productId=" + productId,
      method: 'POST',
      header: {
        'X-Requested-With': 'APP'
      },
      success: function (res) {
   
         learnDataList = res.data.data.hcFLearnSituateList;
      

        for (var i = 0; i < learnDataList.length; i++) {
          if (learnDataList.length == 0){
                       learnDataList[i] = '00:00'
              }else{
                        learnTime[i] = learnDataList[i].courseSchedule
            if ((learnTime[i] / 60) < 10){
              if ((learnTime[i] % 60 < 10)){
                        learnTime[i] = "0" + Math.floor(learnTime[i] / 60) + ":" + "0" + (learnTime[i] % 60)
                  }else{
                        learnTime[i] ="0" + Math.floor(learnTime[i] / 60) + ":" + (learnTime[i] % 60)
                  }
            }else{
                  if ((learnTime[i] % 60 < 10)) {
                    learnTime[i] ="0" + Math.floor(learnTime[i] / 60) + ":" + "0" + (learnTime[i] % 60)
                  } else {
                    learnTime[i] ="0" + Math.floor(learnTime[i] / 60) + ":" + (learnTime[i] % 60)
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
 // 首先根据判断用户有没有每一节的学习信息，如果没有，添加不需要learnSituateId,这个时候需要当前播放的节的id，如果有可以直接更新，这个时候需要获取之前的学习情况id.
  saveOrUpdateLearnSituate: function (audioDetail,res) {
    var that = this;
    var productId = audioDetail.id;
    var hcFLearnSituateList = this.data.learnDataList;
    var uid = app.globalData.uid;
    var learnTime = this.data.learnTime;
    var beforeIndex = this.data.beforeIndex;
    var learnSituateId ="";
    var audiolist = this.data.audiolist;
    var courseChapterId = audiolist[beforeIndex].id;
    // 视频停止时间
    var duration = this.data.audioSeek;

      console.log(hcFLearnSituateList);


    if (hcFLearnSituateList.length != 0){
      for (var i = 0; i < hcFLearnSituateList; i++) {
        // 如果当前节的播放时间不为0  需要id
        if (hcFLearnSituateList[i].courseChapterId == courseChapterId && hcFLearnSituateList[i].courseSchedule != 0) {
          learnSituateId = hcFLearnSituateList[i].id;
        } else {
          learnSituateId = "6da2fff6-43ee-4931-b1b1-878dfb70496d";
        }
      }
    }
    console.log("学习情况id");
    console.log(learnSituateId);
    var formdata ={
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
        console.log("保存成功！");
      }
    })
  },
})
