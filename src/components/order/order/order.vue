<template>
	<div class="order clearfix">
		<div class="order_nav left">
			<router-link v-text="'待处理订单'" tag="div" to="/order/watingOrder" class="order_nav_item" active-class="active" @click.native="outTag()"></router-link>
			<router-link v-for="(item,idx) in orderType" tag="div" :key="idx" :to="item.route" v-text="item.name" class="order_nav_item" active-class="active"></router-link>
		</div>   	
		<div class="order_content right">
			<router-view  @refresh="refresh" :storeName="storeName" :storeId="storeId" :printIp="printIp" :printPort="printPort" :watingOrderTime="watingOrderTime" :printsBtn="printsBtn"></router-view>
		</div>   	
	</div>
</template>

<script>
export default {
	props:['storeId','printIp','printPort','orderNum', 'printsBtn', 'storeName'],
  	data(){
		return{
			orderType: [
				{ name: '已售订单', route: '/order/completeOrder'},
				{ name: '已退订单', route: '/order/retiredOrder'},
				{ name: '未结算订单', route: '/order/hangOrder'},
				{ name: '订单查询', route: '/order/searchOrder'}
			],
			watingOrderTime:(new Date()).getTime()
		}
	},
	watch:{
		orderNum(val){
			this.watingOrderTime = (new Date()).getTime();
		}
	},
	methods: {
		refresh(number){
			//更新 未处理订单轮询
			// console.log(s)
			this.$emit('refresh',number)
		},
		outTag(){
			this.watingOrderTime = (new Date()).getTime();
		}
	}
}
</script>
<style lang="scss" scoped>
	@import "order";
</style>