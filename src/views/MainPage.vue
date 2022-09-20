<template>
  <el-menu :default-active="$route.path"
           class="el-menu-demo"
           mode="horizontal"
           router
           @select="handleSelect"
  >
    <el-sub-menu index="/commodity">
      <template #title>商品</template>
      <el-menu-item index="/addCommodity">添加商品</el-menu-item>
      <el-menu-item index="/searchBook">搜索图书</el-menu-item>
      <el-menu-item index="/book">图书</el-menu-item>
      <el-menu-item index="/culturalCreativity">文创</el-menu-item>
      <el-menu-item index="/dailyNecessity">日用品</el-menu-item>
      <el-menu-item index="/sportsGoods">体育用品</el-menu-item>
      <el-menu-item index="/boardGame">桌游</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="/order">
      <template #title>订单</template>
      <el-menu-item index="/addOrder">生成订单</el-menu-item>
      <el-menu-item index="/allOrder">已有订单</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="/bill">
      <template #title>账目</template>
      <el-menu-item index="/billManage">所有账目</el-menu-item>
      <el-menu-item index="/billAnalyze">销售分析</el-menu-item>
    </el-sub-menu>
    <el-menu-item index="/activity" :disabled="true">活动</el-menu-item>
    <el-menu-item index="/notice" :disabled="true">通知</el-menu-item>
    <el-sub-menu :disabled="isCommonAdmin" index="/infoManage">
      <template #title>信息管理</template>
      <el-menu-item index="/importAttendance">班表导入</el-menu-item>
      <el-menu-item index="/importAdmin">部员信息导入</el-menu-item>
    </el-sub-menu>
    <el-menu-item index="/logAttendance" :disabled="true">值班打卡</el-menu-item>
    <el-menu-item index="/account" :disabled="true">账号设置</el-menu-item>
  </el-menu>

  <el-main>
    <router-view/>
  </el-main>
</template>

<script>
export default {
  name: 'MainPage',
  data() {
    return {
      isCommonAdmin: this.$store.state.admin.type === 'admin-common'
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath)
    },
  }
}
</script>

<style scoped>

</style>