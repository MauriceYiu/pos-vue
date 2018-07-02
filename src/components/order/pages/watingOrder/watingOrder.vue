<template>
	<div class="watingOrder">
		<div class="watingOrderCon ">
			<div class="watingOrderList clearfix"  @click="openDetailBtn=false;payBtn=false">
				<div class="watingOrderBox" :class="{item4:btn4,item6:btn6,item9:btn9}">
					<div class="watingItem left" v-for="item in watingOrderList" :class="{watingItemDetail:!item.notes}">
						<div v-if="item.id" style="height:100%;width:100%;">
							<div class="title clearfix">
								<div class="left seat flex flex-align-center"><span class="name">座位号：</span><span v-text="item.tableNo?item.tableNo:'-'">0</span></div>
                                <div class=" position-middle-center status" v-text="sourceType[item.source]"></div>
								<div class="right">
                                    <span class="left" v-if="item.payments[0].channel!='CASH'" v-text="channelType[item.payments[0].channel]"></span>
                                    <span class="left" v-if="item.payments[0].channel=='CASH'" v-text="'现金(未结算)'" style="color : #f65d45;"></span>
									<!-- <span v-if="item.payments[0].channel=='CASH'" style="color : #f65d45;">未结算 <span class="left" v-text="channelType[item.payments[0].channel]+'：'"></span></span> -->
                                    
									<!-- <span v-if="item.payments[0].channel!='CASH'">已结算</span> -->
								</div>
							</div>
							<div class="goodsBox">
								<ul>
									<li class="item clearfix" v-for="oitem in item.items">
										<span class="productName left" v-text="oitem.productName" :title="oitem.productName"></span>
										<span class="productPrice right" v-text="'￥'+oitem.salesPrice"></span>
										<span class="productNumber right" v-text="'x'+oitem.quantity"></span>
									</li>
								</ul>
							</div>
							<div class="notes">
								<div class="name">
									备注:
								</div>
								<div class="value" v-text="item.notes" :title="item.notes">
								</div>
							</div>
							<div class="bottomBox flex flex-align-center">
								<div class="inner clearfix">
                                    
                                    <span class="left" v-text="'￥'+item.amount" style="font-size:20px;"></span>
									<span class="left" v-text="'（优惠:￥'+item.discount+'）'" v-if="item.discount" style="margin-left:5px;font-size:14px;"></span>
                                    <button class="right" type="button"  @click="completeOrder(item)">完成</button>
                                    <span class="right tip" v-if="item.payments[0].channel=='WECHATPAY_CASH'||item.payments[0].channel=='ALIPAY_CASH'">请核对金额</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="pager">
					<div class="pagerCon clearfix position-middle-center">
                        <div class="pagerBtnBox right">
                            <div class="pagerBtn">
                                <span class="prev flex flex-align-center flex-pack-center left" :class="{havePage:curPage>1}"><i class="el-icon-arrow-left" @click="curPageFn(2)"></i></span>
                                <span class="curPageNumber flex flex-align-center flex-pack-center left">{{curPage}}</span>
                                <span class="next flex flex-align-center flex-pack-center left" :class="{havePage:(curPage<=1||curPage<totalPages)}"><i class="el-icon-arrow-right" @click="curPageFn(1)"></i></span>
                            </div>
                        </div>
                        <div class="curPage flex flex-align-center right" v-text="'第'+curPage+'/'+(totalPages==0?1:totalPages)+'页'"></div>
                        <div class="totalPage flex flex-align-center right" v-text="'共' +totalElements+ '条'"></div>
                    </div>
                    <div class="print">
                    	<div class="input_checkbox">
                    		<span>打印单据</span>
                    		<input type="checkbox" v-model="localPrintsBtn">
                    	</div>
                    	<div class="input_text" v-if="localPrintsBtn">
                    		<span>份数</span>
                    		<input type="text" v-model="printsNum">
                    	</div>
                    </div>
				</div>
			</div>
		</div>

	</div>
</template>

