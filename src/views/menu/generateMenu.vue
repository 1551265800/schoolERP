<template>
  <div class="container">
    <Breadcrumb :items="['菜品管理', '生成菜单']" />
    <a-card class="general-card" style="padding-top: 20px">
      <a-row>
        <a-col :flex="1">
          <a-form
            :model="form"
            :label-col-props="{ span: 8 }"
            :wrapper-col-props="{ span: 18 }"
            label-align="right"
            auto-label-width
          >
            <a-row :gutter="16">
              <a-col :span="16">
                <a-form-item field="mealName" label="菜品名称">
                  <!-- <a-input
                    :style="{ width: '320px' }"
                    v-model="form.mealName"
                    placeholder="请输入菜品名称"
                    allow-clear
                    :max-length="100"
                  /> -->
                  <a-select
                    :style="{ width: '320px' }"
                    allow-search
                    :options="data"
                    v-model="form.mealName"
                    placeholder="请选择菜品名称"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="16">
              <a-col :span="25">
                <a-form-item field="time" label="选择时间">
                  <a-radio-group
                    v-model="form.time"
                    :options="timeOptions"
                    @change="timeChange"
                  >
                    <template #label="{ data }">
                      <a-tag>{{ data.label }}</a-tag>
                    </template>
                  </a-radio-group>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row style="margin-bottom: 16px" :gutter="24">
              <a-col class="addbusiness" :span="4">
                <a-space>
                  <a-input-number
                    v-model="increase"
                    :style="{ width: '80px' }"
                    :min="0"
                    :max="999"
                    placeholder="请输入增加量"
                  >
                  </a-input-number>
                  <a-button type="primary" @click="modifiedIncrement">
                    <icon-pen-fill />
                    修改增加量
                  </a-button>
                </a-space>
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
      <a-divider style="margin-top: 20px" />
      <!-- <a-row style="margin-bottom: 16px">
        <a-col class="addbusiness">
          <a-space>
            <a-button type="primary" @click="addNew()">
              <icon-plus />
              点菜
            </a-button>
          </a-space>
        </a-col>
      </a-row> -->
      <!-- <a-row style="margin-bottom: 16px">
        <a-col class="addbusiness">
          <a-space>
            <a-button type="primary" @click="downLoad()">
              <icon-cloud-download />
              生成采购单
            </a-button>
          </a-space>
        </a-col>
      </a-row> -->
      <a-row style="margin-bottom: 16px" :gutter="24">
        <a-col class="addbusiness" :span="4">
          <a-space>
            <a-button type="primary" @click="downLoad()">
              <icon-cloud-download />
              生成采购单
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-table
        row-key="id"
        :loading="loading"
        :columns="(cloneColumns as TableColumnData[])"
        :data="renderData"
        :bordered="{ cell: true }"
        :size="size"
        :pagination="true"
      >
        <template #operations="{ record, rowIndex }">
          <a-button
            type="text"
            size="small"
            @click="editDetails(record.id, record.mealId)"
          >
            修改数量
          </a-button>
          <a-popconfirm content="确定删除吗?" type="error" @ok="del(record.id)">
            <a-button type="text" size="small" status="danger"> 删除 </a-button>
          </a-popconfirm>
        </template>
        <template #pictureAddress="{ record, rowIndex }">
          <a-image :src="record.pictureAddress" width="160" />
        </template>
        <template #useDate="{ record, rowIndex }">
          {{ record.useDate }}({{ days[new Date(record.useDate).getDay()] }})
        </template>
        <template #foodQuantityList="{ record, rowIndex }">
          <div v-for="food in record.foodQuantityList" :key="food.id">
            {{ food.foodName }}
          </div>
        </template>
      </a-table>
      <a-modal
        v-model:visible="isShow"
        :title="or ? '新增' : '编辑'"
        @cancel="myClose"
        @before-ok="handleBeforeOk"
        unmount-on-close
        width="700px"
      >
        <a-form :model="emitForm" auto-label-width>
          <a-form-item label="新增时间：">
            {{ form.time }} （周{{ new Date(form.time).getDay() }}）
          </a-form-item>
          <a-form-item
            field="quantity"
            label="菜品数量："
            :rules="[{ required: true, message: '请输入菜品数量' }]"
          >
            <a-input-number
              v-model="emitForm.quantity"
              @input="mychange"
              :max-length="10"
              placeholder="请输入菜品数量"
            />
          </a-form-item>
          <a-form-item
            field="increase"
            label="增加量："
            :rules="[{ required: true, message: '请输入增加量' }]"
          >
            <a-input-number
              v-model="emitForm.increase"
              @input="mychange"
              :max-length="10"
              placeholder="请输入增加量"
            />
          </a-form-item>
          <!-- <a-form-item
            field="mealName"
            label="菜品名称："
            :rules="[{ required: true, message: '请输入菜品名称' }]"
          >
            <a-select
              :options="data"
              v-model="emitForm.mealName"
              placeholder="请选择菜品名称"
              allow-search
              allow-clear
              :max-length="100"
            />
            <a-input
              v-model="emitForm.mealName"
              @input="mychange"
              :max-length="10"
              placeholder="请输入菜品名称"
            />
          </a-form-item> -->
        </a-form>
      </a-modal>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, reactive, watch, onMounted } from "vue";
