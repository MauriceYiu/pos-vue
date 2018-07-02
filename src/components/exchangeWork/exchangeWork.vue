<template>
	<div class="exchange_work">
		<div class="exchange_work_inner">
			<div class="inventoryTableBox">
				<table class="titleTable">
					<thead>
						<tr>
	                        <th style="width:10%">序号</th>
							<th style="width:50%">商品名称</th>
							<th style="width:20%">库存(件)</th>
							<th style="width:20%">库存(个)</th>
						</tr>
					</thead>
				</table>
				<div class="scrollBox">
					<table class="conTable" :class="{overLengthTable:inventoryList.length>10}">
						<tbody>
							<tr v-for="(item,idx) in inventoryList">
                                <td style="width:10%" v-text="item.name?((currentPage-1)*pageSize+idx+1):''"></td>
								<td style="width:50%;overflow:hidden" v-text="item.name" :title="item.name"></td>
								<td style="width:20%" v-text="item.name?(item.stockQuantityRatio==0?'-':parseInt(item.counterQuantity/item.stockQuantityRatio)):''"></td>
								<td style="width:20%" v-text="item.name?(item.stockQuantityRatio==0?item.counterQuantity:(item.counterQuantity%item.stockQuantityRatio)):''"></td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
			<div class="pagers">
			    <el-pagination
			      	@current-change="getInventoryList"
			      	:current-page.sync="currentPage"
			      	:page-size="pageSize"
			      	layout="total, prev, pager, next, jumper"
			      	:total="totalElements">
			    </el-pagination>
            </div>
			<div class="btnGroup">
				<div class="exchangeWorkData" @click="showWorkDetailData=true">本班销售统计</div>
				<div class="workDataSel" @click="clearShowWorkSelDatFn">销售汇总查询</div>
				<div class="inv-print" @click="invPrint">盘点数据打印</div>
				<!-- <a class="workDataSel" href="https://inventory.huoxingy.com/#/login" target="view_window">前往库存管理</a> -->
				<button type="button" class="finish position-middle-center" @click="goExchange">前往交班</button>
			</div>
		</div>
		<div class="exchange_work_mask mask" @click="showExchange=false" v-if="showExchange">
			<div class="exchange_work_modal modal" @click.stop="">
				<!--<div class="ex_top">交班<span style="color:#999;font-size:14px;margin-left:10px;">本班应缴现金 =<span v-text="workShift.cashAmount"></span> （万象网费必须与火星捕手网费一致，如不一致，请以自定义网费方式补齐网费）</span></div>-->
				<div class="ex_top">交班</div>
				<span class="close_btn"  @click="showExchange=false">&times;</span>
				<div class="left left-data">
					<div class="title">
						<div class="ex_item clearfix">
							<span class="name white left">姓名：</span>
							<span class="info white right" v-text="workShift.id?workShift.operatorName:'-'"></span>
						</div>
						<div class="ex_item clearfix">
							<span class="name white left">工号：</span>
							<span class="info white right" v-text="workShift.id?storeInfo.employeeCode:'-'"></span>
						</div>
						<div class="ex_item clearfix" style="position:relative;">
							<span class="name white left">工作时段：</span>
							<span class="info white right" style="position:absolute;width:80%;text-align:right;display:inline-block;right:0" v-text="formatDate(workShift.beginTime,workShift.endTime)" >2017-07-15 12:00-17:10</span>
						</div>
					</div>
					
					<!-- <div class="income clearfix">
						<div class="ex_item left" style="font-weight:bold;">
							<span class="name" style="width:60%;">上缴金额</span>
							<span class="info red" v-text="'￥'+(workShift.cashAmount+workShift.alipayCashAmount+workShift.wechatCashAmount).toFixed(2)"></span>
						</div>
						<div class="ex_item right" style="font-weight:bold;">
							<span class="name" style="width:60%;">总销售额</span>
							<span class="info red" v-text="'￥'+workShift.turnInAmount.toFixed(2)"></span>
						</div>
					</div> -->
					<div class="income">
						<div class="ex_item">
							<span class="name">现金支付</span>
							<span class="info red" v-text="'￥'+workShift.cashAmount.toFixed(2)"></span>
						</div>
						<div class="ex_item" v-if="workShift.wechatCashAmount>0">
							<span class="name">线下微信</span>
							<span class="info red" v-text="'￥'+workShift.wechatCashAmount.toFixed(2)"></span>
						</div>
						<div class="ex_item" v-if="workShift.alipayCashAmount>0">
							<span class="name" >线下支付宝</span>
							<span class="info red" v-text="'￥'+workShift.alipayCashAmount.toFixed(2)"></span>
						</div>
						<div style="border-bottom:2px dotted #f5c3c3"></div>
						<div class="ex_item">
							<span class="name">会员支付</span>
							<span class="info red" v-text="'￥'+workShift.memberAmount.toFixed(2)"></span>
						</div>
						<div class="ex_item" v-if="workShift.wechatAmount>0">
							<span class="name">微信支付</span>
							<span class="info red" v-text="'￥'+workShift.wechatAmount.toFixed(2)"></span>
						</div>
						<div class="ex_item" v-if="workShift.alipayAmount>0">
							<span class="name">支付宝支付</span>
							<span class="info red" v-text="'￥'+workShift.alipayAmount.toFixed(2)"></span>
						</div>
						<div class="ex_item">
							<span class="name">优惠券抵扣</span>
							<span class="info red" v-text="'￥'+(workShift.couponAmount/100).toFixed(2)"></span>
						</div>
						<!-- <div class="ex_item">
							<span class="name">会员充值</span>
							<span class="info red" v-text="'￥'+workShift.memberRechargeAmount/100"></span>
						</div> -->
						<div class="ex_item" style="font-weight:bold;">
							<span class="name" style="text-align:right;">总销售额</span>
							<span class="info red" v-text="'￥'+workShift.turnInAmount.toFixed(2)"></span>
						</div>
					</div>
					<div class="income">
						<div class="ex_item">
							<span class="name">会员充值</span>
							<span class="info red" v-text="'￥'+workShift.memberRechargeAmount/100"></span>
						</div>
					</div>
					<div class="sleReceipt clearfix">
						<div class="repecitNumber" >
							<span>打印份数：<input type="number" v-model="repecitNumber"></span>
							<span class="sure-print" @click="surePrint">打印</span>
							<span class="sure-print" @click="sureLastPrint" style="margin-left:15px;width:108px;">前一班次补打</span>
						</div>
					</div>
					<div class="exit_btn">
						<button @click="showConfirmPrint=true">交班并退出</button>
					</div>
				</div>
				<div class="left right-data">
					<div class="typeBoxTitle clearfix" style="margin:10px 0 10px 0;">
						<span class="left" style="margin-left:10px;">网费</span>
			    		<span class="right" style="color:red;font-weight:500;margin-right:6px;" v-text="'￥'+costList.amount/100"></span>
			    	</div>
			    	<!-- <div class="costBox clearfix">
			    		<div class="item left clearfix" v-for="item in costList.list">
		    	            <span class="name left" v-text="item.name"></span>
		    	            <span class="price right" v-text="'￥'+item.price/100"></span>
			    		</div>
			    	</div> -->
					<div class="typeBoxTitle">分类列表<span style="color:red;font-weight:500;margin-left:6px;">(包含优惠券抵扣金额)</span><p class="totalP" v-text="'总计：'+workCalculateData.amount"></p></div>
			    	<div class="typeBox" :style="{'overflow-y':curWorkDetail.repecitData.length>=4?'scroll':''}">
			    	    <div class="item isItem40px" v-for="(item,idx) in curWorkDetail.repecitData" @click="changeBigType( $event )">
			    	        <div class="typeName clearfix isShow">
			    	            <span class="left" v-text="item.typeName"></span>
			    	            <i class="right iconfont icon-jiantou"></i>
			    	            <span class="right" v-text="'￥'+item.amount/100"></span>
			    	        </div>
			    	        <div class="smallGood clearfix " v-for="item2 in item.products" @click.stop="">
				    	        <span class="left" style="margin-right:10px">-</span>
			    	            <span class="left goodName" v-text="item2.quantity+' × '+item2.productName"></span>
			    	            <span class="right" v-text="'￥'+item2.amount/100"></span>
			    	        </div>
			    	
			    	        <div class="smallItem isSmallItem40px" v-for="item2 in item.productTypes" @click.stop="changeSmallType( $event )">
			    	            <div class="smallTypeName clearfix ">
			    	                <span class="left" v-text="item2.typeName"></span>
			    	                <i class="right iconfont icon-jiantou"></i>
			    	                <span class="right" v-text="'￥'+item2.amount/100"></span>
			    	            </div>
			    	            <div class="smallTypeGood clearfix " v-for="item3 in item2.products">
				    	            <span class="left" style="margin-right:10px">-</span>
			    	                <span class="left goodName" v-text="item3.quantity+' × '+item3.productName"></span>
			    	                <span class="right" v-text="'￥'+item3.amount/100"></span>
			    	            </div>
			    	        </div>
			    	    </div>
			    	</div>
			    	<div class="typeBoxTitle clearfix" style="margin-top:20px;cursor:pointer;" @click="couponBtn = !couponBtn">
				    	<span class="left">优惠券核销统计</span>
				    	<span class="right" >查看详情<i style="margin-left:5px;" :class="['iconfont',{'icon-jiantou':!couponBtn,'icon-jiantou-down':couponBtn}]"></i></span>
			    	</div>
			    	<div class="typeBox" v-if="couponBtn" :style="{'overflow-y':curWorkDetail.coupons.length>=4?'scroll':''}">
			    		<div class="item" v-for="(item,idx) in curWorkDetail.coupons">
			    			<div class="typeName clearfix">
			    	            <span class="left" v-text="item.productName"></span>
			    	            <span class="right" v-text="'X'+item.quantity"></span>
			    	            <span class="right" v-text="'￥'+item.amount/100" style="margin-right:30px;"></span>
			    	        </div>
			    		</div>
			    	</div>
				</div>
			</div>
		</div>
		<!-- 当班销售统计 -->
		<div class="curWorkTotalMask mask" @click="showWorkDetailData=false" v-if="showWorkDetailData">
			<div class="curWorkTotalBox modal" @click.stop="">
				<span class="close_btn"  @click="showWorkDetailData=false">&times;</span>
				<div class="title">本班销售统计</div>
		    	<div class="time">
		    		<span>开班时间：</span>
		    		<span>{{curWorkDetail.beginTime|numberToAllDate('')}}</span>
		    	</div>
		    	<div class="workMsgBox">
		    		<div class="workItem left">
		    			<span class="name">姓名：</span>
		    			<span class="val" v-text="curWorkDetail.operatorName"></span>
		    		</div>
		    		<div class="workItem left">
		    			<span class="name">工号：</span>
		    			<span class="val" v-text="curWorkDetail.employeeCode"></span>
		    		</div>
		    		<div class="workItem left">
		    			<span class="name">现金支付：</span>
		    			<span class="val" v-text="'￥'+curWorkDetail.cashAmount"></span>
		    		</div>
		    		<div class="workItem left">
		    			<span class="name">优惠券抵扣：</span>
		    			<span class="val" v-text="'￥'+(curWorkDetail.couponAmount/100)"></span>
		    		</div>
		    		<div class="workItem left">
		    			<span class="name">会员余额支付：</span>
		    			<span class="val" v-text="'￥'+curWorkDetail.memberAmount"></span>
		    		</div>
				    		<div class="workItem left" v-if="curWorkDetail.alipayAmount>0">
				    			<span class="name">支付宝支付：</span>
				    			<span class="val" v-text="'￥'+curWorkDetail.alipayAmount"></span>
				    		</div>
				    		<div class="workItem left" v-if="curWorkDetail.wechatAmount>0">
				    			<span class="name">微信支付：</span>
				    			<span class="val" v-text="'￥'+curWorkDetail.wechatAmount"></span>
				    		</div>
				    		<div class="workItem left" v-if="curWorkDetail.alipayCashAmount>0">
				    			<span class="name">线下支付宝：</span>
				    			<span class="val" v-text="'￥'+curWorkDetail.alipayCashAmount"></span>
				    		</div>
				    		<div class="workItem left" v-if="curWorkDetail.wechatCashAmount>0">
				    			<span class="name">线下微信：</span>
				    			<span class="val" v-text="'￥'+curWorkDetail.wechatCashAmount"></span>
				    		</div>
		    		<div class="clear"></div>
		    		<div style="border-top:1px dotted #fff"></div>
		    		<div class="workItem spec1 clearfix" >
		    			<div class="left" style="width:50%;text-align:left;opacity:0;">
		    				<span class="name">上缴金额：</span>
		    				<span class="val" style="text-align:left;" v-text="'￥'+(curWorkDetail.cashAmount+curWorkDetail.alipayCashAmount+curWorkDetail.wechatCashAmount)"></span>
		    			</div>
		    			<div class="left">
		    				<span class="name">总销售额：</span>
		    				<span class="val" style="text-align:left;" v-text="'￥'+curWorkDetail.turnInAmount"></span>
		    			</div>
		    		</div>
		    		<!-- <div class="workItem spec1">
		    			<span class="name">会员充值：</span>
		    			<span class="val" v-text="'￥'+curWorkDetail.memberRechargeAmount/100"></span>
		    		</div> -->
		    	</div>
		    	<div class="workMsgBox" style="margin-top:10px;">
		    		<div class="workItem spec1">
		    			<span class="name">会员充值：</span>
		    			<span class="val" style="text-align:left;" v-text="'￥'+curWorkDetail.memberRechargeAmount/100"></span>
		    		</div>
		    	</div>
		    	<div class="clearfix">
		    		<div class="left" style="width:58%;">
		    			<div class="typeBoxTitle">分类列表</div>
				    	<div class="typeBox">
				    	    <div class="item isItem40px" v-for="(item,idx) in curWorkDetail.repecitData" @click="changeBigType( $event )">
				    	        <div class="typeName clearfix">
				    	            <span class="left" v-text="item.typeName"></span>
				    	            <i class="right iconfont icon-jiantou"></i>
				    	            <span class="right" v-text="'￥'+item.amount/100"></span>
				    	        </div>
				    	        <div class="smallGood clearfix" v-for="item2 in item.products" @click.stop="">
					    	        <span class="left" style="margin-right:10px">-</span>
				    	            <span class="left goodName" v-text="item2.quantity+' × '+item2.productName"></span>
				    	            <span class="right" v-text="'￥'+item2.amount/100"></span>
				    	        </div>
				    	
				    	        <div class="smallItem isSmallItem40px" v-for="item2 in item.productTypes" @click.stop="changeSmallType( $event )">
				    	            <div class="smallTypeName clearfix">
				    	                <span class="left" v-text="item2.typeName"></span>
				    	                <i class="right iconfont icon-jiantou"></i>
				    	                <span class="right" v-text="'￥'+item2.amount/100"></span>
				    	            </div>
				    	            <div class="smallTypeGood clearfix" v-for="item3 in item2.products">
					    	            <span class="left" style="margin-right:10px">-</span>
				    	                <span class="left goodName" v-text="item3.quantity+' × '+item3.productName"></span>
				    	                <span class="right" v-text="'￥'+item3.amount/100"></span>
				    	            </div>
				    	        </div>
				    	    </div>
				    	</div>
		    		</div>
		    		<div class="right" style="width:40%;">
		    			<div class="typeBoxTitle clearfix">
			    			<span class="left" style="margin-left:10px;">网费</span>
			    			<span class="right" style="font-size:16px;color:#e66a6a;margin-right:10px;" v-text="'￥'+costList.amount/100"></span>
		    			</div>
			    	    <div class="typeBox_Cost">
				    	    <div class="item clearfix" v-for="(item,idx) in costList.list">
			    	            <span class="left" v-text="item.name"></span>
			    	            <span class="right" v-text="'￥'+item.price/100" style="margin-right:0;"></span>
				    	    </div>
				    	</div>
		    		</div>
		    	</div>
	    	   
	    	    
			</div>
		</div>

		<!-- 销售汇总查询 -->
		<div class="workSelMask mask" @click="showWorkSelData=false" v-if="showWorkSelData">
			<div class="workSelModal modal" @click.stop="">
				<span class="close_btn"  @click="showWorkSelData=false">&times;</span>
				<div class="title">销售汇总查询</div>
				<div class="order-Sale">
					<!-- <span class="item">总收入:<span class="num color3" v-text="((salesData.cashAmount+salesData.wechatAmount+salesData.wechatCashAmount+salesData.alipayCashAmount+salesData.alipayAmount+salesData.memberAmount+salesData.couponAmount)/100).toFixed(2)"></span></span> -->
					<span class="item">总销售额:<span class="num color3" v-text="salesData.cashAmount/100" ></span></span>
                    <!-- <span class="item">现金:<span class="num color5" v-text="salesData.cashAmount/100"></span></span>
                    <span class="item">微信:<span class="num color4" v-text="salesData.wechatAmount/100"></span></span>
                    <span class="item">支付宝:<span class="num color1"  v-text="salesData.alipayAmount/100"></span></span>
                    <span class="item">线下微信:<span class="num color1"  v-text="salesData.wechatCashAmount/100"></span></span>
                    <span class="item">线下支付宝:<span class="num color1"  v-text="salesData.alipayCashAmount/100"></span></span>
                    <span class="item">会员:<span class="num color3" v-text="salesData.memberAmount/100"></span></span>
                    <span class="item">优惠券:<span class="num color2" v-text="salesData.couponAmount/100"></span></span> -->
				</div>
				<div class="top">
					<el-date-picker
					  v-model="timeFrom"
					  value-format="yyyy/MM/dd-HH:mm:ss"
					  type="datetime"
					  class="dateTime"
					  :picker-options="pickerOptions0"
					  placeholder="选择开始日期时间">
					</el-date-picker>
					<el-date-picker
					  v-model="timeTo"
					  value-format="yyyy/MM/dd-HH:mm:ss"
					  type="datetime"
					  class="dateTime"
					  :picker-options="pickerOptions0"
					  placeholder="选择结束日期时间">
					</el-date-picker>
					<div class="types">
					    分类选择：
					    <el-select v-model="typeId">
					        <el-option
					          v-for="item in typeList"
					          :key="item.id"
					          :label="item.name"
					          :value="item.id">
					        </el-option>
					    </el-select>
					</div>
					<div class="types">
					    商品选择：
					    <el-input
					        placeholder="请输入商品名称"
					        prefix-icon="el-icon-search"
					        v-model="searchKeywords"
					        @focus="searchKeywords='';goodId=''">
					    </el-input>
					    <ul class="searchInner" :style="{display:(searchList[0]?'block':'none')}" @click.stop="">
					        <li v-for="item in searchList" v-text="item.name" @click="selGood(item)"></li>
					    </ul>
					</div>
					<span class="searchConfirmBtn" @click="searchConfirm">查询</span>
				</div>

				<div class="tableBox">
					<table class="titleTable">
					    <thead>
					    	<tr>
					    	    <th style="width:10%">序号</th>
					    	    <th style="width:30%">商品名称</th>
					    	    <th style="width:20%">数量</th>
					    	    <th style="width:20%">售价</th>
					    	    <th style="width:20%">总计</th>
					    	</tr>
					    </thead>
					</table>
					<div class="scrollBox">
					    <div class="scroll">
					        <table class="conTable" :class="{overLengthTable:workSelData.length>10}">
					            <tbody>
					            	<tr v-for="(item,ind) in workSelData">
					            	    <td style="width:10%" >
					            	        <span v-text="ind+1" v-if="item.productId"></span>
					            	        <span v-if="!item.productId"></span>
					            	    </td>
					            	    <td style="width:30%" v-text="item.productName"></td>
					            	    <td style="width:20%" v-text="item.quantity"></td>
					            	    <td style="width:20%" v-text="item.single"></td>
					            	    <td style="width:20%" v-text="item.amount"></td>
					            	</tr>
					            </tbody>
					        </table>
					    </div>
					</div>
				</div>
			</div>
		</div>
		<!-- 打印确认框 -->
		<div class="confirmPrintMask mask" @click="showConfirmPrint=false" v-if="showConfirmPrint">
			<div class="confirmPrint modal" @click.stop="">
				<div class="title">注意</div>
				<div class="tipText">是否确认已打印交班小票？</div>
				<div class="btnGroup">
				    <button type="button" class="save" @click="exit()">确认</button>
				    <button type="button" class="cancel" @click="showConfirmPrint=false">取消</button>
				</div>
			</div>
		</div>
		<!-- 盘点小票 -->
		<div style="display:none;">
			<div id="inv_print" style="width: 190px; fontSize: 12px;">
				<h1 style="text-align:center;font-size:18px;">欢迎使用火星捕手</h1>
				<p style="text-align:center;font-size:16px;">盘点小票</p>
		    	<div>
		    		<span>店铺名:</span>
		    		<span v-text="invPerson.storeName"></span>
		    	</div>
		    	<div>
		    		<span>操作员:</span>
		    		<span v-text="invPerson.operatorName"></span>
		    	</div>
				<div>
		    		<span>打印时间:</span>
		    		<span>{{new Date() | numberToAllDate('')}}</span>
		    	</div>
		    	<div style="margin-top:10px;border:1px solid #444">
		    		<table style="width:100%;border-collapse: collapse;table-layout:fixed;font-size:12px;">
		    			<tr>
		    				<td style="width:50%;">名称</td>
		    				<td style="width:30%;text-align:center;">应有</td>
		    				<td style="width:20%;">实际</td>
		    			</tr>
	    				<tr v-for="(item,idx) in inventoryPrintList">
	    					<td style="width:50%;overflow:hidden;white-space:nowrap;text-align:left" v-text="item.name"></td>
	    					<td style="width:30%;text-align:center;" v-text="item.counterQuantity"></td>
	    					<td style="width:20%;"></td>
	    				</tr>
		    		</table>
		    	</div>
			</div>
		</div>
		<!-- 当前班交班小票 -->
		<div style="display:none;">
			<div id="receipt">
			    <div style="width: 190px; fontSize: 12px;">
			    	<h1 style="text-align:center;font-size:18px;">欢迎使用火星捕手</h1>
					<p style="text-align:center;font-size:16px;" v-text="workShift.storeName+'-交班'"></p>
			    	<div>
			    		<span>起始时间:</span>
			    		<span>{{workShift.beginTime | numberToAllDate('')}}</span>
			    	</div>
			    	<div>
			    		<span>打印时间:</span>
			    		<span>{{workShift.endTime | numberToAllDate('')}}</span>
			    	</div>
			    	<div style="margin: 10px 0;">
			    		<div>
			    			<span>姓名：</span>
			    			<span v-text="workShift.operatorName"></span>
			    		</div>
			    		<div>
			    			<span>工号：</span>
			    			<span v-text="workShift.employeeCode"></span>
			    		</div>
		    		</div>
		    		<div>
			    		<div>
			    			<span style="display:inline-block;width: 55%;">现金支付：</span>
			    			<span v-text="workShift.cashAmount"></span>
			    		</div>
			    		<div v-if="workShift.wechatCashAmount>0">
			    			<span style="display:inline-block;width: 55%;">线下微信：</span>
			    			<span v-text="workShift.wechatCashAmount"></span>
			    		</div>
			    		<div v-if="workShift.alipayCashAmount>0">
			    			<span style="display:inline-block;width: 55%;">线下支付宝：</span>
			    			<span v-text="workShift.alipayCashAmount"></span>
			    		</div>
			    		<div>----------------------------------------</div>
			    		<div>
			    			<span style="display:inline-block;width: 55%;">优惠券抵扣：</span>
			    			<span v-text="(workShift.couponAmount/100)"></span>
			    		</div>
			    		<div>
			    			<span style="display:inline-block;width: 55%;">会员余额支付：</span>
			    			<span v-text="workShift.memberAmount"></span>
			    		</div>
			    		<div v-if="workShift.alipayAmount>0">
			    			<span style="display:inline-block;width: 55%;">支付宝支付：</span>
			    			<span v-text="workShift.alipayAmount"></span>
			    		</div>
			    		<div v-if="workShift.wechatAmount>0">
			    			<span style="display:inline-block;width: 55%;">微信支付：</span>
			    			<span v-text="workShift.wechatAmount"></span>
			    		</div>
			    		<!-- <div style="margin-top:5px;">
			    			<span style="display:inline-block;width: 55%;font-weight:bold;">上缴金额：</span>
			    			<span v-text="workShift.cashAmount+workShift.alipayCashAmount+workShift.wechatCashAmount"></span>
			    		</div> -->
			    		<div style="margin-top:5px;">
			    			<span style="display:inline-block;width: 55%;font-weight:bold;">总销售额：</span>
			    			<span v-text="workShift.turnInAmount"></span>
			    		</div>
			    		<div>----------------------------------------</div>
			    		<div>
			    			<span style="display:inline-block;width: 55%;">会员充值：</span>
			    			<span v-text="workShift.memberRechargeAmount/100"></span>
			    		</div>
			    		<div>----------------------------------------</div>
			    		<div>
			    			<span style="display:inline-block;width: 55%;font-weight:bold;">网费：</span>
			    			<span v-text="costList.amount/100"></span>
			    		</div>
			    		<div>
			    			<div v-for="item in costList.list">
			    				<span style="display:inline-block;width: 55%;" v-text="item.name"></span>
			    				<span v-text="'￥'+item.price/100"></span>
			    			</div>
			    		</div>
			    	</div>
			    	<div>----------------------------------------</div>
					<div  style="margin-top:10px;border:1px solid #444" v-if="totalClassify=='ONETYPE'">
						<div style="font-weight:600;margin-bottom:5px;" v-for="(item,idx) in repecitData.ONETYPE">
					    	<span v-text="item.typeName+'：'"></span>
					    	<span v-text="'￥'+item.amount/100"></span>
		    			</div>
			    	</div>
			    	<div  style="margin-top:10px;border:1px solid #444" v-if="totalClassify=='ONETOWTYPE'||totalClassify=='DETAILARRTYPE'">
						<div style="font-weight:600;margin-bottom:5px;" v-for="(item,idx) in repecitData.ONETOWTYPE" :style="{'padding-left':item.id==2?'.5em':''}">
					    	<span v-text="item.typeName+'：'" style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;width: 130px;display:inline-block;"></span>
					    	<span v-text="'￥'+item.amount/100"></span>
		    			</div>
			    	</div>

			    	<div style="margin-top:10px;border:1px solid #444" v-if="totalClassify=='DETAILARR'||totalClassify=='DETAILARRTYPE'">	
						<div v-for="(item,idx) in repecitData.DETAILARR">
							<div style="font-weight:600;margin-bottom:5px;">
						    	<span v-text="item.typeName+'：'" style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;width: 130px;display:inline-block;"></span>
						    	<span v-text="'￥'+item.amount/100"></span>
			    			</div>
				    		<table style="width:100%;border-collapse: collapse;table-layout:fixed;font-size:12px;">
				    			<tr>
				    				<td style="width:50%;">名称</td>
				    				<td style="width:23%;">数量</td>
				    				<td style="width:27%;">金额</td>
				    			</tr>
			    				<tr v-for="(oitem,idx) in item.products">
			    					<td style="width:50%;overflow:hidden;white-space:nowrap;text-align:left" v-text="oitem.productName"></td>
			    					<td style="width:25%;" v-text="oitem.quantity"></td>
			    					<td style="width:25%;" v-text="'￥'+oitem.amount/100"></td>
			    				</tr>
				    		</table>
						</div>
			    	</div>
			    	<div style="margin-top: 10px;">
			    		<span>销售总数：</span>
			    		<span v-text="repecitData.totalQuantity"></span>
			    	</div>
			    	<div>
			    		<span>销售总值：</span>
			    		<span v-text="repecitData.totalAmount/100"></span>
			    	</div>
			    </div>
			</div>
		</div>
		<!-- 上一班交班小票 -->
		<div style="display:none;">
			<div id="lastReceipt">
			    <div style="width: 190px; fontSize: 12px;">
			    	<h1 style="text-align:center;font-size:18px;">欢迎使用火星捕手</h1>
					<p style="text-align:center;font-size:16px;" v-text="lastWorkShift.storeName+'-交班（补打）'"></p>
			    	<div>
			    		<span>起始时间:</span>
			    		<span>{{lastWorkShift.beginTime | numberToAllDate('')}}</span>
			    	</div>
			    	<div>
			    		<span>结束时间:</span>
			    		<span>{{lastWorkShift.endTime | numberToAllDate('')}}</span>
			    	</div>
			    	<div>
			    		<span>打印时间:</span>
			    		<span>{{new Date() | numberToAllDate('')}}</span>
			    	</div>
			    	<div style="margin: 10px 0;">
			    		<div>
			    			<span>姓名：</span>
			    			<span v-text="lastWorkShift.operatorName"></span>
			    		</div>
			    		<div>
			    			<span>工号：</span>
			    			<span v-text="lastWorkShift.operatorCode"></span>
			    		</div>
		    		</div>
		    		<div>
			    		<!-- <div>
			    			<span style="display:inline-block;width: 55%;">上缴金额：</span>
			    			<span v-text="lastWorkShift.turnInAmount">15689</span>
			    		</div> -->
			    		<div>
			    			<span style="display:inline-block;width: 55%;">现金支付：</span>
			    			<span v-text="lastWorkShift.cashAmount/100"></span>
			    		</div>
			    		<div>
			    			<span style="display:inline-block;width: 55%;">优惠券抵扣：</span>
			    			<span v-text="(lastWorkShift.couponAmount/100)"></span>
			    		</div>
			    		<div>
			    			<span style="display:inline-block;width: 55%;">会员余额支付：</span>
			    			<span v-text="lastWorkShift.memberAmount/100"></span>
			    		</div>
					    		<div v-if="lastWorkShift.alipayAmount>0">
					    			<span style="display:inline-block;width: 55%;">支付宝支付：</span>
					    			<span v-text="lastWorkShift.alipayAmount/100"></span>
					    		</div>
					    		<div v-if="lastWorkShift.wechatAmount>0">
					    			<span style="display:inline-block;width: 55%;">微信支付：</span>
					    			<span v-text="lastWorkShift.wechatAmount/100"></span>
					    		</div>
					    		<div v-if="lastWorkShift.alipayCashAmount>0">
					    			<span style="display:inline-block;width: 55%;">线下支付宝：</span>
					    			<span v-text="lastWorkShift.alipayCashAmount/100"></span>
					    		</div>
					    		<div v-if="lastWorkShift.wechatCashAmount>0">
					    			<span style="display:inline-block;width: 55%;">线下微信：</span>
					    			<span v-text="lastWorkShift.wechatCashAmount/100"></span>
					    		</div>
			    		<div style="margin-top:5px;">
			    			<span style="display:inline-block;width: 55%;font-weight:bold;">总销售额：</span>
			    			<span v-text="lastWorkShift.turnInAmount/100"></span>
			    		</div>
			    		<div>----------------------------------------</div>
			    		<div>
			    			<span style="display:inline-block;width: 55%;">会员充值：</span>
			    			<span v-text="lastWorkShift.memberDepositAmount/100"></span>
			    		</div>
			    		<div>----------------------------------------</div>
			    		<div>
			    			<span style="display:inline-block;width: 55%;font-weight:bold;">网费：</span>
			    			<span v-text="lastCostList.amount/100"></span>
			    		</div>
			    		<div>
			    			<div v-for="item in lastCostList.list">
			    				<span style="display:inline-block;width: 55%;" v-text="item.name"></span>
			    				<span v-text="'￥'+item.price/100"></span>
			    			</div>
			    		</div>
			    	</div>
			    	<div>----------------------------------------</div>
					<div  style="margin-top:10px;border:1px solid #444" v-if="totalClassify=='ONETYPE'">
						<div style="font-weight:600;margin-bottom:5px;" v-for="(item,idx) in lastRepecitData.ONETYPE">
					    	<span v-text="item.typeName+'：'"></span>
					    	<span v-text="'￥'+item.amount/100"></span>
		    			</div>
			    	</div>
			    	<div  style="margin-top:10px;border:1px solid #444" v-if="totalClassify=='ONETOWTYPE'||totalClassify=='DETAILARRTYPE'">
						<div style="font-weight:600;margin-bottom:5px;" v-for="(item,idx) in lastRepecitData.ONETOWTYPE" :style="{'padding-left':item.id==2?'.5em':''}">
					    	<span v-text="item.typeName+'：'" style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;width: 130px;display:inline-block;"></span>
					    	<span v-text="'￥'+item.amount/100"></span>
		    			</div>
			    	</div>

			    	<div style="margin-top:10px;border:1px solid #444" v-if="totalClassify=='DETAILARR'||totalClassify=='DETAILARRTYPE'">	
						<div v-for="(item,idx) in lastRepecitData.DETAILARR">
							<div style="font-weight:600;margin-bottom:5px;">
						    	<span v-text="item.typeName+'：'" style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;width: 130px;display:inline-block;"></span>
						    	<span v-text="'￥'+item.amount/100"></span>
			    			</div>
				    		<table style="width:100%;border-collapse: collapse;table-layout:fixed;font-size:12px;">
				    			<tr>
				    				<td style="width:50%;">名称</td>
				    				<td style="width:23%;">数量</td>
				    				<td style="width:27%;">金额</td>
				    			</tr>
			    				<tr v-for="(oitem,idx) in item.products">
			    					<td style="width:50%;overflow:hidden;white-space:nowrap;text-align:left" v-text="oitem.productName"></td>
			    					<td style="width:25%;" v-text="oitem.quantity"></td>
			    					<td style="width:25%;" v-text="'￥'+oitem.amount/100"></td>
			    				</tr>
				    		</table>
						</div>
			    	</div>
			    	<div style="margin-top: 10px;">
			    		<span>销售总数：</span>
			    		<span v-text="lastRepecitData.totalQuantity"></span>
			    	</div>
			    	<div>
			    		<span>销售总值：</span>
			    		<span v-text="lastRepecitData.totalAmount/100"></span>
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
		return {
			invPerson:{},//打印操作员
			workShift:{
				"id": "",
			 	"storeId": "",
			 	"storeName": "",
			 	"operatorName": "",
			 	"mobile": "",
			 	"employeeCode": "",
			 	"beginTime": "-",
			 	"endTime": "-",
			 	"staffList": [],
			 	"turnInAmount": 0,
			 	"cashAmount": 0,
			 	"alipayAmount": 0,
			 	"wechatAmount": 0,
			 	"barAmount":0
			},
			lastWorkShift:{
				"id": "",
			 	"storeId": "",
			 	"storeName": "",
			 	"operatorName": "",
			 	"mobile": "",
			 	"employeeCode": "",
			 	"beginTime": "-",
			 	"endTime": "-",
			 	"staffList": [],
			 	"turnInAmount": 0,
			 	"cashAmount": 0,
			 	"alipayAmount": 0,
			 	"wechatAmount": 0,
			 	"barAmount":0
			},
			curWorkDetail: {repecitData:[]}, // 当班销售统计
			lastRepecitData:{},
			storeInfo:{},
			internetAmount:'',//上缴网费
			initId:false,
			confirm: false, // 确认
			showExchange: false, // 是否显示交班
			showWorkDetailData: false, // 是否显示当班销售统计
			showConfirmPrint: false, // 是否显示确认打印提示框

			repecitNumber: 1, // 交班打印份数
			inventoryPrintsNumber: 1, // 库存打印份数
			pageSize: 10, 
			inventoryList: [], // 库存列表
			inventoryPrintList:[],//库存打印列表
			printReceipt: false, // 是否打印小票

			repecitData: {}, // 报表信息
			totalClassify:'',//是否打印总分类

			couponBtn:false,

			showWorkSelData: false, // 显示销售汇总查询框
			pickerOptions0: {
			    disabledDate(time) {
			        return time.getTime() > Date.now()||time.getTime()< Date.now()-259200000;
			    }
			},
			workSelData: [], // 销售汇总查询数组
			typeList: [{
			    name: '全部',
			    id: ''
			}], // 分类
			timeFrom:'',//开始时间
			timeTo:'',//截止时间
			typeId: '', // 分类id
			goodId: '', // 商品id
			searchKeywords: '',// 搜索关键字
			searchList: [], // 搜索结果数组
			canSearch: true, // 控制是否触发watch
			goodSearchBtn: true, // 控制搜索请求
			getBtn: true, // 搜索控制按钮
			costList:{//本班网费
				amount:0,
				list:[]
			},
			lastCostList:{//上一班网费
				amount:0,
				list:[]
			},

			currentPage: 1, // 库存翻页当前页
			totalElements: 0, // 库存总页码
			salesData:{
                turnInAmount: 0,
                cashAmount: 0,
                wechatAmount: 0,
                alipayAmount: 0,
                memberAmount: 0,
                couponAmount: 0,
                wechatCashAmount: 0,
                alipayCashAmount: 0
            },//销售数据
            workCalculateData:{
            	amount:0,
            	quantity:0
            },
		}
	},
	watch:{
	    searchKeywords : function(val){
	        if ( this.canSearch ) {
	            this.goodSearch();
	        } else {
	            this.canSearch = true;
	        }
	    },
	},
	methods:{
		//汇总
		getSales(){
            let url = this.conditionFn();
            this.$http.get(this.storeId+'/sales-total'+url).then((res)=>{
                this.salesData = res.data;
            })
        },
        //清空销售汇总 初始化数据
        clearShowWorkSelDatFn(){
        	this.showWorkSelData=true;
        	this.timeFrom='';//开始时间
			this.timeTo='';//截止时间
			this.typeId=''; // 分类id
			this.goodId= ''; // 商品id
			this.salesData={
                turnInAmount: 0,
                cashAmount: 0,
                wechatAmount: 0,
                alipayAmount: 0,
                memberAmount: 0,
                couponAmount: 0,
                wechatCashAmount: 0,
                alipayCashAmount: 0
            };
            this.workSelData = [];
        },
		// 选择搜索出来的商品
		selGood: function ( item ) {
		    this.canSearch = false;
		    this.searchKeywords = item.name;
		    this.goodId = item.id;
		    this.searchList = [];
		},
		// 搜索
		searchConfirm: function () {
		    if(this.timeTo&&this.timeFrom){
		        if(new Date(this.timeFrom)>new Date(this.timeTo)){
		            this.$message({
		                message: '结束时间不能比开始时间小',
		                showClose: true,
		                type: 'error'
		            })
		            return;
		        }
		        this.getSelWorkData();
		        this.getSales();
		    } else {
		        this.$message({
		            message: '请选择查询时间段',
		            showClose: true,
		            type: 'error'
		        })
		    }
		},
		// 商品模糊检索
		goodSearch: function () {
			let val = this.searchKeywords;
			if ( !val ) {
			    this.searchList = [];
			    return;
			}
			if ( !this.goodSearchBtn ) {
			    return;
			}
			this.goodSearchBtn = false;
			this.$http.get('products/search?storeId='+this.storeId+'&q='+encodeURI(val)).then((res)=>{
			    this.searchList = res.data;
			    for (var i = 0, len = this.searchList.length; i < len; i++) {
			        if ( this.searchKeywords == this.searchList[i].name ) {
			            this.goodId = this.searchList[i].id;
			            break;
			        } else {
			            this.goodId = '';
			        }
			    }
			    this.goodSearchBtn = true;
			}).catch(()=>{
			    this.goodSearchBtn = true;
			})
		},
		//获取消费记录列表
		getSelWorkData(){
		    if ( !this.getBtn ) {
		        return;
		    }
		    this.getBtn = false;
		    let url = this.conditionFn();
		    this.$http.get(this.storeId+'/product-sales'+url).then((res)=>{
		        this.workSelData = res.data;
		        if( this.workSelData.length < this.pageSize ){
		            for(let i = 0, len = this.pageSize - this.workSelData.length; i < len; i++){
		                this.workSelData.push({})
		            }
		        }
		        for(let i = 0,len = this.workSelData.length;i<len;i++){
		            if(this.workSelData[i].productId){
		                this.workSelData[i].single = (this.workSelData[i].amount/this.workSelData[i].quantity).toFixed(2);
		            }
		        }
		        this.getBtn = true;
		    }).catch(()=>{
		        this.getBtn = true;
		    })
		},
		//搜索条件
		conditionFn(){
		    let URL = '';
		    this.timeFrom    ? URL += ('?from='+new Date(this.timeFrom).Format('yyyy-MM-dd hh:mm:ss')):'';
		    this.timeTo      ? URL += ('&to='+new Date(this.timeTo).Format('yyyy-MM-dd hh:mm:ss')):'';
		    URL += '&productTypeId='+this.typeId+'&productId='+this.goodId;
		    return URL;
		},
		changeBigType: function ( event ) {
			if ($(event.target).parents('.item').is('.isItem40px')) {
				$(event.target).parents('.item').children('.smallGood').addClass('isShow');
				$(event.target).parents('.item').children('.smallItem').addClass('isShow');

				$(event.target).parents('.item').removeClass('isItem40px');
				$(event.target).children('i').removeClass('icon-jiantou');
				$(event.target).children('i').addClass('icon-jiantou-down');
				$(event.target).parents('.item').css('height', 'auto');
			} else {
				$(event.target).parents('.item').children('.smallGood').removeClass('isShow');
				$(event.target).parents('.item').children('.smallItem').removeClass('isShow');

				$(event.target).parents('.item').addClass('isItem40px');
				$(event.target).children('i').removeClass('icon-jiantou-down');
				$(event.target).children('i').addClass('icon-jiantou');
				$(event.target).parents('.item').css('height', '40px');
			}
			($('.isShow').length>=5)?$('.typeBox').css('overflow-y', 'scroll'):$('.typeBox').css('overflow-y', 'auto');
		},
		changeSmallType: function ( event ) {
			if ( $(event.target).parents('.smallItem').is('.isSmallItem40px')) {
				$(event.target).parents('.smallItem').children('.smallTypeGood').addClass('isShow');

				$(event.target).parents('.smallItem').removeClass('isSmallItem40px');
				$(event.target).children('i').removeClass('icon-jiantou');
				$(event.target).children('i').addClass('icon-jiantou-down');
				$(event.target).parents('.smallItem').css('height', 'auto');
			} else {
				$(event.target).parents('.smallItem').children('.smallTypeGood').removeClass('isShow');

				$(event.target).parents('.smallItem').addClass('isSmallItem40px');
				$(event.target).children('i').removeClass('icon-jiantou-down');
				$(event.target).children('i').addClass('icon-jiantou');
				$(event.target).parents('.smallItem').css('height', '40px');
			}
			($('.isShow').length>=5)?$('.typeBox').css('overflow-y', 'scroll'):$('.typeBox').css('overflow-y', 'auto');
		},
		couponFn(event){
		},
		print: function () {
		},
  		// 获得列表
  		getInventoryList: function ( val ) {
  			this.$http.get(this.storeId+'/inventory?page='+(val-1)+'&size='+this.pageSize).then((res)=>{
  				this.inventoryList = res.data.products;
  				this.totalElements = res.data.totalElements;
  				for (let i = 0, len = (this.pageSize - this.inventoryList.length); i < len; i++) {
  					this.inventoryList.push({});
  				}
  			});
  		},
  		//获取上一个班信息
  		getLastWorkShift(){
  			this.$http.get('/workshift/'+this.storeId+'/last-details').then((res)=>{
  				let costs = {
  					'memberAmount':res.data.cost.memberAmount,
  					'couponAmount':res.data.cost.couponAmount,
  					'wechatAmount':res.data.cost.wechatAmount,
  					'alipayAmount':res.data.cost.alipayAmount,
  					'cashAmount':res.data.cost.cashAmount,
  					'wechatCashAmount':res.data.cost.wechatCashAmount,
  					'alipayCashAmount':res.data.cost.alipayCashAmount
  				} 
  				let nameType = {
					'alipayAmount':'支付宝支付',
					'alipayCashAmount':'线下支付宝',
					'cashAmount':'现金支付',
					'couponAmount':'优惠券抵扣',
					'memberAmount':'会员支付',
					'wechatAmount':'微信支付',
					'wechatCashAmount':'线下微信',
				};
				this.lastCostList={
					amount :0,
					list :[]
				};
				for (var k in costs) {
					if(k!='turnInAmount'&&costs[k]!=0){
						let obj = {
							name:'',
							price:''
						};
						obj.name = nameType[k];
						obj.price = costs[k];
						this.lastCostList.amount+=costs[k];
						this.lastCostList.list.push(obj);
					}
				}
  				this.lastWorkShift = res.data;
  				var data = res.data.productTypes;
          		var DETAILARR = [];//一二级分类加商品
          		var ONETYPE = [];//仅一级分类
          		var ONETOWTYPE = [];//仅一二级分类
          		var totalQuantity = 0;
          		var totalAmount = 0;
          		for(var i =0,len = data.length;i<len;i++){
          			var obj={};
          			obj.id = 1;
          			obj.typeName = data[i].typeName;
          			obj.products = data[i].products;
          			if(data[i].products&&data[i].products.length>0){
          				let amount = 0;
          				let quantity = 0;
          				for(var j=0;j<data[i].products.length;j++){
          					amount+=data[i].products[j].amount;
          					quantity+=data[i].products[j].quantity;
          				}
          				obj.amount  =amount;
          				obj.quantity=quantity;
	          			DETAILARR.push(obj);
          			}
          			var twoType=data[i].productTypes;
          			if(twoType.length>0) {
          				for(var k = 0,lens = twoType.length;k<lens;k++){
	          				var n = {
	          					"id":2,
	          					"amount":twoType[k].amount,
	          					"quantity":twoType[k].quantity,
	          					"typeName":twoType[k].typeName,
	          					"products":twoType[k].products,
	          				};
		          			DETAILARR.push(n);
		          		}
          			}
          		}
          		for(var i =0,len = data.length;i<len;i++){
          			totalAmount+=data[i].amount;
          			totalQuantity+=data[i].quantity;
          			var obj = {
      					"id":1,
      					"amount":data[i].amount,
      					"quantity":data[i].quantity,
      					"typeName":data[i].typeName,
      					"products":data[i].products,
      				};
	          		ONETYPE.push(obj);
	          		ONETOWTYPE.push(obj);
          			var twoType=data[i].productTypes;
          			if(twoType.length>0) {
          				for(var k = 0,lens = twoType.length;k<lens;k++){
	          				var n = {
	          					"id":2,
	          					"amount":twoType[k].amount,
	          					"quantity":twoType[k].quantity,
	          					"typeName":'-'+twoType[k].typeName,
	          					"products":twoType[k].products,
	          				};
		          			ONETOWTYPE.push(n);
		          		}
          			}
          		}
          		this.lastRepecitData = {
          			DETAILARR:DETAILARR,
          			ONETYPE:ONETYPE,
          			ONETOWTYPE:ONETOWTYPE,
          			totalAmount:totalAmount,
          			totalQuantity:totalQuantity
          		}
  			})
  		},
  		// 前往交班
  		goExchange: function () {
  			this.totalClassify = localStorage.getItem('totalClassify');
            this.getWorkShift();
	        //获取前一班次数据
	        this.getLastWorkShift();
  		},
		getWorkShift(){
			this.$http.get('/workshift/current?storeId='+this.storeId).then((res)=>{
          		this.workShift = res.data;
          		this.showExchange = true;
          		this.getRepecitData();
			}).catch((err)=>{
				this.showExchange = true;
			})
		},
		// 获取当班销售统计
		getWorkDetail: function () {
			this.$http.get('/workshift/current?storeId='+this.storeId).then((res)=>{
          		this.curWorkDetail = res.data;
				this.$http.get('/workshift/'+this.curWorkDetail.id+'/summary').then((res)=>{
					this.$set(this.curWorkDetail, 'repecitData', res.data.type);
					this.$set(this.curWorkDetail, 'coupons', res.data.coupons);
					console.log(this.curWorkDetail.repecitData);
					for(var ii =0;ii<this.curWorkDetail.repecitData.length;ii++){
						if(this.curWorkDetail.repecitData[ii].typeId){
							this.workCalculateData.amount += this.curWorkDetail.repecitData[ii].amount/100;
						}
					}
					this.workCalculateData.amount = this.workCalculateData.amount.toFixed(2);
					let costs = {
						'memberAmount':res.data.cost.memberAmount,
	  					'couponAmount':res.data.cost.couponAmount,
	  					'wechatAmount':res.data.cost.wechatAmount,
	  					'alipayAmount':res.data.cost.alipayAmount,
	  					'cashAmount':res.data.cost.cashAmount,
	  					'wechatCashAmount':res.data.cost.wechatCashAmount,
	  					'alipayCashAmount':res.data.cost.alipayCashAmount
					};
	  				let nameType = {
						'alipayAmount':'支付宝支付',
						'alipayCashAmount':'线下支付宝',
						'cashAmount':'现金支付',
						'couponAmount':'优惠券抵扣',
						'memberAmount':'会员支付',
						'wechatAmount':'微信支付',
						'wechatCashAmount':'线下微信',
					};
					this.costList={
						amount :0,
						list :[]
					};
					for (var k in costs) {
						if(k!='turnInAmount'&&costs[k]!=0){
							let obj={
								name:'',
								price:''
							};
							obj.name = nameType[k];
							obj.price = costs[k];
							this.costList.amount+=costs[k];
							this.costList.list.push(obj);
						}
					}
				})
			}).catch((err)=>{

			})
		},
		// 获得报表信息
		getRepecitData () {
			this.$http.get('/workshift/'+this.workShift.id+'/summary').then((res)=>{
          		// this.repecitData = res.data;
          		var data = res.data.type;
          		var DETAILARR = [];//一二级分类加商品
          		var ONETYPE = [];//仅一级分类
          		var ONETOWTYPE = [];//仅一二级分类
          		var totalQuantity = 0;
          		var totalAmount = 0;
          		for(var i =0,len = data.length;i<len;i++){
          			var obj={};
          			obj.id = 1;
          			obj.typeName = data[i].typeName;
          			obj.products = data[i].products;
          			if(data[i].products&&data[i].products.length>0){
          				let amount = 0;
          				let quantity = 0;
          				for(var j=0;j<data[i].products.length;j++){
          					amount+=data[i].products[j].amount;
          					quantity+=data[i].products[j].quantity;
          				}
          				obj.amount  =amount;
          				obj.quantity=quantity;
	          			DETAILARR.push(obj);
          			}
          			var twoType=data[i].productTypes;
          			if(twoType.length>0) {
          				for(var k = 0,lens = twoType.length;k<lens;k++){
	          				var n = {
	          					"id":2,
	          					"amount":twoType[k].amount,
	          					"quantity":twoType[k].quantity,
	          					"typeName":twoType[k].typeName,
	          					"products":twoType[k].products,
	          				};
		          			DETAILARR.push(n);
		          		}
          			}
          		}
          		for(var i =0,len = data.length;i<len;i++){
          			totalAmount+=data[i].amount;
          			totalQuantity+=data[i].quantity;
          			var obj = {
      					"id":1,
      					"amount":data[i].amount,
      					"quantity":data[i].quantity,
      					"typeName":data[i].typeName,
      					"products":data[i].products,
      				};
	          		ONETYPE.push(obj);
	          		ONETOWTYPE.push(obj);
          			var twoType=data[i].productTypes;
          			if(twoType.length>0) {
          				for(var k = 0,lens = twoType.length;k<lens;k++){
	          				var n = {
	          					"id":2,
	          					"amount":twoType[k].amount,
	          					"quantity":twoType[k].quantity,
	          					"typeName":'-'+twoType[k].typeName,
	          					"products":twoType[k].products,
	          				};
		          			ONETOWTYPE.push(n);
		          		}
          			}
          		}
          		this.repecitData = {
          			DETAILARR:DETAILARR,
          			ONETYPE:ONETYPE,
          			ONETOWTYPE:ONETOWTYPE,
          			totalAmount:totalAmount,
          			totalQuantity:totalQuantity
          		}
			})
		},
		// 处理时间
		formatDate(timeFrom,timeTo){
			let retDate ='';
        	let time1 = new Date(timeFrom);
        	let time2 = new Date(timeTo);
        	// let time2 = new Date(timeTo).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
        	let ymd = time1.getFullYear()+"/"+((time1.getMonth()+1)<10?'0'+(time1.getMonth()+1):(time1.getMonth()+1))+"/"+(time1.getDate()<10?'0'+time1.getDate():time1.getDate());
        	let ymd2 =time2.getFullYear()+"/"+((time2.getMonth()+1)<10?'0'+(time2.getMonth()+1):(time2.getMonth()+1))+"/"+(time2.getDate()<10?'0'+time2.getDate():time2.getDate());

        	retDate = ymd+' '+(time1.getHours()<10?'0'+time1.getHours():time1.getHours())+":"+
        		(time1.getMinutes()<10?'0'+time1.getMinutes():time1.getMinutes()) + ' - '+(time2.getHours()<10?'0'+time2.getHours():time2.getHours())+":"+(time2.getMinutes()<10?'0'+time2.getMinutes():time2.getMinutes());
        	if(new Date(ymd2).getTime() > new Date(ymd).getTime()){
        		retDate =  ymd+' '+(time1.getHours()<10?'0'+time1.getHours():time1.getHours())+":"+(time1.getMinutes()<10?'0'+time1.getMinutes():time1.getMinutes())+ '-' + ymd2 +' '+(time2.getHours()<10?'0'+time2.getHours():time2.getHours())+":"+(time2.getMinutes()<10?'0'+time2.getMinutes():time2.getMinutes());
        	}
        	// let retDate = new Date(+new Date(timeFrom)+8*3600*1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')+'-'+
        	// 		new Date(+new Date(timeTo)+8*3600*1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
        	if(timeFrom=='-'&&timeTo=='-'){
        		return '-';
        	}else{
        		return  retDate;
        	}
		},
		// 交班并退出
		exit(){
			this.$http.put('/workshift/'+this.workShift.id,{
			  	"internetAmount": this.internetAmount?this.internetAmount:0,
			  	"gapAmount": 0,
			  	"gapReason": ""
			}).then((res)=>{
				this.showConfirmPrint = false;
				this.$message({
                    message: '交班成功',
                    showClose: true,
                    type: 'success'
                });
          		this.$router.push({path:'/login'});
			})
		},
		//盘点数据打印
		invPrint(){
			// if(!localStorage.getItem('printId')){
   //              alert('小票打印失败！请设置小票打印机ID');
   //              return;
   //          }
			this.$http.get(this.storeId+'/inventory?page=0&size=10000').then((res)=>{
  				let products = res.data.products;
				this.inventoryList = res.data.products;
				// 分类开始
				console.log(products);
				let inventoryObj = {};
				let inventoryArr = [];
				for(let i =0;i<products.length;i++){
					inventoryArr.push(products[i].typeName);
				}

				inventoryArr = Array.from(new Set(inventoryArr));

				for(let i=0;i<inventoryArr.length;i++){
					inventoryObj[i] = [];
					for(let j=0;j<products.length;j++){
						if(products[j].typeName === inventoryArr[i]){
							inventoryObj[i].push(products[j]);
						}
					}
				}

				console.log(inventoryObj);

				// 分类结束

  				setTimeout(()=>{
					 //销售小票
		            var array =[];
		            array = array.concat([28,38]);//打印汉字
		            array = array.concat([27,97,49]);//居中
		            array = array.concat(gbk(this.storeName+'欢迎光临'));
					array = array.concat([10]);//换行
					array = array.concat([27,97,49]);//居中
		            array = array.concat(gbk('盘点数据打印'));
		            array = array.concat([10]);//换行
		            array = array.concat([27,97,48]);//左
		            array = array.concat(gbk('店铺名:'+this.invPerson.storeName));
		            array = array.concat([10]);//换行
		            array = array.concat(gbk('打印时间:'+new Date().Format('yyyy/MM/dd-hh:mm')));
		            array = array.concat([10]);//换行
		            array = array.concat(gbk('操作人:'+this.invPerson.operatorName));
					array = array.concat([27,100,2]);//空格走纸
					
					// 打印分类开始

					for(var index in inventoryObj){
						// console.log(inventoryObj[index])
						array = array.concat([27,33,8]);//加粗
						array = array.concat(gbk('商品类别:'+inventoryObj[index][0].typeName));
						array = array.concat([27,100,2]);//空格走纸		
						array = array.concat([27,33,1]);	
						for(let i=0;i<inventoryObj[index].length;i++){
							if(inventoryObj[index][i].id) {
								array = array.concat(gbk('商品名称:'+inventoryObj[index][i].name));
								array = array.concat([10]);//换行
								array = array.concat(gbk('应有数量:'+inventoryObj[index][i].counterQuantity));
								array = array.concat([27,100,2]);//空格走纸
							}
		            	}
					}

					// 打印分类结束

					// 修改开始

		            // for(var i=0;i<products.length;i++){
		            //     if(products[i].id) {
		            //         array = array.concat(gbk('商品名称:'+products[i].name));
		            //         array = array.concat([10]);//换行
		            //         array = array.concat(gbk('应有数量:'+products[i].counterQuantity));
		            //         array = array.concat([27,100,2]);//空格走纸
		            //     }
					// }
					
					// 修改结束

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
		          
  				},10)
  			});
		},//打印交班销售单据
		surePrint(){
			// if(!localStorage.getItem('printId')){
   //              alert('小票打印失败！请设置小票打印机ID');
   //              return;
   //          }
			// let num = parseInt(this.repecitNumber);
			// this.$posPrint(num, document.getElementById("receipt").innerHTML);
			// this.repecitNumber = 1;
			if ( localStorage.getItem('autoPrint')) {
                let  autoPrints = JSON.parse(localStorage.getItem('autoPrint'));
                autoPrints.exWork = this.repecitNumber;
                localStorage.setItem('autoPrint', JSON.stringify(autoPrints));
            };
            var array =[];
            array = array.concat([28,38]);//打印汉字
            array = array.concat([27,33,8]);//加粗
            array = array.concat([27,97,49]);//居中
            array = array.concat(gbk(this.storeName+'-交班小票'));
            array = array.concat([10]);//换行
            array = array.concat([27,33,1]);//取消加粗
            array = array.concat([27,97,48]);//左
            array = array.concat(gbk('姓名:'+this.workShift.operatorName));
            array = array.concat([10]);//换行
            array = array.concat(gbk('工号:'+this.workShift.employeeCode));
            array = array.concat([10]);//换行
            array = array.concat(gbk('起始时间:'+new Date(this.workShift.beginTime).Format('yyyy/MM/dd-hh:mm')));
            array = array.concat([10]);//换行
            array = array.concat(gbk('结束时间:'+new Date(this.workShift.endTime).Format('yyyy/MM/dd-hh:mm')));
            array = array.concat([10]);//换行
            array = array.concat([27,33,8]);//加粗
            array = array.concat(gbk('现金支付:'+this.workShift.cashAmount));
            array = array.concat([10]);//换行
            array = array.concat(gbk('线下微信:'+this.workShift.wechatCashAmount)); 
            array = array.concat([10]);//换行
            array = array.concat(gbk('线下支付宝:'+this.workShift.alipayCashAmount));
            array = array.concat([27,33,1]);//取消加粗
            array = array.concat([27,100,2]);//空格走纸
            array = array.concat(gbk('会员余额支付:'+this.workShift.memberAmount));
            array = array.concat([10]);//换行
            array = array.concat(gbk('优惠券抵扣:'+this.workShift.couponAmount/100));
            array = array.concat([10]);//换行
            array = array.concat(gbk('支付宝支付:'+this.workShift.alipayAmount)); 
            array = array.concat([10]);//换行
            array = array.concat(gbk('微信支付:'+this.workShift.wechatAmount)); 
            array = array.concat([10]);//换行
            array = array.concat(gbk('上缴金额:'+(this.workShift.cashAmount+this.workShift.alipayCashAmount+this.workShift.wechatCashAmount)));
            array = array.concat([10]);//换行
            array = array.concat(gbk('总销售额:'+this.workShift.turnInAmount)); 
            array = array.concat([10]);//换行
            array = array.concat(gbk('会员充值:'+this.workShift.memberRechargeAmount/100));
            // array = array.concat(gbk('支付方式:现金'));
            array = array.concat([27,100,2]);//空格走纸
            array = array.concat(gbk('网费:'+this.costList.amount/100));
            // array = array.concat([10]);//换行
            // for(var i=0;i<this.costList.list.length;i++){
            //     if(this.costList.list[i].name) {
            //         array = array.concat(gbk(this.costList.list[i].name+':'));
            //         array = array.concat(gbk('￥'+this.costList.list[i].price/100));
            //         array = array.concat([10]);//换行 
            //     }
            // }
            array = array.concat([27,100,2]);//空格走纸
            if(this.totalClassify=='ONETYPE'){
            	for(var i=0;i<this.repecitData.ONETYPE.length;i++){
            		if(this.repecitData.ONETYPE[i].id==2){
            			array = array.concat(gbk('￥'+this.repecitData.ONETYPE[i].typeName+':'));
	                    array = array.concat(gbk((this.repecitData.ONETYPE[i].amount/100)+'元'));
            		}else{
	            		array = array.concat([27,33,8]);//加粗
	                    array = array.concat(gbk(this.repecitData.ONETYPE[i].typeName+':'));
	                    array = array.concat(gbk((this.repecitData.ONETYPE[i].amount/100)+'元'));
	                    array = array.concat([27,33,1]);//取消加粗
            		}
	                array = array.concat([10]);//换行 
	            }
            }
            if(this.totalClassify=='ONETOWTYPE'||this.totalClassify=='DETAILARRTYPE'){
            	for(var i=0;i<this.repecitData.ONETOWTYPE.length;i++){
            		if(this.repecitData.ONETOWTYPE[i].id==2){
            			array = array.concat(gbk('￥'+this.repecitData.ONETOWTYPE[i].typeName+':'));
	                    array = array.concat(gbk((this.repecitData.ONETOWTYPE[i].amount/100)+'元'));
            		}else{
	            		array = array.concat([27,33,8]);//加粗
	                    array = array.concat(gbk(this.repecitData.ONETOWTYPE[i].typeName+':'));
	                    array = array.concat(gbk((this.repecitData.ONETOWTYPE[i].amount/100)+'元'));
	                    array = array.concat([27,33,1]);//取消加粗
            		}
                    array = array.concat([10]);//换行 
	            }
            }
            if(this.totalClassify=='DETAILARR'||this.totalClassify=='DETAILARRTYPE'){
            	console.log(this.repecitData.DETAILARR)
            	for(var i=0;i<this.repecitData.DETAILARR.length;i++){
            		array = array.concat([27,33,8]);//加粗
            		// array = array.concat([27,97,49]);//居中
            		array = array.concat([27,100,2]);//空格走纸
                    array = array.concat(gbk(this.repecitData.DETAILARR[i].typeName+':'));
                    array = array.concat(gbk((this.repecitData.DETAILARR[i].amount/100)+'元'));
                    array = array.concat([10]);//换行
                    // array = array.concat([27,97,48]);//左
                    array = array.concat([27,33,1]);//取消加粗
                    if(this.repecitData.DETAILARR[i].products&&this.repecitData.DETAILARR[i].products.length){
	                    for(var j=0;j<this.repecitData.DETAILARR[i].products.length;j++){
		                    array = array.concat(gbk('名称:'+this.repecitData.DETAILARR[i].products[j].productName));
		                    array = array.concat([10]);//换行 
		                    array = array.concat(gbk('数量:'+this.repecitData.DETAILARR[i].products[j].quantity)); 
		                    array = array.concat(gbk(',金额:'+this.repecitData.DETAILARR[i].products[j].amount/100));
		                    array = array.concat([10]);//换行 
			            }
                    } 
	            }
            }
            array = array.concat([27,100,2]);//空格走纸
            array = array.concat(gbk('销售总数:'+this.repecitData.totalQuantity));
            array = array.concat(gbk(',销售总值:'+this.repecitData.totalAmount/100));
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

            var arrays=[];
            for(var i = 0 ;i<this.repecitNumber;i++){
                  arrays = arrays.concat(array)
            }
            print_((localStorage.getItem('printId')?localStorage.getItem('printId'):''),arrays);
		},
		//打印前一班次交班销售单据
		sureLastPrint(){
			// if(!localStorage.getItem('printId')){
   //              alert('小票打印失败！请设置小票打印机ID');
   //              return;
   //          }
			// this.$posPrint(1, document.getElementById("lastReceipt").innerHTML);
			if ( localStorage.getItem('autoPrint')) {
                let  autoPrints = JSON.parse(localStorage.getItem('autoPrint'));
                autoPrints.exWork = this.repecitNumber;
                localStorage.setItem('autoPrint', JSON.stringify(autoPrints));
            };
			var array =[];
            array = array.concat([28,38]);//打印汉字
            array = array.concat([27,33,8]);//加粗
            array = array.concat([27,97,49]);//居中
            array = array.concat(gbk(this.storeName+'-交班小票（补打）'));
            array = array.concat([10]);//换行
            array = array.concat([27,33,1]);//取消加粗
            array = array.concat([27,97,48]);//左
            array = array.concat(gbk('姓名:'+this.lastWorkShift.operatorName));
            array = array.concat([10]);//换行
            array = array.concat(gbk('工号:'+this.lastWorkShift.operatorCode));
            array = array.concat([10]);//换行
            array = array.concat(gbk('起始时间:'+new Date(this.lastWorkShift.beginTime).Format('yyyy/MM/dd-hh:mm')));
            array = array.concat([10]);//换行
            array = array.concat(gbk('结束时间:'+new Date(this.lastWorkShift.endTime).Format('yyyy/MM/dd-hh:mm')));
            array = array.concat([10]);//换行
            array = array.concat([27,33,8]);//加粗
            array = array.concat(gbk('现金支付:'+this.lastWorkShift.cashAmount/100));
            array = array.concat([10]);//换行
            array = array.concat(gbk('线下微信:'+this.lastWorkShift.wechatCashAmount/100)); 
            array = array.concat([10]);//换行
            array = array.concat(gbk('线下支付宝:'+this.lastWorkShift.alipayCashAmount/100));
            array = array.concat([27,33,1]);//取消加粗
            array = array.concat([27,100,2]);//空格走纸
            array = array.concat(gbk('会员余额支付:'+this.lastWorkShift.memberAmount/100));
            array = array.concat([10]);//换行
            array = array.concat(gbk('优惠券抵扣:'+this.lastWorkShift.couponAmount/100));
            array = array.concat([10]);//换行
            array = array.concat(gbk('支付宝支付:'+this.lastWorkShift.alipayAmount/100)); 
            array = array.concat([10]);//换行
            array = array.concat(gbk('微信支付:'+this.lastWorkShift.wechatAmount/100)); 
            array = array.concat([10]);//换行
            array = array.concat(gbk('总销售额:'+this.lastWorkShift.turnInAmount/100)); 
            array = array.concat([10]);//换行
            array = array.concat(gbk('会员充值:'+this.lastWorkShift.memberDepositAmount/100));
            // array = array.concat(gbk('支付方式:现金'));
            array = array.concat([27,100,2]);//空格走纸
            array = array.concat(gbk('网费:'+this.lastCostList.amount/100));
            // array = array.concat([10]);//换行
            // for(var i=0;i<this.lastCostList.list.length;i++){
            //     if(this.lastCostList.list[i].name) {
            //         array = array.concat(gbk(this.lastCostList.list[i].name+':'));
            //         array = array.concat(gbk('￥'+this.lastCostList.list[i].price/100));
            //         array = array.concat([10]);//换行 
            //     }
            // }
            array = array.concat([27,100,2]);//空格走纸
            if(this.totalClassify=='ONETYPE'){
            	for(var i=0;i<this.lastRepecitData.ONETYPE.length;i++){
            		if(this.lastRepecitData.ONETYPE[i].id==2){
            			array = array.concat(gbk('￥'+this.lastRepecitData.ONETYPE[i].typeName+':'));
	                    array = array.concat(gbk((this.lastRepecitData.ONETYPE[i].amount/100)+'元'));
            		}else{
	            		array = array.concat([27,33,8]);//加粗
	                    array = array.concat(gbk(this.lastRepecitData.ONETYPE[i].typeName+':'));
	                    array = array.concat(gbk((this.lastRepecitData.ONETYPE[i].amount/100)+'元'));
	                    array = array.concat([27,33,1]);//取消加粗
            		}
	                array = array.concat([10]);//换行 
	            }
            }
            if(this.totalClassify=='ONETOWTYPE'||this.totalClassify=='DETAILARRTYPE'){
            	for(var i=0;i<this.lastRepecitData.ONETOWTYPE.length;i++){
            		if(this.lastRepecitData.ONETOWTYPE[i].id==2){
            			array = array.concat(gbk('￥'+this.lastRepecitData.ONETOWTYPE[i].typeName+':'));
	                    array = array.concat(gbk((this.lastRepecitData.ONETOWTYPE[i].amount/100)+'元'));
            		}else{
	            		array = array.concat([27,33,8]);//加粗
	                    array = array.concat(gbk(this.lastRepecitData.ONETOWTYPE[i].typeName+':'));
	                    array = array.concat(gbk((this.lastRepecitData.ONETOWTYPE[i].amount/100)+'元'));
	                    array = array.concat([27,33,1]);//取消加粗
            		}
                    array = array.concat([10]);//换行 
	            }
            }
            if(this.totalClassify=='DETAILARR'||this.totalClassify=='DETAILARRTYPE'){
            	console.log(this.lastRepecitData.DETAILARR)
            	for(var i=0;i<this.lastRepecitData.DETAILARR.length;i++){
            		array = array.concat([27,33,8]);//加粗
            		// array = array.concat([27,97,49]);//居中
            		 array = array.concat([27,100,2]);//空格走纸
                    array = array.concat(gbk(this.lastRepecitData.DETAILARR[i].typeName+':'));
                    array = array.concat(gbk((this.lastRepecitData.DETAILARR[i].amount/100)+'元'));
                    array = array.concat([10]);//换行
                    // array = array.concat([27,97,48]);//左
                    array = array.concat([27,33,1]);//取消加粗
                    if(this.lastRepecitData.DETAILARR[i].products&&this.lastRepecitData.DETAILARR[i].products.length){
	                    for(var j=0;j<this.lastRepecitData.DETAILARR[i].products.length;j++){
		                    array = array.concat(gbk('名称:'+this.lastRepecitData.DETAILARR[i].products[j].productName));
		                    array = array.concat([10]);//换行 
		                    array = array.concat(gbk('数量:'+this.lastRepecitData.DETAILARR[i].products[j].quantity)); 
		                    array = array.concat(gbk(',金额:'+this.lastRepecitData.DETAILARR[i].products[j].amount/100));
		                    array = array.concat([10]);//换行 
			            }
                    } 
	            }
            }
            array = array.concat([27,100,2]);//空格走纸
            array = array.concat(gbk('销售总数:'+this.lastRepecitData.totalQuantity));
            array = array.concat(gbk(',销售总值:'+this.lastRepecitData.totalAmount/100));
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


            var arrays=[];
            for(var i = 0 ;i<this.repecitNumber;i++){
                  arrays = arrays.concat(array)
            }
            print_((localStorage.getItem('printId')?localStorage.getItem('printId'):''),arrays);
		},
	},
	created(){
		this.getWorkDetail();
		for (var i = 0; i < this.pageSize; i++) {
		    this.inventoryList.push({});
		    this.workSelData.push({});
		}
		 // 开班信息
        if (sessionStorage.getItem('workshift')) {
            this.invPerson = JSON.parse(sessionStorage.getItem('workshift'));
            console.log(this.invPerson.operatorName)
        };
		//获取商品分类
		this.$http.get('/product-types-all?storeId='+this.storeId+'&parentId='+'').then((res)=>{
		    this.typeList = this.typeList.concat(res.data);
		});
		 if ( localStorage.getItem('autoPrint')&&JSON.parse(localStorage.getItem('autoPrint')).exWork) {
            this.repecitNumber = JSON.parse(localStorage.getItem('autoPrint')).exWork;
        }
	},
	mounted () {
    	this.storeInfo = JSON.parse(sessionStorage.getItem('store'));
    	this.totalClassify = localStorage.getItem('totalClassify');
    	this.getInventoryList(1);
	}
}
</script>
<style lang="scss" scoped>
	@import "exchangeWork";
</style>
