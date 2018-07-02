<template>
    <div class="check-bill">
        <div class="select-head">
            <span class="start-time">请选择起始时间:</span>
            <el-time-picker v-model="checkStart" :picker-options="{
        selectableRange: '00:00:00 - 23:59:59'
        }" placeholder="选择起始时间点">
            </el-time-picker>
            <span class="end-time">请选择截止时间:</span>
            <el-time-picker v-model="checkEnd" :picker-options="{
        selectableRange: '00:00:00 - 23:59:59'
        }" placeholder="选择截止时间点">
            </el-time-picker>
            <el-button type="primary" class="check-btn">查询</el-button>
        </div>
        <div class="check-res">
            <el-table :data="res" stripe style="width: 100%;text-align:center;" header-cell-class-name="centhe">
                <el-table-column type="index" width="50">
                </el-table-column>
                <el-table-column prop="date" label="支付方式">
                </el-table-column>
                <el-table-column prop="name" label="金额">
                </el-table-column>
                <el-table-column prop="address" label="时间">
                </el-table-column>
                <el-table-column prop="address" label="订单号">
                </el-table-column>
            </el-table>
        </div>

        <div class="check-bottom">
            <span class="total">
                <b>总计:</b> {{totalAmount}}</span>
            <span class="wechat-amount">
                <b>微信:</b> {{wechatAmount}}</span>
            <span class="ali-amount">
                <b>支付宝:</b>{{aliAmount}}</span>
                <el-pagination background layout="prev, pager, next" class="check-page" :total="1000">
        </el-pagination>
        </div>
    </div>
</template>

<script>
export default {
  name: "checkBill",
  data() {
    return {
      totalAmount: 0.0,
      wechatAmount: 0.0,
      aliAmount: 0.0,
      checkStart: new Date(),
      checkEnd: new Date(),
      res: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        }
      ]
    };
  },
  mounted() {
    console.log(new Date());
  }
};
</script>

<style lang="scss">
@import "./checkBill.scss";
</style>
