<template>
  <div class="container">
    <div style="height: 10px; width: 100%;"></div>
    <div class="item" v-if="role == 3" @click="goTo('/icon/supplierOrder')">
      <div class="img">
        <icon-bookmark :size=size />
      </div>
      <div class="title">
        预采购单(供应商)
      </div>
    </div>

    <div class="item" @click="goTo('/icon/phoneOrder')" v-if="role == 1">
      <div class="img">
        <icon-bookmark :size=size />
      </div>
      <div class="title">
        预采购单
      </div>
    </div>
    <div class="item" @click="goTo('/system/inventoryDetails')" v-if="role == 1">
      <div class="img">
        <icon-interaction :size=size />
      </div>
      <div class="title">
        库存详情
      </div>
    </div>
    <div class="item" @click="goTo('/system/putInAndOutOfStorage')" v-if="role == 1">
      <div class="img">
        <icon-send :size=size />
      </div>
      <div class="title">
        出入库
      </div>
    </div>
    <div class="item" @click="goTo('/system/warehouseDetails')" v-if="role == 1">
      <div class="img">
        <icon-bar-chart :size=size />
      </div>
      <div class="title">
        库存统计
      </div>
    </div>
    <div class="item" @click="goTo('/icon/purchaseStatistics')" v-if="role == 1">
      <div class="img">
        <icon-nav :size=size />
      </div>
      <div class="title">
        采购统计
      </div>
    </div>
    <div class="item" @click="goTo('/system/seasonings')" v-if="role == 1">
      <div class="img">
        <icon-experiment :size=size />
      </div>
      <div class="title">
        调料盘点
      </div>
    </div>
    <div class="item" @click="goTo('/menu/retentionSample2')" v-if="role == 1">
      <div class="img">
        <icon-subscribe-add :size=size />
      </div>
      <div class="title">
        菜品留样
      </div>
    </div>
    <div class="item" @click="goTo('/icon/dailyResponsibilityScore')" v-if="role == 1">
      <div class="img">
        <icon-thumb-up :size=size />
      </div>
      <div class="title">
        职责评分
      </div>
    </div>
    <p></p>
    <VCharts :renderChart="renderChart" v-if="true" :option="options" :style="{ width, height }" />
  </div>
</template>
<script lang="ts" setup>
import { useRouter } from "vue-router";
import { onMounted } from 'vue';
import { ref } from "vue";
import VCharts from "@/components/chart/index.vue";
import { statistics } from "@/api/chars";
const router = useRouter();
const size = ref(50);
const role: any = ref(localStorage.getItem("roles"))
const goTo = (path: any) => {
  router.push({
    path: path
  })
}
onMounted(() => {
  if (!localStorage.getItem("token")) {
    router.push({
      name: "login"
    })
  }
  getList()
})
const options = ref({
  title: {
    text: '标题',
    // subtext: 'Fake Data'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      axisTick: {
        alignWithLabel: true
      }
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: [
    {
      name: '金额',
      type: 'bar',
      barWidth: '60%',
      data: [250, 52, 200, 334, 390, 330, 220]
    }
  ]
})
const width = ref("100%")
const height = ref("300px")
const renderChart = ref(false)
const getList = async () => {
  const res = await statistics()
  if (res.code == 200) {
    console.log(res.data);
    renderChart.value = true;
    // title.value = res.data.title;
    options.value.series[0].data = res.data.ydata;
    options.value.xAxis[0].data = res.data.xdata;
    options.value.title.text = res.data.title;

  }
}

// 模拟异步请求数据
setTimeout(() => {
  // options.value.series[0].data = [100, 200, 300, 400, 500, 600, 700];


}, 1000);

</script>
<script lang="ts">
export default {
  name: "Welcome",
};
</script>

<style lang="less" scoped>
.container {
  display: flex;
  flex-wrap: wrap;

  .item {
    margin: 5px;
    width: 100px;
    height: 100px;
    border-radius: 5px;
    align-items: center;
    justify-content: center;
    display: flex;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.1);
    flex-wrap: wrap;

    .title {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 100%;
      text-align: center;
    }

    .img {
      width: 50px;
      height: 50px;
      // background-color: #000;
    }
  }
}
</style>