<script>
export default {
	props:['storeId','watingOrderTime', 'printsBtn','storeName'],
  	data(){
		return{
			orderNum:0,
			watingOrderList: [],
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
				FAIL:     "未结算",
			},
			channelType: { // 结算方式
				ALIPAY: '支付宝',
				CASH: '现金',
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

            showConfirmMask:false,//撤销订单二次确认框
            completeApiBtn: true, // 处理订单接口控制

            localPrintsBtn: this.printsBtn,//是否单据打印
            printsNum:1,//单据打印的份数

            curPage:1,//当前页
            totalPages:0,//总页码
            totalElements:0,//总条数


            btn4:false,
            btn6:false,
            btn9:false,
            size:4,

            isCostPrintBtn:false,//网费答应
		}
	},
	watch:{
		watingOrderTime(val){
			this.watingOrderList = [];
			this.getWatingOrder();
		},
        printsBtn(val){
            this.localPrintsBtn = val;
        }
	},
	methods: {
		curPageFn(foo){
			console.log(56)
            if(this.totalPages<=1){
                return;
            }
            if(foo==2){
                if( this.curPage==1 ){
                    return;
                }
                this.curPage --;
            }else if(foo==1) {
                if( this.curPage==this.totalPages ){
                    return;
                }
                this.curPage ++;
            }
            this.getWatingOrder();
        },
		openCurOrderDetail: function ( item, idx ) {
			this.curOrderData = item;
			if ( this.curOrderIdx == idx ) {
				this.openDetailBtn = !this.openDetailBtn;
				!this.openDetailBtn?this.payBtn=false:null;
			} else {
				this.openDetailBtn = true;
			}
			this.curOrderIdx = idx;
		},
		// 处理订单
		completeOrder (item) {
			this.curOrderData = item;
			if ( !this.completeApiBtn ) {
				return;
			}
			this.completeApiBtn = false;

            if(this.totalElements%4==1){
                this.curPage--;
                this.curPage<=0?this.curPage=1:'';
            }
            if(this.localPrintsBtn&&!(parseInt(this.printsNum)>0)){
                this.$message({
                    message: '请输入打印份数',
                    showClose: true,
                    type: 'error'
                })
                return;
            }
            if ( !this.curOrderData.id ) {
                return;
            }
			this.$http.post('orders/'+this.curOrderData.id+'/finish').then((res)=>{
				this.openDetailBtn = false;
				this.curOrderIdx = null;
				this.$message({
                    message: '操作成功！',
                    showClose: true,
                    type: 'success'
                })
                this.getWatingOrder();

                for(var k = 0;k<this.curOrderData.items.length;k++){
                    if(this.curOrderData.items[k].productTypeId&&this.curOrderData.items[k].productTypeId!='1'){
                        this.isCostPrintBtn = true;
                    }
                }
                //控制是否打印 
                if(this.localPrintsBtn&&this.isCostPrintBtn){
                    this.isCostPrintBtn = false;
                    this.surePrint();
                }
                this.sureKitchenPrint();//初始化打印配置
               

				setTimeout(()=>{
					this.completeApiBtn = true;
				}, 300)
			}).catch(()=>{
				this.completeApiBtn = true;
			})
		},
        //获取待处理订单
        getWatingOrder(){
        	this.$http.get('todo-orders?storeId='+ this.storeId+'&size='+this.size+'&page='+(this.curPage-1)).then((res)=>{
				this.$emit('refresh',res.data.orders.length);
				this.watingOrderList = res.data.orders;
				if( this.watingOrderList.length<=this.size){
					for(var i = 0,len=this.size-this.watingOrderList.length;i<len;i++){
						this.watingOrderList.push({})
					}
				}
				this.totalElements = res.data.totalElements;
				this.totalPages = res.data.totalPages;
			})
        },
		//打印单据
        surePrint(){
            if ( localStorage.getItem('autoPrint')) {
                let  autoPrints = JSON.parse(localStorage.getItem('autoPrint'));
                autoPrints.watingOrder = this.printsNum;
                localStorage.setItem('autoPrint', JSON.stringify(autoPrints));
            };
            // this.$posPrint(parseInt(this.printsNum), document.getElementById("receipt").innerHTML,this.curOrderData.items);
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
            array = array.concat(gbk('座位号:：'));
            array = array.concat([29,33,17]);
            array = array.concat(gbk(this.curOrderData.tableNo));
            array = array.concat([29,33,0]);
            array = array.concat([10]);//换行
            array = array.concat(gbk('流水号:：'+this.curOrderData.code));
            array = array.concat([10]);//换行
            array = array.concat([27,33,1]);//取消加粗
            array = array.concat(gbk('创建时间:：'+new Date(this.curOrderData.paymentTime).Format('yyyy/MM/dd-hh:mm')));
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
            
            //多份打印
            var arrays=[];
            for(var i = 0 ;i<this.printsNum;i++){
                  arrays = arrays.concat(array)
            }
            print_((localStorage.getItem('printId')?localStorage.getItem('printId'):''),arrays);//小票打印
           
        },
        //厨房打印
        sureKitchenPrint(){
            var newkitchenPrintArr=[],kitchenPrintArr=[],IskitchenPrint=false;
            for(var i=0;i<this.curOrderData.items.length;i++){
                if(this.curOrderData.items[i].id) {
                    if(this.curOrderData.items[i].kitchenPrintEnabled){
                        IskitchenPrint = true;
                        kitchenPrintArr=[];
                        kitchenPrintArr = kitchenPrintArr.concat([29,33,34]);//汉字倍宽高
                        kitchenPrintArr = kitchenPrintArr.concat(gbk('座位号:：'+this.curOrderData.tableNo));
                        kitchenPrintArr = kitchenPrintArr.concat([29,33,0]);//取消汉字倍宽高
                        kitchenPrintArr = kitchenPrintArr.concat([10]);
                        kitchenPrintArr = kitchenPrintArr.concat([27,100,1]);//空格走纸
                        kitchenPrintArr = kitchenPrintArr.concat(gbk('下单人:：'+this.curOrderData.creatorName));
                        kitchenPrintArr = kitchenPrintArr.concat([10]);
                        kitchenPrintArr = kitchenPrintArr.concat(gbk('订单号:：'+this.curOrderData.code));
                        kitchenPrintArr = kitchenPrintArr.concat([10]);
                        kitchenPrintArr = kitchenPrintArr.concat(gbk('下单时间:：'+new Date(this.curOrderData.createTime).Format('yyyy/MM/dd-hh:mm')));
                        kitchenPrintArr = kitchenPrintArr.concat([10]);
                        kitchenPrintArr = kitchenPrintArr.concat(gbk('打印时间:：'+new Date().Format('yyyy/MM/dd-hh:mm')));
                        kitchenPrintArr = kitchenPrintArr.concat([10]);
                        kitchenPrintArr = kitchenPrintArr.concat([27,100,1]);//空格走纸
                        kitchenPrintArr = kitchenPrintArr.concat([29,33,34]);//汉字倍宽高
                        kitchenPrintArr = kitchenPrintArr.concat(gbk(this.curOrderData.items[i].productName));
                        kitchenPrintArr = kitchenPrintArr.concat(gbk('('+this.curOrderData.items[i].quantity+')份'));
                        // kitchenPrintArr = kitchenPrintArr.concat(kitchenPrintArr);//要打印的商品
                        kitchenPrintArr = kitchenPrintArr.concat([10]);//换行 
                        kitchenPrintArr = kitchenPrintArr.concat([29,33,17]);//汉字倍宽高
                        kitchenPrintArr = kitchenPrintArr.concat(gbk('备注:：'+this.curOrderData.notes));
                        kitchenPrintArr = kitchenPrintArr.concat([27,100,2]);//空格走纸
                        kitchenPrintArr = kitchenPrintArr.concat([27,100,2]);//空格走纸
                        kitchenPrintArr = kitchenPrintArr.concat([27,100,2]);//空格走纸
                        kitchenPrintArr = kitchenPrintArr.concat([27,100,2]);//空格走纸
                        kitchenPrintArr = kitchenPrintArr.concat([29,86,0]);//切纸
                        kitchenPrintArr = kitchenPrintArr.concat(kitchenPrintArr);//默认两份
                        newkitchenPrintArr = newkitchenPrintArr.concat(kitchenPrintArr);
                    }
                }
            }
            if(IskitchenPrint){//厨房打印
                if(!localStorage.getItem('kitchIp')||!localStorage.getItem('kitchPort')){
                    alert('厨房打印失败！请设置IP和端口');
                    return;
                }
                printTcp_({ip:localStorage.getItem('kitchIp'),port:parseInt(localStorage.getItem('kitchPort'))}, newkitchenPrintArr);
            }
        },
		//退单
		retiredOrderFn(){
			let _this = this;
			function allFn(){
				_this.showConfirmMask = false;
                _this.openDetailBtn = false;
				_this.payBtn = false;
				_this.curOrderIdx = null;
				_this.$message({
                    message: '退单成功！',
                    showClose: true,
                    type: 'success'
                });
              	_this.$http.get('todo-orders?storeId='+ _this.storeId).then((res)=>{
					_this.watingOrderList = res.data;

					//刷新未处理订单（轮询）
					_this.$emit('refresh',res.data.orders.length);
				})
			}
			if( this.curOrderData.status=='UNSETTLED') {
				//取消订单
				this.$http.delete('orders/'+this.curOrderData.id).then((res)=>{
	               	allFn();
	            });
			}else if(this.curOrderData.status=='UNFINISHED') {
				//退单
				this.$http.post('refund-orders?orderId='+this.curOrderData.id).then((res)=>{
					allFn();
				})
			}
		},
		// 撤销订单
		delOrder: function () {
		    this.$http.delete('orders/'+this.curOrderData.id).then((res)=>{
		    	this.openDetailBtn = false;
		    	this.curOrderIdx = null;
		    	this.$http.get('todo-orders?storeId='+ this.storeId).then((res)=>{
		    		this.watingOrderList = res.data;
		    		//刷新未处理订单（轮询）
		    		this.$emit('refresh',res.data.orders.length);
		    	})

		    	if ( this.curOrderData.id == sessionStorage.getItem('ordersId') ) {
		    		this.createdOrdersId();
		    	}
		    }).catch(()=>{

		    })
		},
	},
	created: function () {
        let width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
            height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        if(height<=900&&width<=1600){
            this.btn4 = true;
            this.size = 4;
        }
        if(height<=900&&width>1600){
            this.btn6 = true;
            this.size = 6;
        }
        if(height>900&&width>1600){
            this.btn9 = true;
            this.size = 9;
        }
        if(height>900&&width<=1600){
            this.btn4 = true;
            this.size = 4;
        }
        if ( localStorage.getItem('autoPrint')&&JSON.parse(localStorage.getItem('autoPrint')).watingOrder) {
            this.printsNum = JSON.parse(localStorage.getItem('autoPrint')).watingOrder;
        }
    },
    mounted: function () {
        this.getWatingOrder();
	}
}
</script>
<style lang="scss" scoped>
	@import "watingOrder";
</style>