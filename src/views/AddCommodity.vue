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
        <el-input v-model="extension.ISBN" />
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
  methods: {
    doAddCommodity: function () {
      this.commodityAddParam.type = this.value;
      if (this.value === 'BOOK') {
        this.commodityAddParam.extension = {
          ISBN: this.extension.ISBN,
          authors: this.extension.authors.split(','),
          publisher: this.extension.publisher
        }
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
                console.log(res)
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
        authors: '',
        publisher: ''
      }
    },
    handleAdd: function () {
      this.doAddCommodity();
      this.resetForm();
    }
  }
}
</script>

<style scoped>
.center {
  margin: 10px auto;
}
</style>