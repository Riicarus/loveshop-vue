<template>
  <el-table :data="boardGameList" stripe style="width: 100%">
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
    <el-form :model="boardGame">
      <el-form-item label="编号" :label-width="140">
        <el-input v-model="boardGame.id" autocomplete="on" disabled/>
      </el-form-item>
      <el-form-item label="名称" :label-width="140">
        <el-input v-model="boardGame.name" autocomplete="on" />
      </el-form-item>
      <el-form-item label="位置" :label-width="140">
        <el-input v-model="boardGame.numbering" autocomplete="on" />
      </el-form-item>
      <el-form-item label="库存" :label-width="140">
        <el-input v-model="boardGame.amount" autocomplete="on" disabled/>
      </el-form-item>
      <el-form-item label="单价" :label-width="140">
        <el-input v-model="boardGame.price" autocomplete="on" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm(boardGame)">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AllBoardGame',
  data() {
    return {
      boardGameList: [],
      editFormVisible: false,
      boardGame: {
        id: '',
        name: '',
        numbering: '',
        amount: '',
        price: ''
      },
      rawBoardGame: {
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
    this.doGetBoardGameInfo();
  },
  methods: {
    doGetBoardGameInfo: function () {
      axios.get(
          this.$store.state.host + "/commodity/info/simple/boardGame/1/5"
      )
          .then(res => {
                this.boardGameList = res.data.data.records;
                console.log(this.boardGameList)
              }
          );
    },
    doUpdateBoardGame: function (rawBoardGame) {
      axios.put(
          this.$store.state.host + "/commodity",
          rawBoardGame,
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
      this.boardGame = {
        id: row.id,
        name: row.name,
        numbering: row.numbering,
        amount: row.amount,
        price: row.price
      }
    },
    handleConfirm: function (boardGame) {
      this.editFormVisible = false;

      this.rawBoardGame.id = boardGame.id;
      this.rawBoardGame.numbering = boardGame.numbering;
      this.rawBoardGame.name = boardGame.name;
      this.rawBoardGame.amount = boardGame.amount;
      this.rawBoardGame.price = boardGame.price;

      this.doUpdateBoardGame(this.rawBoardGame);
      location.reload();
    }
  }
}
</script>

<style scoped>

</style>