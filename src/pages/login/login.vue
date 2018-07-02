<template>
    <div class="pos-login">
        <div class="logo-box position-pos-center">
            <div class="left-logo">
                <div class="loginImg flex flex-align-center flex-pack-center">
                    <img :src="img.logo" alt="">
                </div>
                <div class="include">
                    <p style="font-size:18px;">基于云计算，SaaS模式</p>
                    <p style="font-size:18px;">收银、营销一体化服务平台</p>
                </div>
            </div>
            <form @submit.prevent="login" class="right-user" v-if="!(employeeStore&&employeeStore[1])">
                <p class="title">登录</p>
                <div class="phone login-input-default" >
                    <input type="tel" placeholder="请输入账号" v-model="phone" autocomplete="off">
                    <i class="iconfont icon-mobile"></i>
                </div>
                <div class="password login-input-default">
                    <input type="password" placeholder="请输入密码" v-model="password" autocomplete="off">
                    <i class="iconfont icon-mima"></i>
                </div>
                <div class="btn">
                    <button type="submit">登录</button>
                </div>
                <div class="forget">
                    忘记密码?<span @click="$router.push({path:'./resetPassword'})">点击重置</span>
                </div>
            </form>
            <div class="right-user choice" v-if="employeeStore&&employeeStore[1]">
                <div class="title">请选择店铺</div>
                <div class="closeBtn" @click="employeeStore=[]">&times;</div>
                <div class="scroll-box">
                    <div class="content">
                        <div class="store-item"  v-for="item in employeeStore"  @click="choiceStore(item)">
                            <span v-text="item.storeName"></span>
                            <span v-text="item.employeeName"></span>
                        </div>
                    </div>
                </div>
                <!-- <div class="recently">
                    <p>您最近登录</p>
                    <div class="recently-item">
                        <span v-text="employeeStore[0].storeName"></span>
                        <span v-text="employeeStore[0].employeeName"></span>
                    </div>
                </div> -->
            </div>
        </div>
    </div>
</template>

<script type="text/javascript">
    import {url} from '@/router/url.js';
    export default{
    	data () {
    		return {
                checked: true,
                phone: '', // 手机号
                password: '' ,// 密码
                employeeStore: [],
                img: url
            }
        },
        methods: {
            choiceStore(item){
                sessionStorage.setItem('store', JSON.stringify(item));
                this.$http.post('authorize?storeId='+item.storeId, {}).then((res)=>{//授权
                    
                    this.$http.post('workshift/'+this.$uuid()+'?storeId='+item.storeId,{}).then((res)=>{//开班
                        if(res.data.operatorId != this.phone){
                            this.$message.error({
                                message: "非本班操作员，请谨慎操作！",
                                customClass: 'error'
                            });
                        }
                        sessionStorage.setItem('workshift', JSON.stringify(res.data));
                        this.$router.push({path:'/cashier'});
                    })
                })
            },
            login: function () { // 登录事件
                this.phone = this.phone.replace(/\s+/g, "");
                if ( !(/^1[3|4|5|7|8|9][0-9]{9}$/.test(this.phone)) ) {
                    this.$message.error({
                        message: "请输入正确的手机号",
                        customClass: 'error'
                    });
                    return;
                }
                if ( !this.password ) {
                    this.$message.error({
                        message: "请输入密码",
                        customClass: 'error'
                    });
                    return;
                }
                let data = {
                    "username": this.phone,
                    // "password": hex_md5(this.password),
                    "password": this.password,
                }
                let b = new Base64();
                let authStr = 'Basic '+ b.encode(data.username+':'+data.password);

                this.$http.post('https://api.huoxingy.com/v1/pos/login', {}, {
                // this.$http.post('http://192.168.0.104:9090/v1/pos/login', {}, {
                    auth: data // 添加登录验证
                }).then((res)=>{
                    this.employeeStore = res.data;
                    sessionStorage.setItem('token', authStr);
                    sessionStorage.setItem('store', JSON.stringify(res.data));

                    //一个店铺直接开班
                    if(!res.data[1]){
                        this.choiceStore(res.data[0]);
                    }
                }).catch((err)=>{
                    if ( err.response ) {
                        if ( err.response.status == 401 ) {
                            this.$message({
                                message: "帐号或者密码有误",
                                customClass: 'error'
                            })
                        } else if ( err.response.status == 403 ) {
                            this.$message({
                                message: "权限不足",
                                customClass: 'error'
                            })
                        } else {
                            this.$message({
                                message: err.response.data,
                                customClass: 'error'
                            })
                        }
                    }
                })
            }
        },
        created(){
            /*if(sessionStorage.getItem('store')){
                let store = JSON.parse(sessionStorage.getItem('store'));
                this.employeeStore = store;
            }*/
        }
    }
</script>
<style lang="scss" scoped>
    @import '../../../static/css/common.scss';
	@import "login";
</style>
