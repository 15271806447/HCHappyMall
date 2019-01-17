const app = getApp()
const innerAudioContext = wx.createInnerAudioContext();
Page({
  data: {
    audioInformation:{
      name: "寂静之声-亲子教育",
      //当前播放的视频索引
      thisindex: 1,
      coverimg: "https://goss.veer.com/creative/vcg/veer/800water/veer-146156021.jpg", 
      desption: "正面管教是目前全球领先的教育方法，源自美国，由简尼尔森博士等教育专家历经30多年实践发展与完善，让数以千万计的家长学会了“不骄纵不惩罚”“和善与坚定”并行的育儿方法。",
      // 评分
      sales: 7.4,
      category: "家庭",
      // 当前更新集数
      nowEpisodes: "10",
      // 全部更新集数
      allEpisodes: "40"
    },
    IsHidden: true,
    state: true,
    first_click: false,
    //音频封面图
    audiolist: [{
        audiosrc: 'http://47.107.183.112/audio/Sugar.mp3',
        audioName: "面对孩子的问题父母怎么处理"
      },
      {
        audiosrc: 'http://47.107.183.112/audio/seeyouagain.mp3',
        audioName: "梦想的界定"
      },
      {
        audiosrc: 'http://47.107.183.112/audio/test.mp3',
        audioName: "孩子要怎样获得正能量"
      },
      {
        audiosrc: 'http://47.107.183.112/audio/GuitarSound.mp3',
        audioName: "孩子成长中的动力和阻力"
      }
    ],
    isPlayAudio: false,
    // 音频跳转
    audioSeek: 0,
    //持续时间
    audioDuration: 0,
    showTime1: '00:00',
    showTime2: '00:00',
    audioTime: 0
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
    var index = this.data.audioInformation.thisindex;
    if (this.data.audiolist[index].audiosrc.length != 0) {
      //设置src
      innerAudioContext.src = this.data.audiolist[index].audiosrc;
      console.log('index:' + index);
      console.log(this.data.audiolist[index].audiosrc);
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
    console.log(e.detail.value);
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
    //播放歌曲
    innerAudioContext.play();
  },
  /**
   * 播放、暂停按钮
   */
  playAudio() {
    var index = this.data.audioInformation.thisindex;
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
      innerAudioContext.src = this.data.audiolist[index].audiosrc;
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
  },

  /*video
  / 选择视频
  */
  choosevideo: function(e) {
    //获取点击的索引
    var index = e.currentTarget.dataset.index;
    var audioInformation = this.data.audioInformation;
    audioInformation.thisindex = index;
    this.setData({
      'audioInformation': audioInformation
    });
    this.Initialization();
  },
  /**
   * 下拉按钮
   */
  toggle: function () {
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
  getChapterInfo: function (audioId) {
    var that = this;
    var audioNowEpisodes = "audioInformation.nowEpisodes";
    var audioAllEpisodes = "audioInformation.allEpisodes";
    var audio = [];
    var fileId = [];
    wx.request({
      url: app.globalData.url + '/api/course/getCourseInfo?sid=' + app.globalData.sid + "&id=" + audioId,
      method: "POST",
      header: {
        'X-Requested-With': 'APP'
      },
      success: function (res) {
        console.log(res);
        that.setData({

          [audioNowEpisodes]: res.data.data.courseVO.nowNum,
          [audioAllEpisodes]: res.data.data.courseVO.totalNum
        });
        for (var i = 0; i < res.data.data.courseVO.hcFSectionInfoList.length; i++) {
          var audiochapter = { audioName: "", audiosrc: "" };
          audiochapter.audioName = res.data.data.courseVO.hcFSectionInfoList[i].chapterName;
          that.getFilePath(res.data.data.courseVO.hcFSectionInfoList[i].fileAddr, i);
          // videochapter.videoUrl = app.globalData.url + '/upload/' + that.getFileName(res.data.data.courseVO.hcFSectionInfoList[i].fileAddr);
          // videochapter.videoUrl = app.globalData.url + '/upload/' + res.data.data.courseVO.hcFSectionInfoList[i].fileAddr + '.mp4';
          fileId.push(res.data.data.courseVO.hcFSectionInfoList[i].fileAddr);
          audio.push(audiochapter);
        }
        that.setData({
          audiolist: audio,
          fileId: fileId,
        });
      }


    });
  },

  //获取文件路径
  getFilePath: function (fileId, index) {
    var that = this;
    var myArray = new Array();
    var audiosrc = "audiolist" + "[" + index + "]" + ".audiosrc";
    wx.request({
      url: app.globalData.url + '/api/common/file/get?id=' + fileId,
      method: 'GET',
      success: function (res) {
        console.log(res);
        var index = res.data.data.storageId.indexOf("upload");
        var filePath = app.globalData.url + "/" + res.data.data.storageId.substring(index);
        console.log(filePath);
        that.setData({
          [audiosrc]: filePath
        })
        var fileName = res.data.data.fileName.split(".")[0];
        console.log(fileName);
        myArray[0] = filePath;
        myArray[1] = fileName;
        return myArray;
      }
    })
  },

  onLoad:function(e){
    var that = this;
    var audioDetail = JSON.parse(e.audioDetail);
    that.getChapterInfo(audioDetail.id);
    var audioName = "audioInformation.name";
    var audioDesption = "audioInformation.desption";
    var audioSales = "audioInformation.sales";

    that.setData({
      [audioName]: audioDetail.productTitle,
      [audioDesption]: audioDetail.courseIntroduce,
      [audioSales]: audioDetail.productStock
    })

   
    that.getSecondClassifyName(audioDetail);
  },


  getSecondClassifyName: function (audioDetail) {
    var that = this;
    var audioCategory = "audioInformation.category";
    wx.request({
      url: app.globalData.url + '/api/product/getSecondClassifyFromProductId?sid=' + app.globalData.sid + "&productId=" + audioDetail.id,
      method: 'POST',
      header: {
        'X-Requested-With': 'APP'
      },
      success: function (res) {
        console.log(res);
        that.setData({
          [audioCategory]: res.data.data.hcProductSecondClassifyList[0].secondClassName
        })
      }
    })
  },

})