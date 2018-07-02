<template>
    <div id="cashier" class="cashier" @click="goodList=[];addVipBtn=false">
        <div class="cashier_content">
            <div class="goods_box left">
                <div class="left" style="width:35%;height:100%;margin-right:2%;">
                    <div class="vipbox" :class="{heights:curSelectVipData}">
                        <!-- 会员信息框 -->
                        <div class="vip-info" :style="{display:curSelectVipData?'block':'none'}">
                            <span class="close-btn" @click="closeVipFn();deBindVip();">&times;</span>
                            <div class="space-height"></div>
                            <div class="item clearfix name_recharge">
                                <span class="left vipname" v-text="curSelectVipData.name"></span>
                                <span class="left recharge" @click="showRechargeBox=true;vipPayBtn=false">会员充值</span>
                                <div class="right selCoupon">
                                    <span class="name" @click="openCoupon">{{curBindCoupon[0]?curBindCoupon.length+'张优惠券':'选择优惠券'}}</span>
                                    <div class="curCouponBox" :style="{top:(-(curBindCoupon.length*30+10)/2+'px')}" v-if="curBindCoupon[0]">
                                        <li v-for="(item,idx) in curBindCoupon">
                                            <div class="left couponMsg" :title="item.couponName+'  商品抵用券 - '+item.productName">
                                                <span class="couponName" v-text="item.couponName"></span>
                                                <span v-text="'商品抵用券'"></span>
                                                <span>-</span>
                                                <span v-text="item.productName"></span>
                                            </div>
                                            <span class="right deBind" @click="relieveCoupon(item)">&times;</span>
                                        </li>
                                    </div>
                                </div>
                            </div>
                            <div class="space-height"></div>
                            <div class="item clearfix phone_price"><span class="left" v-text="curSelectVipData.mobile?curSelectVipData.mobile:curSelectVipData.code"></span><span class="right price" v-text="'￥'+curSelectVipData.amount"></span></div>
                            <div class="space-height"></div>
                        </div>
                        <!-- 选择会员内容框 -->
                        <div class="vip_up" :style="{display:(addVipBtn?'block':'none')}" @click.stop="">
                            <div class="closeBtn userNotSelect" @click="addVipBtn=false;">&times;</div>
                            <div class="vipInputBox flex flex-align-center">
                                <input type="text" class="vipInput" v-model="vipNumber" placeholder="输入会员账号">
                                <!-- <button type="button" @click="addVipFn">确认</button> -->
                            </div>
                            <ul class="vipCheckList">
                                <div class="leftIcon" :style="{top:(curVipIdx*40+'px'),display:(vipList[0]?'block':'none')}"></div>
                                <li v-for="item in vipList" @click.stop="addVipFn(item)">
                                    <div class="left name" v-text="item.name" :title="item.name"></div>
                                    <div class="right tel" v-text="item.mobile?item.mobile:item.code"></div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="goods_order">
                        <div class="add-vip-btn" :style="{display:curSelectVipData?'none':'block'}">
                            <button class="vip_btn" type="button" @click.stop="vipNumber='';addVipBtn=!addVipBtn;vipList=[]">
                                选择会员
                            </button>
                        </div>
                        <div class="scroll_out_box">
                            <div class="scroll_box">
                                <div class="scroll_inner_box">
                                    <div class="goods_order_item" v-for="(item,ind) in choiceArr">
                                        <p class="title_name ellipsis" :title="item.productName">{{item.productName}}</p>
                                        <div class="money_number clearfix" v-if="item.productName">
                                            <div class="left money">{{'&yen;'+(item.salesPrice/item.quantity).toFixed(2)}}</div>
                                            <div class="right number clearfix">
                                                <span class="number_reduction left userNotSelect" @click="reduceAmount(item)">-</span>
                                                <span class="amount left" v-text="item.quantity"></span>
                                                <span class="number_add left userNotSelect" @click="addAmount(item)">+</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="pay_box">
                            <div class="pay_li">
                                <div class="left flex flex-align-center">
                                    <span class="name">合计</span>
                                    <span class="number red" v-text="'￥'+totalPrice.total.toFixed(2)"></span>
                                </div>
                                <div class="right flex flex-align-center">
                                    <span class="name">总数</span>
                                    <span class="number" v-text="totalPrice.count"></span>
                                </div>
                            </div>
                            <div class="pay_li">
                                <div class="left flex flex-align-center red">
                                    <span class="name">优惠</span>
                                    <span class="number" v-text="'￥'+totalPrice.discount"></span>
                                </div>
                            </div>
                            <div class="pay_li">
                                <div class="left flex flex-align-center red">
                                    <span class="name">应付</span>
                                    <span class="number bigSize" v-text="'￥'+totalPrice.amount.toFixed(2)"></span>
                                </div>
                            </div>
                            <div class="pay_li">
                                <div class="left flex flex-align-center red">
                                    <span class="number" v-text="(curSelectVipData&&curSelectVipData.amount>=totalPrice.amount)?'可用会员余额支付结账':((curSelectVipData.amount<totalPrice.amount)?'会员余额不足，请提醒充值':'')">应付</span>
                                </div>
                            </div>
                            <!-- <div class="ready_order">
                                <button  type="button" class="right">挂单</button>
                            </div> -->
                            <div class="btnGroup">
                                <button class="delOrder" type="button" @click="showConfirmMask=true;">撤销</button>
                                <button class="pay_btn" type="button" @click="shopUpBox(true)">结账</button>
                            </div>
                        </div>
                        <div class="up_box" :class="{move_animation:upBtn}">
                            <div class="top_money">
                                <div class="returnBtn">
                                    <div class="left flex flex-align-center" @click="shopUpBox(false)">
                                        <i class="iconfont icon-fanhui"></i>
                                        <span>返回</span>
                                    </div>
                                </div>
                                <div class="totalPrice flex flex-align-center flex-pack-center" v-text="'￥'+totalPrice.amount.toFixed(2)"></div>
                                <div class="serialNumber flex flex-align-center">
                                    <span class="name">流水号</span>
                                    <span v-text="code"></span>
                                </div>
                            </div>
                            <p class="selPayType flex flex-align-center">选择支付方式</p>
                            <div class="pay_type clearfix">
                                <!-- <input name="Fruit" @click="changePayType('CASH')" type="radio" value="CASH" > -->
                                <span class="left size1" @click="changePayType('CASH')" :class="{span_active:payType == 'CASH'}">现金支付</span>
                                <span v-if="isOnline" class="left size1" @click="openPayCodeBox('PAYCARD')" :class="{span_active:payType == 'PAYCARD'}">在线支付</span>

                                <span v-if="!isOnline" class="left size1" :class="{span_active:payType == 'ALIPAY_CASH'}"><input name="Fruit" type="radio" value="ALIPAY_CASH" v-model="payType">支付宝支付</span>
                                <span v-if="!isOnline" class="left size1" :class="{span_active:payType == 'WECHATPAY_CASH'}"><input name="Fruit" type="radio" value="WECHATPAY_CASH" v-model="payType">微信支付</span>

                                <!-- <span class="left size1" :class="{span_active:payType == 'MEMBER'}" v-if="curSelectVipData"><input name="Fruit" type="radio" value="MEMBER" v-model="payType">会员支付</span> -->
                                <span class="left size1" :class="{span_active:payType == 'MEMBER'}" v-if="curSelectVipData" @click="changePayType('MEMBER')">会员支付</span>
                            </div>
                            <div class="prints clearfix notes">
                                <div class="check left">
                                    <span>座位号</span>
                                </div>
                                <div class="input-num left">
                                    <input type="text" placeholder="输入座位号" v-model="tableNo">
                                </div>
                            </div>
                            <div class="prints clearfix notes">
                                <div class="check left">
                                    <span>备注</span>
                                </div>
                                <div class="input-num left">
                                    <input type="text" placeholder="请输入口味、偏好等要求" v-model="notes">
                                </div>
                            </div>
                            <div class="prints clearfix">
                                <div class="check left">
                                    <span>打印单据</span>
                                    <input type="checkbox" v-model="localPrintsBtn">
                                </div>
                                <div class="input-num left" v-if="localPrintsBtn">
                                    <input type="text" placeholder="输入打印份数" v-model="printsNum">
                                </div>
                            </div>
                            <div class="sure_pay">
                                <button @click="confirmPayment" type="button">确认支付</button>
                            </div>
                        </div>
                        <div class="userPayCodeBox" v-if="showPayCodeBox">
                            <form class="userPayCode" @submit.prevent="confirmPayment">
                                <div class="tipText">
                                    * 请输入或者扫描用户付款码
                                </div>
                                <div class="inputBox">
                                    <input type="text" id="" v-focus autocomplete="off" v-model="payCode">
                                </div>
                                <div class="btnGroup">
                                    <button type="submit" class="save">确认</button>
                                    <button type="button" class="cancel" @click="showPayCodeBox=false">取消</button>
                                </div>
                            </form>
                        </div>
                        <div class="payLoding" v-if="showPayLoding">
                            <div class="payLodeBox">
                                <div class="payLoadImg">
                                    <i class="iconfont icon-looding"></i>
                                </div>
                                <p v-if="payType == 'PAYCARD' || payVipType == 'PAYCARD'">支付中，请等待！</p>
                                <!-- <p v-if="payType == 'PAYCARD' || payVipType == 'PAYCARD'">请在3分钟内完成支付，超时将自动取消。</p> -->
                                <div class="btnGroup" v-if="payType == 'PAYCARD' || payVipType == 'PAYCARD'">
                                    <button type="button"  @click="deletePayment(orderId)" :class="canDeletepayment?'cancel':'cancel wd'" v-text="canDeletepayment?'取消支付':('取消支付('+delPaymentLodingTime+'s)')"></button>
                                    <!-- <button type="button" class="save" @click="aNewOrder">挂起此单</button> -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="goods_item_box left">
                    <div class="searchGood clearfix" @keyup.enter="choiceGoods(goodList[0])">
                        <i class="iconfont icon-sousuo sousuo"></i>
                        <input type="text" class="right" id="searchInput" v-model="goodSearch" placeholder="商品检索">
                        <ul class="goodCheckList" :style="{display:(goodList[0]?'block':'none')}" @click.stop="">
                            <div class="leftIcon" :style="{top:(curGoodIdx*40+'px')}"></div>
                            <li v-for="item in goodList" @click="choiceGoods(item);goodList=[]">
                                <div class="left name" v-text="item.name"></div>
                            </li>
                        </ul>
                    </div>
                    <div class="right_scroll_box">
                        <div class="scroll_inner_box">
                            <div class="goods_item">
                                <div class="goods_item_inner_box clearfix">
                                    <div class="goods_li left" v-for="(item,ind) in curSelectGoodsData.products">
                                        <div class="imgBox">
                                            <!-- <div class="inventoryNumber clearfix " :class="{'nowNotSupply':item.supplyTimes==='[]'||item.supplyTimes===null?false:true,'inventoryNumberSpace':item.productStatus=='ON'?false:true}"> -->
                                            <div class="inventoryNumber clearfix " :class="{'':doShowSupply(item.supplyTimes),'inventoryNumberSpace':item.productStatus=='ON'?false:true}">
                                                <span @click="showpProductStatus(item)" v-if="item.id.length>4">
                                                        <span class="left"  v-text="item.productStatus=='ON'?'已上架':'已下架'"></span>
                                                <i class="iconfont icon-xialajiantou"></i>
                                                </span>
                                                <span class="right" v-text="item.isStockEnabled?'×'+item.quantity:'无限'"></span>
                                            </div>
                                            <div @click="choiceGoods(item)" class="imgBoxBottom">
                                                <p v-text="item.name" class="p" :title="item.name"></p>
                                                <p v-text=" '￥' + item.salesPrice" class="p sales_price"></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="goods_item" v-for="(item,ind) in curSelectGoodsData.subTypes">
                                <p v-text="item.typeName" class="title_name"></p>
                                <div class="goods_item_inner_box clearfix">
                                    <div class="goods_li left" v-for="oitem in curSelectGoodsData.subTypes[ind].products">
                                        <div class="imgBox">
                                            <!-- <div class="inventoryNumber clearfix" :class="{'nowNotSupply':oitem.supplyTimes==='[]'||oitem.supplyTimes===null?false:true,'inventoryNumberSpace':oitem.productStatus=='ON'?false:true}"> -->
                                            <div class="inventoryNumber clearfix" :class="{'':doShowSupply(oitem.supplyTimes),'inventoryNumberSpace':oitem.productStatus=='ON'?false:true}">
                                                <span @click="showpProductStatus(oitem)">
                                                        <span class="left" v-text="oitem.productStatus=='ON'?'已上架':'已下架'" ></span>
                                                <i class="iconfont icon-xialajiantou"></i>
                                                </span>
                                                <span class="right" v-text="oitem.isStockEnabled?'×'+oitem.quantity:'无限'"></span>
                                            </div>
                                            <div @click="choiceGoods(oitem)" class="imgBoxBottom">
                                                <p v-text="oitem.name" class="p"></p>
                                                <p v-text=" '￥' + oitem.salesPrice" class="p sales_price"></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="goods_type_nav left">
                <div class="scroll">
                    <div v-if="goodsData[0].typeName" class="nav_text" :class="{nav_text_active:curIdx==index}" v-for="(oitem,index) in goodsData">
                        <span v-text="oitem.typeName" class="bigType left" @click="selGoodType(index)" :title="oitem.typeName"></span>
                        <span v-for="(item,idx) in oitem.subTypes" class="smallType left" @click="selSmallGoodType(index, idx)" v-text="item.typeName"></span>
                        <i v-if="curIdx==index&&curSmallTypeIdx>=0" class="iconfont icon-jiantou1" :style="{top:(70+curSmallTypeIdx*54)+'px'}"></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="mask" v-if="showConfirmMask" @click="showConfirmMask=false">
            <div class="orderConfirmBox" @click.stop="">
                <div class="title">提示</div>
                <p>确认删除此单？</p>
                <div class="btnGroup">
                    <button type="button" class="cancel" @click="showConfirmMask=false">取消</button>
                    <button type="button" class="save" @click="delOrder">确认</button>
                </div>
            </div>
        </div>
        <div class="mask" v-if="productStatus.btn" @click="productStatus.btn=false">
            <div class="orderConfirmBox" @click.stop="">
                <div class="title">提示</div>
                <p>商品 <span style="color:red;height:103%;display:inline-block;vertical-align: middle;max-width: 150px;overflow: hidden; text-overflow: ellipsis;white-space: nowrap" :title="productStatus.name">{{productStatus.name}}</span> 将 <span style="color:red;">{{productStatus.status=='ON'?'下架':'上架'}}</span>，是否继续？</p>
                <div class="btnGroup">
                    <button type="button" class="cancel" @click="productStatus.btn=false">取消</button>
                    <button type="button" class="save" @click="sureProductStatus">确认</button>
                </div>
            </div>
        </div>
        <div class="mask" v-if="showCustomPrice" @click="showCustomPrice=false">
            <div class="customPriceBox" @click.stop="">
                <div class="title">自定义网费</div>
                <div class="inner">
                    <input type="text" id="customPriceInput" v-model="customPrice" placeholder="请输入自定义网费价格" @keyup.enter="confirmCustomPrice">
                </div>
                <div class="btnGroup">
                    <button type="button" class="cancel" @click="showCustomPrice=false">取消</button>
                    <button type="button" class="save" @click="confirmCustomPrice">确认</button>
                </div>
            </div>
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
        <div class="vipRechargeMask" v-if="showRechargeBox" @click="showRechargeBox=false">
            <div class="vipRechargeBox" @click.stop="">
                <div class="title">会员充值</div>
                <div class="vipMsg clearfix">
                    <div class="name left">会员名称：</div>
                    <div class="val left" v-text="curSelectVipData.name"></div>
                    <div class="name left">会员帐号：</div>
                    <div class="val left" v-text="curSelectVipData.mobile?curSelectVipData.mobile:curSelectVipData.code"></div>
                </div>
                <div class="selMoneyBox">
                    <div class="recharge-scroll-box" v-if="!vipPayBtn">
                        <div class="item" v-for="item in rulesData" @click="choiceRules(item)"><span v-text="item.name"></span></div>
                        <div class="input-recharge">
                            <div class="clearfix">
                                <span class="left">自定义金额：</span>
                                <input class="left" type="text" placeholder="请输入充值金额" v-model="inputVipMoney">
                            </div>
                        </div>
                    </div>
                    <div class="btnGroup" v-if="!vipPayBtn">
                        <button type="button" class="cancel" @click="showRechargeBox=false">取消</button>
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
                            <!-- <input name="Fruit" type="radio" value="CASH" v-model="payVipType"> -->
                            <span class="left size1 dfgdfgdf" @click="changeVipPayType('CASH')" :class="{span_active:payVipType == 'CASH'}">现金支付</span>
                            <!-- <input name="Fruit" type="radio" value="PAYCARD" v-model="payVipType"> -->
                            <span v-if="isOnline" class="left size1" @click="openPayCodeBoxForVip('PAYCARD')" :class="{span_active:payVipType == 'PAYCARD'}">在线支付</span>

                            <span v-if="!isOnline" class="left size1" :class="{span_active:payVipType == 'ALIPAY_CASH'}"><input name="Fruit" type="radio" value="ALIPAY_CASH" v-model="payVipType">支付宝支付</span>
                            <span v-if="!isOnline" class="left size1" :class="{span_active:payVipType == 'WECHATPAY_CASH'}"><input name="Fruit" type="radio" value="WECHATPAY_CASH" v-model="payVipType">微信支付</span>
                        </div>
                        <div class="sure_pay">
                            <button @click="vipPayFn" type="button">确认支付</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="vipCouponMask" v-if="showSelCoupon" @click="showSelCoupon=false">
            <div class="vipCouponBox" @click.stop="">
                <div class="title">会员优惠券</div>
                <div class="vipMsg clearfix">
                    <div class="name left">会员名称：</div>
                    <div class="val left" v-text="curSelectVipData.name"></div>
                    <div class="name left">会员帐号：</div>
                    <div class="val left" v-text="curSelectVipData.mobile?curSelectVipData.mobile:curSelectVipData.code"></div>
                </div>
                <div class="selCouponBox">
                    <div class="coupon-scroll-box">
                        <div class="item" v-for="(item,idx) in couponList" :class="{active:idx==curCouponIdx}" @click="curCouponData=item;curCouponIdx=idx;">
                            <span class="coupon_title" v-text="item.title"></span>
                            <div class="left typeAddProduct">
                                <span class="typeName" v-text="couponType[item.type]"></span>
                                <span>-</span>
                                <span v-text="item.productName"></span>
                            </div>
                            <div class="deadLine">
                                <span>有效日期：</span>
                                <span>{{item.beginTime | numberToAllDate('')}}</span>
                                <span>~</span>
                                <span>{{item.endTime | numberToAllDate('')}}</span>
                            </div>
                        </div>
                    </div>
                    <div class="btnGroup">
                        <button type="button" class="cancel" @click="showSelCoupon=false">取消</button>
                        <button type="button" class="save" @click="choiceCoupon()">确认</button>
                    </div>
                </div>
            </div>
        </div>
        <div style="display:none;">
            <div id="receipt">
                <div style="width: 164px; fontSize: 12px;">
                    <h1 style="text-align:center;font-size:18px;"  v-text="'欢迎光临'+storeName">欢迎使用火星捕手</h1>
                    <p style="text-align:center;font-size:16px;" v-text="'销售单据'"></p>
                    <div>
                        <span>座位号:</span>
                        <span style="font-size:18px;" v-text="printData.tableNo"></span>
                    </div>
                    <div>
                        <span>打印时间:</span>
                        <span>{{new Date() | numberToAllDate('')}}</span>
                    </div>
                    <div>
                        <span>流水号:</span>
                        <span>{{code}}</span>
                    </div>
                    <div style="margin-bottom: 10px;">
                        <span>创建人:</span>
                        <span>{{storeInfo.employeeName}}</span>
                    </div>
                    <div v-for="(item,idx) in printData.goodArr" v-if="item.productName">
                        <div>
                            <span>名称：</span>
                            <span v-text="item.productName"></span>
                        </div>
                        <div style="width:35%;display:inline-block">
                            <span>数量：</span>
                            <span v-text="item.quantity"></span>
                        </div>
                        <div style="width:60%;display:inline-block">
                            <span>单价：</span>
                            <span v-text="(item.salesPrice/item.quantity).toFixed(2)"></span>
                        </div>
                        <div style="line-height:3px;">----------------------------------</div>
                    </div>
                    <div style="margin-top: 10px;">
                        <span>合计：</span>
                        <span v-text="printData.total.toFixed(2)"></span>
                    </div>
                    <div>
                        <span>总数：</span>
                        <span v-text="printData.count"></span>
                    </div>
                    <div>
                        <span>优惠：</span>
                        <span v-text="printData.discount.toFixed(2)"></span>
                    </div>
                    <div>
                        <span>应付：</span>
                        <span v-text="printData.amount.toFixed(2)"></span>
                    </div>
                    <div>
                        <span>备注：</span>
                        <span v-text="printData.notes"></span>
                    </div>
                </div>
            </div>
        </div>
        <div style="display:none;">
            <div id="paster">
                <div style="text-align:center">乐事薯片柠檬味</div>
                <div style="text-align:center">￥5.00</div>
            </div>
        </div>
        <div style="display: none" id="speech_voice" v-text="voice_text"></div>
    </div>
