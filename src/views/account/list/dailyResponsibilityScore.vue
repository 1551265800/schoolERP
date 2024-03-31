<template>
  <div class="container">
    <Breadcrumb :items="['menu.system', '每日职责评分']" class="mytable" />
    <a-card class="general-card" style="padding-top: 20px">
      <a-row>
        <a-col :flex="1">
          <a-form :model="form" :label-col-props="{ span: 8 }" :wrapper-col-props="{ span: 18 }" label-align="right"
            auto-label-width>
            <!-- <a-row :gutter="16">
              <a-col :span="16">
                <a-form-item field="foodName" label="食材名称">
                  <a-select v-model="form.foodName" placeholder="请选择食材名称" :options="data" style="width: 250px"></a-select>
                </a-form-item>
              </a-col>
            </a-row> -->
            <a-row :gutter="16">
              <a-col :span="16">
                <a-form-item field="time" label="时间">
                  <a-date-picker v-model="form.time" style="width: 350px" format="YYYY-MM-DD"
                  @change="onOk" />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
          <!-- <a-divider style="height: 35px" direction="vertical" /> -->
          <a-col :flex="'86px'" style="text-align: left">
            <a-space :size="9">
              <a-button type="primary" @click="search">
                <template #icon>
                  <icon-search />
                </template>
                搜索
              </a-button>
              <a-button @click="reset">
                <template #icon>
                  <icon-refresh />
                </template>
                刷新
              </a-button>
            </a-space>
          </a-col>
        </a-col>
      </a-row>
      <a-divider style="margin-top: 20px" class="mytable" />
      <div class="list">
        <div class="item" v-for="(v, index ) in renderData" :key="index">
          <!--   <div class="item-left">
            <image :src="v.pictureAddress" mode=""></image>
            <img :src="v.pictureAddress" alt="">
          </div> -->
          <div class="item-right">
            <div class="line">
              <text class="title">
                {{ v.respName }}
              </text>
              <br>
              <text class="chef">执行人：{{ v.executorName }}</text>
              <br>
              <a-rate v-model="v.completeStatus" @change="(val) => { changeRate(val, v.id) }" />
            </div>
          </div>
        </div>
      </div>
      <!-- <a-table row-key="id" :loading="loading" :columns="(cloneColumns as TableColumnData[])" :data="renderData"
        :bordered="{ cell: true }" :size="size" :pagination="true" class="mytable">
      </a-table> -->
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, reactive, watch, onMounted } from "vue";
import useLoading from "@/hooks/loading";
import { goodlistDetails } from "@/api/IOStorage";
import { detailsOfDailyDuties, scoring } from "@/api/outboundRecord";
import type { TableColumnData } from "@arco-design/web-vue/es/table/interface";
import cloneDeep from "lodash/cloneDeep";
import { useRouter } from "vue-router";
import { Message } from "@arco-design/web-vue";
import { nextTick } from "vue";

type SizeProps = "mini" | "small" | "medium" | "large";
type Column = TableColumnData & { checked?: true };
const router = useRouter();
const or = ref(true);
const generateFormModel = () => {
  return {
    foodName: "",
    time: "",
    beforeDate: "",
    afterDate: "",
  };
};
const { loading, setLoading } = useLoading(true);
const renderData: any = ref([]);
const form: any = ref(generateFormModel());
const cloneColumns = ref<Column[]>([]);
const showColumns = ref<Column[]>([]);
const size = ref<SizeProps>("medium");

