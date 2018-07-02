<template>
	<div id="app">  
		<router-view></router-view>
		<div class="topAndRefresh">
			<!-- <div class="refresh" @click="noticeFn()" style="color:red;">
				<i class="iconfont icon-kefu"></i>
				<p>呼叫</p>
			</div> -->
			<div class="refresh" @click="refresh()">
				<i class="iconfont icon-jiaoban"></i>
				<p>刷新页面</p>
			</div>
			<div class="goTop" @click="goTop()">
				<i class="iconfont icon-fanhuidingbu"></i>
				<p>返回顶部</p>
			</div>
		</div>
	</div>
</template>

<script>
export default {
  name: "app",
  methods: {
    // 回到顶部
    goTop: function() {
      $(".scroll").animate({ scrollTop: 0 }, 500);
    },
    // 刷新页面
    refresh: function() {
      window.location.reload(true);
    }
  }
};
</script>
<style lang="scss">
#app {
  min-width: 960px;
  // min-height: 800px;
  height: 100%;
  font-family: "微软雅黑";
  .topAndRefresh {
    position: fixed;
    right: 5px;
    bottom: 5px;
    // width: 20px;
    // height: 20px;
    .goTop,
    .refresh {
      height: 55px;
      width: 70px;
      color: #444;
      cursor: pointer;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      padding-top: 15px;
      border-radius: 8px;
      font-size: 14px;
      background-color: rgba(255, 255, 255, 0.4);
      box-shadow: 0 2px 4px 0 #d5d5d5;
      text-align: center;
      i {
        font-size: 30px;
      }
      p {
        line-height: 26px;
      }
    }
    .refresh {
      margin-bottom: 10px;
    }
  }
}
</style>
