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
      }
    }
  },
  created() {
    this.doGetSportsGoodsInfo();
  },
  methods: {
    doGetSportsGoodsInfo: function () {
      axios.get(
          this.$store.state.host + "/commodity/info/simple/sportsGoods/1/5"
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
    }
  }
}
</script>

<style scoped>

</style>