const data = ref();
const getList = async () => {
  const res = await goodlistDetails();
  res.data.forEach((item: any) => {
    item.label = item.foodName;
    delete item.foodName;
    item.value = item.id;
    delete item.id;
  });
  data.value = res.data;
  data.value.unshift({
    value: "a",
    label: "全部",
  });
};
const columns = computed<TableColumnData[]>(() => [
  // {
  //   title: "序号",
  //   dataIndex: "id",
  //   align: "center",
  //   width: 150,
  // },
  {
    title: "职责名称",
    dataIndex: "respName",
    align: "center",
    width: 150,
  },
  {
    title: "执行人",
    dataIndex: "executorName",
    align: "center",
    width: 120,
  },
  {
    title: "评分",
    dataIndex: "completeStatus",
    align: "center",
    width: 120,
  },
]);
// 表格数据
const fetchData = async (params?: any) => {
  setLoading(true);
  try {
    const { data } = await detailsOfDailyDuties(params);
    if (data.length == 0) {
      renderData.value = data;
      return;
    }
    data[0].first = "123";
    data[data.length - 1].last = "123";
    //如果是null置为-
    const result = data.map((obj: any) => {
      const modifiedObj: any = {};
      for (const prop in obj) {
        if (obj[prop] === null) {
          modifiedObj[prop] = "-";
        } else {
          modifiedObj[prop] = obj[prop];
        }
      }
      return modifiedObj;
    });
    renderData.value = result;
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};
onMounted(() => {
  // getList();
  fetchData({});
});
const search = async () => {
  const formData = JSON.parse(JSON.stringify(form.value));
  // console.log("formData::: ", formData);
  // formData.foodName = formData.foodName == "a" ? "" : formData.foodName;
  await fetchData({
    // foodId: formData.foodName,
    // afterDate: formData.afterDate,
    // beforeDate: formData.beforeDate,
    useDate: form.value.time
  });
};
const reset = () => {
  form.value = generateFormModel();
  search();
};
const onOk = () => {
  // console.log("onOk: ", dateString, date);
  // form.value.beforeDate = dateString[1];
  // form.value.afterDate = dateString[0];
  search()
};

const changeRate = async (e: any, id: string) => {
  // console.log(e, id);
  const res = await scoring({ id: id, completeStatus: e })
  console.log(res);
}

watch(
  () => columns.value,
  (val) => {
    cloneColumns.value = cloneDeep(val);
    cloneColumns.value.forEach((item, index) => {
      item.checked = true;
    });
    showColumns.value = cloneDeep(cloneColumns.value);
  },
  { deep: true, immediate: true }
);
</script>

<script lang="ts">
export default {
  name: "dailyResponsibilityScore",
};
</script>

<style scoped lang="less">
:deep(.arco-table-th) {
  &:last-child {
    .arco-table-th-item-title {
      margin-left: 16px;
    }
  }
}

.addbusiness {
  display: flex;
  justify-content: start;
}

.action-icon {
  margin-left: 12px;
  cursor: pointer;
}

.active {
  color: #0960bd;
  background-color: #e3f4fc;
}

.setting {
  display: flex;
  align-items: center;
  width: 200px;

  .title {
    margin-left: 12px;
    cursor: pointer;
  }
}

.general-card {
  .card-top {
    margin-top: 10px;

    .grid-demo {
      margin-bottom: 25px;
    }

    .search {
      margin-right: 15px;
      width: 150px;
    }
  }
}


.tip {
  font-size: 10px;
  margin-left: 120px;
  color: #7d7979;
}

/* 当屏幕宽度小于480px时，隐藏.mytable */
@media (max-width: 480px) {
  .mytable {
    display: none;
  }

  .container {
    padding: 0;
  }
}

/* 当屏幕宽度大于480px时，隐藏.liuyang */
@media (min-width: 481px) {
  .liuyang {
    display: none;
  }

  .container {
    padding: 0 20px 20px 20px;
  }
}

.list {
  .item {
    display: flex;
    justify-content: left;
    align-items: center;
    border-bottom: 10px solid #F0F2F5;
    background-color: #fff;
    position: relative;
    height: 100%;
    border: 1px solid rgba(0, 0, 0, 0.116);
    border-radius: 5px;
    margin: 10px auto;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    padding: 10px 5px;

    .LYbtn2 {
      position: absolute;
      right: 0px;
      bottom: 15px;
      border-radius: 7px;
      padding: 10px 20px;
    }

    .LYbtn {
      position: absolute;
      right: 0px;
      bottom: 60px;
      border-radius: 7px;
      padding: 10px 20px;
    }

    .item-left {
      display: flex;
      flex-direction: column;
      line-height: 2;

      img {
        width: 130px;
        height: 130px;
        border-radius: 7px;
      }

      text {
        font-size: 32rpx;

        &:last-child {
          font-size: 28rpx;
        }

        &:first-child {
          font-weight: bold;
        }
      }
    }

    .line {
      margin-left: 20px;
      line-height: 30px;

      .title {
        font-weight: 700;
        font-size: 20px;
      }
    }


    .item-right {
      text.success {
        color: #18bc37;
      }

      text.error {
        color: #e43d33;
      }

      text.warning {
        color: #f3a73f;
        font-size: 26rpx;
      }
    }
  }
}
</style>
