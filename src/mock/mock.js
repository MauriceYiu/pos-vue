import Mock from 'mockjs'

export default {
  mockData () {

    // 获得验证码
    Mock.mock('/verify-code', {
      'code': '@integer(100000,999999)'
    })

    // 注册
    Mock.mock('/sign-up/admin', {
    })

    // 登录
    Mock.mock('/login/admin', {
    })

    // 判断邀请码是否有效
    Mock.mock('/validate-referral-code', {
    })

    // 添加店铺
    Mock.mock('/stores', {
      
    })

    // 获得店铺类型
    Mock.mock('/store-types', {
      "typeArr" : [
        {
          "id":1,
          "name":"Drink",
          "addTime":"2017-07-06T09:01:00Z",
          "updateTime":"2017-07-06T09:01:00Z"
        },
        {
          "id":2,
          "name":"FastFood",
          "addTime":"2017-07-06T09:01:00Z",
          "updateTime":"2017-07-06T09:01:00Z"
        }
      ]
    })

    // 添加店铺
    Mock.mock('/stores/123', {
      "id": 1,
      "name": "wangba",
      "addr": "Chengdu",
      "referralCode": "1101",
      "addTime": "2017-07-06T09:01:00Z",
      "updateTime": "2017-07-06T09:01:00Z"
    })

  }
}
