<template>
	<div class="completeOrder">
		<div class="completeOrderCon clearfix">
			<div class="completeOrderList left" :class="{list_openDetail:openDetailBtn}" @click="openDetailBtn=false">
				<table class="titleTable">
					<tr>
						<th style="width:10%;">座位号</th>
						<th style="width:10%;">时间</th>
						<th style="width:15%;">金额</th>
						<th style="width:50%;text-align:left;padding-left:2%;">订单详情</th>
						<th style="width:13%;">来源</th>
						<th style="width:2%;"></th>
					</tr>
				</table>
				<div class="scrollBox" id="scrollBox">
					<ul class="scroll" id="scroll">
						<li v-for="(item,idx) in completeOrderList" :class="{active:curOrderIdx==idx}" @click.stop="openCurOrderDetail(item, idx)">
							<div class="orderItem clearfix">
								<span class="left" style="width:10%;" v-text="item.tableNo?item.tableNo:'—'"></span>
								<span class="left" style="width:10%;">{{item.paymentTime | numberToTime('')}}</span>
								<span class="left" style="width:15%;" v-text="'￥'+item.amount.toFixed(2)"></span>
								<span class="left goodsSpan" style="width:46%;margin:0 2%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:left" v-text="item.productInfo" :title="item.productInfo">
									<!-- <span v-for="goodItem in item.items" v-text="goodItem.productName+'×'+goodItem.quantity+'，'"></span> -->

								</span>
								<span class="left goodsSpan" style="width:13%;" v-text="sourceType[item.source]"></span>
								<span class="left" style="width:2%;"><i class="iconfont icon-jiantou"></i></span>
							</div>
						</li>
						<div style="text-align:center;padding:20px 0;" v-if="bottomBtn">已经到底了！</div>
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
						<div class="itemVal right flex flex-align-center">{{curOrderData.payments[0]?channelType[curOrderData.payments[0].channel]:''}}</div>
					</div>
					<div class="msgItem clearfix">
						<div class="name left flex flex-align-center">创建时间：</div>
						<div class="itemVal right flex flex-align-center">{{curOrderData.paymentTime | numberToTime('')}}</div>
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
				<div class="returnResion flex flex-align-center">
					<input type="text" placeholder="请输入退单原因" v-model="reason">
				</div>
				<div class="pay_box">
					<div class="pay_li">
						<div class="left flex flex-align-center">
							<span class="name">金额</span>
							<span class="number" v-text="'￥'+curOrderData.total.toFixed(2)"></span>
						</div>
					</div>
					<div class="pay_li">
						<div class="left flex flex-align-center red">
							<span class="name">优惠</span>
							<span class="number bigSize" v-text="'￥'+curOrderData.discount.toFixed(2)"></span>
						</div>
					</div>
					<div class="pay_li">
						<div class="left flex flex-align-center red">
							<span class="name">可退金额</span>
							<span class="number bigSize" v-text="'￥'+curOrderData.amount.toFixed(2)"></span>
						</div>
					</div>
					<div class="print_btn_box">
						<button type="button" @click="surePrint">打印</button>
					</div>
					<button class="pay_btn" type="button" @click="showConfirmMask=true;">退单</button>
				</div>
			</div>
		</div>
		<div class="mask" v-if="showConfirmMask" @click="showConfirmMask=false">
			<div class="orderConfirmBox" @click.stop="">
				<div class="title">提示</div>
				<p><i class="iconfont icon-xiaoxitishi-jinggao" style="color:#ff4f3d;margin-right:10px;font-size:20px;"></i>仅支持现金退款，确认退回此单？</p>
				<div class="btnGroup">
					<button type="button" class="cancel" @click="showConfirmMask=false">取消</button>
					<button type="button" class="save" @click="returnOrder">确认</button>
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
		                <span>创建时间：</span>
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
		                <span>创建人：</span>
		                <span v-text="curOrderData.creatorName"></span>
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
		                <span v-text="curOrderData.total.toFixed(2)"></span>
		            </div>
		            <div>
		                <span>总数量：</span>
		                <span v-text="curOrderData.count"></span>
		            </div>
		            <div>
		                <span>优惠：</span>
		                <span v-text="curOrderData.discount.toFixed(2)"></span>
		            </div>
		            <div>
		                <span>应付：</span>
		                <span v-text="curOrderData.amount.toFixed(2)"></span>
		            </div>
					<div>
		                <span>备注：</span>
		                <span v-text="curOrderData.notes"></span>
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
			reason: '', // 退单原因
			curOrderData: {
				total: 0, 
				amount: 0,
				discount: 0,
				payments: []
			}, // 当前订单数据
			openDetailBtn: false,
			showConfirmMask: false,

			pageSize: 15, // 每页数量
			curPage: 0, // 当前页码
			bottomBtn:false,
			printsNum :1
		}
	},
	methods: {
		openCurOrderDetail: function ( item, idx ) {
			this.reason = '';
			// this.curOrderData = item;
			this.$http.get('orders/'+ item.id).then((res)=>{
				this.curOrderData = res.data;
			})
			if ( this.curOrderIdx == idx ) {
				this.openDetailBtn = !this.openDetailBtn;
			} else {
				this.openDetailBtn = true;
			}
			this.curOrderIdx = idx;
			
		},
		//打印单据
        surePrint(){
        	// if(!localStorage.getItem('printId')){
         //        alert('小票打印失败！请设置小票打印机ID');
         //        return;
         //    }
        	// this.$posPrint(parseInt(this.printsNum), document.getElementById("receipt").innerHTML);
        	// this.printsNum = 1;
        	 //销售小票
            var array =[],kitchenPrintArr=[],newkitchenPrintArr=[],IskitchenPrint=false;
            array = array.concat([28,38]);//打印汉字
            // array = array.concat([29,33,17]);//汉字倍宽高
            array = array.concat([27,33,8]);//加粗
            array = array.concat([27,97,49]);//居中
            array = array.concat(gbk('欢迎光临'+this.storeName));
            array = array.concat([10]);//换行
            array = array.concat([27,97,48]);//左
            // array = array.concat([29,33,0]);//取消汉字倍宽高
            array = array.concat(gbk('座位号:：'));
            array = array.concat([29,33,17]);
            array = array.concat(gbk(this.curOrderData.tableNo));
            array = array.concat([29,33,0]);
            array = array.concat([10]);//换行
            array = array.concat(gbk('流水号:：'+this.curOrderData.code));
            array = array.concat([10]);//换行
            array = array.concat([27,33,1]);//取消加粗
            array = array.concat(gbk('下单时间:：'+new Date(this.curOrderData.createTime).Format('yyyy/MM/dd-hh:mm')));
            array = array.concat([10]);//换行
            array = array.concat(gbk('打印时间:：'+new Date().Format('yyyy/MM/dd-hh:mm')));
            array = array.concat([10]);//换行
            array = array.concat(gbk('创建人:：'+this.curOrderData.creatorName));
            array = array.concat([10]);//换行
            array = array.concat(gbk('支付方式:：'+(this.curOrderData.payments[0]?this.channelType[this.curOrderData.payments[0].channel]:"-")));
            array = array.concat([27,100,2]);//空格走纸
            for(var i=0;i<this.curOrderData.items.length;i++){
                if(this.curOrderData.items[i].id) {
                    array = array.concat(gbk('商品:：'+this.curOrderData.items[i].productName));
                    array = array.concat([10]);//换行
                    array = array.concat(gbk('数量:：'+this.curOrderData.items[i].quantity));
                    array = array.concat(gbk(',单价:：'+this.curOrderData.items[i].salesPrice/this.curOrderData.items[i].quantity));
                    array = array.concat([27,100,2]);//空格走纸
                    if(this.curOrderData.items[i].kitchenPrintEnabled){
                        IskitchenPrint = true;
                        newkitchenPrintArr=[];
		               	newkitchenPrintArr = newkitchenPrintArr.concat([29,33,34]);//汉字倍宽高
		                newkitchenPrintArr = newkitchenPrintArr.concat(gbk('座位号:：'+this.curOrderData.tableNo));
		                newkitchenPrintArr = newkitchenPrintArr.concat([29,33,0]);//取消汉字倍宽高
		                newkitchenPrintArr = newkitchenPrintArr.concat([10]);
		                newkitchenPrintArr = newkitchenPrintArr.concat([27,100,1]);//空格走纸
		                newkitchenPrintArr = newkitchenPrintArr.concat(gbk('下单人:：'+this.curOrderData.creatorName));
		                newkitchenPrintArr = newkitchenPrintArr.concat([10]);
		                newkitchenPrintArr = newkitchenPrintArr.concat(gbk('订单号:：'+this.curOrderData.code));
		                newkitchenPrintArr = newkitchenPrintArr.concat([10]);
		                newkitchenPrintArr = newkitchenPrintArr.concat(gbk('下单时间:：'+new Date(this.curOrderData.createTime).Format('yyyy/MM/dd-hh:mm')));
		                newkitchenPrintArr = newkitchenPrintArr.concat([10]);
		                newkitchenPrintArr = newkitchenPrintArr.concat(gbk('打印时间:：'+new Date().Format('yyyy/MM/dd-hh:mm')));
		                newkitchenPrintArr = newkitchenPrintArr.concat([10]);
		                newkitchenPrintArr = newkitchenPrintArr.concat([27,100,1]);//空格走纸
		                newkitchenPrintArr = newkitchenPrintArr.concat([29,33,34]);//汉字倍宽高
		                newkitchenPrintArr = newkitchenPrintArr.concat(gbk(this.curOrderData.items[i].productName));
                        newkitchenPrintArr = newkitchenPrintArr.concat(gbk('('+this.curOrderData.items[i].quantity+')份'));
		                newkitchenPrintArr = newkitchenPrintArr.concat([10]);//换行 
		                newkitchenPrintArr = newkitchenPrintArr.concat([29,33,17]);//汉字倍宽高
		                newkitchenPrintArr = newkitchenPrintArr.concat(gbk('备注:：'+this.curOrderData.notes));
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
            array = array.concat(gbk('合计:：'+this.curOrderData.total));
            array = array.concat([10]);//换行
            array = array.concat(gbk('总数:：'+this.curOrderData.count));
            array = array.concat([10]);//换行
            array = array.concat(gbk('优惠:：'+this.curOrderData.discount));
            array = array.concat([10]);//换行
            array = array.concat(gbk('应付:：'+this.curOrderData.amount));
            array = array.concat([10]);//换行 
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

            print_((localStorage.getItem('printId')?localStorage.getItem('printId'):''),array);
            if(IskitchenPrint){
				return;
                if(!localStorage.getItem('kitchIp')||!localStorage.getItem('kitchPort')){
                    alert('厨房打印失败！请设置IP和端口');
                    return;
                }
                printTcp_({ip:localStorage.getItem('kitchIp'),port:parseInt(localStorage.getItem('kitchPort'))}, kitchenPrintArr);
            }
        },

		// 退单
		returnOrder: function () {
			this.reason = this.reason.replace(/(^\s*)|(\s*$)/g, "");
			if ( !this.reason ) {
				this.$message({
                    message: '请输入退单原因',
                    showClose: true,
                    type: 'error'
                })
                this.showConfirmMask = false;
                return;
			}
			this.$http.post('refund-orders?orderId='+this.curOrderData.id + '&status=true'+'&reason='+this.reason).then((res)=>{
				this.openDetailBtn = false;
				this.showConfirmMask = false;
				this.$message({
                    message: '操作成功！',
                    showClose: true,
                    type: 'success'
                })
                this.curPage = 0;
                this.completeOrderList = [];
				this.getCompleteOrderList();
			})
		},
		getCompleteOrderList: function () {
			this.bottomBtn =false;
			this.$http.get('finished-orders?storeId='+ this.storeId+'&size='+this.pageSize+'&page='+this.curPage).then((res)=>{
				this.completeOrderList = this.completeOrderList.concat(res.data);
				$('#scrollBox').unbind();
				setTimeout(()=>{
					if ( res.data.length >= this.pageSize) {
						let scrollHeight = $('#scroll').height() - $('#scrollBox').height();
						let addList = true;
						$('#scrollBox').on('scroll', ()=>{
							if ( scrollHeight - $('#scrollBox').scrollTop() < 100 && addList ) {
								addList = false;
								this.curPage++;

								this.$http.get('finished-orders?storeId='+ this.storeId+'&size='+this.pageSize+'&page='+this.curPage).then((res)=>{
									this.completeOrderList = this.completeOrderList.concat(res.data);
									if ( res.data.length < this.pageSize ) {
										this.bottomBtn = true;
										this.curPage--;
										return;
									}else{
										this.bottomBtn =false;
 									}
									setTimeout(()=>{
										scrollHeight = $('#scroll').height() - $('#scrollBox').height();
										addList = true;
									}, 200)
								}).catch(()=>{
									addList = true;
									this.curPage--;
								})
							}
						})
					}
				}, 200)
			})
		}
	},
	created: function () {
	},
	mounted: function () {
		this.getCompleteOrderList();
	}
}
</script>
<style lang="scss" scoped>
	@import "completeOrder";
</style>