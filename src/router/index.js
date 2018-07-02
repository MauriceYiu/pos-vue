import Vue from 'vue'
import Router from 'vue-router'

// index routers
import index from '@/pages/index/index.vue'
import login from '@/pages/login/login.vue'
import resetPassword from '@/pages/resetPassword/resetPassword.vue'
import cashier from '@/components/cashier/cashier.vue'
import order from '@/components/order/order/order.vue'
import exchangeWork from '@/components/exchangeWork/exchangeWork.vue'
import shiftWork from '@/components/shiftWork/shiftWork.vue'
import checkBill from '@/components/checkBill/checkBill.vue'

// order routers
import completeOrder from '@/components/order/pages/completeOrder/completeOrder.vue'//已售订单
import searchOrder from '@/components/order/pages/searchOrder/searchOrder.vue'//订单查询
import watingOrder from '@/components/order/pages/watingOrder/watingOrder.vue'//待处理订单
import retiredOrder from '@/components/order/pages/retiredOrder/retiredOrder.vue'//已退订单
import hangOrder from '@/components/order/pages/hangOrder/hangOrder.vue'//已退订单

Vue.use(Router)




export default new Router({
    routes: [
        {
            //重定向
            path: '*',
            redirect: '/index'
        },
        {
            path: '/login',
            name: 'login',
            component: login
        },
        {
            path: '/resetPassword',
            name: 'resetPassword',
            component: resetPassword
        },
        {
            path: '/index',
            name: 'index',
            component: index,
            redirect: '/cashier',
            children:[
                {
                    path: '/cashier',
                    name: 'cashier',
                    component: cashier
                },
                {
                    path: '/order',
                    name: 'order',
                    component: order,
                    redirect: '/order/watingOrder',
                    children: [
                        {
                            path: '/order/completeOrder',
                            name: 'completeOrder',
                            component: completeOrder
                        },
                        {
                            path: '/order/searchOrder',
                            name: 'searchOrder',
                            component: searchOrder
                        },
                        {
                            path: '/order/watingOrder',
                            name: 'watingOrder',
                            component: watingOrder
                        },
                        {
                            path: '/order/retiredOrder',
                            name: 'retiredOrder',
                            component: retiredOrder
                        },
                        {
                            path: '/order/hangOrder',
                            name: 'hangOrder',
                            component: hangOrder
                        }
                    ]
                },{
                    path: '/exchangeWork',
                    name: 'exchangeWork',
                    component: exchangeWork
                },{
                    path: '/shiftWork',
                    name: 'shiftWork',
                    component: shiftWork
                },
                {
                    path: '/checkBill',
                    name: 'checkBill',
                    component: checkBill
                }
            ]
        }
     ]
})
