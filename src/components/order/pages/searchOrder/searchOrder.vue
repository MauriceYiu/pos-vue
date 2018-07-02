<template>
	<div class="searchOrder">
		<div class="completeOrderCon clearfix">

			<div class="completeOrderList left" :class="{list_openDetail:openDetailBtn}" @click="openDetailBtn=false">
				<!-- <div class="orderType flex flex-align-center">
					<div class="typeItem active">所有订单</div>
					<div class="typeItem">销售订单</div>
					<div class="typeItem">已退订单</div>
				</div> -->
				<div class="top-search">
					<i class="iconfont icon-sousuo" @click="searchOrder"></i>
					<input type="text" placeholder="请输入订单号进行查询" v-model="code" @keyup.enter="searchOrder" id="searchInput">
				</div>
				<div class="content-search">
					<table class="titleTable">
						<tr>
							<th style="width:10%;text-align:center;">序号</th>
							<th style="width:38%;">流水号</th>
							<th style="width:35%;">时间</th>
							<th style="width:15%;">来源</th>
						</tr>
					</table>
					<div class="scrollBox">
						<ul class="scroll">
							<li v-for="(item,idx) in completeOrderList" :class="{active:curOrderIdx==idx}" @click.stop="openCurOrderDetail(item, idx)" class="clearfix">
								<span class="left textCenter" style="width:10%;" v-text="idx+1"></span>
								<span class="left" style="width:38%;" v-text="item.code"></span>
								<span class="left" style="width:35%;">{{item.paymentTime | numberToAllDate('')}}</span>
								<span class="left textRight" style="width:15%;">
										<span v-text="sourceType[item.source]"></span><i class="iconfont icon-jiantou" ></i>
								</span>
							</li>
						</ul>
					</div>
				</div>
				
			</div>
			<div class="orderDetail left" :class="{active:openDetailBtn}">
				<div class="msgBox">
					<div class="msgItem clearfix">
						<div class="name left flex flex-align-center">流水号：</div>
						<div class="itemVal right flex flex-align-center" v-text="curOrderData.code"></div>
					</div>
					<div class="msgItem clearfix">
						<div class="name left flex flex-align-center">支付方式：</div>
						<div class="itemVal right flex flex-align-center">{{curOrderData.PAYTYPE}}</div>
					</div>
					<div class="msgItem clearfix" v-if="curOrderData.status=='REFUNDED'">
						<div class="name left flex flex-align-center">退款方式：</div>
						<div class="itemVal right flex flex-align-center" v-text="curOrderData.RETIREDTYPE"></div>
					</div>
					<div class="msgItem clearfix">
						<div class="name left flex flex-align-center">订单状态：</div>
						<div class="itemVal right flex flex-align-center" v-text="statusType[curOrderData.status]"></div>
					</div>
					<div class="msgItem clearfix">
						<div class="name left flex flex-align-center">创建时间：</div>
						<div class="itemVal right flex flex-align-center">{{curOrderData.paymentTime | numberToAllDate('')}}</div>
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
				<div class="pay_box">
					<div class="pay_li">
						<div class="left flex flex-align-center">
							<span class="name">金额</span>
							<span class="number" v-text="'￥'+curOrderData.total"></span>
						</div>
					</div>
					<div class="pay_li">
						<div class="left flex flex-align-center red">
							<span class="name color_CB4A4F">优惠</span>
							<span class="number bigSize color_CB4A4F" v-text="'￥'+curOrderData.discount"></span>
						</div>
					</div>
					<div class="pay_li">
						<div class="left flex flex-align-center red">
							<span class="name color_CB4A4F">总计</span>
							<span class="number bigSize color_CB4A4F" v-text="'￥'+curOrderData.amount"></span>
						</div>
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
					<div class="notesBox clearfix">
						<span class="left">备注:</span>
						<span class="right notes" v-text="curOrderData.notes" :title="curOrderData.notes"></span>
					</div>
					<div class="notesBox clearfix" style="margin-top:15px;" v-if="curOrderData.status=='REFUNDED'">
						<span class="left">退单原因:</span>
						<span class="right notes" v-text="curOrderData.refundReason" :title="curOrderData.refundReason"></span>
					</div>
				</div>
				<!-- <div class="returnResion"><span class="left flex flex-align-center">退单原因</span><span class="right flex flex-align-center"><i class="iconfont icon-jiantou"></i></span></div> -->
				
			</div>
		</div>
		<div class="mask" v-if="showConfirmMask" @click="showConfirmMask=false">
			<div class="orderConfirmBox" @click.stop="">
				<div class="title">提示</div>
				<p>确认退回此单？</p>
				<div class="btnGroup">
					<button type="button" class="cancel" @click="showConfirmMask=false">取消</button>
					<button type="button" class="save" @click="returnOrder">确认</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props:['storeId'],
  	data(){
		return{
			completeOrderList: [],
			sourceType: {
				POS: "收银台",
				EMPLOYEE: "店员宝",
				WEB: "电脑点单",
				WEIXIN: "微信点单",
				CONSUMER: "消费者，微信",
				TAKEOUT: "三方外卖"
			},
			statusType: { // 状态类型
				UNSETTLED: "未结算",
				UNFINISHED: "未处理",
				FINISHED: "已处理",
				CANCELED: "已取消",
				REFUNDED: "已退",
				FAIL: "已失败"
			},
			channelType: { // 结算方式
				ALIPAY: '支付宝',
				CASH: '现金',
				WECHATPAY: '微信',
				MEMBER : '会员支付',
				WECHATPAY_CASH : '线下微信',
				ALIPAY_CASH : '线下支付宝'
			},
			curOrderIdx: null,
			curOrderData: {
				payments: [],
			}, // 当前订单数据
			openDetailBtn: false,
			showConfirmMask: false,
			code:""
		}
	},
	methods: {
		openCurOrderDetail: function ( item, idx ) {
			let obj = {};
			for(var key in item){
				obj[key] = item[key]
				if(key=='payments'){
					for(var i=0;i<item[key].length;i++){
						if(item[key][i].amount>0){
							//支付方式
							obj.PAYTYPE = this.channelType[item[key][i].channel]
						}else if(item[key][i].amount<0){
							//退款方式
							obj.RETIREDTYPE = this.channelType[item[key][i].channel]
						}
					}
				}
			}
			this.curOrderData = obj;
			if ( this.curOrderIdx == idx ) {
				this.openDetailBtn = !this.openDetailBtn;
			} else {
				this.openDetailBtn = true;
			}
			this.curOrderIdx = idx;
		},
		// 退单
		returnOrder: function () {
			this.$http.post('refund-orders?orderId='+this.curOrderData.id).then((res)=>{
				
			})
		},
		searchOrder(){
			this.$http.get('orders?code='+ this.code+'&storeId='+this.storeId).then((res)=>{
				this.completeOrderList = res.data;
				if(!res.data.length){
					this.$message({
	                    message: '没有搜索到相关订单！',
	                    showClose: true,
	                    type: 'error'
	                })
	                return;
				}
				for(let i=0,len=this.completeOrderList.length;i<len;i++){
					if(!this.completeOrderList[i].items.length){
						this.completeOrderList[i].items=[{
							'productName':"自定义充值",
							'salesPrice':this.completeOrderList[i].amount,
							'quantity':"1",
						}]
					}
					if (!this.completeOrderList[i].paymentTime) {
						this.completeOrderList[i].paymentTime = this.completeOrderList[i].updateTime;
					}
				}
			})
		}
	},
	created: function () {
	},
	mounted: function () {
		$("#searchInput").focus();
	}
}
</script>
<style lang="scss" scoped>
	@import "searchOrder";
</style>