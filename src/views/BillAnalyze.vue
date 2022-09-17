<template>
  <el-row :gutter="10">
    <el-col :span="6">
      <el-card class="box-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <span>总完成订单数</span>
          </div>
        </template>
        <div class="data-number" v-text="billAnalyzeInfo.bill"></div>
      </el-card>
    </el-col>

    <el-col :span="9">
      <el-card class="box-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <span>销售额--按时间</span>
          </div>
        </template>
        <el-row :gutter="10">
          <el-col class="data-name" :span="12">今日销售额</el-col>
          <el-col class="data-number" :span="12" v-text="billAnalyzeInfo.day"></el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col class="data-name" :span="12">本周销售额</el-col>
          <el-col class="data-number" :span="12" v-text="billAnalyzeInfo.week"></el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col class="data-name" :span="12">当月销售额</el-col>
          <el-col class="data-number" :span="12" v-text="billAnalyzeInfo.month"></el-col>
        </el-row>
      </el-card>
    </el-col>

    <el-col :span="9">
      <el-card class="box-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <span>销售额--按商品类型</span>
          </div>
        </template>
        <el-row :gutter="10">
          <el-col class="data-name" :span="12">图书</el-col>
          <el-col class="data-number" :span="12" v-text="billAnalyzeInfo.book"></el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col class="data-name" :span="12">文创</el-col>
          <el-col class="data-number" :span="12" v-text="billAnalyzeInfo.culturalCreativity"></el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col class="data-name" :span="12">日用品</el-col>
          <el-col class="data-number" :span="12" v-text="billAnalyzeInfo.dailyNecessity"></el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col class="data-name" :span="12">体育用品</el-col>
          <el-col class="data-number" :span="12" v-text="billAnalyzeInfo.sportsGoods"></el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col class="data-name" :span="12">桌游</el-col>
          <el-col class="data-number" :span="12" v-text="billAnalyzeInfo.boardGames"></el-col>
        </el-row>
      </el-card>
    </el-col>
  </el-row>

  <div class="segmentation" style="border-bottom: 1px solid black"></div>

  <div id="myCharts" class="chart-box"></div>
</template>

<script>
import axios from "axios";
import * as echarts from 'echarts'

export default {
  name: "BillAnalyze",
  setup() {
    let myChart;

    const initT = (option, source) => {
      if (myChart != null && myChart !=='' && myChart !== undefined) {
        myChart.dispose();
      }

      myChart = echarts.init(document.getElementById('myCharts'));

      option && (option.dataset[0].source = source);

      option && myChart.setOption(option);

      window.onresize = function () {
        myChart.resize();
      };
    }

    return { initT };
  },
  data() {
    return {
      billAnalyzeInfo: {
        day: 0,
        week: 0,
        month: 0,
        all: 0,
        book: 0,
        culturalCreativity: 0,
        dailyNecessity: 0,
        sportsGoods: 0,
        boardGames: 0,
        bill: 0,
        culturalCreativityInfo: []
      },
      option: {
        title: {
          text: '文创销量统计',
          x: 'center'
        },
        dataset: [
          {
            dimensions: ['name', 'count'],
            source: []
          },
          {
            transform: {
              type: 'sort',
              config: {
                dimension: 'count',
                order: "desc"
              }
            }
          }
        ],
        xAxis: {
          type: 'category',
          axisLabel: { interval: 0, rotate: 30 }
        },
        yAxis: {},
        series: {
          type: 'bar',
          encode: { x: 'name', y: 'count' },
          datasetIndex: 1,
          label: {
            show: true,
            position: 'top'
          }
        }
      }
    }
  },
  created() {
    this.doGetAnalyzeInfo();
  },
  mounted() {
    this.$nextTick(() => {
      this.initT(this.option, this.billAnalyzeInfo.culturalCreativityInfo);
    });
  },
  methods: {
    doGetAnalyzeInfo: function () {
      axios.get(
          this.$store.state.host + "/bill/admin/analyze",
          {
            headers: {
              auth: this.$store.state.token
            }
          }
      )
          .then(res => {
            this.billAnalyzeInfo = res.data.data;
            for (let i = 0; i < this.billAnalyzeInfo.culturalCreativityInfo.length; i++) {
              let count = this.billAnalyzeInfo.culturalCreativityInfo[i][1];
              this.billAnalyzeInfo.culturalCreativityInfo[i][1] = count * 1;
            }

            this.initT(this.option, this.billAnalyzeInfo.culturalCreativityInfo);
          });
    }
  }
}
</script>

<style scoped>
.box-card {
  margin: 10px auto;
  width: 90%;
}

.data-number {
  color: #1772b4;
  font-size: 30px;
}

.data-name {
  text-align: center;
  border-right: 1px solid black;
}

.el-row {
  margin: 10px auto;
}

.chart-box{
  width: 600px;
  height: 600px;
  margin: 10px auto;
}
</style>