<template>
  <div class="container">
    <Breadcrumb :items="['menu.system', '出库记录']" />
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
                <a-form-item field="foodName" label="食材名称">
                  <a-select
                    v-model="form.foodName"
                    placeholder="请选择食材名称"
                    :options="data"
                    style="width: 250px"
                  ></a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="16">
              <a-col :span="16">
                <a-form-item field="time" label="出库时间">
                  <a-range-picker
                    v-model="form.time"
                    style="width: 350px"
                    show-time
                    format="YYYY-MM-DD HH:mm:ss"
                    @ok="onOk"
                  />
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
      <a-divider style="margin-top: 20px" />
      <!--  <a-row style="margin-bottom: 16px">
        <a-col class="addbusiness">
          <a-space>
            <a-button type="primary" @click="addNew()">
              <icon-plus />
              新增
            </a-button>
          </a-space>
        </a-col>
      </a-row> -->
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
          <div v-if="!record.confirm">
            <!-- <a-button type="text" size="small" @click="editDetails(record.id)">
              修改用量
            </a-button> -->

            <a-popconfirm
              content="确定提交吗?"
              type="success"
              @ok="confirm(record.id)"
            >
              <a-button type="text" size="small"> 提交 </a-button>
            </a-popconfirm>
          </div>
          <div v-else>-</div>
        </template>
        <template #operations2="{ record, rowIndex }">
            <a-popconfirm
              content="确定删除吗?"
              type="error"
              @ok="del(record.id)"
            >
              <a-button type="text" size="small" status="danger"> 删除 </a-button>
            </a-popconfirm>
        </template>
        <template #confirm="{ record, rowIndex }">
          <view v-if="record.confirm == false"
            ><icon-close-circle-fill :size="15" style="color: #fe163e" />未确认
          </view>
          <view v-else>
            <icon-check-circle-fill :size="15" style="color: #00b42a" />已确认
          </view>
        </template>
      </a-table>
      <a-modal
        v-model:visible="isShow"
        :title="or ? '新增' : '编辑'"
        @cancel="myClose"
        @before-ok="handleBeforeOk"
        unmount-on-close
      >
        <a-form :model="emitForm" auto-label-width>
          <a-form-item
            field="quantity"
            label="食材数量"
            :rules="[{ required: true, message: '请输入食材数量' }]"
          >
            <a-input-number
              v-model="emitForm.quantity"
              @input="mychange"
              :max-length="20"
              placeholder="请输入食材数量"
            />
          </a-form-item>
        </a-form>
      </a-modal>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, reactive, watch, onMounted } from "vue";
import useLoading from "@/hooks/loading";
import { goodlistDetails } from "@/api/IOStorage";
import {
  editorialOrganization,
  delate,
  confom,
  idDetails,
  listDetails,
} from "@/api/outboundRecord";
import type { TableColumnData } from "@arco-design/web-vue/es/table/interface";
import cloneDeep from "lodash/cloneDeep";
import { useRouter } from "vue-router";
import { Message } from "@arco-design/web-vue";
import { IconEdit, IconPlus } from "@arco-design/web-vue/es/icon";
import { nextTick } from "vue";

type SizeProps = "mini" | "small" | "medium" | "large";
type Column = TableColumnData & { checked?: true };
const router = useRouter();
const or = ref(true);
const mychange = () => {
  nextTick(() => {
    // emitForm.foodName = emitForm.foodName.replace(/\s+/g, "");
  });
};
const generateFormModel = () => {
  return {
    time: "",
    beforeDate: "",
    afterDate: "",
    foodName: "",
    establishedTime: "",
    organType: "",
    address: "",
    memberNum: "",
    production: "",
  };
};

const emitForm: any = reactive({
  foodName: "",
  establishedTime: "",
  organType: "",
  address: "",
  memberNum: "",
  production: "",
});

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
    title: "操作",
    dataIndex: "operations",
    slotName: "operations",
    align: "center",
    width: 100,
  },
  {
    title: "确认状态",
    dataIndex: "confirm",
    slotName: "confirm",
    align: "center",
    width: 150,
  },
  {
    title: "食材名称",
    dataIndex: "foodName",
    align: "center",
    width: 120,
  },
  {
    title: "食材品类",
    dataIndex: "foodClassify",
    align: "center",
    width: 120,
  },
  {
    title: "食材数量",
    dataIndex: "quantity",
    align: "center",
    width: 160,
  },
  {
    title: "食材单位",
    dataIndex: "unit",
    align: "center",
    width: 80,
  },
  {
    title: "出库原因",
    dataIndex: "reason",
    align: "center",
    width: 100,
  },
  {
    title: "食材用途",
    dataIndex: "useTo",
    align: "center",
    width: 100,
  },
  {
    title: "食材单价（元）",
    dataIndex: "foodPrice",
    align: "center",
    width: 150,
  },
  {
    title: "出库时间",
    dataIndex: "createDate",
    align: "center",
    width: 150,
  },
  {
    title: "备注",
    dataIndex: "notes",
    align: "center",
    width: 100,
  },
  {
    title: "操作",
    dataIndex: "operations2",
    slotName: "operations2",
    align: "center",
    width: 100,
  },
]);
// 表格数据
const fetchData = async (params?: any) => {
  setLoading(true);
  try {
    const { data } = await listDetails(params);
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
  emitForm.establishedTime = "";
  emitForm.organType = "";
  emitForm.address = "";
  emitForm.memberNum = "";
  emitForm.production = "";
  emitForm.id = "";
  emitForm.userId = "";
  isShow.value = false;
  file.value = {};
};
const isShowError = (val: any) => {
  isShow.value = val;
};

const handleBeforeOk = async (done: any) => {
  if (emitForm.uid == "") {
    delete emitForm.uid;
  }
  emitForm.id = emitForm.userId;
  delete emitForm.userId;
  if (!emitForm.quantity) {
    Message.error({
      content: "请输入食材数量",
    });
    return false;
  }
  // 增加
  try {
    setLoading(true);
    const res: any = await editorialOrganization(emitForm);
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
const confirm = async (uid: any) => {
  await confom(uid);
  fetchData({});
};

// 获取详情
const detailData: any = reactive({ data: [] });
const systemDetail = async () => {
  setLoading(true);
  try {
    const res: any = await idDetails({ userId: emitForm.userId });
    detailData.data = res.data;
    emitForm.quantity = detailData.data.quantity;
    if (!or.value) {
      emitForm.icon = detailData.data.icon;
    }
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};
// 上移下移是否置灰
const search = async () => {
  const formData = JSON.parse(JSON.stringify(form.value));
  formData.foodName = formData.foodName == "a" ? "" : formData.foodName;
  await fetchData({
    foodId: formData.foodName,
    afterDate: formData.afterDate,
    beforeDate: formData.beforeDate,
  });
};
const reset = () => {
  form.value = generateFormModel();
  search();
};
const onOk = (dateString: any, date: any) => {
  console.log("onOk: ", dateString, date);
  form.value.beforeDate = dateString[1];
  form.value.afterDate = dateString[0];
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

const file: any = ref({});
// 弹框
const visible: any = ref(false);
const fileSrc: any = ref({});
const imgFlag: any = ref(false);
</script>

<script lang="ts">
export default {
  name: "wareDetails",
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
