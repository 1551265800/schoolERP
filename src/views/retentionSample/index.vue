<template>
  <div class="container" v-if="flag">
    <div class="mytable">
      <a-table :columns="columns" :data="listData" :pagination="false">
        <template #pictureAddress="{ record }">
          <a-image :src="record.pictureAddress" width="160" />
        </template>
      </a-table>
    </div>
    <div class="liuyang">
      <div class="title">留样详情</div>
      菜品名：{{ listData[0].mealName }}
      <br />
      厨师：{{ listData[0].chef }}
      <br />
      留样人：{{ listData[0].operator }}
      <br />
      留样时间：{{ listData[0].useDate }}
      <br />
      <a-image :src="listData[0].pictureAddress" width="250" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRoute, useRouter, RouteRecordRaw } from "vue-router";
import useLoading from "@/hooks/loading";
import { messageCheck } from "@/api/out";
import { onMounted, reactive, ref } from "vue";
const listData: any = ref([]);
// 获取id
const route = useRoute();
const { loading, setLoading } = useLoading(true);
const flag: any = ref(false);
const fetchData = async (params?: any) => {
  setLoading(true);
  try {
    const { data } = await messageCheck(route.query.id);
    // console.log(data);
    flag.value = true;
    listData.value = [data];
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};

const columns: any = [
  {
    title: "厨师",
    dataIndex: "chef",
  },
  {
    title: "留样人",
    dataIndex: "operator",
  },
  {
    title: "留样图片",
    dataIndex: "pictureAddress",
    slotName: "pictureAddress",
    align: "center",
  },
  {
    title: "留样时间",
    dataIndex: "useDate",
    width: 120,
  },
];

onMounted(() => {
  fetchData({});
});
</script>

<style lang="less" scoped>
.container {
  width: 90%;
  margin: 0 auto;
  font-size: 20px;
  line-height: 50px;
  background: #f3f3f3;
  padding: 10px;
  box-shadow: inset 0 0 10px 5px rgba(0, 0, 0, 0.1);
}
.title {
  text-align: center;
  font-size: 35px;
}

/* 当屏幕宽度小于480px时，隐藏.mytable */
@media (max-width: 480px) {
  .mytable {
    display: none;
  }
}

/* 当屏幕宽度大于480px时，隐藏.liuyang */
@media (min-width: 481px) {
  .liuyang {
    display: none;
  }
}

</style>
