//获取应用实例
const app = getApp()

Page({
  data: {
    memberInformation: {
      memberCartImage: "http://47.107.183.112/img/membercart.jpg"
    },
    memberCategory: [{
      memberCategoryName: "健康专属会员",
      price: "19800",
      memberSign: "",
      ischecked: true,
      program: "方案1：全基因检测1次，19800元 / 人\n建立家庭健康档案管理及全年跟踪服务\n专家检测报告解读服务：1500元 / 人\n肝胆排毒门票2张，费用：2980元 / 张\n全食养智能破壁机1台，价值：3980元 / 台\n参加全年线下美食沙龙活动\n名额2人\n参加线上 / 线下全年专家健康沙龙分享会\n名额2人\n方案二：\n1.60天健康工程调理（健康档案和体检报告，解读）费用：20000元\n2.肝胆排毒门票2张\n费用2980元/张\n3.参加全年线下美食沙龙活动，名额2人\n4.参加全年线上/线下专家健康沙龙分享会，名额2人\n方案三：\n1.商城所有产品享受会员价格\n2.肝胆排毒门票2张，费用2980元/张\n3.参加全年线下美食沙龙活动，名额2人\n4.参加全年线上/线下专家健康沙龙分享会，名额2人\n5.全食养智能破壁机1台，价值：3980元"
    }, {
      memberCategoryName: "教育专属会员",
      price: "19800",
      memberSign: "",
      ischecked: false
    }, {
      memberCategoryName: "农业专属会员",
      price: "19800",
      memberSign: "",
      ischecked: false
    }, {
      memberCategoryName: "旅游专属会员",
      price: "19800",
      memberSign: "",
      ischecked: false
    }],
    thisindex: 0,
    state: false,
    first_click: true
  },
  convertHtmlToText: function(inputText) {
    var returnText = "" + inputText;
    returnText = returnText.replace(/<\/div>/ig, '\r\n');
    returnText = returnText.replace(/<\/li>/ig, '\r\n');
    returnText = returnText.replace(/<li>/ig, ' * ');
    returnText = returnText.replace(/<\/ul>/ig, '\r\n');
    //-- remove BR tags and replace them with line break
    returnText = returnText.replace(/<br\s*[\/]?>/gi, "\r\n");

    //-- remove P and A tags but preserve what's inside of them
    returnText = returnText.replace(/<p.*?>/gi, "\r\n");
    returnText = returnText.replace(/<a.*href="(.*?)".*>(.*?)<\/a>/gi, " $2 ($1)");

    //-- remove all inside SCRIPT and STYLE tags
    returnText = returnText.replace(/<script.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/script>/gi, "");
    returnText = returnText.replace(/<style.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/style>/gi, "");
    //-- remove all else
    returnText = returnText.replace(/<(?:.|\s)*?>/g, "");

    //-- get rid of more than 2 multiple line breaks:
    returnText = returnText.replace(/(?:(?:\r\n|\r|\n)\s*){2,}/gim, "\r\n\r\n");

    //-- get rid of more than 2 spaces:
    returnText = returnText.replace(/ +(?= )/g, '');

    //-- get rid of html-encoded characters:
    returnText = returnText.replace(/ /gi, " ");
    returnText = returnText.replace(/&/gi, "&");
    returnText = returnText.replace(/"/gi, '"');
    returnText = returnText.replace(/</gi, '<');
    returnText = returnText.replace(/>/gi, '>');

    return returnText;
  },
  getMemberType: function() {
    var that = this;
    wx.request({
      url: app.globalData.url + '/api/personalCenter/checkMemberType?sid=' + app.globalData.sid,
      method: "POST",
      header: {
        'X-Requested-With': 'APP'
      },
      success(res) {
        var hcMemberTypeList = res.data.data.hcMemberTypeList;
        var memberCategory = new Array();
        for (var i = 0; i < hcMemberTypeList.length; i++) {
          var bool = false;
          if (i == 0) {
            bool = true;
          } else {
            bool = false;
          }
          var memberType = {
            memberCategoryName: "",
            price: "",
            memberSign: "",
            ischecked: bool,
            program: ""
          };
          memberType.memberCategoryName = hcMemberTypeList[i].memberTypeName;
          memberType.price = hcMemberTypeList[i].memberPrice;
          memberType.memberSign = app.globalData.url + '/common/file/showPicture.do?id=' + hcMemberTypeList[i].memberSign;
          memberType.program = that.convertHtmlToText(hcMemberTypeList[i].memberDescribe);
          memberCategory.push(memberType);
        }
        that.setData({
          memberCategory: memberCategory
        })
      }
    })
  },
  recharge: function(e) {
    var index = e.currentTarget.dataset.indext_num;
    wx: wx.navigateTo({
      url: '../confirm/confirm?type=' + 'member' + '&productInfo=' + encodeURIComponent(JSON.stringify(this.data.memberCategory[index])),
    })
  },
  onLoad: function() {
    this.getMemberType();
  },
  /**
   * 选择会员
   */
  chooseMember: function(e) {
    //获取点击索引
    var index = e.currentTarget.dataset.index;
    var memberCategory = this.data.memberCategory;
    for (var i = 0; i < memberCategory.length; i++) {
      memberCategory[i].ischecked = false;
    }
    memberCategory[index].ischecked = true;
    this.setData({
      'memberCategory': memberCategory,
      'thisindex': index
    })
  },
  more: function() {
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
  }

})