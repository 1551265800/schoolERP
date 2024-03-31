<template>
  <div class="container">
    <a-card class="general-card" style="padding-top: 20px">
      <a-row>
        <a-col :flex="1">
          <!-- <a-form :model="form" :label-col-props="{ span: 8 }" :wrapper-col-props="{ span: 18 }" label-align="right"
            auto-label-width>
            <a-row :gutter="16">
              <a-col :span="16">
                <a-form-item field="foodName" label="食材名称">
                  <a-input :style="{ width: '320px' }" v-model="form.foodName" placeholder="请输入食材名称" allow-clear
                    :max-length="100" />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form> -->
          <!-- <a-divider style="height: 35px" direction="vertical" /> -->
          <a-col :flex="'86px'" style="text-align: left">
            <a-space :size="9">
              <a-button type="primary" @click="back">
                <template #icon>
                  <icon-left />
                </template>
                返回
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
      <a-divider style="margin-top: 20px" />
      <a-row style="margin-bottom: 16px">
        <a-col class="addbusiness">
          <a-space>
            <a-button type="primary" @click="addNew()">
              <icon-plus />
              新增&nbsp;&nbsp;{{ option.foodName }}
            </a-button>
          </a-space>
        </a-col>

      </a-row>
      <a-table row-key="id" :loading="loading" :columns="columns2" :data="renderData2" :bordered="{ cell: true }"
        :size="size" :pagination="false" style="margin-top: 10px;">
      </a-table>
      <a-modal v-model:visible="isShow" :title="or ? '新增' : '编辑'" @cancel="myClose" @before-ok="handleBeforeOk"
        unmount-on-close width="320px">
        <a-form :model="emitForm" auto-label-width>
          <!-- <a-form-item field="foodName" label="食材名称：" :rules="[{ required: true, message: '请输入食材名称' }]">
            <a-input v-model="emitForm.foodName" @input="mychange" :max-length="10" placeholder="请输入食材名称" />
          </a-form-item> -->
          <a-form-item field="dateOfManufacture" label="生产日期：" :rules="[{ required: true, message: '请选择出生产日期' }]">
            <a-date-picker placeholder="请选择生产日期" v-model="emitForm.dateOfManufacture" style="width: 200px" />
          </a-form-item>
          <a-form-item field="qualityGuaranteePeriod" label="保质期：" :rules="[{ required: true, message: '请输入保质期' }]">
            <a-input-number :min="0" v-model="emitForm.qualityGuaranteePeriod" @input="mychange" :max-length="10"
              placeholder="请输入保质期" hide-button>
              <template #suffix>
                月
              </template>
            </a-input-number>

          </a-form-item>
          <a-form-item field="quantity" label="入库数量：" :rules="[{ required: true, message: '请输入入库数量' }]">
            <a-input-number :min="0" v-model="emitForm.quantity" @input="mychange" :max-length="10"
              placeholder="请输入入库数量" hide-button>
              <template #suffix>
                {{ option.unit }}
              </template>
            </a-input-number>

          </a-form-item>


        </a-form>
      </a-modal>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, reactive, watch, onMounted } from "vue";
import useLoading from "@/hooks/loading";
import {
  seasoningInventory,
  addWarehouse,
  delate,
  idDetails,
  listDetails,
  listDetails2,
  putPic,
  getCategory,
  unitCategory
} from "@/api/goods";
import type { TableColumnData } from "@arco-design/web-vue/es/table/interface";
import cloneDeep from "lodash/cloneDeep";
import { useRouter, useRoute } from "vue-router";
import { Message } from "@arco-design/web-vue";
import { IconEdit, IconPlus } from "@arco-design/web-vue/es/icon";
import { nextTick } from "vue";

type SizeProps = "mini" | "small" | "medium" | "large";
type Column = TableColumnData & { checked?: true };
const router = useRouter();
const route = useRoute()
const or = ref(true);
const mychange = () => {
  nextTick(() => {
    emitForm.foodName = emitForm.foodName.replace(/\s+/g, "");
  });
};
const generateFormModel = () => {
  return {
    foodName: "",
    dateOfManufacture: "",
    qualityGuaranteePeriod: "",
    quantity: "",

  };
};

const emitForm: any = reactive({
  foodName: "",
  dateOfManufacture: "",
  qualityGuaranteePeriod: "",
  quantity: "",
});

const { loading, setLoading } = useLoading(true);
const renderData: any = ref([]);
const renderData2: any = ref([]);
const form = ref(generateFormModel());
const showColumns = ref<Column[]>([]);
const size = ref<SizeProps>("medium");

