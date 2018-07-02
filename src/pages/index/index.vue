<template>
    <div class="index" id="index">
        <div class="side_bar left">
          <!-- <router-link v-for="(item,ind) in sideData" tag="div" key="ind" :to="item.url" active-class="active_class" class="side_bar_item">
                    <span v-text='item.name'></span>
                </router-link> -->
            <div class="logo flex flex-align-center flex-pack-center">
                <div class="logo-img">
                    <img src="../../assets/logo.png" height="186" width="210" alt="">
                </div>
            </div>
            <router-link active-class="active_class" to="/cashier" tag="div" :key="1" class="side_bar_item flex flex-align-center flex-pack-center">
                <div>
                    <div><i class="iconfont icon-shouyin"></i></div>
                    <div><span>收银</span></div>
                </div>
            </router-link>
            <router-link active-class="active_class" to="/order" tag="div" :key="2" class="side_bar_item flex flex-align-center flex-pack-center ">
                <div>
                    <div class="order-icon">
                        <i class="iconfont icon-dingdan"></i>
                        <span class="num" v-text="'!'" :style="{'display':(orderNum>0?'block':'none')}"></span>
                    </div>
                    <div><span>订单</span></div>
                </div>
            </router-link>
            <div class="side_bar_item flex flex-align-center flex-pack-center" @click="vipBoxBtn=true">
                <div>
                    <div class="order-icon">
                        <i class="iconfont icon-vip"></i>
                    </div>
                    <div><span>会员</span></div>
                </div>
            </div>
            <router-link class="side_bar_item flex flex-align-center flex-pack-center" to="/exchangeWork" tag="div" :key="3" active-class="active_class">
                <div>
                    <div><i class="iconfont icon-jiaoban"></i></div>
                    <div><span>交班</span></div>
                </div>
            </router-link>
            <!-- <router-link class="side_bar_item flex flex-align-center flex-pack-center" to="/checkBill" tag="div" :key="4" active-class="active_class">
                <div>
                    <div><i class="iconfont icon-zhangdan"></i></div>
                    <div><span>对账单</span></div>
                </div>
            </router-link> -->
            <div class="side_bar_item flex flex-align-center flex-pack-center" @click="setting">
                <div>
                    <div><i class="iconfont icon-set"></i></div>
                    <div><span>设置</span></div>
                </div>
            </div>
            <!-- <div class="side_bar_item flex flex-align-center flex-pack-center" @click="goInv">
                <div>
                    <div><i class="iconfont icon-chakankucun"></i></div>
                    <div><span>库存</span></div>
                </div>
            </div> -->
        </div>
        <div class="index_route_box right">
            <div class="top">
                <div class="dateBox clearfix left dateBoxCenter">
                    <span class="flex flex-align-center left">欢迎光临</span>
                    <span class="flex flex-align-center left" v-text="storeInfo.storeName"></span>
                </div>
                <div class="dateBox clearfix right userNotSelect">
                    <span class="flex flex-align-center left logout" @click="showConfirmMask=true">[退出]</span>
                    <span class="flex flex-align-center left span" v-text="employeeInfo.operatorName"></span>
                    <div class="flex flex-align-center date left">
                        <div v-text="dateStr"></div>
                        <div class="time" ><span v-text="weekStr" style="margin-right:5px;"></span><span v-text="timeStr"></span></div>
                    </div>
                </div>
                <div class="position-middle-center " style="width:200px">
                    <marquee direction="left" align="bottom" height="25" width="100%" onmouseout="this.start()" onmouseover="this.stop()" scrollamount="4" scrolldelay="1" style="font-size:18px;">温馨提示：开班后，须在24小时内进行交班，否则系统将强制交班！</marquee>
                </div>
                <!-- <div class="dateBox clearfix right">
                    <span class="flex flex-align-center logout" @click="noticeCurrentPage=1 ;getNoticeFn(1)">服务</span>
                </div> -->
            </div>
            <div class="index_route_inner">
                <router-view
                    :storeId="storeInfo.storeId"
                    :storeName="storeInfo.storeName"
                    :printsBtn="printsBtn"
                    :orderNum="orderNum"
                    :isOnline="isOnline"
                    @refresh="getNewNum"
                    >
                </router-view>
            </div>
        </div>

        <div class="mask" v-if="showConfirmMask" @click="showConfirmMask=false">
            <div class="orderConfirmBox" @click.stop="">
                <div class="title">提示</div>
                <p>确认退出当前账号？</p>
                <div class="btnGroup">
                    <button type="button" class="cancel" @click="showConfirmMask=false">取消</button>
                    <button type="button" class="save" @click="logout">确认</button>
                </div>
            </div>
        </div>

        <div class="vipBox" v-if="vipBoxBtn" @click="vipBoxBtn = false">
            <div class="content position-middle-center clearfix" @click.stop="()=>{}">
                <div class="item left flex flex-align-center flex-pack-center" @click.stop="addVip">
                    <div>
                        <div class="i_pre">
                            <i class="iconfont icon-adduser"></i>
                            <!-- <span style="font-size:25px;">+</span> -->
                        </div>
                        <p>添加</p>
                    </div>
                </div>
                <div class="item left flex flex-align-center flex-pack-center" @click.stop="rechargeFn">
                    <div>
                        <div class="i_pre">
                            <i class="iconfont icon-shouyin"></i>
                        </div>
                        <p>充值</p>
                    </div>
                </div>
            </div>
        </div>
        <!-- 添加会员弹框 -->
        <div class="qrCodeBox" v-if="qrCodeBtn" @click="qrCodeBtn = false">
            <div class="qrCode position-middle-center" @click.stop="()=>{}">
                <div class="close-btn" @click.stop="()=>{qrCodeBtn = false}">&times;</div>
                <div class="title">
                    添加会员
                </div>
                <div class="content">
                    <div id="qrcode"></div>
                </div>
                <p class="qrcode-text">微信扫码并关注“火星捕手”即可成为会员</p>
            </div>
        </div>
        <div class="rechargeBox" v-if="rechargeBoxBtn" @click="rechargeBoxBtn = false">
            <div class="recharge position-middle-center" @click.stop="()=>{}">
                <div class="closeBtns" @click="rechargeBoxBtn = false">&times;</div>
                <div class="title">会员充值</div>
                <div v-if="!inputVipCodeBtn">
                    <div class="vipMsg clearfix">
                        <div class="name left">会员名称：</div>
                        <div class="val left" v-text="curSelectVipData.name"></div>
                    </div>
                    <div class="vipMsg clearfix">
                        <div class="name left">会员帐号：</div>
                        <div class="val left" v-text="curSelectVipData.mobile?curSelectVipData.mobile:curSelectVipData.code"></div>
                    </div>
                    <div class="vipMsg clearfix">
                        <div class="name left">会员余额：</div>
                        <div class="val left" v-text="'￥'+curSelectVipData.amount"></div>
                    </div>
                    <div class="selMoneyBox">
                        <div class="recharge-scroll-box" v-if="!vipPayBtn">
                            <div class="item" v-for="item in rulesData" @click="choiceRules(item)"><span v-text="item.name"></span></div>
                            <div class="input-recharge">
                                <div class="clearfix" v-if="MorePayBtn">
                                    <span class="left">自定义金额：</span>
                                    <input class="left" type="text" placeholder="请输入充值金额" v-model="inputVipMoney">
                                </div>
                                <div class="clearfix" v-if="!MorePayBtn">
                                    <button type="button" @click="MorePayBtn=true">更多充值规则</button>
                                </div>
                            </div>
                        </div>
                        <div class="btnGroup" v-if="!vipPayBtn">
                            <button type="button" class="cancel" @click="rechargeBoxBtn=false">取消</button>
                            <button type="button" class="save" @click="choiceRules()">确认</button>
                        </div>

                        <div class="vipPayBox" v-if="vipPayBtn">
                            <div class="top_money">
                                <div class="returnBtn">
                                    <div class="left flex flex-align-center" @click="vipPayBtn=false">
                                        <i class="iconfont icon-fanhui"></i>
                                        <span>返回</span>
                                    </div>
                                </div>
                                <div class="totalPrice flex flex-align-center flex-pack-center" v-text="'￥'+(inputVipMoney?inputVipMoney:(vipObj.depositAmount?vipObj.depositAmount:0))"></div>
                                <div class="serialNumber flex flex-align-center">
                                    <span class="name">流水号</span>
                                    <span v-text="vipObj.code"></span>
                                </div>
                            </div>
                            <p class="selPayType flex flex-align-center">选择支付方式</p>
                            <div class="pay_type clearfix">
                                <span class="left size1" :class="{span_active:payVipType == 'CASH'}"><input name="Fruit" type="radio" value="CASH" v-model="payVipType">现金支付</span>
                                <span v-if="isOnline" class="left size1" @click="openPayCodeBox()" :class="{span_active:payVipType == 'PAYCARD'}"><input name="Fruit" type="radio" value="PAYCARD" v-model="payVipType">在线支付</span>

                                <span v-if="!isOnline" class="left size1" :class="{span_active:payVipType == 'ALIPAY_CASH'}"><input name="Fruit" type="radio" value="ALIPAY_CASH" v-model="payVipType">支付宝支付</span>
                                <span v-if="!isOnline" class="left size1" :class="{span_active:payVipType == 'WECHATPAY_CASH'}"><input name="Fruit" type="radio" value="WECHATPAY_CASH" v-model="payVipType">微信支付</span>
                            </div>
                            <div  class="sure_pay">
                                <button @click="vipPayFn" type="button">确认支付</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="inputVipCode" style="width:420px;height:80px;" v-if="inputVipCodeBtn">
                    <div class="vip_up">
                        <div class="vipInputBox flex flex-align-center">
                            <input type="text" class="vipInput" v-model="vipNumber" placeholder="输入会员账号">
                            <!-- <button type="button" @click="addVipFn">确认</button> -->
                        </div>
                        <ul class="vipCheckList">
                            <div class="leftIcon" :style="{top:(curVipIdx*40+'px'),display:(vipList[0]?'block':'none')}"></div>
                            <li v-for="item in vipList" @click.stop="addVipFn(item)">
                                <div class="left name" v-text="item.name"></div>
                                <div class="right tel" v-text="item.mobile?item.mobile:item.code"></div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div class="userPayCodeBox" v-if="showPayCodeBox">
            <form class="userPayCode" @submit.prevent="vipPayFn">
                <div class="tipText">
                    * 请输入或者扫描用户付款码
                </div>
                <div class="inputBox">
                    <input type="text" id="payCodeInput" autocomplete="off" v-model="payCode">
                </div>
                <div class="btnGroup">
                    <button type="submit" class="save">确认</button>
                    <button type="button" class="cancel" @click="showPayCodeBox=false">取消</button>
                </div>
            </form>
        </div>
        <div class="mask" v-if="showOnLinePaySuccessMask" @click="showOnLinePaySuccessMask=false">
            <div class="orderConfirmBox" @click.stop="">
                <div class="title">提示</div>
                <p>支付成功！</p>
                <div class="btnGroup">
                    <button type="button" class="save" @click="showOnLinePaySuccessMask=false">确认</button>
                </div>
            </div>
        </div>
        <div class="payLoding" v-if="showPayLoding">
            <div class="payLodeBox">
                <div class="payLoadImg">
                    <i class="iconfont icon-looding"></i>
                </div>
                <p v-if=" payVipType == 'PAYCARD'">支付中，请等待！</p>
                <p v-if=" payVipType == 'PAYCARD'">请在3分钟内完成支付，超时将自动取消。</p>
                <div class="btnGroup" v-if="payVipType == 'PAYCARD'">
                    <button type="button" class="cancel" @click="deleteOrder(vipObj.ordersId)">取消支付</button>
                    <button type="button" class="save" @click="aNewOrder">挂起此单</button>
                </div>
            </div>
        </div>

        <div class="mask" v-if="showSetting" @click="showSetting=false">
            <div class="settingBox" @click.stop="">
                <div class="title">系统设置</div>
                <div class="setInnter clearfix">
                    <div class="setItem">
                        <span class="name left">自动打印收银小票：</span>
                        <select name="" id="" v-model="settingObj.autoPrint">
                            <option value="ON">开</option>
                            <option value="OFF">关</option>
                        </select>
                    </div>
                    <div class="setItem">
                        <span class="name left">交班小票分类打印：</span>
                        <select name="" id="" v-model="settingObj.totalClassify">
                            <option value="DETAILARRTYPE">所有分类+详细商品</option>
                            <option value="DETAILARR">仅详细商品</option>
                            <option value="ONETYPE">仅一级分类</option>
                            <option value="ONETOWTYPE">仅一二级分类</option>
                        </select>
                    </div>
                    <div class="setItem" style="display:none;">
                        <span class="name left">标签打印机名称：</span>
                        <input type="text" v-model="settingObj.pasterName">
                    </div>
                    <div class="setItem" style="display:none;">
                        <span class="name left">小票打印机ID：</span>
                        <input type="text" v-model="settingObj.printId" placeholder="如：vid_0483&pid_070b">
                    </div>
                    <div class="setItem">
                        <span class="name left">厨房打印Ip：</span>
                        <input type="text" v-model="settingObj.kitchIp" placeholder="如：192.168.123.100">
                    </div>
                    <div class="setItem">
                         <span class="name left">厨房打印端口：</span>
                        <input type="text" v-model="settingObj.kitchPort" placeholder="如：9100">
                    </div>
                    <div class="setItem">
                        <span class="name left">订单提示音：</span>
                        <select name="" id="" v-model="settingObj.orderVoiceName" @change="selVoice">
                            <option value="voice_1.ogg">voice_1.ogg</option>
                            <option value="voice_2.ogg">voice_2.ogg</option>
                            <option value="voice_3.ogg">voice_3.ogg</option>
                            <option value="voice_4.ogg">voice_4.ogg</option>
                            <option value="voice_5.ogg">voice_5.ogg</option>
                            <option value="voice_6.ogg">voice_6.ogg</option>
                            <option value="voice_7.ogg">voice_7.ogg</option>
                            <option value="voice_8.ogg">voice_8.ogg</option>
                            <option value="voice_9.ogg">voice_9.ogg</option>
                            <option value="voice_10.ogg">voice_10.ogg</option>
                        </select>
                    </div>
                </div>
                <div class="btnGroup">
                    <button type="button" class="cancel" @click="showSetting=false">取消</button>
                    <button type="button" class="save" @click="saveSetting()">确认</button>
                </div>
            </div>
        </div>
        <div class="mask " v-if="noticeBtn" @click="noticeBtn=false">
            <div class="settingBox notice" @click.stop="" style="width:680px;">
                <div class="title">呼叫历史</div>
                <div class="noticeBox">
                    <div class="item">
                        <span style="width:10%;"  class="left">序号</span>
                        <span style="width:30%;" class="left">座位号</span>
                        <span style="width:60%;" class="right">时间</span>
                    </div>
                    <div v-for="(item,ind) in noticeList" class="item clearfix">
                        <span style="width:10%;" v-text="(noticeCurrentPage-1)*10+ind+1" class=" left"></span>
                        <span style="width:30%;" v-text="item.tableNo" class=" left"></span>
                        <span style="width:60%;"  class=" right">{{item.addTime | numberToAllDate('')}}</span>
                    </div>
                </div>
                <div class="pagers">
                <el-pagination
                    @current-change="getNoticeFn"
                    :current-page.sync="noticeCurrentPage"
                    :page-size="10"
                    layout="total, prev, pager, next, jumper"
                    :total="noticeTotalElements">
                </el-pagination>
                </div>
            </div>
        </div>
        <div style="display: none" id="speech_voice_index" v-text="voice_text_index"></div>
        <div style="display: none" id="notice_voice" v-text="voice_text_notice"></div>
        <audio style="display:none" controls="" class="audio" src="../../../static/voice/default.m4a" autoplay="" id="audios"></audio>
    </div>
