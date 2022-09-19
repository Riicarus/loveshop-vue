<template>
  <el-table :data="culturalCreativityList" stripe style="width: 100%">
    <el-table-column prop="" label="#" width="40px"></el-table-column>
    <el-table-column prop="name" label="名称" width="180px"></el-table-column>
    <el-table-column prop="numbering" label="位置" width="140px"></el-table-column>
    <el-table-column prop="amount" label="库存" width="140px"></el-table-column>
    <el-table-column prop="price" label="价格" width="140px"></el-table-column>
    <el-table-column fixed="right" width="200px">
      <template #default="scope">
        <el-button size="small" @click="handleEdit(scope.row)">修改</el-button>
        <el-button size="small" type="primary" @click="handleAddAmount(scope.row.id)">增量</el-button>
        <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
      </template>
    </el-table-column>
    <el-table-column></el-table-column>
  </el-table>

  <el-dialog v-model="addAmountFormVisible" title="增加商品">
    <el-input style="width: 50%" v-model="addAmountInfo.amount" autocomplete="on"/>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addAmountFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAddConfirm">确认</el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog v-model="editFormVisible" title="编辑商品信息">
    <el-form :model="culturalCreativity">
      <el-form-item label="编号" :label-width="140">
        <el-input v-model="culturalCreativity.id" autocomplete="on" disabled/>
      </el-form-item>
      <el-form-item label="名称" :label-width="140">
        <el-input v-model="culturalCreativity.name" autocomplete="on" />
      </el-form-item>
      <el-form-item label="位置" :label-width="140">
        <el-input v-model="culturalCreativity.numbering" autocomplete="on" />
      </el-form-item>
      <el-form-item label="库存" :label-width="140">
        <el-input v-model="culturalCreativity.amount" autocomplete="on" disabled/>
      </el-form-item>
      <el-form-item label="单价" :label-width="140">
        <el-input v-model="culturalCreativity.price" autocomplete="on" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm(culturalCreativity)">确认</el-button>
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
  name: 'AllCulturalCreativity',
  data() {
    return {
      culturalCreativityList: [],
      editFormVisible: false,
      addAmountFormVisible: false,
      culturalCreativity: {
        id: '',
        name: '',
        numbering: '',
        amount: '',
        price: ''
      },
      rawCulturalCreativity: {
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
      },
      addAmountInfo: {
        id: 0,
        amount: 0
      }
    }
  },
  created() {
    this.doGetPaginationInfo();
    this.doGetCulturalCreativityInfo(this.page.currentPage, this.page.size);
  },
  methods: {
    doGetPaginationInfo: function () {
      axios.get(
          this.$store.state.host + "/commodity/pagination/CULTURAL_CREATIVITY",
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
    doGetCulturalCreativityInfo: function (currentPage, size) {
      axios.get(
          this.$store.state.host + "/commodity/info/simple/culturalCreativity/" + currentPage + "/" + size
      )
          .then(res => {
                this.culturalCreativityList = res.data.data.records;
                console.log(this.culturalCreativityList)
              }
          );
    },
    doUpdateCulturalCreativity: function (rawCulturalCreativity) {
      axios.put(
          this.$store.state.host + "/commodity",
          rawCulturalCreativity,
          {
            headers: {
              auth: this.$store.state.token
            }
          }
      )
          .then(res => {
            if (res.data.code !== 600) {
              window.alert("更改失败, 请检查数据是否符合要求!");
            } else {
              location.reload();
              window.alert("更改成功!");
            }
          });
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
            if (res.data.code !== 600) {
              window.alert("删除失败!");
            } else {
              location.reload();
              window.alert("删除成功!");
            }
          });
    },
    handleEdit: function (row) {
      this.editFormVisible = true;
      this.culturalCreativity = {
        id: row.id,
        name: row.name,
        numbering: row.numbering,
        amount: row.amount,
        price: row.price
      }
    },
    handleConfirm: function (culturalCreativity) {
      this.editFormVisible = false;

      this.rawCulturalCreativity.id = culturalCreativity.id;
      this.rawCulturalCreativity.numbering = culturalCreativity.numbering;
      this.rawCulturalCreativity.name = culturalCreativity.name;
      this.rawCulturalCreativity.amount = culturalCreativity.amount;
      this.rawCulturalCreativity.price = culturalCreativity.price;

      this.doUpdateCulturalCreativity(this.rawCulturalCreativity);
      location.reload();
    },
    handleAddAmount: function (id) {
      this.addAmountInfo.id = id;
      this.addAmountFormVisible = true;
    },
    handleAddConfirm: function () {
      console.log(this.addAmountInfo);

      if (this.addAmountInfo.amount <= 0) {
        window.alert("增加的数量应该是一个正整数!");
        this.amount = 0;
        return;
      }

      axios.put(
          this.$store.state.host + "/commodity/amount/" + this.addAmountInfo.id + "/" + this.addAmountInfo.amount,
          {},
          {
            headers: {
              auth: this.$store.state.token
            }
          }
      )
          .then(res => {
                if (res.data.code !== 600) {
                  window.confirm("增加库存失败!");
                } else {
                  window.confirm("增加库存成功!");
                }
                location.reload();
              }
          );

      this.addAmountFormVisible = false;
      this.addAmountInfo.amount = 0;
    },
    handlePageChange: function (currentPage) {
      this.page.currentPage = currentPage;
      this.doGetCulturalCreativityInfo(this.page.currentPage, this.page.size);
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