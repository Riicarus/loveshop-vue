<template>
  <el-table :data="bookList" stripe style="width: 100%">
    <el-table-column prop="" label="#" width="40px"></el-table-column>
    <el-table-column prop="name" label="名称" width="140px"></el-table-column>
    <el-table-column prop="numbering" label="位置" width="140px"></el-table-column>
    <el-table-column prop="amount" label="库存" width="140px"></el-table-column>
    <el-table-column prop="price" label="价格" width="140px"></el-table-column>
    <el-table-column prop="extension.ISBN" label="ISBN" width="180px"></el-table-column>
    <el-table-column label="作者" width="140px">
      <template #default="scope">
        <div v-for="i in JSON.parse(scope.row.extension.authors)" :key="i.index">
          <div style="text-decoration-line: underline">{{i}}</div>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="extension.publisher" label="出版商" width="140px"></el-table-column>
    <el-table-column fixed="right" width="150px">
      <template #default="scope">
        <el-button size="small" @click="handleEdit(scope.row)">修改</el-button>
        <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
      </template>
    </el-table-column>
    <el-table-column></el-table-column>
  </el-table>

  <el-dialog v-model="editFormVisible" title="编辑货物信息">
    <el-form :model="book">
      <el-form-item label="编号" :label-width="140">
        <el-input v-model="book.id" autocomplete="on" disabled/>
      </el-form-item>
      <el-form-item label="名称" :label-width="140">
        <el-input v-model="book.name" autocomplete="on" />
      </el-form-item>
      <el-form-item label="位置" :label-width="140">
        <el-input v-model="book.numbering" autocomplete="on" />
      </el-form-item>
      <el-form-item label="库存" :label-width="140">
        <el-input v-model="book.amount" autocomplete="on" disabled/>
      </el-form-item>
      <el-form-item label="单价" :label-width="140">
        <el-input v-model="book.price" autocomplete="on" />
      </el-form-item>
      <el-form-item label="ISBN" :label-width="140">
        <el-input v-model="book.ISBN" autocomplete="on" />
      </el-form-item>
      <el-form-item label="authors" :label-width="140">
        <el-input v-model="book.authors" autocomplete="on" />
      </el-form-item>
      <el-form-item label="publisher" :label-width="140">
        <el-input v-model="book.publisher" autocomplete="on" />
      </el-form-item>

    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm(book)">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AllBook',
  data() {
    return {
      bookList: [],
      editFormVisible: false,
      book: {
        id: '',
        name: '',
        numbering: '',
        amount: '',
        price: '',
        ISBN: '',
        authors: [],
        publisher: ''
      },
      rawBook: {
        id: '',
        name: '',
        numbering: '',
        amount: '',
        price: '',
        extension: {
          ISBN: '',
          authors: [],
          publisher: ''
        }
      }
    }
  },
  created() {
    this.doGetBookInfo();
  },
  methods: {
    doGetBookInfo: function () {
      axios.get(
          this.$store.state.host + "/commodity/info/simple/book/1/5"
      )
          .then(res => {
                this.bookList = res.data.data.records;
                console.log(this.bookList)
              }
          );
    },
    doUpdateBook: function (rawBook) {
      axios.put(
          this.$store.state.host + "/commodity",
          rawBook,
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
      this.book = {
        id: row.id,
        name: row.name,
        numbering: row.numbering,
        amount: row.amount,
        price: row.price,
        ISBN: row.extension.ISBN,
        authors: row.extension.authors,
        publisher: row.extension.publisher
      }
    },
    handleConfirm: function (book) {
      this.editFormVisible = false;

      this.rawBook.id = book.id;
      this.rawBook.numbering = book.numbering;
      this.rawBook.name = book.name;
      this.rawBook.amount = book.amount;
      this.rawBook.price = book.price;
      this.rawBook.extension.authors = book.authors;
      this.rawBook.extension.publisher = book.publisher;
      this.rawBook.extension.ISBN = book.ISBN;

      this.doUpdateBook(this.rawBook);
      location.reload();
    }
  }
}
</script>

<style scoped>

</style>