import Vue from 'vue'
import App from './App'
import router from './router'
import { Message,DatePicker,TimePicker,Input,Select,Option,pagination ,Button,Table,TableColumn} from 'element-ui'
import axios from 'axios'
import UUID from 'uuid-js'

Vue.use(Input)
Vue.use(Option)
Vue.use(Select)
Vue.use(DatePicker)
Vue.use(pagination)
Vue.use(TimePicker)
Vue.use(Button)
Vue.use(Table)
Vue.use(TableColumn)

/*
    图片上传，获取验证码两个接口不使用根路径
*/
axios.defaults.baseURL = 'https://api.huoxingy.com/v1/pos/';
// axios.defaults.baseURL = 'http://192.168.0.104:9090/v1/pos/';
axios.defaults.headers.post['Content-Type'] = 'application/json';

/*
    设置请求拦截器
*/
axios.interceptors.request.use(function(config) {
    // console.log(config);

    // 获取验证码，注册不能带token验证
    /*if ( config.url.indexOf('v1/verify-code') >= 0 || config.url.indexOf('v1/admin/sign-up') >= 0 ) {
        return config;
    }*/
    let token = sessionStorage.getItem('token');
    if (token) {
        config.headers.Authorization = token;
    }
    return config;
}, function(error) {
    console.log(1231);
    return Promise.reject(error);
});

/*
    添加响应拦截器
*/
axios.interceptors.response.use(function(response) {
    return response;
}, function(error) {
    if (error.response) {
        let tipText;
        error.response.data.message?tipText=error.response.data.message:tipText=error.response.data;
        if ( error.response.status == 401 ) {
            window.location.href = window.location.href.split('#')[0]+'#/login';
            tipText = '帐号失效，请重新登录';
        } else if ( error.response.status == 403 ) {
            // window.location.href = window.location.href.split('#')[0]+'#/login';
            tipText = '权限不足';
        }
        Message.error({
            message: tipText,
            customClass: 'error'
        })
    }
    return Promise.reject(error);
});
// 解决支付框聚焦问题
Vue.directive('focus', {
    // 当被绑定的元素插入到 DOM 中时……
    inserted: function (el) {
        // 聚焦元素
        el.focus();
    }
})
/*
    添加自定义过滤器
*/
Vue.filter('numberToDate', function ( val ) {
    let dateStr = new Date(val).toLocaleDateString();
    return dateStr;
})

Vue.filter('numberToTime', function ( val ) {
    let date = new Date(val);
    let dateStr = (date.getHours()<10?'0'+date.getHours():date.getHours()) + ':' + (date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes());
    return dateStr;
})

Vue.filter('numberToAllDate', function ( val ) {
    if ( !val ) {
        return '';
    }
    let date = new Date(val);
    let dateStr =date.getFullYear()+'/'+(date.getMonth()+1)+'/'+date.getDate()+'-'+ (date.getHours()<10?'0'+date.getHours():date.getHours()) + ':' + (date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes());
    return dateStr;
})

Vue.prototype.$uuid = function ( len, radix ) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i;
    radix = radix || chars.length;
    if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
    } else {
        // rfc4122, version 4 form
        var r;
 
        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';
 
        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for ( i = 0; i < 32; i++ ) {
            if ( !uuid[i] ) {
                r = 0 | Math.random()*63;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }

    return uuid.join('');
}

Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
/*
  生产UUID：this.$uuid.create(1)
*/

Vue.prototype.$http = axios

Vue.prototype.$message = Message

Vue.prototype.$posPrint = function ( num, str, goodItems ) {
    window.LODOP = getLodop(document.getElementById('LODOP_OB'), document.getElementById('LODOP_EM'));
    prn1_print( num );

    // 直接打印
    function prn1_print( num ) {
        CreateOneFormPage();
        window.LODOP.SET_PRINT_COPIES(num);
        window.LODOP.PRINT();
    }; 
    function CreateOneFormPage() {
        window.LODOP = getLodop();
        window.LODOP.PRINT_INIT("pos小票打印");
        window.LODOP.SET_PRINT_PAGESIZE(3, '58mm', 100, 4);
        window.LODOP.ADD_PRINT_HTM(0, "1mm","RightMargin:1mm","BottomMargin:5mm", str);
    };

    if ( localStorage.getItem('pasterName') && goodItems ) {
        let pasterName = localStorage.getItem('pasterName');
        console.log(goodItems)
        console.log(pasterName)
        let paster_LODOP = getLodop(document.getElementById('LODOP_OB'), document.getElementById('LODOP_EM'));

        for (var i = 0, len = goodItems.length; i < len; i++) {
            if ( goodItems[i].directTherma ) {
                for (var j = 0; j < goodItems[i].quantity; j++) {
                    paster_print(`
                        <div style="text-align:center;width:130px;height:85px;overflow:hidden;padding-top:15px">
                            <div style="padding-bottom:8px">`+goodItems[i].productName+`</div>
                            <div style="line-height:30px">￥`+(goodItems[i].salesPrice/goodItems[i].quantity).toFixed(2)+`</div>
                        </div>
                    `);
                }
            }
        }
        // 直接打印
        // Gprinter GP-3120TU
        function paster_print( str ) {
            CreateOneFormPage( str );
            if (LODOP.SET_PRINTER_INDEX(pasterName)) 
                paster_LODOP.PRINT();
        }; 
        function CreateOneFormPage( str ) {
            paster_LODOP = getLodop();
            paster_LODOP.PRINT_INIT("pos贴纸打印");
            paster_LODOP.SET_PRINT_PAGESIZE(3, '58mm', 100, 4);
            paster_LODOP.ADD_PRINT_HTM(0, "1mm","RightMargin:1mm","BottomMargin:5mm", str);
        };
    }
}
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App }
})
