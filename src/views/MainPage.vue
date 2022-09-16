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
    <el-menu-item index="/bill">账目</el-menu-item>
    <el-menu-item index="/activity">活动</el-menu-item>
    <el-menu-item index="/notice">通知</el-menu-item>
    <el-sub-menu index="/attendance">
      <template #title>值班</template>
      <el-menu-item index="/manageAttendance">管理</el-menu-item>
      <el-menu-item index="/logAttendance">打卡</el-menu-item>
    </el-sub-menu>
    <el-menu-item index="/account">账号设置</el-menu-item>
  </el-menu>

  <el-main>
    <router-view/>
  </el-main>
</template>

<script>
export default {
  name: 'MainPage',
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath)
    },
  }
}
</script>

<style scoped>

</style>