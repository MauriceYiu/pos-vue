<template>
    <div class="pos-resetPW">
        <div class="logo-box position-pos-center">
            <div class="left-logo"></div>
            <form @submit.prevent="resetPassword" class="right-user">
                <p class="title">重置密码</p>
                <div class="phone login-input-default" >
                    <input type="tel" placeholder="请输入您的手机号码" v-model="phone">
                </div>
                <div class="phone login-input-default" >
                    <input type="tel" placeholder="请输入验证码" v-model="code">
                    <span class="getCode" v-if="!isGetCode" @click="getCode">获取验证码</span>
                    <span class="getCode" v-if="isGetCode">{{time+' s'}}</span>
                </div>
                <div class="password login-input-default">
                    <input type="password" placeholder="请输入密码" v-model="password">
                </div>
                <div class="btn">
                    <button type="submit">确认</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script type="text/javascript">
    import {url} from '@/router/url.js';
    export default{
    	data () {
    		return {
                checked: true,
                isGetCode: false,
                time: 60,
                phone: '', // 手机号
                code: '', // 验证码
                password: '' ,// 密码
                employeeStore: {},
            }
    	},
        methods: {
            resetPassword: function () {
                this.phone = this.phone.replace(/\s+/g, "");
                if ( !(/^1[3|4|5|7|8|9][0-9]{9}$/).test(this.phone) ) {
                    this.$message({
                        message: '请输入正确的手机号',
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
                    "mobile": this.phone,
                    "verifyCode": this.code,
                    // "pwd": hex_md5(this.password)
                    "pwd": this.password
                }
                this.$http.post('reset-pwd', data).then((res)=>{
                    this.$router.push({path:'./login'});
                });
            },
            // 获取验证码
            getCode: function () {
                if ( (/^1[3|4|5|7|8|9][0-9]{9}$/).test(this.phone) ) {
                    this.isGetCode = true;
                    this.$http.post('https://api.huoxingy.com/v1/verify-code?mobile='+this.phone+'&type=ACCOUNT').then((res)=>{
                        let intervalCode = setInterval(()=>{
                            this.time--;
                            if ( this.time <= 0 ) {
                                this.isGetCode = false;
                                this.time = 60;
                                clearInterval(intervalCode);
                            }
                        }, 1000);
                    }).catch((err)=>{
                        this.isGetCode = false;
                    })
                } else {
                    this.$message({
                        message: '请输入正确的手机号',
                        customClass: 'error'
                    });
                    return;                   
                }
            }
        },
        mounted(){
        }
    }
</script>
<style lang="scss" scoped>
    @import '../../../static/css/common.scss';
	@import "resetPassword";
</style>
