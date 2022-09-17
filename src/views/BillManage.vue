<template>
  <el-table :data="billList" :border="true" style="width: 100%">
    <el-table-column type="expand">
      <template #default="props">
        <div>
          <p style="padding-left: 10px">账目编号: {{ props.row.id }}</p>
          <p style="padding-left: 10px">订单编号: {{ props.row.orderId }}</p>
        </div>
        <h3 style="padding-left: 10px">购买商品</h3>
        <el-table size="small" :data="props.row.goods" :border="false">
          <el-table-column label="名称" prop="commodityName" />
          <el-table-column label="类型" prop="commodityType" />
          <el-table-column label="数量" prop="amount" />
          <el-table-column label="价格" prop="price" />
          <el-table-column label="位置" prop="numbering" />
        </el-table>
      </template>
    </el-table-column>
    <el-table-column label="时间" prop="time" />
    <el-table-column label="收银" prop="adminName" />
    <el-table-column label="购买者" prop="userName" />
    <el-table-column label="总价" prop="payment" />
  </el-table>

  <div class="page">
    <el-pagination
        @current-change="handlePageChange"
        :current-page="page.currentPage"
        :hide-on-single-page="true"
        :page-size="page.size"
        :pager-count="7"
        layout="prev, pager, next"
        :total="page.total"
    />
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "BillManage",
  data() {
    return {
      billList: [],
      bill: {
        id: '',
        orderId: '',
        userName: '',
        adminName: '',
        time: '',
        goods: [],
        payment: ''
      },
      page: {
        currentPage: 1,
        size: 8,
        total: 80,
      }
    }
  },
  created() {
    this.doGetPaginationInfo();
    this.doGetBillInfo(this.page.currentPage, this.page.size);
  },
  methods: {
    doGetPaginationInfo: function () {
      axios.get(
          this.$store.state.host + "/bill/admin/detail/pagination",
          {
            headers: {
              auth: this.$store.state.token
            }
          }
      )
          .then(res => {
                this.page.total = res.data.data.total;
              }
          );
    },
    doGetBillInfo: function (page, size) {
      axios.get(
          this.$store.state.host + "/bill/admin/detail/" + page + "/" + size,
          {
            headers: {
              auth: this.$store.state.token
            }
          }
      )
          .then(res => {
                this.billList = res.data.data.records;
                console.log(this.billList)
              }
          );
    },
    handlePageChange: function (currentPage) {
      this.page.currentPage = currentPage;

      this.doGetBillInfo(this.page.currentPage, this.page.size);
    }
  }
}
</script>

<style scoped>
.page {
  margin: 10px auto;
}

.el-pagination {
  justify-content: center;
}
</style>