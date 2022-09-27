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
      <el-form-item label="作者" :label-width="140">
        <el-input v-model="book.authors" autocomplete="on" />
      </el-form-item>
      <el-form-item label="出版商" :label-width="140">
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
  name: 'AllBook',
  data() {
    return {
      bookList: [],
      editFormVisible: false,
      addAmountFormVisible: false,
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
    this.doGetBookInfo(this.page.currentPage, this.page.size);
  },
  methods: {
    doGetPaginationInfo: function () {
      axios.get(
          this.$store.state.host + "/commodity/pagination/BOOK",
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
    doGetBookInfo: function (currentPage, size) {
      axios.get(
          this.$store.state.host + "/commodity/info/simple/book/" + currentPage + "/" + size
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
                if (res.data.code !== 600) {
                  window.alert("更改失败, 请检查数据是否符合要求!");
                } else {
                  location.reload();
                  window.alert("更改成功!");
                }
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
      this.book = {
        id: row.id,
        name: row.name,
        numbering: row.numbering,
        amount: row.amount,
        price: row.price,
        ISBN: row.extension.ISBN,
        authors: JSON.parse(row.extension.authors),
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

      let authors = book.authors.toString().split(",");
      this.rawBook.extension.authors = [];
      for (let author of authors) {
        this.rawBook.extension.authors.push(author.trim());
      }

      this.rawBook.extension.publisher = book.publisher;
      this.rawBook.extension.ISBN = book.ISBN;

      this.doUpdateBook(this.rawBook);
    },
    handleAddAmount: function (id) {
      this.addAmountInfo.id = id;
      this.addAmountFormVisible = true;
    },
    handleAddConfirm: function () {
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
      this.doGetBookInfo(this.page.currentPage, this.page.size);
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