</template>
<script type="text/javascript">
export default{
    data(){
        return {
            showConfirmMask: false,//退出登录按钮

            launchFullBtn: true,//全屏控制按钮
            employeeInfo: {},//账号信息
            storeInfo: {},//店铺信息
            ordersId: '',//订单id

            // 更新订单数量
            timer:'',
            orderNum: 0,
            weekStr: '', // 星期
            dateStr: '', // 年月日
            timeStr: '', // 时分秒
            intervalTimer: {}, // 时间定时器
            vipBoxBtn:false,//会员弹框
            qrCodeBtn:false,//添加会员
            rechargeBoxBtn:false,//会员充值

            rulesData:{},
            curSelectVipData:{},
            inputVipMoney:'',
            vipPayBtn:false,
            vipObj:{},
            payVipType : "CASH", // 会员支付方式
            payCode:'',
            showPayCodeBox: false, // 是否显示在线支付
            showOnLinePaySuccessMask: false, // 在线支付成功提示框
            showPayLoding: false, // 是否显示等待支付框
            inputVipCodeBtn: true,//输入会员
            vipNumber:"",
            curVipIdx:0,
            vipList:[],
            searchVipBtn: true, // 搜索会员接口控制
            payApiBtn: true, // 支付情况控制
            MorePayBtn:false,

            timeNum: true, // 支付等待时间
            payLoadTimer:'',

            printsBtn: false, // 打印勾选按钮
            showSetting: false, // 显示设置界面
            settingObj: {
                orderVoiceName: '', // 订单提示音
                autoPrint: 'ON', // 自动打印
                totalClassify: 'DETAILARR', // 总分类打印
                printId:'',//小票打印机id
                kitchIp:'',//厨房打印IP
                kitchPort:'9100',//厨房打印端口
                pasterName: '', // 标签打印机名称
            },
            curVoiceName: 'voice_1.ogg', // 当前声音名称

            voice_text_index: '', // 到账声音
            isOnline: true, // 是否走银行通道

            stompClient: null, // stomp客户端对象
            stompClientNotice: null, // stomp客户端对象(语音服务)
            updatesTime: '', // 
            token: '',
            timerNotice:'',
            noticeBtn:false,
            noticeUpdatesTime:'',//(语音服务)初试时间
            noticeWill:[],//(语音服务)将要播报的数组
            voice_text_notice:'',//(语音服务)文字
            noticeTotalElements:0,//(语音服务)总条
            noticeCurrentPage: 1, //(语音服务)翻页当前页
            noticeList:[]
        }
    },
    watch: {
        vipNumber (val) {
            if ( !this.searchVipBtn || !val ) {
                return;
            }
            this.searchVipBtn = false;
            this.$http.get('members?storeId=' + this.storeInfo.storeId + '&q=' + val).then((res) => {
                this.vipList = res.data;
                if (this.vipList && this.vipList[0]) {
                    this.curSelectVipData = this.vipList[0];
                }
                this.searchVipBtn = true;
                setTimeout(()=>{
                    let that = this;
                    $('.vipCheckList li').hover( function () {
                        that.curVipIdx = $(this).index()-1;
                    }, function () {
                        that.curVipIdx = 0;
                    })
                },0)
            }).catch(()=>{
                this.searchVipBtn = true;
            })
        },
    },
    methods: {
        //挂单
        aNewOrder(){
            clearInterval(this.payLoadTimer);
            this.payApiBtn = true;
            this.showPayLoding = false;
            this.vipPayBtn = false;
            this.inputVipMoney = '';
        },
        //取消单
        deleteOrder( orderId ){
            clearInterval(this.payLoadTimer);
            this.payApiBtn = true;
            this.$http.delete('payments/'+orderId).then((res)=>{
                this.showPayLoding = false;
                this.vipPayBtn = false;
                this.inputVipMoney = '';
                // 传入index生成新订单
            });
        },
        addVipFn(item){
            this.curSelectVipData = item;
            this.curSelectVipData.curMoney = item.amount+item.bonus;//curMoney为当前会员展示的余额
            this.curSelectVipData.curMoney = this.curSelectVipData.curMoney.toFixed(2);
            this.inputVipCodeBtn =false;
            this.searchVipBtn = true;
        },
        // 打开在线支付框事件
        openPayCodeBox: function () {
            this.showPayCodeBox = true;
            this.payCode = '';
            setTimeout(()=>{
                $('#payCodeInput').focus();
            }, 0)
        },
        //会员充值
        vipPayFn(){
            if ( !this.payCode && this.payVipType == 'PAYCARD'  ) {
                this.$message({
                    message: '请输入收款码',
                    customClass: 'error'
                })
                return;
            }

            if ( !this.payApiBtn ) {
                return;
            }
            this.payApiBtn = false;
            this.showPayCodeBox = false;
            this.showPayLoding = true;

            this.$http.put('payments/' + this.$uuid(), {
                "orderId": this.vipObj.ordersId,
                "channel": this.payVipType,
                "amount":  this.vipObj.amount,
                "authCode": this.payCode,
            }).then((res)=>{
                this.payCode = '';
                if ( res.status === 202 && this.payVipType == 'PAYCARD' ) {
                    let overTimeNum = 0;
                    let curOrderId = this.vipObj.ordersId;

                    this.payLoadTimer = setInterval(()=>{
                        overTimeNum += 2;
                        let that = this;
                        if ( overTimeNum >= 180 ) { // 超过180秒，取消订单
                            clearInterval(this.payLoadTimer);
                            this.payApiBtn = true;
                            this.showPayLoding = false;
                            this.$message({
                                message: '支付超时，当前订单已取消！',
                                customClass: 'error'
                            })
                            this.deleteOrder( curOrderId );
                            return;
                        }
                        this.payLoad(this.vipObj.ordersId, function () {
                            clearInterval(that.payLoadTimer);
                            that.$http.get('members?storeId='+that.storeInfo.storeId+'&q='+encodeURI(that.curSelectVipData.code)).then((res)=>{
                                that.curSelectVipData = res.data[0];
                                that.curSelectVipData.curMoney = res.data[0].amount+res.data[0].bonus;//curMoney为当前会员展示的余额
                                that.curSelectVipData.curMoney = that.curSelectVipData.curMoney.toFixed(2);
                                sessionStorage.setItem('curSelectVipData', JSON.stringify(that.curSelectVipData));
                            })
                            that.$message({
                                message: '充值成功',
                                customClass: 'success'
                            });
                            that.vipPayBtn = false;
                            that.showPayLoding = false;
                            that.rechargeBoxBtn = false;
                            that.showOnLinePaySuccessMask = true;
                            that.inputVipMoney = '';
                            that.MorePayBtn = false
                            setTimeout(()=>{
                                that.payApiBtn = true;
                            }, 300)
							var iframe = "<iframe id='iframes' height='0' width='0' src='https://api.huoxingy.com/v1/pos/speech?tex=成功到账"+that.vipObj.amount+"元&vol=9&per=0&spd=5&pit=5' frameborder='0'></iframe>";
	                        $('#index').append(iframe)
	                        setTimeout(()=>{
	                            $("#iframes").remove();
	                        },8000)
//                          that.voice_text_index = '成功到账'+that.vipObj.amount+'元';
//                          setTimeout(()=>{
//                              $('#speech_voice_index').speech({
//                                  "speech": false,
//                                  "speed": 3,
//                              });
//                          })
                        })
                    }, 2000);
                } else {
                    this.$http.get('members?storeId='+this.storeInfo.storeId+'&q='+encodeURI(this.curSelectVipData.code)).then((res)=>{
                        this.curSelectVipData = res.data[0];
                        this.curSelectVipData.curMoney = res.data[0].amount+res.data[0].bonus;//curMoney为当前会员展示的余额
                        this.curSelectVipData.curMoney = this.curSelectVipData.curMoney.toFixed(2);
                        sessionStorage.setItem('curSelectVipData', JSON.stringify(this.curSelectVipData));
                    })
                    this.$message({
                        message: '充值成功',
                        customClass: 'success'
                    });
                    this.vipPayBtn = false;
                    this.showPayLoding = false;
                    this.rechargeBoxBtn = false;

                    if ( this.payVipType == 'PAYCARD' ) {
                        this.showOnLinePaySuccessMask = true;
                        var iframe = "<iframe id='iframes' height='0' width='0' src='https://api.huoxingy.com/v1/pos/speech?tex=成功到账"+this.vipObj.amount+"元&vol=9&per=0&spd=5&pit=5' frameborder='0'></iframe>";
                        $('#index').append(iframe)
                        setTimeout(()=>{
                            $("#iframes").remove();
                        },8000)
//                      this.voice_text_index = '成功到账'+this.vipObj.amount+'元';
//                      setTimeout(()=>{
//                          $('#speech_voice_index').speech({
//                              "speech": false,
//                              "speed": 3,
//                          });
//                      })
                    }

                    this.inputVipMoney = '';
                    this.MorePayBtn = false
                    setTimeout(()=>{
                        this.payApiBtn = true;
                        this.showPayLoding = false;
                    }, 300)
                }
            }).catch(()=>{
                this.payApiBtn = true;
                this.showPayLoding = false;
            })
        },
        //会员充值
        rechargeFn(){
            this.vipBoxBtn = false;
            this.rechargeBoxBtn =true;
            this.inputVipCodeBtn = true;
            this.vipPayBtn = false;
            this.vipList = [];
            this.vipNumber = '';
            // 获取充送规则
            this.$http.get('charge-rules?storeId='+this.storeInfo.storeId).then((res)=>{
                this.rulesData = res.data;
            })
        },
        // 等待支付轮训接口
        payLoad: function ( orderId, fn ) {
            this.$http.get('https://api.huoxingy.com/v1/pay/micropay/query?orderId='+orderId).then((res)=>{
                if ( res.status === 200 ) {
                    fn();
                }
            }).catch(( err )=>{
                this.payApiBtn = true;
                this.showPayLoding = false;
                clearInterval(this.payLoadTimer);
            })
        },
        choiceRules(item){
            if( item ){
                this.inputVipMoney = '';//防止用户填了自定义充值，但结果选了冲送规则。
            }else {
                if(!/^(0|[1-9][0-9]{0,9})(\.[0-9]{1,2})?$/.test(this.inputVipMoney)|| this.inputVipMoney == 0){
                    this.$message({
                        message: '充值金额输入有误',
                        customClass: 'error'
                    });
                    return;
                }
            }
            this.payVipType = 'CASH';
            let sendBody = {
                "storeId": this.storeInfo.storeId,
                "memberId": this.curSelectVipData.id,
                "amount": parseFloat(this.inputVipMoney?this.inputVipMoney:item.depositAmount),
                "chargeRuleId": this.inputVipMoney?'':item.id
            }
            this.$http.put('member-charges/'+this.$uuid(),sendBody).then((res)=>{
                this.vipObj = item?item:{};
                this.$set(this.vipObj, 'code', res.data.code);
                this.$set(this.vipObj, 'ordersId', res.data.id);
                this.$set(this.vipObj, 'amount', res.data.amount);
            })
            this.vipPayBtn = true;
        },
        //添加会员
        addVip(){
            this.vipBoxBtn = false;
            this.qrCodeBtn=true;
            setTimeout(
                ()=>{
                    $('#qrcode')[0].innerHTML='';
                    this.$http.get('https://api.huoxingy.com/v1/clerk/referral-code?storeId='+this.storeInfo.storeId).then((res)=>{
                        let qrcode = new QRCode("qrcode", {
                            text: res.data,
                            colorDark : "#000000",
                            colorLight : "#ffffff",
                            correctLevel : QRCode.CorrectLevel.H
                        });
                    }).catch((res)=>{
                    })

                },0
            )
        },
        logout(){
            //退出登录
            this.$router.push({path: '/login'});
        },
        getNewNum(number){
            //number 为待处理订单页面过来的订单数量
            this.orderNum = number;
        },
        // 设置
        setting: function () {
            this.showSetting = true;
            this.settingObj = {
                orderVoiceName: localStorage.getItem('orderVoiceName'), // 订单提示音
                autoPrint: JSON.parse(localStorage.getItem('autoPrint')).autoPrint, // 自动打印
                totalClassify: localStorage.getItem('totalClassify'), // 总分类打印
                pasterName: localStorage.getItem('pasterName')?localStorage.getItem('pasterName'):'', // 总分类打印
                printId: localStorage.getItem('printId')?localStorage.getItem('printId'):'', // 小票打印
                kitchIp: localStorage.getItem('kitchIp')?localStorage.getItem('kitchIp'):'', // 厨房打印Ip
                kitchPort: localStorage.getItem('kitchPort')?localStorage.getItem('kitchPort'):'', // 厨房打印端口
            }
        },
        // 保存设置
        saveSetting: function () {
            this.settingObj.pasterName = this.settingObj.pasterName.replace(/(^\s*)|(\s*$)/g,''); // 去掉前后空格
            this.settingObj.printId = this.settingObj.printId.replace(/(^\s*)|(\s*$)/g,''); // 去掉前后空格
            this.settingObj.kitchIp = this.settingObj.kitchIp.replace(/(^\s*)|(\s*$)/g,''); // 去掉前后空格
            this.settingObj.kitchPort = this.settingObj.kitchPort.replace(/(^\s*)|(\s*$)/g,''); // 去掉前后空格
            this.showSetting = false;
            this.$message({
                message: '保存成功',
                customClass: 'success'
            })
            let autoPrints = JSON.parse(localStorage.getItem('autoPrint'));
            autoPrints.autoPrint = this.settingObj.autoPrint;
            localStorage.setItem('orderVoiceName', this.settingObj.orderVoiceName);
            localStorage.setItem('autoPrint', JSON.stringify(autoPrints));
            localStorage.setItem('totalClassify', this.settingObj.totalClassify);
            localStorage.setItem('pasterName', this.settingObj.pasterName);
            localStorage.setItem('printId', this.settingObj.printId);
            localStorage.setItem('kitchIp', this.settingObj.kitchIp);
            localStorage.setItem('kitchPort', this.settingObj.kitchPort);

            this.curVoiceName = this.settingObj.orderVoiceName;
            if ( this.settingObj.autoPrint == 'ON' ) {
                this.printsBtn = true;
            } else {
                this.printsBtn = false;
            }
        },
        // 选择声音
        selVoice: function () {
            $('.audio').remove();
            $('.index').append($('<audio style="display:none" controls="" class="audio" src="../../../static/voice/'+this.settingObj.orderVoiceName+'" autoplay="" id="audios"></audio>')); 
        },

        //连接服务器的函数
        connect: function () {
            var socket = new SockJS('https://api.huoxingy.com/gs-guide-websocket');
            this.stompClient = Stomp.over(socket);
            let that = this;
            this.stompClient.connect({'Auth-Token': this.token}, function (frame) {
                that.stompClient.ws.onerror = function ( evnt ) {
                    that.connect();
                }
                that.stompClient.ws.onclose = function ( evnt ) {
                    that.connect();
                }
                // that.sendMessage();
                //订阅服务器发送来的消息
                // that.stompClient.subscribe('/message/'+that.token+"/"+that.storeInfo.storeId, function (event) {
                //     let res = JSON.parse(event.body);
                //     that.updatesTime = res.lastTimestamp;
                //     that.orderNum += res.count;
                //     if ( res.count > 0 ) {
                //         if ( that.curVoiceName ) {
                //             $('.audio').remove();
                //             $('.index').append($('<audio style="display:none" controls="" class="audio" src="../../../static/voice/'+that.curVoiceName+'" autoplay="autoplay" id="audios"></audio>'));
                //         }
                //     }
                // });
                that.stompClient.subscribe('/message/'+that.storeInfo.storeId, function (event) {
                    console.log("我收到了服务器消息");
                    let res = JSON.parse(event.body);
                    that.updatesTime = res.lastTimestamp;
                    that.orderNum += res.count;
                    if ( res.count > 0 ) {
                        if ( that.curVoiceName ) {
                            $('.audio').remove();
                            $('.index').append($('<audio style="display:none" controls="" class="audio" src="../../../static/voice/'+that.curVoiceName+'" autoplay="autoplay" id="audios"></audio>'));
                        }
                    }
                });

                // that.timer = setInterval(()=>{
                //     that.sendMessage();
                // }, 6000);
                // that.timer = setInterval(()=>{
                //     that.sendMessage();
                // }, 6000);

            });
            this.stompClient.ws.onclose = function ( evnt ) {
                setTimeout(()=>{
                    that.connect(); 
                }, 1000);
            }
            this.stompClient.debug = function(str) {
                // str 参数即为 debug 信息
            // append the debug log to a #debug div somewhere in the page using JQuery:
                console.log(str);
            };
        },
       
        //发送聊天信息
        sendMessage: function () {
            
            this.stompClient.send('/app/todo-orders/updates-count/'+this.token, {}, JSON.stringify({'lastTimestamp': this.updatesTime,'storeId':this.storeInfo.storeId}));
        },
        //  //发送聊天信息(语音服务)
        // sendMessageNotice: function () {
        //     this.stompClientNotice.send('/app/notice/'+this.token, {}, JSON.stringify({'lastTimestamp': this.noticeUpdatesTime,'storeId':this.storeInfo.storeId}));
        // },
        // 断开ws连接
        disconnect: function () {
            if (this.stompClient !== null) {
                this.stompClient.disconnect();
            }
        },// 断开ws连接(语音服务)
       
        getNoticeFn(val){
            this.$http.get(this.storeInfo.storeId+'/notic'+'?page='+(val-1)+'&size=10').then((res)=>{
                this.noticeBtn = true;
                this.noticeList = res.data.content;
                this.noticeTotalElements = res.data.totalElements;
            })
        },
        goInv(){
            window.open('https://inventory.huoxingy.com/#/login');
        }
    },
    created: function () {

        if (!sessionStorage.getItem('token')) {
            this.$router.push({path: '/login'});
            return;
        } else {
            this.token = sessionStorage.getItem('token');
        }
        if (sessionStorage.getItem('store')) {
            this.storeInfo = JSON.parse(sessionStorage.getItem('store'));
        };

        if ( localStorage.getItem('autoPrint')&&JSON.parse(localStorage.getItem('autoPrint')).autoPrint == 'ON' ) {
            this.printsBtn = true;
        } else if ( localStorage.getItem('autoPrint')&&JSON.parse(localStorage.getItem('autoPrint')).autoPrint == 'OFF' ) {
            this.printsBtn = false;
        } else {
            this.printsBtn = true;
            localStorage.setItem('autoPrint', JSON.stringify({autoPrint:'ON',placingOrder:1,watingOrder:1,exWork:1}));
        }
        // 开班信息
        if (sessionStorage.getItem('workshift')) {
            this.employeeInfo = JSON.parse(sessionStorage.getItem('workshift'));
        };
        // 订单音乐
        if ( localStorage.getItem('orderVoiceName') ) {
            this.curVoiceName = localStorage.getItem('orderVoiceName');
        } else {
            localStorage.setItem('orderVoiceName', 'voice_1.ogg');
        }

        if(!localStorage.getItem('totalClassify')){
            localStorage.setItem('totalClassify', 'DETAILARR');
        }
        this.settingObj = {
            orderVoiceName: localStorage.getItem('orderVoiceName'), // 订单提示音
            autoPrint: JSON.parse(localStorage.getItem('autoPrint')).autoPrint, // 自动打印
            totalClassify: localStorage.getItem('totalClassify'), // 自动打印
            pasterName: localStorage.getItem('pasterName'), // 小票打印
            printId: localStorage.getItem('printId'), // 厨房打印IP
            kitchIp: localStorage.getItem('kitchIp'), // 厨房打印端口
            kitchPort: localStorage.getItem('kitchPort') // 厨房打印端口
        }

        if (!this.storeInfo.storeId) {
            return;
        }

        // 获取店铺信息判断是否选择三方支付
        this.$http.get('/stores/'+this.storeInfo.storeId).then((res)=>{
            if ( res.data.payMode == "THIRD_PARTY" ) {
                this.isOnline = true;
            } else {
                this.isOnline = false;
            }
        })
        this.updatesTime = new Date(+JSON.parse(sessionStorage.getItem('workshift')).beginTime).toISOString().replace(/T/g, 'T').replace(/\.[\d]{3}Z/, 'Z');//tz时间
        this.noticeUpdatesTime = new Date(+JSON.parse(sessionStorage.getItem('workshift')).beginTime).toISOString().replace(/T/g, 'T').replace(/\.[\d]{3}Z/, 'Z');//tz时间
        // this.updatesCount();

        // 获得时间
        let date = new Date();
        let weekArr = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        this.dateStr = date.toLocaleDateString();
        // 如果是ie浏览器
        if ( !!window.ActiveXObject || "ActiveXObject" in window ) {

        } else {
            let dateStrSplit = this.dateStr.split('/');
            this.dateStr = dateStrSplit[0] + //年
                        "-"+ (dateStrSplit[1]<10 ? '0' + dateStrSplit[1] : dateStrSplit[1])+ //月
                        "-"+ (dateStrSplit[2]<10 ? '0' + dateStrSplit[2] : dateStrSplit[2]) //日
        }

        this.weekStr = weekArr[date.getDay()];
        this.timeStr = (date.getHours()<10?('0'+date.getHours()):date.getHours()) + ':' + (date.getMinutes()<10?('0'+date.getMinutes()):date.getMinutes());
        let that = this;
        this.intervalTimer = setInterval(()=>{
            let date = new Date();
            that.timeStr = (date.getHours()<10?('0'+date.getHours()):date.getHours()) + ':' + (date.getMinutes()<10?('0'+date.getMinutes()):date.getMinutes());
        }, 10000)

        // 创建ws连接
        // this.connect();
        // alert('created');
    },
    mounted: function () {
        // alert('mounted');
        this.connect();
        $(document).ready(() => {
            let that = this;
            $('.vipCheckList li').hover(function () {
                that.curVipIdx = $(this).index() - 1;
            }, function () {
                that.curVipIdx = 0;
            })
        });
    },
    beforeDestroy: function () {
        // 离开路由时，取消订单
        this.disconnect();
        // this.disconnectNotice();
        clearInterval(this.timer);
        clearInterval(this.timerNotice);
        clearInterval(this.intervalTimer);
        localStorage.removeItem("pasterName");
        sessionStorage.removeItem("store");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("workshift");
        sessionStorage.removeItem("ordersId");
        sessionStorage.removeItem("curSelectVipData");
    }
  }
</script>
<style lang="scss" scoped>
  @import "index";
</style>