import useLoading from "@/hooks/loading";
import { listDetails } from "@/api/menu";
import {
  editorial,
  mealOrderDetails,
  getTime,
  idDetails,
  delateOrder,
  changeIncrement,
} from "@/api/generateMenu";
import type { TableColumnData } from "@arco-design/web-vue/es/table/interface";
import cloneDeep from "lodash/cloneDeep";
import { useRouter } from "vue-router";
import { Message } from "@arco-design/web-vue";
import { IconEdit, IconPlus } from "@arco-design/web-vue/es/icon";
import { nextTick } from "vue";
import { down } from "@/api/purchaseOrder";

type SizeProps = "mini" | "small" | "medium" | "large";
type Column = TableColumnData & { checked?: true };
const router = useRouter();
const or = ref(true);
const mychange = () => {
  nextTick(() => {
    emitForm.mealName = emitForm.mealName.replace(/\s+/g, "");
  });
};
const increase: any = ref();
const timeOptions = ref();

const generateFormModel = () => {
  return {
    mealName: "",
    pictureAddress: "",
    author: "",
    mealType: "",
    production: "",
    time: "",
  };
};
const emitForm: any = reactive({
  mealName: "",
  pictureAddress: "",
  author: "",
  mealType: "",
  production: "",
  time: "",
  increase: "",
  // useTo: "",
  // foodStatus: "",
  // notes: "",
});

const { loading, setLoading } = useLoading(true);
const renderData: any = ref([]);
const form = ref(generateFormModel());
const cloneColumns = ref<Column[]>([]);
const showColumns = ref<Column[]>([]);
const size = ref<SizeProps>("medium");
const days = ref(["周日", "周一", "周二", "周三", "周四", "周五", "周六"]);

// var currentDate = new Date();
// currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
// var year = currentDate.getFullYear(); // 获取当前年份
// var month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // 获取当前月份，并确保是两位数
// var day = currentDate.getDate().toString().padStart(2, "0"); // 获取当前日期，并确保是两位数
// form.value.time = year + "-" + month + "-" + day;

