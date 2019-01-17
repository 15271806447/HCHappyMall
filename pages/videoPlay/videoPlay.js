
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
  //获取节的信息
  getChapterInfo: function (videoId) {
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
      success: function (res) {
        console.log(res);
        that.setData({
           
          [videoNowEpisodes]: res.data.data.courseVO.nowNum,
          [videoAllEpisodes]: res.data.data.courseVO.totalNum
        });
        for (var i = 0; i < res.data.data.courseVO.hcFSectionInfoList.length; i++) {
          var videochapter = { videoName: "", videoUrl: "" };
          videochapter.videoName = res.data.data.courseVO.hcFSectionInfoList[i].chapterName;
         that.getFilePath(res.data.data.courseVO.hcFSectionInfoList[i].fileAddr,i);
          // videochapter.videoUrl = app.globalData.url + '/upload/' + that.getFileName(res.data.data.courseVO.hcFSectionInfoList[i].fileAddr);
          // videochapter.videoUrl = app.globalData.url + '/upload/' + res.data.data.courseVO.hcFSectionInfoList[i].fileAddr + '.mp4';
          // videochapter.videoUrl = app.globalData.url + "/common/file/showPicture.do?id=" + res.data.data.courseVO.hcFSectionInfoList[i].fileAddr;
          // videochapter.videoUrl = that.getFilePath(res.data.data.courseVO.hcFSectionInfoList[i].fileAddr, i)[0];
          fileId.push(res.data.data.courseVO.hcFSectionInfoList[i].fileAddr);
          video.push(videochapter);
        }
        that.setData({
          video: video,
          fileId: fileId,
        });
      }

      
    });
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
  getFilePath: function (fileId,index) {
    var that = this;
    var myArray = new Array();
    var videoUrl = "video"+"["+index+"]"+".videoUrl";
    wx.request({
      url: app.globalData.url + '/api/common/file/get?id=' + fileId,
      method: 'GET',
      success: function (res) {
        console.log(res);
        var index = res.data.data.storageId.indexOf("upload");
        var filePath = app.globalData.url + "/" + res.data.data.storageId.substring(index);
        console.log(filePath);
        that.setData({
          [videoUrl]:filePath
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
    
    console.log(e);
    var that = this;
    
    var videoDetail = JSON.parse(e.videoDetail);
    that.getChapterInfo(videoDetail.id);
    var videoName = "videoInformation.name";
    var videoDesption = "videoInformation.desption";
    var videoSales = "videoInformation.sales";
    that.setData({
      [videoName]: videoDetail.productTitle,
      [videoDesption]: videoDetail.courseIntroduce,
      [videoSales] : videoDetail.productStock
    });


    that.getSecondClassifyName(videoDetail);

  },
   
//获取二级分类名称
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




})

