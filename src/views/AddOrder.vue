<template>
  <div id="orderAddDiv" style="width: 50%; margin: 0 auto">
    <el-form ref="orderAddForm" :model="form" label-width="120px">
      <el-form-item label="名称">
        <div class="mt-4">
          <el-input
              v-model="form.name"
              placeholder="请输入要添加的商品名称">
            <template #append>
              <el-button
                @click="searchCommodity">
                <el-icon><Search/></el-icon>
              </el-button>
            </template>
          </el-input>
        </div>
      </el-form-item>
      <el-form-item label="折扣">
        <el-select v-model="form.discount" placeholder="请选择折扣数">
          <el-option label="二折" value="2" default/>
          <el-option label="三折" value="3" />
        </el-select>
      </el-form-item>
    </el-form>
  </div>

  <el-dialog v-model="editFormVisible" title="选择商品">
    <el-table :data="commodityList" stripe style="width: 100%">
      <el-table-column prop="name" label="名称" width="180px"/>
      <el-table-column prop="numbering" label="位置" width="100px"/>
      <el-table-column prop="amount" label="库存" width="100px"/>
      <el-table-column prop="price" label="价格" width="100px"/>
      <el-table-column label="操作" fixed="right" width="100px">
        <template #default="scope">
          <el-button size="small" @click="handleSelect(scope.row)" :disabled="selectedCommodityMap.has(scope.row.id)">选择</el-button>
        </template>
      </el-table-column>
      <el-table-column></el-table-column>
    </el-table>
  </el-dialog>

  <div style="border-bottom: 1px solid gray; margin:40px 0"></div>

  <h3>已添加</h3>
  <el-button style="margin-bottom: 10px" type="primary" @click="generateOrder">生成订单</el-button>
  <el-table :data="Array.from(selectedCommodityMap.values())" size="small" :border="true" style="width: 100%">
    <el-table-column label="名称" prop="commodity.name" />
    <el-table-column label="类型" prop="commodity.type" />
    <el-table-column label="数量" prop="number">
      <template #default="scope">
        <el-input v-model="scope.row.number" type="number"></el-input>
      </template>
    </el-table-column>
    <el-table-column label="价格" prop="commodity.price" />
    <el-table-column label="位置" prop="commodity.numbering" />
    <el-table-column label="操作" fixed="right" width="100px">
      <template #default="scope">
        <el-button size="small" type="danger" @click="handleDelete(scope.row.commodity)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>


</template>

<script>
import { Search } from '@element-plus/icons-vue'
import axios from "axios";

export default {
  name: "AddOrder",
  data() {
    return {
      editFormVisible: false,
      commodityList: [],
      selectedCommodityMap: new Map(),
      selectedCommodity: {
        number: 0,
        commodity: null
      },
      form: {
        name: '',
        discount: ''
      }
    }
  },
  components: {
    Search
  },
  methods: {
    addToList: function (commodity) {
      if (this.selectedCommodityMap.has(commodity.id)) {
        window.alert("已添加该商品!");
      } else {
        this.selectedCommodityMap.set(commodity.id, {
          number: 1,
          commodity: commodity
        });
      }
    },
    searchCommodity: function () {
      axios.get(
          this.$store.state.host + "/commodity/info/simple?name=" + this.form.name,
      )
          .then(res => {
                this.commodityList = res.data.data;
                console.log(this.commodityList);
              }
          );
      this.editFormVisible = true;
    },
    handleSelect: function (commodity) {
      this.addToList(commodity);
      this.editFormVisible = false;
    },
    handleDelete: function (commodity) {
      this.selectedCommodityMap.delete(commodity.id);
    },
    generateOrder: function () {
      if (this.form.discount === '') {
        window.alert("请选择折扣!");
        return;
      }

      let goodsList = [];

      let orderAddParam = {
        userId: '',
        adminId: this.$store.state.admin.id,
        discount: this.form.discount,
        goods: []
      }

      console.log(Array.from(this.selectedCommodityMap.values()));

      for (let v of Array.from(this.selectedCommodityMap.values())) {
        let goods = {
          commodityId: v.commodity.id,
          amount: v.number,
          price: v.commodity.price,
          commodityType: v.commodity.type
        }
        goodsList.push(goods);
      }

      orderAddParam.goods = goodsList;

      console.log(orderAddParam);

      axios.post(
          this.$store.state.host + "/order",
          orderAddParam,
          {
            headers: {
              auth: this.$store.state.token,
              'Content-Type': 'application/json'
            }
          }
      )
          .then(res => {
                if (res.data.code !== 600) {
                  window.alert("生成订单失败!");
                } else {
                  window.alert("生成订单成功!");
                  this.selectedCommodityMap = new Map();
                }
              }
          );
    }
  }
}
</script>

<style scoped>

</style>