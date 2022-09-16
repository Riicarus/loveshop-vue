<template>
  <el-table :data="sportsGoodsList" stripe style="width: 100%">
    <el-table-column prop="" label="#" width="40px"></el-table-column>
    <el-table-column prop="name" label="名称" width="180px"></el-table-column>
    <el-table-column prop="numbering" label="位置" width="140px"></el-table-column>
    <el-table-column prop="amount" label="库存" width="140px"></el-table-column>
    <el-table-column prop="price" label="价格" width="140px"></el-table-column>
    <el-table-column fixed="right" width="150px">
      <template #default="scope">
        <el-button size="small" @click="handleEdit(scope.row)">修改</el-button>
        <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
      </template>
    </el-table-column>
    <el-table-column></el-table-column>
  </el-table>

  <el-dialog v-model="editFormVisible" title="编辑货物信息">
    <el-form :model="sportsGoods">
      <el-form-item label="编号" :label-width="140">
        <el-input v-model="sportsGoods.id" autocomplete="on" disabled/>
      </el-form-item>
      <el-form-item label="名称" :label-width="140">
        <el-input v-model="sportsGoods.name" autocomplete="on" />
      </el-form-item>
      <el-form-item label="位置" :label-width="140">
        <el-input v-model="sportsGoods.numbering" autocomplete="on" />
      </el-form-item>
      <el-form-item label="库存" :label-width="140">
        <el-input v-model="sportsGoods.amount" autocomplete="on" disabled/>
      </el-form-item>
      <el-form-item label="单价" :label-width="140">
        <el-input v-model="sportsGoods.price" autocomplete="on" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm(sportsGoods)">确认</el-button>
      </span>
    </template>
  </el-dialog>

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
import axios from 'axios';

export default {
  name: 'AllSportsGoods',
  data() {
    return {
      sportsGoodsList: [],
      editFormVisible: false,
      sportsGoods: {
        id: '',
        name: '',
        numbering: '',
        amount: '',
        price: ''
      },
      rawSportsGoods: {
        id: '',
        name: '',
        numbering: '',
        amount: '',
        price: '',
        extension: null
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
    this.doGetSportsGoodsInfo(this.page.currentPage, this.page.size);
  },
  methods: {
    doGetPaginationInfo: function () {
      axios.get(
          this.$store.state.host + "/commodity/pagination/SPORTS_GOODS",
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
    doGetSportsGoodsInfo: function (currentPage, size) {
      axios.get(
          this.$store.state.host + "/commodity/info/simple/sportsGoods/" + currentPage + "/" + size
      )
          .then(res => {
                this.sportsGoodsList = res.data.data.records;
                console.log(this.sportsGoodsList)
              }
          );
    },
    doUpdateSportsGoods: function (rawSportsGoods) {
      axios.put(
          this.$store.state.host + "/commodity",
          rawSportsGoods,
          {
            headers: {
              auth: this.$store.state.token
            }
          }
      )
          .then(res => {
                console.log(res);
              }
          );
    },
    handleDelete: function (id) {
      axios.delete(
          this.$store.state.host + "/commodity/" + id,
          {
            headers: {
              auth: this.$store.state.token
            }
          }
      )
          .then(res => {
                console.log(res);
                location.reload();
              }
          );
    },
    handleEdit: function (row) {
      this.editFormVisible = true;
      this.sportsGoods = {
        id: row.id,
        name: row.name,
        numbering: row.numbering,
        amount: row.amount,
        price: row.price
      }
    },
    handleConfirm: function (sportsGoods) {
      this.editFormVisible = false;

      this.rawSportsGoods.id = sportsGoods.id;
      this.rawSportsGoods.numbering = sportsGoods.numbering;
      this.rawSportsGoods.name = sportsGoods.name;
      this.rawSportsGoods.amount = sportsGoods.amount;
      this.rawSportsGoods.price = sportsGoods.price;

      this.doUpdateSportsGoods(this.rawSportsGoods);
      location.reload();
    },
    handlePageChange: function (currentPage) {
      this.page.currentPage = currentPage;
      this.doGetSportsGoodsInfo(this.page.currentPage, this.page.size);
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