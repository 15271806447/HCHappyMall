
var app = getApp();
Page({
  data: {
    info:"",
    videoInformation:{
      name: "寂静之声-亲子教育",
      thisindex: 0,
      desption: "正面管教是目前全球领先的教育方法，源自美国，由简尼尔森博士等教育专家历经30多年实践发展与完善，让数以千万计的家长学会了“不骄纵不惩罚”“和善与坚定”并行的育儿方法。",
      // 评分
      sales: 7.4,
      category: "家庭",
      // 当前更新集数
      nowEpisodes: "10",
      // 全部更新集数
      allEpisodes: "40"
    },
    
    video: [{
         videoName: "面对孩子的问题父母怎么处理",
         videoUrl: "http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400"
       }, {
         videoName: "梦想的界定",
         videoUrl: "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4"
       }, {
         videoName: "孩子要怎样获得正能量",
        videoUrl: "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4"
       }, {
         videoName: "孩子成长中的动力和阻力",
         videoUrl: "http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400"
      }
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
  choosevideo:function(e) {
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
  onLoad:function(e){
    console.log(e);
    var that = this;
    var videoDetail = JSON.parse(e.videoDetail);
    var videoName = "videoInformation.name";
    var videoDesption = "videoInformation.desption";
    var videoSales = "videoInformation.sales";
    var videoNowEpisodes = "videoInformation.nowEpisodes";
    var videoAllEpisodes = "videoInformation.allEpisodes";
    
    var video = [];
    that.setData({
      [videoName]: videoDetail.productTitle,
      [videoDesption]: videoDetail.courseIntroduce,
      [videoSales] : videoDetail.productStock
    })

    console.log(videoDetail.id)
    wx.request({
      url: app.globalData.url + '/api/course/getCourseInfo?sid=' + app.globalData.sid + "&id=" + videoDetail.id,
      method: "POST",
      header: {
        'X-Requested-With': 'APP'
      },
      success: function (res) {
        console.log(res);
        that.setData({
          [videoNowEpisodes]: res.data.data.courseVO.nowNum,
          [videoAllEpisodes]: res.data.data.courseVO.totalNum
        })
        for (var i = 0; i < res.data.data.courseVO.hcFSectionInfoList.length;i++){
          var videochapter = { videoName: "", videoUrl: "" };
          videochapter.videoName = res.data.data.courseVO.hcFSectionInfoList[i].chapterName;
          console.log(res.data.data.courseVO.hcFSectionInfoList[i].fileAddr);
          console.log(app.globalData.url + '/common/file/showPicture.do?id=' + res.data.data.courseVO.hcFSectionInfoList[i].fileAddr);
       
          videochapter.videoUrl = app.globalData.url + '/common/file/showPicture.do?id=' + res.data.data.courseVO.hcFSectionInfoList[i].fileAddr;
          //videochapter.videoUrl = "H:\\apache-tomcat-7.0.91\\webapps\\ROOT\\upload\\6dcd368363ccf37a27800ff5eec7ed11.avi";
          video.push(videochapter);
        }
        // var videochapter1 = { videoName: "面对孩子的问题父母怎么处理", videoUrl: "http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400" };
        // video.push(videochapter1);
        // console.log(that.data.video.length);
        that.setData({
          video: video
        })
      }
    });
    that.getSecondClassifyName(videoDetail);
    // console.log(that.data.video.length);
    // wx.request({
    //   url: app.globalData.url + '/api/product/getSecondClassify?sid=' + app.globalData.sid + "&firstClassifyId=" + videoDetail.firstClassifyId,
    //   method: "POST",
    //   header: {
    //     'X-Requested-With': 'APP'
    //   },
    //   success: function (res) {
    //     console.log(res);
    //   }
    // })
  },

  getSecondClassifyName: function (videoDetail){
    var that = this;
    var videoCategory = "videoInformation.category";
    wx.request({
      url: app.globalData.url + '/api/product/getSecondClassifyFromProductId?sid=' + app.globalData.sid + "&productId=" + videoDetail.id,
      method: 'POST',
      header: {
        'X-Requested-With': 'APP'
      },
      success: function (res) {
        console.log(res);
        that.setData({
          [videoCategory]: res.data.data.hcProductSecondClassifyList[0].secondClassName
        })
      }
    })
  },

// getFile:function(e){
//   var that = this;
//   console.log(that.data.video[e.currentTarget.dataset.index].videoUrl);
//   // console.log(app.globalData.url2(that.data.video[e.currentTarget.dataset.index].videoUrl));
//   wx.request({
//     url: app.globalData.url + '/api/common/file/download?sid=' + app.globalData.sid + "&fileId=" + that.data.video[e.currentTarget.dataset.index].videoUrl,
//     method:'GET',
//     success:function(res){
//       console.log(res);
//       console.log("成功");
//       that.setData({
//         info:res.data
//       })
//       // videoInformation.thisindex
//     }
//   })
// }
 


})

