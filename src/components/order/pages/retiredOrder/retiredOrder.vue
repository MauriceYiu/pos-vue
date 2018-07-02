<template>
	<div class="retiredOrder">
		<div class="completeOrderCon clearfix">
			<div class="completeOrderList left" :class="{list_openDetail:openDetailBtn}" @click="openDetailBtn=false">
				<table class="titleTable">
					<tr>
						<th style="width:5%;"></th>
						<th style="width:13%;">时间</th>
						<th style="width:15%;">金额</th>
						<th style="width:52%;text-align:left;padding-left:2%;">订单详情</th>
						<th style="width:13%;">来源</th>
						<th style="width:2%;"></th>
					</tr>
				</table>
				<div class="scrollBox">
					<ul class="scroll">
						<li v-for="(item,idx) in completeOrderList" :class="{active:curOrderIdx==idx}" @click.stop="openCurOrderDetail(item, idx)">
							<div class="orderItem clearfix">
								<span class="left" style="width:5%;" v-text="idx+1"></span>
								<span class="left" style="width:13%;">{{item.paymentTime | numberToTime('')}}</span>
								<span class="left" style="width:15%;" v-text="'￥'+item.amount"></span>
								<span class="left goodsSpan" style="width:48%;margin:0 2%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:left">
									<span v-for="goodItem in item.items" v-text="goodItem.productName+'×'+goodItem.quantity+'，'"></span>
								</span>
								<span class="left textRight" style="width:13%;" v-text="sourceType[item.source]"></span>
								<span class="left" style="width:2%;"><i class="iconfont icon-jiantou"></i></span>
							</div>
						</li>
					</ul>
				</div>
			</div>
			<div class="orderDetail left">
				<div class="msgBox">
					<div class="msgItem clearfix">
						<div class="name left flex flex-align-center">流水号：</div>
						<div class="itemVal right flex flex-align-center" v-text="curOrderData.code"></div>
					</div>
					<div class="msgItem clearfix">
						<div class="name left flex flex-align-center">支付方式：</div>
						<div class="itemVal right flex flex-align-center">{{curOrderData.PAYTYPE}}</div>
					</div>
					<div class="msgItem clearfix">
						<div class="name left flex flex-align-center">退款方式：</div>
						<div class="itemVal right flex flex-align-center">{{curOrderData.RETIREDTYPE}}</div>
					</div>
					<div class="msgItem clearfix">
						<div class="name left flex flex-align-center">退单时间：</div>
						<div class="itemVal right flex flex-align-center">{{curOrderData.paymentTime | numberToTime('')}}</div>
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
							<span class="number" v-text="'￥'+curOrderData.total.toFixed(2)"></span>
						</div>
					</div>
					<div class="pay_li">
						<div class="left flex flex-align-center">
							<span class="name color_CB4A4F">优惠</span>
							<span class="number color_CB4A4F" v-text="'￥'+curOrderData.discount"></span>
						</div>
					</div>
					<div class="pay_li">
						<div class="left flex flex-align-center red">
							<span class="name color_CB4A4F">已退金额</span>
							<span class="number bigSize color_CB4A4F" v-text="'￥'+curOrderData.amount.toFixed(2)"></span>
						</div>
					</div>
				</div>
				<div class="goodsBox">
					<div class="name">商品类目：</div>
					<div class="goods">
						<ul>
							<li class="clearfix" v-for="item in curOrderData.items">
								<span class="goodName left ellipsis" v-text="item.productName"></span>
								<span class="price left" v-text="'￥'+item.salesPrice.toFixed(2)"></span>
								<span class="number right" v-text="'x '+item.quantity"></span>
							</li>
						</ul>
					</div>
				</div>
				<div class="pay_box">
					<p v-text="'退单原因：'+curOrderData.refundReason"></p>
				</div>
				<div class="notesBox clearfix">
					<span class="left">备注:</span>
					<span class="right notes" v-text="curOrderData.notes" :title="curOrderData.notes"></span>
				</div>
				<div style="text-align:right;padding:5px 20px;">
					<span @click="surePrint" style="color:red;border:1px solid red;font-size:16px;padding:0 5px;border-radius:5px;cursor:pointer;">打印</span>
				</div>
			</div>
		</div>


		<div style="display:none;">
            <div id="receipt">
                <div style="width: 164px; fontSize: 12px;">
                    <h1 style="text-align:center;font-size:18px;" v-text="'欢迎光临'+storeName">欢迎使用火星捕手</h1>
                    <p style="text-align:center;font-size:16px;" v-text="'退单单据'"></p>
                    
                    <div style="font-size:15px;margin-top:10px;">
                        <span>退单原因：</span>
                        <span v-text="curOrderData.refundReason"></span>
                    </div>
                    <div>
                        <span>创建时间：</span>
                        <span>{{curOrderData.createTime | numberToAllDate('')}}</span>
                    </div>
                    <div>
                        <span>退单时间：</span>
                        <span>{{curOrderData.paymentTime | numberToAllDate('')}}</span>
                    </div>
                    <div>
                        <span>打印时间：</span>
                        <span>{{new Date() | numberToAllDate('')}}</span>
                    </div>
                    <div>
                        <span>流水号：</span>
                        <span v-text="curOrderData.code"></span>
                    </div>
                    <div>
                        <span>支付方式：</span>
                        <span v-text="curOrderData.PAYTYPE"></span>
                    </div>
                    <div>
                        <span>退款方式：</span>
                        <span v-text="curOrderData.RETIREDTYPE"></span>
                    </div>
                    <div>
                        <span>座位号：</span>
                        <span v-text="curOrderData.tableNo"></span>
                    </div>
                    <div>
                        <span>备注：</span>
                        <span v-text="curOrderData.notes"></span>
                    </div>
                    <div>
                        <span>退单操作员：</span>
                        <span v-text="curOrderData.creatorName"></span>
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
	props:['storeId','storeName'],
  	data(){
		return{
			completeOrderList: [],
			sourceType: {
				POS: "收银台",
				WEB: "电脑点单",
				EMPLOYEE: "店员宝",
				WEIXIN: "微信点单",
				CONSUMER: "消费者，微信",
				TAKEOUT: "三方外卖"
			},
			statusType: { // 状态类型
				UNSETTLED: "未结算",
				UNFINISHED: "未处理",
				FINISHED: "已处理",
				CANCELED: "已取消",
				REFUNDED: "已退"
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
				total: 0,
				amount: 0,
				payments: [],
			}, // 当前订单数据
			openDetailBtn: false,
			showConfirmMask: false,
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
		//打印单据
        surePrint(){
        	
        	// this.$posPrint(parseInt(this.printsNum), document.getElementById("receipt").innerHTML);
        	// this.printsNum = 1;
        	 //销售小票
            var array =[];
            array = array.concat([28,38]);//打印汉字
            // array = array.concat([29,33,17]);//汉字倍宽高
            array = array.concat([27,33,8]);//加粗
            array = array.concat([27,97,49]);//居中
            array = array.concat(gbk('欢迎光临'+this.storeName));
            array = array.concat([10]);//换行
            array = array.concat([27,97,48]);//左
            // array = array.concat([29,33,0]);//取消汉字倍宽高
            array = array.concat(gbk('座位号:：'+this.curOrderData.tableNo));
            array = array.concat([10]);//换行
            array = array.concat(gbk('流水号:：'+this.curOrderData.code));
            array = array.concat([10]);//换行
            array = array.concat([27,33,1]);//取消加粗
            array = array.concat(gbk('退单时间:：'+new Date(this.curOrderData.paymentTime).Format('yyyy/MM/dd-hh:mm')));
            array = array.concat([10]);//换行
            array = array.concat(gbk('打印时间:：'+new Date().Format('yyyy/MM/dd-hh:mm')));
            array = array.concat([10]);//换行
            array = array.concat(gbk('创建人:：'+this.curOrderData.creatorName));
            array = array.concat([10]);//换行
            array = array.concat(gbk('支付方式:：'+this.curOrderData.PAYTYPE));
            array = array.concat([10]);//换行
            array = array.concat(gbk('退款方式:：'+this.curOrderData.RETIREDTYPE));
            array = array.concat([10]);//换行
            array = array.concat(gbk('退单原因:：'+this.curOrderData.refundReason));
            array = array.concat([27,100,2]);//空格走纸
            for(var i=0;i<this.curOrderData.items.length;i++){
                if(this.curOrderData.items[i].id) {
                    array = array.concat(gbk('商品:：'+this.curOrderData.items[i].productName));
                    array = array.concat([10]);//换行
                    array = array.concat(gbk('数量:：'+this.curOrderData.items[i].quantity));
                    array = array.concat(gbk(',单价:：'+this.curOrderData.items[i].salesPrice/this.curOrderData.items[i].quantity));
                    array = array.concat([27,100,2]);//空格走纸
                }
            }
            // array = array.concat(gbk('合计:：'+this.curOrderData.total));
            // array = array.concat([10]);//换行 
            // array = array.concat(gbk('总计:：'+this.curOrderData.count));
            // array = array.concat([10]);//换行 
            // array = array.concat(gbk('优惠:：'+this.curOrderData.discount));
            // array = array.concat([10]);//换行 
            // array = array.concat(gbk('应付:：'+this.curOrderData.amount));
            // array = array.concat([10]);//换行 
            array = array.concat(gbk('备注:：'+this.curOrderData.notes));
            array = array.concat([27,100,2]);//空格走纸
            array = array.concat([27,100,2]);//空格走纸

			 //切纸
            // array = array.concat([10]);//换行 
            // array = array.concat([10]);//换行     
            // array = array.concat([27,100,2]);//空格走纸
            // array = array.concat([27,100,2]);//空格走纸    
            array = array.concat([27,105]);//切纸           
            array = array.concat([10]);//换行 
            //切纸结束

            //多份打印
            // for(var i = 0 ;i<this.printsNum-1;i++){
            //       array = array.concat(array)
            // }
            print_((localStorage.getItem('printId')?localStorage.getItem('printId'):''),array);
        },
	},
	created: function () {
	},
	mounted: function () {
		this.$http.get('refund-orders?storeId='+ this.storeId).then((res)=>{
				this.completeOrderList = res.data;
				for(let i=0,len=this.completeOrderList.length;i<len;i++){
					if(!this.completeOrderList[i].items.length){
						this.completeOrderList[i].items=[{
							'productName':"自定义充值",
							'salesPrice':this.completeOrderList[i].amount,
							'quantity':"1",
						}]
					}
				}
			})
	}
}
</script>
<style lang="scss" scoped>
	@import "retiredOrder";
</style>