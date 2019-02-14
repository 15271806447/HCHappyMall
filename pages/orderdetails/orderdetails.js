var app = getApp();
var allOrderList = new Array();
var pendingOrderList = new Array();
var shippedOrderList = new Array();
var receivedOrderList = new Array();
var successAndRefundOrderList = new Array();
Page({
  data: {
    // 顶部菜单切换
    navbar: ['全部', '代付款', "代发货", "待收货", "已完成"],
    // 默认选中菜单
    currentTab: 1,
    index: 0,
    pick_name: "",
    imgHeader: app.globalData.url + '/common/file/showPicture.do?id=',
    state: false,
    first_click: false,
    // list数据
    list: [{
      binahao: "3124356568797697978",
      start: "已发货",
      arry: [{
        name: "这里是昵称这里是昵称这里是昵称这里是昵称这里是昵称",
        image: "../image/a.jpg",
        money: "56",
      },
      {
        name: "这里是昵称这里是昵称这里是昵称这里是昵称这里是昵称",
        image: "../image/a.jpg",
        money: "56",
      },
      ],
      cont_count: "2",
      count_money: "112",
    }, {
      binahao: "3124356568797697978",
      start: "已发货",
      arry: [{
        name: "这里是昵称这里是昵称这里是昵称这里是昵称这里是昵称",
        image: "../image/a.jpg",
        money: "56",
      },
      {
        name: "这里是昵称这里是昵称这里是昵称这里是昵称这里是昵称",
        image: "../image/a.jpg",
        money: "56",
      },
      ],
      cont_count: "2",
      count_money: "112",
    }, {
      binahao: "3124356568797697978",
      start: "已发货",
      arry: [{
        name: "这里是昵称这里是昵称这里是昵称这里是昵称这里是昵称",
        image: "../image/a.jpg",
        money: "56",
      },
      {
        name: "这里是昵称这里是昵称这里是昵称这里是昵称这里是昵称",
        image: "../image/a.jpg",
        money: "56",
      },
      ],
      cont_count: "2",
      count_money: "112",
    },

    ],

  },
  //获得订单
  getOrders: function (orderState) {
    var that = this;
    wx.request({
      url: app.globalData.url + '/api/order/getOrderByOrderState?sid=' + app.globalData.sid + "&userId=" + app.globalData.uid + "&orderState=" + orderState + "&page=" + 1 + "&size=" + 10,
      method: "POST",
      header: {
        'X-Requested-With': 'APP'
      },
      success: function (res) {
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
            console.log(that.data.successAndRefundOrderList);
            break;
        }

      }
    })
  },
  //判断数组中存在某个元素
  getList: function (list, item) {
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
  toOrderdetail: function (event) {
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
    var index = e.currentTarget.dataset.index
    var pace = this.data.pendingOrderList[index].actualPayment + this.data.pendingOrderList[index].freight
    wx.navigateTo({
      url: '../pay/pay?TotalPrice=' + pace + '&orderId=' + that.data.pendingOrderList[index].id + '&orderItemVOList=' + JSON.stringify(that.data.pendingOrderList[index].orderItemVOList)
    })
  },
  // 初始化加载
  onLoad: function (options) {
    var state = options.state;
    if (state != null) {
      this.setData({
        currentTab: JSON.parse(state),
      })
      // this.setData({
      //   current: this.data.currentTab - 1
      // })
    } else {
      state = JSON.stringify(this.data.currentTab)
    }
 
    if (this.data.currentTab < 4) {
      if (this.data.currentTab == 0){
        this.getOrders("1");
        this.getOrders("2");
        this.getOrders("3");
        this.getOrders("4");
        this.getOrders("5");
        console.log("执行了");
        for (var i = 0; i < pendingOrderList.length; i++) {
          allOrderList.push(pendingOrderList[i]);
        }
        for (var i = 0; i < shippedOrderList.length; i++) {
          allOrderList.push(shippedOrderList[i]);
        }
        for (var i = 0; i < receivedOrderList.length; i++) {
          allOrderList.push(receivedOrderList[i]);
        }
        for (var i = 0; i < successAndRefundOrderList.length; i++) {
          allOrderList.push(successAndRefundOrderList[i]);
        }
        this.setData({
          allOrderList: allOrderList
        })
      }else{
      this.getOrders(state);
      }
    } else {
      this.getOrders("4");
      this.getOrders("5");
    }
    /**
    * 获取系统信息
    */
    var that = this;
    wx.getSystemInfo({

      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
  },
  // swichNav: function (e) {
  //   var that = this;
  //   if (this.data.currentTab === e.target.dataset.current) {
  //     return false;
  //   } else {
  //     that.setData({
  //       currentTab: e.target.dataset.current,
  //       current: e.target.dataset.current - 1
  //     })
  //     var options = {
  //       state: e.target.dataset.current
  //     }
  //     that.onLoad(options);
  //   }
  // },

  //顶部tab切换
  navbarTap: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    });
    var options = {
      state: JSON.stringify(e.currentTarget.dataset.idx)
    }
    this.onLoad(options);
  },
  //下拉分页请求
  onPullDownRefresh: function () {
    var page = this.data.page;
    this.data.page += this.data.pageSize;
    this.data.pageSize = (page + 1) * this.data.pageSize;
    var options = {
      state: JSON.stringify(this.data.currentTab)
    };
    this.onLoad(options);
  }


})
