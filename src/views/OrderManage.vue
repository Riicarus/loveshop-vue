<template>
  <div class="chooseOrderStatus">
    <el-button-group>
      <el-button :class="{'active':activeButtonIndex === 0}" @click="handleGetAllOrder">所有订单</el-button>
      <el-button :class="{'active':activeButtonIndex === 1}" @click="handleGetPayedOrder">已支付</el-button>
      <el-button :class="{'active':activeButtonIndex === 2}" @click="handleGetUnPayedOrder">未支付</el-button>
    </el-button-group>
  </div>
  <el-table :data="orderList" :border="true" style="width: 100%">
    <el-table-column type="expand">
      <template #default="props">
        <div>
          <p style="padding-left: 10px">订单编号: {{ props.row.id }}</p>
          <p style="padding-left: 10px">折扣: {{ props.row.discount }}</p>
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
    <el-table-column label="状态" prop="status" />
    <el-table-column fixed="right" label="操作">
      <template #default="scope">
        <el-button
            :disabled="scope.row.status === 'FINISHED' || scope.row.status === 'CANCELED'"
            size="small"
            type="primary"
            @click="handlePay(scope.row)">支付</el-button>
        <el-button
            :disabled="scope.row.status === 'FINISHED' || scope.row.status === 'CANCELED'"
            size="small"
            type="primary"
            @click="handleCancel(scope.row)">取消</el-button>
      </template>
    </el-table-column>
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
import Qs from "qs";

export default {
  name: "OrderManage",
  data() {
    return {
      orderList: [],
      order: {
        id: '',
        userName: '',
        adminName: '',
        time: '',
        goods: [],
        payment: '',
        status: '',
        discount: ''
      },
      activeButtonIndex: 0,
      page: {
        currentPage: 1,
        size: 8,
        total: 80,
      }
    }
  },
  created() {
    this.doGetPaginationInfo('all');
    this.doGetOrderInfo(this.page.currentPage, this.page.size);
  },
  methods: {
    doGetPaginationInfo: function (status) {
      axios.get(
          this.$store.state.host + "/order/pagination/" + status,
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
    doGetOrderInfo: function (page, size) {
      axios.get(
          this.$store.state.host + "/order/admin/" + page + "/" + size,
          {
            headers: {
              auth: this.$store.state.token
            }
          }
      )
          .then(res => {
                this.orderList = res.data.data.records;
                console.log(this.orderList)
              }
          );
    },
    doGetPayedOrderInfo: function (page, size) {
      axios.get(
          this.$store.state.host + "/order/admin/payed/" + page + "/" + size,
          {
            headers: {
              auth: this.$store.state.token
            }
          }
      )
          .then(res => {
                this.orderList = res.data.data.records;
                console.log(this.orderList)
              }
          );
    },
    doGetUnPayedOrderInfo: function (page, size) {
      axios.get(
          this.$store.state.host + "/order/admin/unpayed/" + page + "/" + size,
          {
            headers: {
              auth: this.$store.state.token
            }
          }
      )
          .then(res => {
                this.orderList = res.data.data.records;
                console.log(this.orderList)
              }
          );
    },
    finishOrder: function (orderId) {
      axios.put(
          this.$store.state.host + "/order/finish/" + orderId,
          {},
          {
            headers: {
              auth: this.$store.state.token
            }
          }
      )
          .then(res => {
                if (res.data.code !== 600) {
                  window.confirm("结束订单失败!")
                  location.reload();
                } else {
                  this.generateBill(orderId);
                }
              }
          );
    },
    generateBill: function (orderId) {
      axios.post(
          this.$store.state.host + "/bill",
          Qs.stringify({
            orderId: orderId,
            adminId: this.$store.state.admin.id
          }),
          {
            headers: {
              auth: this.$store.state.token
            }
          }
      )
          .then(res => {
                if (res.data.code !== 600) {
                  window.confirm("生成账目失败!");
                  location.reload();
                } else {
                  window.confirm("支付并生成账目成功!");
                  location.reload();
                }
              }
          );
    },
    handlePay: function (row) {
      if (window.confirm("确定要支付吗?")) {
        this.finishOrder(row.id);
      }
    },
    handleCancel: function (row) {
      if (window.confirm("确定要取消订单吗?")) {
        axios.put(
            this.$store.state.host + "/order/cancel/" + row.id,
            {},
            {
              headers: {
                auth: this.$store.state.token
              }
            }
        )
            .then(res => {
                  if (res.data.code !== 600) {
                    window.confirm("取消失败!")
                  }
                  location.reload();
                }
            );
      }
    },
    handleGetAllOrder: function () {
      this.page.currentPage = 1;
      this.doGetPaginationInfo('all');
      this.doGetOrderInfo(this.page.currentPage, this.page.size);
      this.activeButtonIndex = 0;
    },
    handleGetPayedOrder: function () {
      this.page.currentPage = 1;
      this.doGetPaginationInfo('payed');
      this.doGetPayedOrderInfo(this.page.currentPage, this.page.size);
      this.activeButtonIndex = 1;
    },
    handleGetUnPayedOrder: function () {
      this.page.currentPage = 1;
      this.doGetPaginationInfo('unpayed');
      this.doGetUnPayedOrderInfo(this.page.currentPage, this.page.size);
      this.activeButtonIndex = 2;
    },
    handlePageChange: function (currentPage) {
      this.page.currentPage = currentPage;

      if (this.activeButtonIndex === 0) {
        this.doGetOrderInfo(this.page.currentPage, this.page.size);
      } else if (this.activeButtonIndex === 1) {
        this.doGetPayedOrderInfo(this.page.currentPage, this.page.size);
      } else if (this.activeButtonIndex === 2) {
        this.doGetUnPayedOrderInfo(this.page.currentPage, this.page.size);
      }
    }
  }
}
</script>

<style scoped>
.chooseOrderStatus {
  margin-bottom: 10px;
  text-align: left;
}

.page {
  margin: 10px auto;
}

.el-pagination {
  justify-content: center;
}

.active {
  color: rgb(84, 160, 255);
}
</style>