// 获取职位
const data = ref();
const data2 = ref();
const getList = async () => {
  const res = await listDetails({});
  res.data.forEach((item: any) => {
    item.label = item.mealName;
    item.value = item.id;
  });
  data.value = res.data;
  const time:any = await getTime();
  form.value.time = time.defaultTime;
  time.data.forEach((item: any) => {
    item.label = `${item.dateStr}(${item.weekStr})`;
    item.value = item.dateStr;
  });
  timeOptions.value = time.data;
  // console.log(data.value);

  // const res2 = await unitCategory();
  // res2.data.forEach((item: any) => {
  //   item.label = item.unitName;
  //   item.value = item.unitName;
  // });
  // data2.value = res2.data;
  /* data.value.unshift({
    value: "a",
    label: "全部",
  }); */
};
const timeChange = (value: any) => {
  // console.log(value);
  form.value.time = value;
  search();
};
const columns = computed<TableColumnData[]>(() => [
  // {
  //   title: "序号",
  //   dataIndex: "id",
  //   align: "center",
  //   width: 50,
  // },
  {
    title: "时间",
    dataIndex: "createDate",
    align: "center",
    width: 90,
  },
  {
    title: "操作",
    dataIndex: "operations",
    slotName: "operations",
    align: "center",
    width: 50,
  },
  {
    title: "菜品名称",
    dataIndex: "mealName",
    align: "center",
    width: 120,
  },
  {
    title: "菜品数量",
    dataIndex: "quantity",
    align: "center",
    width: 120,
  },
  {
    title: "增加量",
    dataIndex: "increase",
    align: "center",
    width: 120,
  },
  {
    title: "点餐时间",
    dataIndex: "useDate",
    slotName: "useDate",
    align: "center",
    width: 150,
  },
  {
    title: "菜品图片",
    dataIndex: "pictureAddress",
    slotName: "pictureAddress",
    align: "center",
    width: 150,
  },
  {
    title: "菜品类型",
    dataIndex: "mealType",
    align: "center",
    width: 80,
  },
]);
// 表格数据
const fetchData = async (params?: any) => {
  setLoading(true);
  try {
    const { data } = await mealOrderDetails(params);
    if (data.length == 0) {
      renderData.value = data;
      return;
    }
    //如果是null置为-
    const result = data.map((obj: any) => {
      const modifiedObj: any = {};
      for (const prop in obj) {
        if (!obj[prop]) {
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
onMounted(async() => {
 await getList();
 await search();
});
// 新增业务
const isShow = ref(false);
const addNew = () => {
  if (!form.value.time) {
    Message.warning("请先选择时间");
    return;
  }
  or.value = true;
  isShow.value = true;
};
const addShow = (val: any) => {
  isShow.value = val;
};
const myClose = () => {
  emitForm.mealName = "";
  emitForm.pictureAddress = "";
  emitForm.foodPrice = "";
  emitForm.author = "";
  emitForm.mealType = "";
  emitForm.production = "";
  emitForm.mealName = "";
  emitForm.id = "";
  emitForm.userId = "";
  isShow.value = false;
  file.value = {};
};

const handleBeforeOk = async (done: any) => {
  if (emitForm.uid == "") {
    delete emitForm.uid;
  }
  emitForm.id = emitForm.userId;
  delete emitForm.userId;
  if (!emitForm.quantity) {
    Message.error({
      content: "请输入菜品数量",
    });
    return false;
  }
  if (!emitForm.increase) {
    Message.error({
      content: "请输入增加量",
    });
    return false;
  }
  // 增加
  try {
    setLoading(true);
    const res: any = await editorial({
      id: emitForm.id,
      mealId: emitForm.mealId,
      increase: emitForm.increase,
      quantity: emitForm.quantity,
      mealName: emitForm.mealName,
      useDate: form.value.time,
    });
    if (res.message) {
      Message.success({
        content: res.message,
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
// 编辑
const editDetails = async (uid: any, mealId: any) => {
  if (!form.value.time) {
    Message.error({
      content: "请选择时间",
    });
    return;
  }
  or.value = false;
  emitForm.userId = uid;
  emitForm.mealId = mealId;
  await systemDetail();
  isShow.value = true;
};
const del = async (uid: any) => {
  await delateOrder(uid);
  search();
};

// 获取详情
const detailData: any = reactive({ data: [] });
const systemDetail = async () => {
  setLoading(true);
  try {
    const res: any = await idDetails({ userId: emitForm.userId });
    detailData.data = res.data;
    emitForm.mealName = detailData.data.mealName;
    emitForm.quantity = detailData.data.quantity;
    emitForm.increase = detailData.data.increase;
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
    mealName: formData.mealName,
    useDate: formData.time,
  });
};
const reset = () => {
  let temp = form.value.time;
  form.value = generateFormModel();
  form.value.time = temp;
  search();
};

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

// 弹框
const visible: any = ref(false);
const fileSrc: any = ref({});
const imgFlag: any = ref(false);

const file: any = ref({});
const downLoad = () => {
  down()
    .then((res: any) => {
      const fileUrl = res.message;
      window.open(fileUrl, "_blank");
    })
    .catch((err: any) => {
      Message.error({
        content: err.data,
      });
    });
};

// 批量修改增加量
const modifiedIncrement = async () => {
  // alert(increase.value);
  const res:any = await changeIncrement(increase.value);
  if (res.message) {
    Message.success({
      content: res.message,
    });
  } else {
    Message.success({
      content: "操作成功",
    });
  }
  search();
};
</script>

<script lang="ts">
export default {
  name: "generateMenu",
};
</script>

<style scoped lang="less">
.container {
  padding: 0 20px 20px 20px;
}

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
</style>
