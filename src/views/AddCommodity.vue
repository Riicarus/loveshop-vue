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
      ],
      time: 0
    }
  },
  components: {
    Search
  },
  methods: {
    doAddCommodity: function () {
      this.commodityAddParam.type = this.value;

      console.log(this.extension.authors);

      console.log(Object.prototype.toString.call(this.extension.authors));

      if (this.value === 'BOOK') {
        if (Object.prototype.toString.call(this.extension.authors) !== "[object Array]") {
          let authorList = this.extension.authors.split(",");
          this.extension.authors = [];
          for (let string of authorList) {
            this.extension.authors.push(string.trim());
          }
        }

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
      let timeNow = new Date().getTime();
      console.log(timeNow)
      console.log(this.time)
      if (this.time !== 0 && timeNow - this.time <= 1100) {
        window.alert("不要再点啦, 再点要封IP啦!!!!!!");
      } else {
        this.doSearchISBN();
      }
      this.time = timeNow;
    },
    doSearchISBN: function () {
      axios.get("https://api.jike.xyz/situ/book/isbn/" + this.extension.ISBN + "?apikey=" + this.$store.state.ISBN_API_KEY[this.$store.state.ISBN_API_KEY_INDEX])
          .then(res => {
            if (res.data.ret !== 1) {
              if (res.status !== 200) {
                window.alert("请求失败, 请检查ISBN是否输入正确,或选择手动录入该图书!")
              } else {
                let authorList = (res.data.data.author == null ? [] : res.data.data.author.split("/"));
                this.extension.authors = [];
                for (let string of authorList) {
                  this.extension.authors.push(string.trim());
                }
                this.extension.publisher = res.data.data.publishing;
                this.commodityAddParam.name = (res.data.data.name + " " + res.data.data.subname).trim();
                this.commodityAddParam.price = res.data.data.price.substring(0, res.data.data.price.length - 1) / 1;
              }
            } else {
              console.log(this.$store.state.ISBN_API_KEY.length)
              let newIndex = (this.$store.state.ISBN_API_KEY_INDEX + 1) % this.$store.state.ISBN_API_KEY.length;
              this.$store.commit('setIndex', newIndex);
              console.log(this.$store.state.ISBN_API_KEY.length)
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