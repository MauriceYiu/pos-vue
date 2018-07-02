<template>
	<div class="exchange_work">
		<div class="exchange_work_inner">
			<div class="inventoryTableBox">
				<table class="titleTable">
					<thead>
						<tr>
	                        <!-- <th style="width:7%">
	                            <div class="checkboxBox">
	                                <span>全选</span>
	                                <input type="checkbox" id="inventory" v-model="isSelAll" @click="selAllGoods">
	                                <label class="th_label" for="inventory"></label>
	                            </div>
	                        </th> -->
	                        <th style="width:7%">序号</th>
							<th style="width:13%">商品名称</th>
							<th style="width:13%">分类</th>
							<th style="width:13%">应有数量</th>
							<th style="width:13%">库存数量</th>
							<th style="width:10%">误差</th>
							<th style="width:13%">应补金额</th>
						</tr>
					</thead>
				</table>
				<div class="scrollBox">
					<div class="scroll">
						<table class="conTable" :class="{overLengthTable:inventoryList.length>10}">
							<tbody>
								<tr v-for="(item,idx) in inventoryList">
	                                <!-- <td style="width:7%">
	                                    <div class="checkboxBox" :style="{display:(item.name?'block':'none')}">
	                                        <input type="checkbox" :id="'inventory'+idx" v-model="checkboxArr[idx]" @click="selGood(item, idx)">
	                                        <label :for="'inventory'+idx"></label>
	                                    </div>
	                                </td> -->
	                                <td style="width:7%" v-text="item.name?idx+1:''"></td>
									<td style="width:13%;overflow:hidden" v-text="item.name" :title="item.name"></td>
									<td style="width:13%" v-text="item.typeName"></td>
									<td style="width:13%" v-text="item.quantity"></td>
									<td style="width:13%">
										<input type="number" v-if="item.name" v-model="goodCheckArr[idx].checkQuantity" oninput="if(value.length>5)value=value.slice(0,5)">
									</td>
									<td style="width:10%"><span v-if="item.name" v-text="((goodCheckArr[idx].checkQuantity-item.quantity)>0?('+'+(goodCheckArr[idx].checkQuantity-item.quantity)):(goodCheckArr[idx].checkQuantity-item.quantity))"></span></td>
									<td style="width:13%"><span v-if="item.name" v-text="((goodCheckArr[idx].checkQuantity-item.quantity)<0?('￥'+((item.quantity-goodCheckArr[idx].checkQuantity)*item.salePrice)):'￥0')"></span></td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
			<div class="btnGroup">
				<div class="exchangeWorkData" @click="showWorkDetailData=true">本班销售统计</div>
				<div class="workDataSel" @click="showWorkSelData=true">销售汇总查询</div>
				<button type="button" class="finish position-middle-center" @click="goExchange">完成盘点，前往交班</button>
				<div class="inventory_prints">
					<span>商品盘点单据</span>
					<input type="text" v-model="inventoryPrintsNumber" placeholder="请输入打印份数">
					<span @click="inventoryPrintsFn" class="inventory_prints_btn">打印</span>
				</div>
			</div>
		</div>
		<div class="exchange_work_mask mask" @click="showExchange=false" v-if="showExchange">
			<div class="exchange_work_modal modal" @click.stop="">
				<div class="ex_top">交班<span style="color:#999;font-size:14px;margin-left:20px;">上交现金 = 万象交班网费 + 火星捕手总销售额 - 火星捕手网费 - 线上支付（仅供参考）</span></div>
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
			    	<div class="costBox clearfix">
			    		<div class="item left clearfix" v-for="item in costList.list">
		    	            <span class="name left" v-text="item.name"></span>
		    	            <span class="price right" v-text="'￥'+item.price/100"></span>
			    		</div>
			    	</div>
					<div class="typeBoxTitle">分类列表<span style="color:red;font-weight:500;margin-left:6px;">(包含优惠券抵扣金额)</span></div>
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
		<div style="display:none">
			<div id="inventory-prints">
			    <div style="width: 190px; fontSize: 12px;">
			    	<h1 style="text-align:center;font-size:18px;">欢迎使用火星捕手</h1>
					<p style="text-align:center;font-size:16px;" v-text="'商品盘点单据'"></p>
			    	<div>
			    		<span>打印时间:</span>
			    		<span>{{new Date() | numberToAllDate('')}}</span>
			    	</div>
    		    	<div v-for="(item,idx) in oldInvList" style="margin-top:10px;border:1px solid #444">
    					<div style="font-weight:600;margin-bottom:5px;">
    				    	<span v-text="item.typeName"></span>
    	    			</div>
    		    		<table style="width:100%;border-collapse: collapse;table-layout:fixed;font-size:12px;">
    		    			<tr>
    		    				<td style="width:50%;">名称</td>
    		    				<td style="width:23%;">应有</td>
    		    				<td style="width:27%;">实际</td>
    		    			</tr>
    	    				<tr v-for="(item,idx) in item.products">
    	    					<td style="width:50%;overflow:hidden;white-space:nowrap;text-align:left" v-text="item.name"></td>
    	    					<td style="width:25%;" v-text="item.quantity"></td>
    	    					<td style="width:25%;"></td>
    	    				</tr>
    		    		</table>
    		    	</div>
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
	props:['storeId'],
	data(){
		return {
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
			checkboxArr: [], // 保存所有复选框选择状态
			inventoryList: [], // 库存列表
			goodCheckArr: [], // 商品批量盘点数组
			oldInvList: [], // 库存原始数据

			printReceipt: false, // 是否打印小票

			repecitData: {}, // 报表信息
			totalClassify:'',//是否打印总分类

			goExchangeBtn:true,
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
			}
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
		                customClass: 'error'
		            })
		            return;
		        }
		        this.getSelWorkData();
		        this.getSales();
		    } else {
		        this.$message({
		            message: '请选择查询时间段',
		            customClass: 'error'
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
		getSales(){
		    let url = this.conditionFn();
		    this.$http.get(this.storeId+'/sales-total'+url).then((res)=>{
		        this.salesData = res.data;
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
  		getInventoryList: function () {
  			this.$http.get('workshift/inventories?storeId=' + this.storeId).then((res)=>{
  				this.oldInvList = res.data;
  				this.goodCheckArr = [];
  				this.inventoryList = [];
  				for (let i = 0, len = res.data.length; i < len; i++) {
  					for (var j = 0, len2 = res.data[i].products.length; j < len2; j++) {
  						this.goodCheckArr.push({
		            		id: this.$uuid(),
		  					productId: res.data[i].products[j].id,
		  					name: res.data[i].products[j].name,
		  					accurateQuantity: res.data[i].products[j].quantity,
		  					checkQuantity: res.data[i].products[j].quantity,
		            		errorQuantity: ''
		  				});
		  				this.inventoryList.push(res.data[i].products[j]);
  					}
  				}
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
  			if(!this.goExchangeBtn){
  				return
  			}
  			this.goExchangeBtn =false;
  			this.totalClassify = localStorage.getItem('totalClassify');
  			for (var i = 0, len = this.goodCheckArr.length; i < len; i++) {
                if(!/^(0|[1-9][0-9]*)$/.test(Math.abs(this.goodCheckArr[i].accurateQuantity))||!/^(0|[1-9][0-9]*)$/.test(Math.abs(this.goodCheckArr[i].checkQuantity))){
                    this.$message({
                        message: this.goodCheckArr[i].name+' 输入有误',
                        customClass: 'error'
                    })
                    return true;
                }
            }
            for (var i = 0, len = this.goodCheckArr.length; i < len; i++) {
                this.goodCheckArr[i].accurateQuantity = parseInt(this.goodCheckArr[i].accurateQuantity);
                this.goodCheckArr[i].checkQuantity = parseInt(this.goodCheckArr[i].checkQuantity);
                this.goodCheckArr[i].errorQuantity = this.goodCheckArr[i].checkQuantity - this.goodCheckArr[i].accurateQuantity;
            }

	        this.$http.put(this.storeId+'/inventory-checks', this.goodCheckArr).then((res)=>{
	        	setTimeout(()=>{
	        		this.goExchangeBtn = true;
	        	},500)
	          	this.getInventoryList();
                this.$message({
                    message: "盘点成功！",
                    customClass: 'success'
                })
                this.getWorkShift();
	        }).catch((res)=>{
	        	setTimeout(()=>{
	        		this.goExchangeBtn = true;
	        	},500)
	        });
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
                    customClass: 'success'
                });
          		this.$router.push({path:'/login'});
			})
		},
		//打印交班销售单据
		surePrint(){
			let num = parseInt(this.repecitNumber);
			this.$posPrint(num, document.getElementById("receipt").innerHTML);
			this.repecitNumber = 1;
		},
		//打印前一班次交班销售单据
		sureLastPrint(){
			this.$posPrint(1, document.getElementById("lastReceipt").innerHTML);
		},
		//打印盘点单据
		inventoryPrintsFn(){
            window.LODOP = getLodop(document.getElementById('LODOP_OB'), document.getElementById('LODOP_EM'));
			let num = parseInt(this.inventoryPrintsNumber);
			prn1_print(num);

			// 直接打印
			function prn1_print(num) {
			    CreateOneFormPage();
			    window.LODOP.SET_PRINT_COPIES(num);
			    window.LODOP.PRINT();
			};
			function CreateOneFormPage() {
			    window.LODOP = getLodop();
			    window.LODOP.PRINT_INIT("交班盘点打印");
			    window.LODOP.SET_PRINT_PAGESIZE(3, '58mm', 100, 4);
			    window.LODOP.ADD_PRINT_HTM(0, "1mm","RightMargin:1mm","BottomMargin:5mm", document.getElementById("inventory-prints").innerHTML);
			};
		}
	},
	created(){
		this.getWorkDetail();
		for (var i = 0; i < this.pageSize; i++) {
		    this.inventoryList.push({});
		    this.workSelData.push({});
		}

		//获取商品分类
		this.$http.get('/product-types-all?storeId='+this.storeId+'&parentId='+'').then((res)=>{
		    this.typeList = this.typeList.concat(res.data);
		})
	},
	mounted () {
    	this.storeInfo = JSON.parse(sessionStorage.getItem('store'));
    	this.totalClassify = localStorage.getItem('totalClassify');
    	this.getInventoryList();
	}
}
</script>
<style lang="scss" scoped>
	@import "shiftWork";
</style>