// 获取职位
const data = ref();
const data2 = ref();
const getList = async () => {
  const res = await getCategory();
  res.data.forEach((item: any) => {
    item.label = item.classifyName;
    item.value = item.classifyName;
  });
  data.value = res.data;
  const res2 = await unitCategory();
  res2.data.forEach((item: any) => {
    item.label = item.unitName;
    item.value = item.unitName;
  });
  data2.value = res2.data;

  /* data.value.unshift({
    value: "a",
    label: "全部",
  }); */
};
const columns2 = computed<TableColumnData[]>(() => [
  {
    title: "生产日期",
    dataIndex: "dateOfManufacture",
    align: "center",
  },
  {
    title: "保质期",
    dataIndex: "qualityGuaranteePeriod",
    align: "center",
  },
  {
    title: `数量(${option.unit})`,
    dataIndex: "quantity",
    align: "center",
  },
  {
    title: `入库时间`,
    dataIndex: "createDate",
    align: "center",
  },
]);
const option: any = reactive({
  foodId: "",
  foodName: ""
})
const op = route.query
option.foodId = op.foodId
option.foodName = op.foodName
option.unit = op.unit
// 表格数据
const fetchData = async (params?: any) => {
  setLoading(true);
  try {
    // params.foodId = option.foodId;
    console.log(option.foodId);
    const data2 = await seasoningInventory({ foodId: option.foodId });
    renderData2.value = data2.data;
  } catch (err) {
    // you can report use errorHandler or other
    console.log(err);

  } finally {
    setLoading(false);
  }
};
onMounted(() => {
  getList();
  fetchData({});
});
// 新增业务
const isShow = ref(false);
const addNew = () => {
  or.value = true;
  isShow.value = true;
};
const addShow = (val: any) => {
  isShow.value = val;
};
const myClose = () => {
  emitForm.foodName = "";
  emitForm.dateOfManufacture = "";
  emitForm.qualityGuaranteePeriod = "";
  emitForm.quantity = "";
  emitForm.foodPrice = "";
  emitForm.id = "";
  emitForm.userId = "";
  isShow.value = false;
};
const isShowError = (val: any) => {
  isShow.value = val;
};

const handleBeforeOk = async (done: any) => {
  if (emitForm.uid == "") {
    delete emitForm.uid;
  }
  emitForm.foodId = option.foodId;
  emitForm.foodName = option.foodName;
  delete emitForm.userId;
  delete emitForm.id;
  if (!emitForm.dateOfManufacture) {
    Message.error({
      content: "请选择生产日期",
    });
    return false;
  }
  if (!emitForm.qualityGuaranteePeriod) {
    Message.error({
      content: "请输入保质期",
    });
    return false;
  }
  if (!emitForm.quantity) {
    Message.error({
      content: "请输入入库数量",
    });
    return false;
  }

  // 增加
  try {
    setLoading(true);
    const res: any = await addWarehouse(emitForm);
    if (res.msg) {
      Message.success({
        content: res.msg,
      });
    } else {
      Message.success({
        content: "操作成功",
      });
    }
    if (res.code == 200) {
      window.setTimeout(() => {
        done();
        myClose();
      }, 1000);
    }
    await search();
    setLoading(false);
  } catch (error) {
    setLoading(false);
    return false;
  }
};

// 编辑
const editeShow = ref(false);
const editeId = ref();
const editDetails = async (uid: any) => {
  or.value = false;
  emitForm.userId = uid;
  await systemDetail();
  isShow.value = true;
};
const del = async (uid: any) => {
  await delate(uid);
  fetchData({});
};

// 获取详情
const detailData: any = reactive({ data: [] });
const systemDetail = async () => {
  setLoading(true);
  try {
    const res: any = await idDetails({ userId: emitForm.userId });
    detailData.data = res.data;
    emitForm.foodName = detailData.data.foodName;
    emitForm.dateOfManufacture = detailData.data.dateOfManufacture;
    emitForm.qualityGuaranteePeriod = detailData.data.qualityGuaranteePeriod;
    emitForm.quantity = detailData.data.quantity;
    emitForm.foodPrice = detailData.data.foodPrice;
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};
const search = async () => {
  const formData = JSON.parse(JSON.stringify(form.value));
  // formData.positionId = formData.positionId == "a" ? "" : formData.positionId;
  await fetchData({
    // foodName: formData.foodName,
  });
};
const reset = () => {
  form.value = generateFormModel();
  search();
};
const back = () => {
  router.push({ path: 'seasonings' })
}
</script>

<script lang="ts">
export default {
  name: "seasondetil",
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
    margin: 5px auto;
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
        width: 100px;
        height: 100px;
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

      .title {
        font-weight: 700;
        font-size: 17px;
      }

      .chef {
        font-size: 15px;
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
</style>
