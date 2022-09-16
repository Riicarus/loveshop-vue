<template>
  <el-table :data="dailyNecessityList" stripe style="width: 100%">
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
    <el-form :model="dailyNecessity">
      <el-form-item label="编号" :label-width="140">
        <el-input v-model="dailyNecessity.id" autocomplete="on" disabled/>
      </el-form-item>
      <el-form-item label="名称" :label-width="140">
        <el-input v-model="dailyNecessity.name" autocomplete="on" />
      </el-form-item>
      <el-form-item label="位置" :label-width="140">
        <el-input v-model="dailyNecessity.numbering" autocomplete="on" />
      </el-form-item>
      <el-form-item label="库存" :label-width="140">
        <el-input v-model="dailyNecessity.amount" autocomplete="on" disabled/>
      </el-form-item>
      <el-form-item label="单价" :label-width="140">
        <el-input v-model="dailyNecessity.price" autocomplete="on" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm(dailyNecessity)">确认</el-button>
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
  name: 'AllDailyNecessity',
  data() {
    return {
      dailyNecessityList: [],
      editFormVisible: false,
      dailyNecessity: {
        id: '',
        name: '',
        numbering: '',
        amount: '',
        price: ''
      },
      rawDailyNecessity: {
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
    this.doGetDailyNecessityInfo(this.page.currentPage, this.page.size);
  },
  methods: {
    doGetPaginationInfo: function () {
      axios.get(
          this.$store.state.host + "/commodity/pagination/DAILY_NECESSITY",
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
    doGetDailyNecessityInfo: function (currentPage, size) {
      axios.get(
          this.$store.state.host + "/commodity/info/simple/dailyNecessity/" + currentPage + "/" + size
      )
          .then(res => {
                this.dailyNecessityList = res.data.data.records;
                console.log(this.dailyNecessityList)
              }
          );
    },
    doUpdateDailyNecessity: function (rawDailyNecessity) {
      axios.put(
          this.$store.state.host + "/commodity",
          rawDailyNecessity,
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
      this.dailyNecessity = {
        id: row.id,
        name: row.name,
        numbering: row.numbering,
        amount: row.amount,
        price: row.price
      }
    },
    handleConfirm: function (dailyNecessity) {
      this.editFormVisible = false;

      this.rawDailyNecessity.id = dailyNecessity.id;
      this.rawDailyNecessity.numbering = dailyNecessity.numbering;
      this.rawDailyNecessity.name = dailyNecessity.name;
      this.rawDailyNecessity.amount = dailyNecessity.amount;
      this.rawDailyNecessity.price = dailyNecessity.price;

      this.doUpdateDailyNecessity(this.rawDailyNecessity);
      location.reload();
    },
    handlePageChange: function (currentPage) {
      this.page.currentPage = currentPage;
      this.doGetDailyNecessityInfo(this.page.currentPage, this.page.size);
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