//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    sourceType: ['在线充值', '订单消费', '订单返回消费', '提取现金', '获得佣金'], //充值类型
    // 顶部菜单切换
    navbar: ['全部', '收入', "支出"],
    // 默认选中菜单
    currentTab: 0,
    //全部账单信息
    hcWalletTransactionRecordList: [{}, ],
    //收入账单信息
    hcIncomeBillList: [{}, ],
    //支出账单信息
    hcBillOfExpenditureList: [{}, ],
    iShcWalletTransactionRecordList: "false", //是否有全部明细
    iShcIncomeBillList: "false", //是否有收入账单明细，
    iShcBillOfExpenditureList: "false", //是否有支出账单明细
  },
  //顶部tab切换
  navbarTap: function(e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    });
    var options = {
      state: JSON.stringify(e.currentTarget.dataset.idx)
    }
    this.onLoad(options);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //获得账户明细
    this.accountDetails();
  },
  //账单类型转换
  typeConversion: function(data, hc) {
    for (var i = 0; i < data.length; i++) {
      //类型
      var hcSourceType = data[i].sourceType;
      //收入或支出
      var hcType = data[i].type;
      var hcSourceType = this.data.sourceType[hcSourceType - 1]
      var hcType = this.data.navbar[type]
      var sourceType = hc + "[" + i + "].sourceType";
      var type = hc + "[" + i + "].type";
      this.setData({
        [sourceType]: hcSourceType,
        [type]: hcType,
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  //获得账户明细
  accountDetails: function() {
    var that = this;
    wx.request({
      url: app.globalData.url + '/api/wallet/getWalletRecord?sid=' + app.globalData.sid + '&userId=' + app.globalData.uid,
      method: "POST",
      header: {
        'X-Requested-With': 'APP'
      },
      success: function(res) {
        //全部账单类型转换
        if (that.data.hcWalletTransactionRecordList != null && that.data.hcWalletTransactionRecordList != '') {
          var hcWalletTransactionRecordList = res.data.data.hcWalletTransactionRecordList;
          that.setData({
            'hcWalletTransactionRecordList': hcWalletTransactionRecordList
          })
          that.setData({
            iShcWalletTransactionRecordList: 'true'
          })
          var data = res.data.data.hcWalletTransactionRecordList;
          for (var i = 0; i < data.length; i++) {
            var datas = data[i]
            if (data[i].type == '1') {
              var hcIncomeBillList = "hcIncomeBillList[" + i + "]";
              that.setData({
                [hcIncomeBillList]: datas
              })
              that.setData({
                iShcIncomeBillList: 'true'
              })
            }
            if (data[i].type == '2') {
              var hcBillOfExpenditureList = "hcBillOfExpenditureList[" + i + "]";
              that.setData({
                [hcBillOfExpenditureList]: datas
              })
              that.setData({
                iShcBillOfExpenditureList: 'true'
              })
            }
          }
          if (that.data.hcWalletTransactionRecordList != null && that.data.hcWalletTransactionRecordList != '') {
            console.log("全部明细：", that.data.hcWalletTransactionRecordList)
            console.log(that.data.iShcWalletTransactionRecordList)
            that.typeConversion(that.data.hcWalletTransactionRecordList, 'hcWalletTransactionRecordList');
          }
          if (that.data.hcIncomeBillList != null && that.data.hcIncomeBillList != '') {
            console.log("收入明细：", that.data.hcIncomeBillList)
            console.log(that.data.iShcIncomeBillList)
            //收入账单类型转换
            that.typeConversion(that.data.hcIncomeBillList, 'hcIncomeBillList');
          }
          if (that.data.hcBillOfExpenditureList != null && that.data.hcBillOfExpenditureList != '') {
            console.log("支出明细：", that.data.hcBillOfExpenditureList)
            console.log(that.data.iShcBillOfExpenditureList)
            //支出账单类型转换
            that.typeConversion(that.data.hcBillOfExpenditureList, 'hcBillOfExpenditureList');
          }
        }
      }
    })
  },
})