</template>

<script type="text/javascript">
export default {
    props: ['routeSelectVipData','storeId', 'printsBtn', 'isOnline','storeName'],//storeId店铺id，orderId 订单id 是否走银行通道 isOnline
    data(){
        return{
            storeInfo:{},//店铺信息
            inputVipMoney:"",//自定义充值金额
            vipObj:{},//会员充值信息
            vipPayBtn:false,//会员充值
            rulesData:[],//充值规则数组
            addVipBtn: false, // 控制会员添加弹出框
            showRechargeBox: false, // 显示会员充值框
            showSelCoupon: false, // 选择优惠券弹框
            vipNumber: '', // 会员帐号
            vipList: [], // 会员列表
            curVipIdx: 0, // 当前会员索引
            searchVipBtn: true, // 搜索会员接口控制
            curSelectVipData: '', // 会员数据

            choiceArr: [], // 选择商品列表
            curActiveBtn: 0,
            upBtn: false,  // 控制挂单弹出框样式
            payType : "", // 商品支付方式
            payVipType : "", // 会员支付方式

            newOrderStatus: { // 判断需要生成新订单的状态
                UNFINISHED:1,
                FINISHED:1,
                CANCELED:1,
                REFUNDED:1,
            },
            couponType: {
                'GET_ITEM_FREE': '商品抵用券'
            },

            goodsData:[ // 全部商品数据
                {
                    products:[],
                    subTypes:[
                        {
                            products:[]
                        }
                    ]
                }
            ], // 商品列表
            curSelectGoodsData: [], // 当前选中的商品数据
            curIdx:0, // 当前选择商品分类索引
            curSmallTypeIdx: -1, // 当前选择细类索引
            totalPrice: { // 选择商品总计
                count: 0, // 总数量
                total: 0, // 总计金额
                discount: 0, // 优惠金额
                amount: 0, // 最终价格
            },
            orderId: this.ordersId, // 订单id
            paymentBtn: true, // 支付控制，true:可以支付
            goodSearch: '', // 商品搜索
            curGoodIdx: 0, // 当前商品索引
            goodList: [], // 模糊检索商品列表
            code:'',//流水号

            addGoodBtn: true, // 控制添加商品
            reduceGoodBtn: true, // 控制减少商品

            pageSize: 5, // 默认选择商品数量
            productStatus: {//商品上下架
                status:'',
                id:'',
                btn:false,
                name:''
            },
            showConfirmMask: false, // 删除订单确认
            showOnLinePaySuccessMask: false, // 在线支付成功
            localPrintsBtn: this.printsBtn,//是否单据打印
            printsNum:1,//单据打印的份数
            notes:'',//备注
            tableNo:'',//座位号
            payApiBtn: true, // 支付情况控制

            payCode: '', // 用户支付授权码
            showPayCodeBox: false, // 是否显示在线支付
            showPayLoding: false, // 是否显示等待支付框

            printData: { //打印数据
                goodArr: [],
                count: 0, // 总数量
                total: 0, // 总计金额
                discount: 0, // 优惠金额
                amount: 0, // 最终价格
                tableNo: '', // 座位号
                notes: '', // 备注
                createTime:0
            },
            isCostPrintBtn:false,//是否打印网费

            couponList: [], // 优惠券列表
            curBindCoupon: [], // 当前已经绑定了的优惠券列表
            curCouponData: {}, // 当前选择优惠券
            curCouponIdx: 0, // 当前选中优惠券索引

            curCouponPage: 0, // 优惠券页码
            couponPageSize: 1000, // 优惠券每页条数

            timeNum: true, // 支付等待时间
            payLoadTimer:'',//支付时间控制器
            showCustomPrice: false, // 显示自定义充值框
            customPrice: '', // 自定义价格

            voice_text: '', // 文字转语音

            canDeletepayment: false, // 是否能取消支付
            delPaymentLodingTime: 15, // 取消支付等待时间
            delPaymentApiBtn: true, //
        }
    },
    watch:{
        //搜索获取会员
        vipNumber (val) {
            if ( !this.searchVipBtn || !val ) {
                return;
            }
            this.searchVipBtn = false;
            this.$http.get('members?storeId='+this.storeId+'&q='+val).then((res) => {
                this.vipList = res.data;
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
        printsBtn ( val ) {
            this.localPrintsBtn = val;
        },
       //搜索获取商品
        goodSearch ( val ) {
            if ( !(val.replace(/\s/g,'')) ) {
                this.goodList = [];
                return;
            }
            this.$http.get('products/search?storeId='+this.storeId+'&q='+encodeURI(val)).then((res)=>{
                this.goodList = res.data;
                setTimeout(()=>{
                    let that = this;
                    $('.goodCheckList li').hover( function () {
                        that.curGoodIdx = $(this).index()-1;
                    }, function () {
                        that.curGoodIdx = 0;
                    })
                },0)
            })
        },
    },
    methods:{
        doShowSupply(info){
            let date = new Date();
            let nowH = date.getHours();
            let nowM = date.getMinutes();

            console.log('当前时间为:'+nowH+' 分钟数wei:'+nowM);
            let notSupply = true;
            if(info!=='[]'&&info!==null){
                let timeData = JSON.parse(info);
                for(let i=0;i<timeData.length;i++){
                    if(nowH>=timeData[i].beginHour&&nowH<=timeData[i].endHour){
						if(nowH==timeData[i].beginHour&&nowM<timeData[i].beginMinute){
                            notSupply = true;
                            return notSupply;           
                        }
                        if(nowH==timeData[i].endHour&&nowM>timeData[i].endMinute){
                            notSupply = true;
                            return notSupply;           
                        }
                        notSupply = false;
                        return notSupply;
                    }
                }
                return notSupply;
            }else{
                return false;
            }
        },
        changePayType(str){
            this.payType = str;
            console.log("当前支付方式："+this.payType)
        },
        changeVipPayType(vipStr){
            this.payVipType = vipStr;
            console.log("vip支付方式为："+this.payVipType)
        },
        //获取即将切换的商品状态
        showpProductStatus(item){
            this.productStatus.id=item.id;
            this.productStatus.name=item.name;
            this.productStatus.status=item.productStatus;
            this.productStatus.btn=true;
        },
        //切换商品状态
        sureProductStatus(){
            this.$http.post(this.productStatus.id+'/products-status?status='+(this.productStatus.status=="ON"?'OFF':'ON')).then((res)=>{
                this.productStatus = {
                    id:'',
                    name:'',
                    status:'',
                    btn:false
                }
                this.getGoods();
                this.$message({
                    message: '修改成功',
                    showClose: true,
                    type: 'success'
                });
            })
        },
        // 清除当前会员信息。回到选择会员
        closeVipFn(){
            this.vipPayBtn = false;
            this.showRechargeBox = false;
            this.curSelectVipData = '';
        },
         // 选择商品分类
        selGoodType: function (index) {
            $("#searchInput").focus();
            if ( this.curIdx !== index ) {
                $($('.goods_type_nav .nav_text')[index]).css('height', 'auto');
            } else {
                if ( $($('.goods_type_nav .nav_text')[index]).css('height') == '50px' ) {
                    $($('.goods_type_nav .nav_text')[index]).css('height', 'auto');
                } else {
                    $($('.goods_type_nav .nav_text')[index]).css('height', '50px');
                }
            }
            this.curIdx = index;
            this.curSmallTypeIdx = -1;
            this.curSelectGoodsData = this.goodsData[this.curIdx];
            this.vipPayBtn = false;
            this.showRechargeBox = false;
        },
        // 解除会员绑定
        deBindVip: function () {
            if( sessionStorage.getItem('ordersId') ) {
                this.orderId = sessionStorage.getItem('ordersId');
                let vipDataId = (this.curSelectVipData&&this.curSelectVipData.id)?this.curSelectVipData.id:'';
                this.$http.put('orders/'+this.orderId+'/relieveMember?memberId='+vipDataId).then((res)=>{
                    this.curSelectVipData = '';
                    this.$http.get('orders/'+this.orderId).then((ress)=>{
                        let resBody = ress.data;
                        this.totalPrice = {
                            count:    resBody.count, // 总数量
                            total:    resBody.total, // 总计金额
                            discount: resBody.discount, // 优惠金额
                            amount:   resBody.amount // 最终价格
                        };
                    });
                })
            }
        },
       
        // 选择小类商品
        selSmallGoodType: function ( index, smallIdx ) {
            this.curIdx = index;
            this.curSmallTypeIdx = smallIdx;
            this.curSelectGoodsData = this.goodsData[index].subTypes[smallIdx];
        },
        //选择充值规则进行充值
        choiceRules(item){
            if( item ){
                this.inputVipMoney = '';//防止用户填了自定义充值，但结果选了冲送规则。
            }else {
                if(!/^(0|[1-9][0-9]{0,9})(\.[0-9]{1,2})?$/.test(this.inputVipMoney)|| this.inputVipMoney == 0){
                    this.$message({
                        message: '充值金额输入有误',
                        showClose: true,
                        type: 'error'
                    });
                    return;
                }
            }
            this.payVipType = 'CASH';
            let sendBody = {
                "storeId": this.storeId,
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
       
        //点击会员列表，选择确定当前会员
        addVipFn(item){
            this.curBindCoupon = [];//清除会员已经绑好的优惠券
            this.vipANDdata(item);//绑定会员和当前订单
            this.curSelectVipData = item;
            this.curSelectVipData.amount = this.curSelectVipData.amount.toFixed(2);
            this.addVipBtn = false;
        },
        // 获取商品列表
        getGoods(){
            if ( !this.storeId ) {
                return;
            }
            this.$http.get('index?storeId='+ this.storeId).then((res)=>{
                if ( !res.data || !res.data[0] ) {
                    return;
                }
                this.goodsData = res.data;
                this.curSelectGoodsData = this.goodsData[this.curIdx];
                $('.goods_type_nav .nav_text').css('height', '50px');
                $($('.goods_type_nav .nav_text')[this.curIdx]).css('height', 'auto');
            })
        },
          // 绑定会员和订单
        vipANDdata ( vipData ) {
            let vipDataId = (vipData&&vipData.id)?vipData.id:'';
            if( sessionStorage.getItem('ordersId') ){
                this.orderId = sessionStorage.getItem('ordersId');
                this.$http.put('orders/'+this.orderId+'/attachMember?memberId='+vipDataId).then((res)=>{
                    this.$message({
                        message: '成功绑定会员',
                        showClose: true,
                        type: 'success'
                    });
                })
            } else {
                this.orderId = '';
            }
        },
        // 选择商品
        choiceGoods( item ){
            // 如果在选择支付方式界面，直接返回
            this.goodSearch = '';
            if ( this.upBtn ) return;
            if ( item.id == '0' ) {
                this.showCustomPrice = true;
                this.customPrice = '';
                setTimeout(()=>{
                    $('#customPriceInput').focus();
                })
                return;
            }
            this.addProduct( item.id );
        },
        // 确定自定义商品
        confirmCustomPrice: function () {
            if ( this.customPrice ) {
                this.customPrice = this.customPrice.replace(/\s+/g, "");
            }
            if ( !/^[0-9]*[1-9][0-9]*$/.test(this.customPrice) ) {
                this.$message({
                    message: '请输入正整数',
                    showClose: true,
                    type: 'error'
                })
                return;
            }
            this.addProduct( '0', this.customPrice);
            this.showCustomPrice = false;
        },
        // 增加数量
        addAmount: function ( item ) {
            if ( this.upBtn ) return;
            if ( item.productId == '0' ) return;
            this.addProduct( item.productId );
        },
        // 减少数量
        reduceAmount: function ( item ) {
            if ( this.upBtn ) return;
            this.reduceProduct( item.productId );
        },
        
        // 添加商品
        addProduct: function ( productId, isCustom ) {
            if ( !this.addGoodBtn ) {
                return;
            }
            this.addGoodBtn = false;
            let data = {
                "productId": productId,
                "productCount": 1,
            }
            if ( isCustom ) {
                data = {
                    "productId": productId,
                    "productCount": 1,
                    "amount": this.customPrice
                }
            }
            if(sessionStorage.getItem('ordersId')){
                //有本地id就赋值 ，
                this.orderId = sessionStorage.getItem('ordersId')
            }else{
                //没有就新建id
                let url='?createTime='+new Date().getTime()+'&storeId='+this.storeId;
                if( this.curSelectVipData ){
                    url+='&memberId='+this.curSelectVipData.id
                }
                this.$http.put('/create-orders'+url).then((res)=>{
                    sessionStorage.setItem('ordersId',res.data.id);
                    this.orderId = res.data.id;
                    this.code = res.data.code;
                    this.$http.post('orders/' + this.orderId + '/add', data).then((res)=>{
                        let body = res.data;
                        this.choiceArr = body.items;
                        this.totalPrice = {
                            count:    body.count, // 总数量
                            total:    body.total, // 总计金额
                            discount: body.discount, // 优惠金额
                            amount:   body.amount, // 最终价格
                        }
                        for (let i = 0, len = this.pageSize - this.choiceArr.length; i < len; i++) {
                            this.choiceArr.push({});
                        }
                        this.addGoodBtn = true;
                    }).catch( ( err )=>{
                        this.addGoodBtn = true;
                        if ( err.response.status === 400 ) {
                            this.searchOrderType();
                        }
                    })
                })
                return;
            }
            this.$http.post('orders/' + this.orderId + '/add', data).then((res)=>{
                let body = res.data;
                this.choiceArr = body.items;
                this.totalPrice = {
                    count:    body.count, // 总数量
                    total:    body.total, // 总计金额
                    discount: body.discount, // 优惠金额
                    amount:   body.amount, // 最终价格
                }
                for (let i = 0, len = this.pageSize - this.choiceArr.length; i < len; i++) {
                    this.choiceArr.push({});
                }
                this.addGoodBtn = true;
            }).catch( ( err )=>{
                this.addGoodBtn = true;
                if ( err.response.status === 400 ) {
                    this.searchOrderType();
                }
            })
        },
        // 减少商品
        reduceProduct: function ( productId ) {
            if ( !this.reduceGoodBtn ) {
                return;
            }
            this.reduceGoodBtn = false;
            this.$http.post('orders/' + this.orderId + '/remove', {
                "productId": productId,
                "productCount": 1,
            }).then((res)=>{
                let body = res.data;
                if(body==''){
                    //订单已经删除
                    sessionStorage.removeItem('ordersId');
                    this.curBindCoupon = [];
                    this.orderId = ''; 
                    this.choiceArr = [{},{},{},{},{}];
                    this.totalPrice = {
                        count: 0, // 总数量
                        total: 0, // 总计金额
                        discount: 0, // 优惠金额
                        amount: 0, // 最终价格
                    };
                    this.reduceGoodBtn = true;
                    return;
                }
                this.choiceArr = body.items;
                this.totalPrice = {
                    count: body.count, // 总数量
                    total: body.total, // 总计金额
                    discount: body.discount, // 优惠金额
                    amount: body.amount, // 最终价格
                }
                this.curBindCoupon = body.couponInstances;
                for (let i = 0, len = this.pageSize - this.choiceArr.length; i < len; i++) {
                    this.choiceArr.push({});
                }
                this.reduceGoodBtn = true;
            }).catch(( err )=>{
                this.reduceGoodBtn = true;
                if ( err.response.status === 400 ) {
                    this.searchOrderType();
                }
            })
        },
        // 选择支付方式
        shopUpBox(boo){
            if ( !(this.choiceArr[0].productName) ) {
                return;
            }
            this.payType = 'CASH';
            if(this.curSelectVipData&&this.curSelectVipData.amount>=this.totalPrice.amount){
                this.payType = 'MEMBER';
            }
            //挂单弹出框
            this.upBtn = boo;
            console.log("打开支付方式界面后默认支付方式为："+this.payType);
        },
        //会员充值
        vipPayFn(){
            this.canDeletepayment = false;
            if ( !this.payCode && this.payVipType == 'PAYCARD'  ) {
                this.$message({
                    message: '请输入收款码',
                    showClose: true,
                    type: 'error'
                })
                return;
            }
            if ( !this.payApiBtn ) {
                return;
            }
            this.payApiBtn = false;
            this.showPayCodeBox = false;
            this.showPayLoding = true;
            if ( this.payVipType !== "PAYCARD" ) {
                this.payCode = '';
            }
            if ( this.vipObj.amount <= 0 ) {
                return;
            }
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

                    this.delPaymentLodingTimer();
                    this.payLoadTimer = setInterval(()=>{
                        overTimeNum += 2;
                        let that = this;
                        if ( overTimeNum >= 180 ) { // 超过180秒，取消订单
                            clearInterval(this.payLoadTimer);
                            // this.payApiBtn = true;
                            // this.showPayLoding = false;
                            // this.showRechargeBox = false;
                            // this.$message({
                            //     message: '支付超时，当前订单已取消！',
                            //     showClose: true,
                            //     type: 'error'
                            // })
                            // this.deletePayment( curOrderId );
                            return;
                        }
                        this.payLoad(curOrderId, function () {
                            clearInterval(that.payLoadTimer);
							var iframe = "<iframe id='iframes' height='0' width='0' src='https://api.huoxingy.com/v1/pos/speech?tex=成功到账"+that.vipObj.amount+"元&vol=9&per=0&spd=5&pit=5' frameborder='0'></iframe>";
	                        $('#cashier').append(iframe)
	                        setTimeout(()=>{
	                            $("#iframes").remove();
	                        },8000)
//                          that.voice_text = '成功到账'+that.vipObj.amount+'元';
//                          setTimeout(()=>{
//                              $('#speech_voice').speech({
//                                  "speech": false,
//                                  "speed": 3,
//                              });
//                          })
                            that.getMemberData(that.curSelectVipData.id);
                            that.$message({
                                message: '充值成功',
                                showClose: true,
                                type: 'success'
                            });
                            that.showRechargeBox = false;
                            that.vipPayBtn = false;
                            that.showPayLoding = false;
                            that.showOnLinePaySuccessMask = true;
                            that.inputVipMoney = '';
                            setTimeout(()=>{
                                that.payApiBtn = true;
                            }, 300)
                        })
                    }, 2000)
                } else {
                    if ( this.payVipType == 'PAYCARD' ) {
                        this.showOnLinePaySuccessMask = true;
                        var iframe = "<iframe id='iframes' height='0' width='0' src='https://api.huoxingy.com/v1/pos/speech?tex=成功到账"+this.vipObj.amount+"元&vol=9&per=0&spd=5&pit=5' frameborder='0'></iframe>";
                        $('#cashier').append(iframe)
                        setTimeout(()=>{
                            $("#iframes").remove();
                        },8000)
//                      this.voice_text = '成功到账'+this.vipObj.amount+'元';
//                      setTimeout(()=>{
//                          $('#speech_voice').speech({
//                              "speech": false,
//                              "speed": 3,
//                          });
//                      })
                    }
                    this.$message({
                        message: '充值成功',
                        showClose: true,
                        type: 'success'
                    });
                    this.getMemberData(this.curSelectVipData.id);
                    this.showRechargeBox = false;
                    this.vipPayBtn = false;
                    this.showPayLoding = false;
                    this.inputVipMoney = '';
                    setTimeout(()=>{
                        this.payApiBtn = true;
                    }, 300)
                }
            }).catch(()=>{
                this.payCode = '';
                this.showPayLoding = false;
                this.payApiBtn = true;
            })
        },
        delPaymentLodingTimer: function () {
            setTimeout(()=>{
                this.delPaymentLodingTime--;
                if ( this.delPaymentLodingTime <= 0 ) {
                    this.canDeletepayment = true;
                    this.delPaymentLodingTime = 15;
                } else {
                    this.delPaymentLodingTimer();
                }
            },1000)
        },
        //备注
        orderNotes(){
            let body = {
                notes:this.notes
            }
            this.$http.post('orders/'+this.orderId+'/notes',body).then((res)=>{
                this.notes = '';
            })
        },
        // 确认支付
        confirmPayment: function () {
            if ( this.vipPayBtn ) {
                this.vipPayFn();
                return;
            }
            this.canDeletepayment = false;
            if(this.localPrintsBtn&&this.printsNum==''){
                this.$message({
                    message: '请输入打印份数',
                    showClose: true,
                    type: 'error'
                })
                return;
            }
            if ( !this.payCode && this.payType == 'PAYCARD' ) {
                this.$message({
                    message: '请输入收款码',
                    showClose: true,
                    type: 'error'
                })
                this.openPayCodeBox('PAYCARD');
                return;
            }
            if ( !this.paymentBtn ) { // 不能支付
                return;
            }
            this.paymentBtn = false;
            this.showPayCodeBox = false;
            if ( this.payType !== "PAYCARD" ) {
                this.payCode = '';
            }
            let data = {
                "orderId": this.orderId,
                "channel": this.payType,
                "amount": this.totalPrice.amount,
                "authCode": this.payCode,
                "tableNo": this.tableNo,
                "notes": this.notes
            }
            this.printData = {
                goodArr: this.choiceArr,
                count: this.totalPrice.count, // 总数量
                total: this.totalPrice.total, // 总计金额
                discount: this.totalPrice.discount, // 优惠金额
                amount: this.totalPrice.amount, // 最终价格
                tableNo: this.tableNo,
                notes: this.notes,
                createTime:0
            }
            if ( this.totalPrice.count <= 0 && this.totalPrice.total <= 0 ) {
                return;
            }
            this.showPayLoding = true; // 显示等待框

            this.$http.put('payments/' + this.$uuid(), data).then((res)=>{
                this.printData.createTime = res.data.createTime;
                this.payCode = '';
                if ( res.status === 202 ) {
                    let overTimeNum = 0;
                    let curOrderId = this.orderId;

                    this.delPaymentLodingTimer();
                    this.payLoadTimer = setInterval(()=>{
                        overTimeNum += 2;
                        if ( overTimeNum >= 180 ) { // 超过180秒，取消订单
                            clearInterval(this.payLoadTimer);
                            // this.paymentBtn = true;
                            // this.showPayLoding = false;
                            // this.$message({
                            //     message: '支付超时，当前订单已取消！',
                            //     showClose: true,
                            //     type: 'error'
                            // })
                            // this.deletePayment( curOrderId );
                            // this.clearOrder();
                            return;
                        }
                        let that = this;
                        this.payLoad(curOrderId, function () {
                            clearInterval(that.payLoadTimer);
                            that.$message({
                                message: '支付成功！',
                                showClose: true,
                                type: 'success'
                            })
                            sessionStorage.removeItem('ordersId');
                            // 支付成功后，获取商品列表
                            that.getGoods();
                            that.clearOrder();

                            that.showPayLoding = false;
                            that.showOnLinePaySuccessMask = true;
                            for(var k = 0;k<that.printData.goodArr.length;k++){
                                if(that.printData.goodArr[k].productTypeId&&that.printData.goodArr[k].productTypeId!='1'){
                                    that.isCostPrintBtn = true;
                                }
                            }
                            setTimeout(()=>{
                                that.paymentBtn = true;
                                //控制是否打印
                                if(that.localPrintsBtn&&that.printsNum!=''&&that.isCostPrintBtn){
                                    that.surePrint();
                                    that.isCostPrintBtn = false;
                                }
                                that.sureKitchenPrint();
                            }, 100)
							var iframe = "<iframe id='iframes' height='0' width='0' src='https://api.huoxingy.com/v1/pos/speech?tex=成功到账"+that.printData.amount+"元&vol=9&per=0&spd=5&pit=5' frameborder='0'></iframe>";
	                        $('#cashier').append(iframe)
	                        setTimeout(()=>{
	                            $("#iframes").remove();
	                        },8000)
//                          that.voice_text = '成功到账'+that.printData.amount+'元';
//                          setTimeout(()=>{
//                              $('#speech_voice').speech({
//                                  "speech": false,
//                                  "speed": 3,
//                              });
//                          })
                        });
                    }, 2000)
                } else {
                    this.$message({
                        message: '支付成功！',
                        showClose: true,
                        type: 'success'
                    })
                    sessionStorage.removeItem('ordersId');
                    // 支付成功后，获取商品列表
                    this.getGoods();
                    console.log('999');
                    // $.get('https://tsn.baidu.com/text2audio?lan=zh&ctp=1&cuid=abcdxxx&tok=24.41033a259c20301114cb4997319428ca.2592000.1525010048.282335-11019528&tex=%E7%99%BE%E5%BA%A6%E4%BD%A0%E5%A5%BD&vol=9&per=0&spd=5&pit=5',function(yunyi){
                    //     console.log(yunyi)
                    // })
                    // 可能是现金支付处的到账语音
                    // var iframe = "<iframe id='iframes' height='0' width='0' src='https://api.huoxingy.com/v1/pos/speech?tex=成功到账"+this.printData.amount+"元&vol=9&per=0&spd=5&pit=5' frameborder='0'></iframe>";
                    //     $('#cashier').append(iframe)
                    //     console.log(iframe);
                    //     setTimeout(()=>{
                    //         $("#iframes").remove();
                    //     },8000)
                    if ( this.payType == 'PAYCARD' ) {
                        this.showOnLinePaySuccessMask = true;
						var iframe = "<iframe id='iframes' height='0' width='0' src='https://api.huoxingy.com/v1/pos/speech?tex=成功到账"+this.printData.amount+"元&vol=9&per=0&spd=5&pit=5' frameborder='0'></iframe>";
                        $('#cashier').append(iframe)
                        setTimeout(()=>{
                            $("#iframes").remove();
                        },8000)
//                      this.voice_text = '成功到账'+this.printData.amount+'元';
//                      setTimeout(()=>{
//                          $('#speech_voice').speech({
//                              "speech": false,
//                              "speed": 3,
//                          });
//                      })
                   }
                    // 更新订单
                    this.clearOrder();
                    // console.log(this.printData)
                    this.showPayLoding = false;
                    for(var k = 0;k<this.printData.goodArr.length;k++){
                        if(this.printData.goodArr[k].productTypeId&&this.printData.goodArr[k].productTypeId!='1'){
                            this.isCostPrintBtn = true;
                        }
                    }
                    setTimeout(()=>{
                        this.paymentBtn = true;
                        //控制是否打印
                        if(this.localPrintsBtn&&this.printsNum!=''&&this.isCostPrintBtn){
                            this.surePrint();
                            this.isCostPrintBtn = false;
                        }
                        this.sureKitchenPrint();
                    }, 100)
                }
            }).catch((err)=>{
                this.payCode = '';
                this.paymentBtn = true;
                this.showPayLoding = false;
                if ( err.response.status === 400 ) {
                    this.searchOrderType();
                }
            })
        },
       
        createdOrdersId: function () {
            this.orderId = this.$uuid();
            this.$http.put('orders/' + this.orderId + '?storeId=' + this.storeId).then((res) => {
                sessionStorage.setItem('ordersId', this.orderId);
            }).catch(( err )=>{
                if ( err.response.status == 400 ) {
                    this.createdOrdersId();
                }
            })
        },
         // 刷新点单
        clearOrder: function () {
            this.closeVipFn();//删掉本地存储的会员信息
            this.payType = '';//重置支付方式
            this.tableNo = ''; // 重置座位号
            this.totalPrice = { // 重置
                count: 0, // 总数量
                total: 0, // 总计金额
                discount: 0, // 优惠金额
                amount: 0, // 最终价格
            };
            this.curSelectVipData = '';
            this.upBtn = false;
            this.notes = '';
            // 生成新订单
            // this.createdOrdersId();
            this.choiceArr = [];
            this.curBindCoupon = []; // 清空选择的优惠券
            this.vipName = '';
            for (let i = 0; i < this.pageSize; i++) {
                this.choiceArr.push({});
            }
        },
        // 等待支付轮训接口
        payLoad: function ( orderId, fn ) {
            this.$http.get('https://api.huoxingy.com/v1/pay/micropay/query?orderId='+orderId).then((res)=>{
                if ( res.status === 200 ) {
                    fn();
                }
            }).catch(( err )=>{
                this.payApiBtn = true;
                this.paymentBtn = true;
                this.showPayLoding = false;
                clearInterval(this.payLoadTimer);
            })
        },
        // 初始化订单状态
        initOrder: function ( orderId ) {
            this.$http.put('orders/'+orderId+'/cancel').then((res)=>{

            })
        },
        // 打开在线支付框事件
        openPayCodeBox: function (str) {
            this.showPayCodeBox = true;
            this.payCode = '';
            this.payType = str;
            
            console.log("修改了函数后："+this.payType);
            //如果支付码框为true时，判断当前payType是否为CASH，如为CASH则提示用户重新选择支付方式
            if(this.payType==='CASH'&&this.showPayCodeBox){
                console.log(this.payType);              
                this.$message({
                    message: "支付方式有误，请重新选择支付方式",
                    showClose: true,
                    type: 'error'
                });
                this.showPayCodeBox = false;
                this.payCode = '';
                console.log("修改后："+this.payType);
                return;
            }
        },
        openPayCodeBoxForVip: function (strVip) {
            this.showPayCodeBox = true;
            this.payCode = '';
            this.payVipType = strVip;
            
            console.log("修改了函数后VIP支付方式："+this.payVipType);
            //如果支付码框为true时，判断当前payType是否为CASH，如为CASH则提示用户重新选择支付方式
            if(this.payVipType==='CASH'&&this.showPayCodeBox){
                console.log(this.payVipType);              
                this.$message({
                    message: "支付方式有误，请重新选择支付方式",
                    showClose: true,
                    type: 'error'
                });
                this.showPayCodeBox = false;
                this.payCode = '';
                console.log("修改后："+this.payVipType);
                return;
            }
        },
        newCreatOrderFn(){
            let createTime=new Date().getTime()
            this.$http.put('/create-orders?createTime='+createTime+'&storeId='+this.storeId).then((res)=>{
                this.orderId = res.data.id;
            })
        },
        //打印单据
        surePrint(){
            // if(!localStorage.getItem('printId')){
            //     alert('小票打印失败！请设置小票打印机ID');
            //     return;
            // }
            if ( localStorage.getItem('autoPrint')) {
                let  autoPrints = JSON.parse(localStorage.getItem('autoPrint'));
                autoPrints.placingOrder = this.printsNum;
                localStorage.setItem('autoPrint', JSON.stringify(autoPrints));
            };
            // this.$posPrint(parseInt(this.printsNum), document.getElementById("receipt").innerHTML, this.printData.goodArr);
             //销售小票
            var array =[];
            array = array.concat([28,38]);//打印汉字
            // array = array.concat([29,33,17]);//汉字倍宽高
            array = array.concat([27,33,8]);//加粗
            // array = array.concat([27,33,48]);
            array = array.concat([27,97,49]);//居中
            array = array.concat([29,33,17]);
            array = array.concat(gbk('欢迎光临'+this.storeName));
            // array = array.concat([29,33,17]);//汉字倍宽高
            array = array.concat([10]);//换行
            array = array.concat([10]);//换行
            array = array.concat([27,97,48]);//左
            array = array.concat([29,33,0]);//取消汉字倍宽高
            // array = array.concat([27,33,16]);//加粗
            array = array.concat(gbk('座位号:：'));
            // array = array.concat([29,33,17]);
            array = array.concat([27,33,8]);//加粗
            array = array.concat(gbk(this.printData.tableNo));
            array = array.concat([29,33,0]);
            array = array.concat([10]);//换行
            array = array.concat([27,33,1]);//取消加粗
            array = array.concat(gbk('流水号:：'+this.code));
            array = array.concat([10]);//换行
            array = array.concat(gbk('下单时间:：'+new Date(this.printData.createTime).Format('yyyy/MM/dd-hh:mm')));
            array = array.concat([10]);//换行
            array = array.concat(gbk('打印时间:：'+new Date().Format('yyyy/MM/dd-hh:mm')));
            array = array.concat([10]);//换行
            array = array.concat(gbk('创建人:：'+this.storeInfo.employeeName));
            // array = array.concat([10]);//换行
            // array = array.concat(gbk('支付方式:现金'));
            array = array.concat([27,100,2]);//空格走纸
            for(var i=0;i<this.printData.goodArr.length;i++){
                if(this.printData.goodArr[i].id) {
                    array = array.concat(gbk('商品:：'+this.printData.goodArr[i].productName));
                    array = array.concat([10]);//换行
                    array = array.concat(gbk('数量:：'+this.printData.goodArr[i].quantity));
                    array = array.concat([10]);//换行                    
                    array = array.concat(gbk('单价:：'+this.printData.goodArr[i].salesPrice/this.printData.goodArr[i].quantity));
                    array = array.concat([27,100,2]);//空格走纸
                }
            }
            array = array.concat(gbk('合计:：'+this.printData.total));
            array = array.concat([10]);//换行
            array = array.concat(gbk('总数:：'+this.printData.count));
            array = array.concat([10]);//换行
            array = array.concat(gbk('优惠:：'+this.printData.discount));
            array = array.concat([10]);//换行
            array = array.concat(gbk('应付:：'+this.printData.amount));
            array = array.concat([10]);//换行 
            array = array.concat(gbk('备注:：'+this.printData.notes));
            array = array.concat([27,100,2]);//空格走纸
            array = array.concat([27,100,2]);//空格走纸
            // alert(array)
            //切纸
            // array = array.concat([10]);//换行 
            // array = array.concat([10]);//换行     
            // array = array.concat([27,100,2]);//空格走纸
            // array = array.concat([27,100,2]);//空格走纸
            array = array.concat([27,105]);//切纸           
            array = array.concat([10]);//换行 
            //切纸结束
            var arrays = [];
            for(var i = 0 ;i<this.printsNum;i++){
                  arrays = arrays.concat(array);
            }
            print_((localStorage.getItem('printId')?localStorage.getItem('printId'):''),arrays);
            
        },
        sureKitchenPrint(){
            var kitchenPrintArr=[],newkitchenPrintArr=[],IskitchenPrint=false;
            for(var i=0;i<this.printData.goodArr.length;i++){
                if(this.printData.goodArr[i].id) {
                    if(this.printData.goodArr[i].kitchenPrintEnabled){
                        IskitchenPrint = true;
                         var newkitchenPrintArr=[];
                        newkitchenPrintArr = newkitchenPrintArr.concat([29,33,34]);//汉字倍宽高
                        newkitchenPrintArr = newkitchenPrintArr.concat(gbk('座位号:：'+this.printData.tableNo));
                        newkitchenPrintArr = newkitchenPrintArr.concat([29,33,0]);//取消汉字倍宽高
                        newkitchenPrintArr = newkitchenPrintArr.concat([10]);
                        newkitchenPrintArr = newkitchenPrintArr.concat([27,100,1]);//空格走纸
                        newkitchenPrintArr = newkitchenPrintArr.concat(gbk('下单人:：'+this.storeInfo.employeeName));
                        newkitchenPrintArr = newkitchenPrintArr.concat([10]);
                        newkitchenPrintArr = newkitchenPrintArr.concat(gbk('订单号:：'+this.code));
                        newkitchenPrintArr = newkitchenPrintArr.concat([10]);
                        newkitchenPrintArr = newkitchenPrintArr.concat(gbk('下单时间:：'+new Date(this.printData.createTime).Format('yyyy/MM/dd-hh:mm')));
                        newkitchenPrintArr = newkitchenPrintArr.concat([10]);
                        newkitchenPrintArr = newkitchenPrintArr.concat(gbk('打印时间:：'+new Date().Format('yyyy/MM/dd-hh:mm')));
                        newkitchenPrintArr = newkitchenPrintArr.concat([10]);
                        newkitchenPrintArr = newkitchenPrintArr.concat([27,100,1]);//空格走纸
                        newkitchenPrintArr = newkitchenPrintArr.concat([29,33,34]);//汉字倍宽高
                        newkitchenPrintArr = newkitchenPrintArr.concat(gbk(this.printData.goodArr[i].productName));
                        newkitchenPrintArr = newkitchenPrintArr.concat(gbk('('+this.printData.goodArr[i].quantity+')份'));
                        newkitchenPrintArr = newkitchenPrintArr.concat([10]);//换行 
                        newkitchenPrintArr = newkitchenPrintArr.concat([29,33,17]);//汉字倍宽高
                        newkitchenPrintArr = newkitchenPrintArr.concat(gbk('备注:：'+this.printData.notes));
                        newkitchenPrintArr = newkitchenPrintArr.concat([27,100,2]);//空格走纸
                        newkitchenPrintArr = newkitchenPrintArr.concat([27,100,2]);//空格走纸
                        newkitchenPrintArr = newkitchenPrintArr.concat([27,100,2]);//空格走纸
                        newkitchenPrintArr = newkitchenPrintArr.concat([27,100,2]);//空格走纸
                        newkitchenPrintArr = newkitchenPrintArr.concat([29,86,0]);//切纸
                        newkitchenPrintArr = newkitchenPrintArr.concat(newkitchenPrintArr);//默认两份
                        kitchenPrintArr = kitchenPrintArr.concat(newkitchenPrintArr);//默认两份
                       
                    }
                }
            }
            if(IskitchenPrint){
                if(!localStorage.getItem('kitchIp')||!localStorage.getItem('kitchPort')){
                    alert('厨房打印失败！请设置IP和端口');
                    return;
                }
               
                printTcp_({ip:localStorage.getItem('kitchIp'),port:parseInt(localStorage.getItem('kitchPort'))}, kitchenPrintArr);
            }
        },
        // 计算总价
        calcAllPrice: function () {
            this.totalPrice = { // 选择商品总计
                number: 0, // 总数量
                allPrice: 0, // 总计金额
                salePrice: 0, // 优惠金额
                finalPrice: 0, // 最终价格
            }
            for (let i = 0, len = this.choiceArr.length; i < len; i++) {
                this.totalPrice.number += this.choiceArr[i].amount;
                this.totalPrice.allPrice += this.choiceArr[i].amount*this.choiceArr[i].salesPrice;
            }
            this.totalPrice.finalPrice = this.totalPrice.allPrice;
        },
        // 撤销订单
        delOrder: function () {
            if(!sessionStorage.getItem("ordersId")){
                this.$message({
                    message: "暂无订单",
                    showClose: true,
                    type: 'error'
                });
                this.showConfirmMask = false;
                return
            }
            this.$http.delete('orders/'+this.orderId).then((res)=>{
                this.$message({
                    message: "撤销成功",
                    showClose: true,
                    type: 'success'
                });
                this.orderId = '';
                this.curBindCoupon = []; // 清空选择的优惠券
                sessionStorage.removeItem("curSelectVipData");
                sessionStorage.removeItem("ordersId");
                // 传入index生成新订单
                this.showConfirmMask = false;
                this.clearOrder();
                this.getGoods();
            });
        },
        // 查询订单状态
        searchOrderType: function () {
            this.$http.get('orders/' + this.orderId).then((res)=>{
                if ( this.newOrderStatus[res.data.status] ) {
                    sessionStorage.removeItem("ordersId");
                    this.clearOrder();
                }
            });
        },
        // 打开选择优惠券弹框
        openCoupon: function () {
            this.showPayLoding = true;
            this.$http.get(this.curSelectVipData.id+'/coupon-instance?storeId='+this.storeId+'&page='+this.curCouponPage+'&size='+this.couponPageSize).then((res)=>{
                this.showPayLoding = false;
                this.couponList = res.data.couponInstances;
                if ( this.couponList && this.couponList[0] ) {
                    this.showSelCoupon = true;
                    this.curCouponData = this.couponList[0];
                    this.curCouponIdx = 0;
                } else {
                    this.$message({
                        message: '暂无可用优惠券',
                        showClose: true,
                        type: 'error'
                    });
                }
            }).catch(()=>{
                this.showPayLoding = false;
            })
        },
        // 选择优惠券
        choiceCoupon: function () {
            if(!this.orderId){
                this.$message({
                    message: '请先选择商品！',
                    showClose: true,
                    type: 'error'
                });
                return
            }
            this.$http.put('orders/'+this.orderId+'/attachCouponInstance?couponInstanceCode='+this.curCouponData.code).then((res)=>{
                this.curBindCoupon = res.data.couponInstances;
                this.showSelCoupon = false;
                this.totalPrice = {
                    count:    res.data.count, // 总数量
                    total:    res.data.total, // 总计金额
                    discount: res.data.discount, // 优惠金额
                    amount:   res.data.amount, // 最终价格
                }
                this.$message({
                    message: '成功绑定优惠券',
                    showClose: true,
                    type: 'success'
                });
            }).catch(()=>{

            })
        },
        // 解除优惠券
        relieveCoupon: function ( item ) {
            this.$http.put('orders/'+this.orderId+'/relieveCouponInstance?couponInstanceCode='+item.couponInstanceCode).then((res)=>{
                this.curBindCoupon = res.data.couponInstances;
                this.totalPrice = {
                    count:    res.data.count, // 总数量
                    total:    res.data.total, // 总计金额
                    discount: res.data.discount, // 优惠金额
                    amount:   res.data.amount, // 最终价格
                }
            }).catch(()=>{

            })
        },
        //挂起次单
        aNewOrder(){
            this.paymentBtn=true;
            this.showPayLoding = false;
            sessionStorage.removeItem("ordersId");
            clearInterval(this.payLoadTimer);
            this.clearOrder();
            this.getGoods();
        },
        //取消支付
        deletePayment( orderId ){
            if ( !this.canDeletepayment ) {
                return;
            } else {
                this.paymentBtn=true;
                clearInterval(this.payLoadTimer);

                if ( !this.delPaymentApiBtn ) {
                    return;
                }
                this.delPaymentApiBtn = false;
                this.$http.delete('payments/'+orderId).then((res)=>{
                    this.showPayLoding = false;
                    this.delPaymentApiBtn = true;
                    this.$message({
                        message: '取消支付成功！如果顾客已付款，系统会在24小时内将款项原路退回至顾客账户',
                        showClose: true,
                        duration:'15000'
                    });
                }).catch(()=>{
                    this.showPayLoding = false;
                    this.delPaymentApiBtn = true;
                })
            }
        },
        // 获取会员信息
        getMemberData: function ( memberId ) {
            this.$http.get(this.storeId+'/members?memberId='+memberId).then((res)=>{
                this.curSelectVipData = res.data;
                this.curSelectVipData.amount = this.curSelectVipData.amount.toFixed(2);
            });
        },
    },
    created(){
        this.getGoods();
        for (let i = 0; i < this.pageSize; i++) {
            this.choiceArr.push({});
        }
        if ( sessionStorage.getItem('ordersId') ) {
            this.orderId = sessionStorage.getItem('ordersId');
            this.$http.get('orders/'+this.orderId).then((res)=>{
                let body = res.data;
                this.curBindCoupon = body.couponInstances;
                this.code = body.code;
                if ( !body ) {
                    return;
                }
                this.choiceArr  = body.items;
                this.totalPrice = {
                    count:    body.count, // 总数量
                    total:    body.total, // 总计金额
                    discount: body.discount, // 优惠金额
                    amount:   body.amount, // 最终价格
                }
                this.vipName = body.memberName;
                for (let i = 0, len = this.pageSize - this.choiceArr.length; i < len; i++) {
                    this.choiceArr.push({});
                }

                if ( res.data.memberId ) {
                    this.getMemberData(res.data.memberId);
                }
            });
        } else {
            // this.createdOrdersId();
        }
        if (sessionStorage.getItem('store')) {
            this.storeInfo = JSON.parse(sessionStorage.getItem('store'));
        };
        if ( localStorage.getItem('autoPrint')&&JSON.parse(localStorage.getItem('autoPrint')).placingOrder) {
            this.printsNum = JSON.parse(localStorage.getItem('autoPrint')).placingOrder;
        }
        // 获取充送规则
        this.$http.get('charge-rules?storeId='+this.storeId).then((res)=>{
            this.rulesData = res.data;
        })
    },
    mounted: function () {
        $("#searchInput").focus();
        // this.showPayLoding = true;
    }
}
</script>
<style lang="scss" scoped>
    @import "cashier";
</style>
