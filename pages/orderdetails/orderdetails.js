var app = getApp();
var pendingOrderList = new Array();
var shippedOrderList = new Array();
var receivedOrderList = new Array();
var successAndRefundOrderList = new Array();
Page({
  data: {
    h: 320,
    inputvalue: "",
    winWidth: 0,
    winHeight: 0,
    // tab切换
    currentTab: 1,
    current: 0,
    page: 0,
    pageSize: 3,
    imgHeader: app.globalData.url + '/common/file/showPicture.do?id=',
    state: false,
    first_click: false
  },
  toggle: function(e) {
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
    let index = e.currentTarget.dataset.index;
    this.setData({
      'thisIndex': index
    })
  },
  complete: function(e) {
    this.setData({
      inputvalue: e.detail.value
    })
  },
  toggle1: function(e) {

    this.setData({
      state: false,
    });

    var local_database = this.data.orderVOList;

    //从退货变成退货中
    local_database[this.data.thisIndex].returngoods = 1;
    //this.load();
    this.setData({
      inputvalue: ""
    })
  },

  check: function(e) {
    var input = e.detail.value; // 获取当前表单元素输入框内容
    if (input) {
      this.setData({
        'inputvalue': input
      })
    } else {

    }
  },
  //获得订单
  getOrders: function(orderState) {
    var that = this;
    wx.request({
      url: app.globalData.url + '/api/order/getOrderByOrderState?sid=' + app.globalData.sid + "&userId=" + app.globalData.uid + "&orderState=" + orderState + "&page=" + 1 + "&size=" + 5,
      method: "POST",
      header: {
        'X-Requested-With': 'APP'
      },
      success: function(res) {
        switch (orderState) {
          case '1':
            //待付款货订单
            for (var i = 0; i < res.data.data.orderVOList.length; i++) {
              if (that.getList(pendingOrderList, res.data.data.orderVOList[i])) {
                pendingOrderList.push(res.data.data.orderVOList[i]);
              }
            }
            that.setData({
              pendingOrderList: pendingOrderList
            })
            break;
          case '2':
            for (var i = 0; i < res.data.data.orderVOList.length; i++) {
              if (that.getList(shippedOrderList, res.data.data.orderVOList[i])) {
                shippedOrderList.push(res.data.data.orderVOList[i]);
              }
            }
            that.setData({
              shippedOrderList: shippedOrderList
            })
            break;
          case '3':
            for (var i = 0; i < res.data.data.orderVOList.length; i++) {
              if (that.getList(receivedOrderList, res.data.data.orderVOList[i])) {
                receivedOrderList.push(res.data.data.orderVOList[i]);
              }
            }
            that.setData({
              receivedOrderList: receivedOrderList
            })
            break;
          case '4':
            for (var i = 0; i < res.data.data.orderVOList.length; i++) {
              if (that.getList(successAndRefundOrderList, res.data.data.orderVOList[i])) {
                successAndRefundOrderList.push(res.data.data.orderVOList[i]);
              }
            }
            break;
          case '5':
            for (var i = 0; i < res.data.data.orderVOList.length; i++) {
              if (that.getList(successAndRefundOrderList, res.data.data.orderVOList[i])) {
                successAndRefundOrderList.push(res.data.data.orderVOList[i]);
              }
            }
            that.setData({
              successAndRefundOrderList: successAndRefundOrderList
            })
            break;
        }

      }
    })
  },
  //判断数组中存在某个元素
  getList: function(list, item) {
    if (list.length != 0) {
      for (var j = 0; j < list.length; j++) {
        if (item.orderNum != list[j].orderNum) {
          return true;
        } else {
          return false;
        }
      }
    } else {
      return true;
    }
  },
  //下拉分页请求
  onPullDownRefresh: function() {
    var page = this.data.page;
    this.data.page += this.data.pageSize;
    this.data.pageSize = (page + 1) * this.data.pageSize;
    var options = {
      state: this.data.currentTab
    };
    this.onLoad(options);
  },
  toOrderdetail: function(event) {
    var orderState = event.currentTarget.dataset.state;
    var orderNum = event.currentTarget.dataset.ordernum;
    var orderData;
    switch (orderState) {
      case 1:
        for (var i = 0; i < pendingOrderList.length; i++) {
          if (pendingOrderList[i].orderNum == orderNum) {
            orderData = pendingOrderList[i];
            break;
          };
        }
        break;
      case 2:
        for (var i = 0; i < shippedOrderList.length; i++) {
          if (shippedOrderList[i].orderNum == orderNum) {
            orderData = shippedOrderList[i];
            break;
          };
        }
        break;
      case 3:
        for (var i = 0; i < receivedOrderList.length; i++) {
          if (receivedOrderList[i].orderNum == orderNum) {
            orderData = receivedOrderList[i];
            break;
          };
        }
        break;
      case 4:
        for (var i = 0; i < successAndRefundOrderList.length; i++) {
          if (successAndRefundOrderList[i].orderNum == orderNum) {
            orderData = successAndRefundOrderList[i];
            break;
          };
        }
        break;
      case 5:
        for (var i = 0; i < successAndRefundOrderList.length; i++) {
          if (successAndRefundOrderList[i].orderNum == orderNum) {
            orderData = successAndRefundOrderList[i];
            break;
          };
        }
        break;
    }
    wx.navigateTo({
      url: '../orderdetail/orderdetail?orderData=' + JSON.stringify(orderData)
    })
  },
  toPay: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.num
    var pace = this.data.pendingOrderList[index].actualPayment + this.data.pendingOrderList[index].freight
    wx.navigateTo({
      url: '../pay/pay?TotalPrice=' + pace + '&orderId=' + that.data.pendingOrderList[index].id + '&orderItemVOList=' + JSON.stringify(that.data.pendingOrderList[index].orderItemVOList)
    })
  },
  onLoad: function(options) {
    var state = options.state;
    if (state != null) {
      this.setData({
        currentTab: JSON.parse(state),
      })
      this.setData({
        current: this.data.currentTab - 1
      })
    }else{
      state = JSON.stringify(this.data.currentTab)
    }
    if (this.data.currentTab < 4) {
      this.getOrders(state);
    } else {
      this.getOrders("4");
      this.getOrders("5");
    }

    /**
     * 获取系统信息
     */
    var that = this;
    wx.getSystemInfo({

      success: function(res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }

    });
    //}
  },
  onShow: function() {
    //this.getOrders(this.data.currentTab);
  },
  cancelMenu: function() {
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定要删除订单吗?',
      success: function(res) {
        if (res.confirm) {
          console.log('取消')
        } else {
          console.log('确定')
        }
      }
    })
  },


  /**
   * 滑动切换tab
   */
  bindChange: function(e) {

    var that = this;
    that.setData({
      currentTab: e.detail.current + 1
    });

  },
  /**
   * 点击tab切换
   */
  swichNav: function(e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
        current: e.target.dataset.current - 1
      })
      var options = {
        state: e.target.dataset.current
      }
      that.onLoad(options);
    }
  }
})