Page({
  data: {
    array: ['请选择卡类型','中国工商银行', '中国农商银行', '信用卡', '中国存储银行'],
    objectArray: [
    
      {
        id: 0,
        name: '中国工商银行'
      },
      {
        id: 1,
        name: '中国'
      },
      {
        id: 2,
        name: '信用卡'
      },
      {
        id: 3,
        name: '中国存储银行'
      }
    ],
    index: 0,
  },
  bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  }
})
