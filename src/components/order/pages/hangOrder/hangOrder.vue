<template>
	<div class="hangOrder">
		<div class="hangOrderCon clearfix">
			<div class="hangOrderList left" :class="{list_openDetail:openDetailBtn}" @click="openDetailBtn=false;payBtn=false">
				<table class="titleTable">
					<tr>
						<th style="width:10%;">座位号</th>
						<th style="width:10%;">时间</th>
						<th style="width:15%;">金额</th>
						<th style="width:50%;text-align:left;padding-left:2%;">订单详情</th>
						<th style="width:13%;">状态</th>
						<th style="width:2%;"></th>
					</tr>
				</table>
				<div class="scrollBox">
					<ul class="scroll">
						<li v-for="(item,idx) in hangOrderList" :class="{active:curOrderIdx==idx}" @click.stop="openCurOrderDetail(item, idx)">
							<div class="orderItem clearfix">
								<span class="left" style="width:10%;" v-text="item.tableNo?item.tableNo:'—'"></span>
								<span class="left" style="width:10%;">{{item.updateTime | numberToTime('')}}</span>
								<span class="left" style="width:15%;" v-text="'￥'+item.amount.toFixed(2)"></span>
								<span class="left goodsSpan" style="width:46%;margin:0 2%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:left">
									<span v-for="goodItem in item.items" v-text="goodItem.productName+'×'+goodItem.quantity+'，'"></span>
								</span>
								<!-- <span class="left goodsSpan" style="width:13%;">{{(item.payments[0]&&item.payments[0].channel=='CASH')?'未结算':'已结算'}}</span> -->
								<span class="left goodsSpan" style="width:13%;">{{statusType[item.status]}}</span>
								<span class="left" style="width:2%;text-align:right"><i class="iconfont icon-jiantou"></i></span>
							</div>
						</li>
					</ul>
				</div>
			</div>
			<div class="orderDetail left">
				<div class="orderDetailInner">
					<div class="msgBox">
						<div class="msgItem clearfix">
							<div class="name left flex flex-align-center">流水号：</div>
							<div class="itemVal right flex flex-align-center" v-text="curOrderData.code"></div>
						</div>
						<div class="msgItem clearfix">
							<div class="name left flex flex-align-center">支付方式：</div>
							<div class="itemVal right flex flex-align-center">{{curOrderData.payments[0]?channelType[curOrderData.payments[0].channel]:''}}</div>
						</div>
						<div class="msgItem clearfix">
							<div class="name left flex flex-align-center">创建时间：</div>
							<div class="itemVal right flex flex-align-center">{{curOrderData.updateTime | numberToTime('')}}</div>
						</div>
						<div class="msgItem clearfix">
							<div class="name left flex flex-align-center">创建人：</div>
							<div class="itemVal right flex flex-align-center" v-text="curOrderData.creatorName"></div>
						</div>
						<div class="msgItem clearfix">
							<div class="name left flex flex-align-center">座位号：</div>
							<div class="itemVal right flex flex-align-center" v-text="curOrderData.tableNo"></div>
						</div>
					</div>
					<div class="goodsBox">
						<div class="name">商品类目：</div>
						<div class="goods">
							<ul>
								<li class="clearfix" v-for="item in curOrderData.items">
									<span class="goodName left ellipsis" v-text="item.productName" :title="item.productName"></span>
									<span class="price left" v-text="'￥'+item.salesPrice"></span>
									<span class="number right" v-text="'x '+item.quantity"></span>
								</li>
							</ul>
						</div>
					</div>
					<div class="notesBox clearfix">
						<span class="left">备注:</span>
						<span class="right notes" v-text="curOrderData.notes" :title="curOrderData.notes"></span>
					</div>
					<div class="pay_box">
						<div class="pay_li">
							<div class="left flex flex-align-center">
								<span class="name">合计</span>
								<span class="number red" v-text="'￥'+curOrderData.total"></span>
							</div>
							<div class="right flex flex-align-center">
								<span class="name">总计</span>
								<span class="number" v-text="curOrderData.count"></span>
							</div>
						</div>
						<div class="pay_li">
							<div class="left flex flex-align-center red">
								<span class="name">优惠</span>
								<span class="number" v-text="'￥'+curOrderData.discount"></span>
							</div>
						</div>
						<div class="pay_li">
							<div class="left flex flex-align-center red">
								<span class="name">应付</span>
								<span class="number bigSize" v-text="'￥'+curOrderData.amount"></span>
							</div>
						</div>
						<div class="clearfix">
                            <span style="color:red;font-size:16px;"><i class="iconfont icon-xiaoxitishi-jinggao" style="color:#ff4f3d;margin-right:3px;font-size:20px;"></i>如需再次支付，请重新下单！</span>
                        </div>
                        <!-- <div class="prints clearfix">
                            <div class="check left clearfix">
                               <label class="left" for="printInput">打印单据</label>
                               <input class="left" id="printInput" type="checkbox" v-model="printsBtn">
                            </div>
                            <div class="input-num left" v-if="printsBtn">
                               <input type="text" placeholder="输入打印份数" v-model="printsNum">
                            </div>
                        </div> -->

						<!-- <div class="retired_order_btn flex flex-align-center flex-pack-right"><button type="button" @click="showConfirmMask=true;">{{(curOrderData.payment&&curOrderData.payment.channel=='CASH')?'取消订单':'退 单'}}</button></div> -->
						
						<div class="btnGroup" v-if="curOrderData.status=='NOTSURE'">
							<button class="pay_btn" type="button" @click="showConfirmMask=true">取消订单</button>
						</div>

						<!-- <div class="btnGroup" v-if="curOrderData.payments[0]&&curOrderData.payments[0].channel!=='CASH'">
							<button class="pay_btn" type="button" @click="showConfirmMask = true">取消</button>
						</div>

						<div class="btnGroup" v-if="curOrderData.payments[0]&&curOrderData.payments[0].channel=='CASH'">
							<button class="pay_btn" type="button" @click="completeOrder">确认收款并处理</button>
						</div> -->

					</div>
				</div>
			</div>
		</div>
		<div class="mask" v-if="showConfirmMask" @click="showConfirmMask=false">
            <div class="orderConfirmBox" @click.stop="">
                <div class="title">提示</div>
                <p ><i class="iconfont icon-xiaoxitishi-jinggao" style="color:#ff4f3d;margin-right:10px;font-size:20px;"></i>确认取消订单？</p>
                <!-- <p v-if="curOrderData.status=='UNFINISHED'">确认退单？</p> -->
                <div class="btnGroup">
                    <button type="button" class="cancel" @click="showConfirmMask=false">取消</button>
                    <button type="button" class="save" @click="retiredOrderFn">确认</button>
                </div>
            </div>
        </div>

        <div style="display:none">
            <div id="receipt">
                <div style="width: 164px; fontSize: 12px;">
                    <h1 style="text-align:center;font-size:18px;" v-text="'欢迎光临'+storeName">欢迎使用火星捕手</h1>
                    <p style="text-align:center;font-size:16px;" v-text="'销售单据'"></p>
                    <p style="text-align:center;font-size:16px;">
                    	<span>座位号：</span>
                        <span v-text="curOrderData.tableNo"></span>
                    </p>
                    <div>
                        <span>打印时间:</span>
                        <span>{{new Date() | numberToAllDate('')}}</span>
                    </div>
                    <div>
                        <span>流水号：</span>
                        <span v-text="curOrderData.code"></span>
                    </div>
                    <div>
                        <span>创建人：</span>
                        <span v-text="curOrderData.creatorName"></span>
                    </div>
                    <div>
                        <span>创建时间：</span>
                        <span>{{curOrderData.createTime | numberToTime('')}}</span>
                    </div>
                    <div>
                        <span>支付方式：</span>
                        <span v-text="curOrderData.payments[0]?channelType[curOrderData.payments[0].channel]:''"></span>
                    </div>
                    <div v-for="(item,idx) in curOrderData.items" style="margin: 10px 0;" v-if="item.productName">
                        <div>
                            <span>商品名称：</span>
                            <span v-text="item.productName"></span>
                        </div>
                        <div>
                            <span>销售数量：</span>
                            <span v-text="item.quantity"></span>
                        </div>
                        <div>
                            <span>销售金额：</span>
                            <span v-text="item.salesPrice"></span>
                        </div>
                    </div>
                    <!-- <div style="margin-top: 10px;">销售商品总计：</div> -->
                    <div>
                        <span>合计：</span>
                        <span v-text="curOrderData.total"></span>
                    </div>
                    <div>
                        <span>总计：</span>
                        <span v-text="curOrderData.count"></span>
                    </div>
                    <div>
                        <span>优惠：</span>
                        <span v-text="curOrderData.discount"></span>
                    </div>
                    <div>
                        <span>应付：</span>
                        <span v-text="curOrderData.amount"></span>
                    </div>
                </div>
            </div>
        </div>

	</div>
