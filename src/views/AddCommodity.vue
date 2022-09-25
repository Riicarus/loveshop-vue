<template>
  <div>
    <el-form
        class="center"
        label-position="left"
        label-width="100px"
        :model="commodityAddParam"
        style="max-width: 460px"
    >
      <el-form-item label="类型">
        <el-select v-model="value" placeholder="选择商品类型">
          <el-option
              v-for="item in types"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="commodityAddParam.name" />
      </el-form-item>
      <el-form-item label="位置">
        <el-input v-model="commodityAddParam.numbering" />
      </el-form-item>
      <el-form-item label="单价">
        <el-input v-model="commodityAddParam.price" />
      </el-form-item>
      <el-form-item label="库存">
        <el-input v-model="commodityAddParam.amount" />
      </el-form-item>
      <el-form-item v-if="value==='BOOK'" label="ISBN">
        <div style="width: 100%;">
          <el-input
              v-model="extension.ISBN">
            <template #append>
              <el-button
                  @click="handleSearchISBN">
                <el-icon><Search/></el-icon>
              </el-button>
            </template>
          </el-input>
        </div>
      </el-form-item>
      <el-form-item v-if="value==='BOOK'" label="作者">
        <el-input v-model="extension.authors" />
      </el-form-item>
      <el-form-item v-if="value==='BOOK'" label="出版社">
        <el-input v-model="extension.publisher" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="center" @click="handleAdd">添加</el-button>
        <el-button class="center" @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { Search } from '@element-plus/icons-vue'
import axios from 'axios';
import { ref } from 'vue';

export default {
  name: "AddCommodity",
  setup() {
    const value = ref('');
    return {value};
  },
  data() {
    return {
      commodityAddParam: {
        type: '',
        name: '',
        numbering: '',
        price: '',
        amount: '',
        extension: null
      },
      extension: {
        ISBN: '',
        authors: '',
        publisher: ''
      },
      dialogVisible: false,
      types: [
        {
          label: '图书',
          value: 'BOOK'
        },
        {
          label: '文创',
          value: 'CULTURAL_CREATIVITY'
        },
        {
          label: '日用品',
          value: 'DAILY_NECESSITY'
        },
        {
          label: '体育用品',
          value: 'SPORTS_GOODS'
        },
        {
          label: '桌游',
          value: 'BOARD_GAME'
        }
      ]
    }
  },
  components: {
    Search
  },
  methods: {
    doAddCommodity: function () {
      this.commodityAddParam.type = this.value;
      if (this.value === 'BOOK') {
        this.commodityAddParam.extension = this.extension;
      }
      axios.post(
          this.$store.state.host + "/commodity",
          this.commodityAddParam,
          {
            headers: {
              auth: this.$store.state.token
            }
          }
      )
          .then(res => {
                if (res.data.code === 604) {
                  window.alert("添加失败, 已有该商品!")
                } else if (res.data.code !== 600) {
                  window.alert("添加失败, 请查看数据是否符合要求!")
                } else {
                  window.alert("添加成功!")
                  this.resetForm();
                }
              }
          );
    },
    resetForm: function () {
      this.commodityAddParam = {
        type: '',
        name: '',
        numbering: '',
        price: '',
        amount: '',
        extension: null
      };
      this.extension = {
        ISBN: '',
        authors: [],
        publisher: ''
      }
    },
    handleAdd: function () {
      this.doAddCommodity();
    },
    handleSearchISBN: function () {
      axios.get("https://api.jike.xyz/situ/book/isbn/" + this.extension.ISBN + "?apikey=13553.a1dc12ba4903dc9d12c72d9a2b6c4be2.c521e2db6ac2ee389f26b62a714d16b4")
      .then(res => {
        if (res.status !== 200) {
          window.alert("请求失败, 请检查ISBN是否输入正确,或选择手动录入该图书!")
        } else {
          let authorList = res.data.data.author.split("/");
          this.extension.authors = [];
          for (let string of authorList) {
            this.extension.authors.push(string.trim());
          }
          this.extension.publisher = res.data.data.publishing;
          this.commodityAddParam.name = (res.data.data.name + " " + res.data.data.subname).trim();
          this.commodityAddParam.price = res.data.data.price.substring(0, res.data.data.price.length - 1) / 1;
        }
      })
    }
  }
}
</script>

<style scoped>
.center {
  margin: 10px auto;
}
</style>