</template>

<script>
export default {
	props:['storeId','watingOrderTime','storeName'],
  	data(){
		return{
			orderNum:0,
			hangOrderList: [],
			sourceType: { // 订单来源类型
				POS: "收银台",
				WEB: "电脑点单",
				EMPLOYEE: "店员宝",
				WEIXIN: "微信点单",
				CONSUMER: "消费者，微信",
				TAKEOUT: "三方外卖"
			},
			statusType: { // 状态类型
				UNSETTLED: "未结算",
				UNFINISHED: "已结算",
				FINISHED: "已处理",
				CANCELED: "已取消",
				REFUNDED: "已退",
				NOTSURE:  "支付中",
				FAIL:     "已失败",
			},
			channelType: { // 结算方式
				ALIPAY: '支付宝',
				CASH: '现金',
				PAYCARD: '线上支付',
				WECHATPAY: '微信',
				MEMBER : '会员支付',
				WECHATPAY_CASH : '线下微信',
				ALIPAY_CASH : '线下支付宝'
			},
			curOrderIdx: null, // 当前订单索引
			curOrderData: {
				payments:[]
			}, // 当前订单数据
			openDetailBtn: false,
			printsBtn:'',
			showConfirmMask:false
		}
	},
	watch:{

	},
	methods: {
		openCurOrderDetail: function ( item, idx ) {
			this.curOrderData = item;
			// (date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes())
			// console.log(new Date().getMinutes()-new Date(item.updateTime).getMinutes())
			if ( this.curOrderIdx == idx ) {
				this.openDetailBtn = !this.openDetailBtn;
				!this.openDetailBtn?this.payBtn=false:null;
			} else {
				this.openDetailBtn = true;
			}
			this.curOrderIdx = idx;
			console.log(item)
		},
		completeOrder(){
			console.log(this.curOrderData)

		},
		retiredOrderFn(){
			this.$http.delete('/payments/'+this.curOrderData.id).then((res)=>{
				this.showConfirmMask = false;
				this.$http.get('orders/'+this.storeId+'/order-untreated').then((res)=>{
					this.hangOrderList = res.data;
					this.openDetailBtn = false;
					for(let i=0,len=this.hangOrderList.length;i<len;i++){
						if(!this.hangOrderList[i].items.length){
							this.hangOrderList[i].items=[{
								'productName':"自定义充值",
								'salesPrice':this.hangOrderList[i].amount,
								'quantity':"1",
							}]
						}
					}
				})
			})
		}
	},
	created: function () {

	},
	mounted: function () {
		this.$http.get('orders/'+this.storeId+'/order-untreated').then((res)=>{
			this.hangOrderList = res.data;
			for(let i=0,len=this.hangOrderList.length;i<len;i++){
				if(!this.hangOrderList[i].items.length){
					this.hangOrderList[i].items=[{
						'productName':"自定义充值",
						'salesPrice':this.hangOrderList[i].amount,
						'quantity':"1",
					}]
				}
			}
		})
	}
}
</script>
<style lang="scss" scoped>
	@import "hangOrder";
</style>