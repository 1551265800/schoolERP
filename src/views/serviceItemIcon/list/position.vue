<template>
  <div class="container">
    <Breadcrumb :items="['查看信息','职位管理']" />
    <a-card class="general-card" style="padding-top: 20px">
      <!--  <a-row>
        <a-col :flex="1">
          <a-form
            :model="form"
            :label-col-props="{ span: 6 }"
            :wrapper-col-props="{ span: 18 }"
            label-align="right"
            auto-label-width
          >
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item field="appName" label="姓名">
                  <a-input
                    v-model="form.loginName"
                    placeholder="请输入姓名"
                    allow-clear
                    :max-length="100"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="openStatus" label="职位">
                  <a-select
                    v-model="form.positionId"
                    :placeholder="$t('list.form.all')"
                    :options="data"
                  >
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-divider style="height: 35px" direction="vertical" />
        <a-col :flex="'86px'" style="text-align: right">
          <a-space :size="18">
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
      </a-row>
      <a-divider style="margin-top: 0" /> -->
      <a-row style="margin-bottom: 16px">
        <a-col class="addbusiness">
          <a-space>
            <a-button type="primary" @click="addNew()">
              <icon-plus />
              新增
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
        <!--   <template #index="{ rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.size }}
        </template> -->

        <!-- <template #accountStatus="{ record }">
          <span v-if="record.accountStatus === '已注销'" class="circle"></span>
          <span v-else class="circle pass"></span>
          {{ record.accountStatus }}
        </template> -->
        <!-- <template #icon="{ record }">
          <img :src="record.icon" alt="" style="width: 50px; height: 50px" />
        </template> -->
        <!-- <template #openStatus="{ record }">
          <template v-if="record.status == 0"> 启用 </template>
          <template v-else> 禁用 </template>
        </template> -->

        <template #operations="{ record, rowIndex }">
          <a-button type="text" size="small" @click="editDetails(record.id)">
            编辑
          </a-button>
          <a-popconfirm content="确定删除吗?" type="error" @ok="del(record.id)">
            <a-button
              type="text"
              size="small"
              status="danger"
            >
              删除
            </a-button>
          </a-popconfirm>
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
            field="positionName"
            label="职位名称："
            :rules="[{ required: true, message: '请输入职位名称' }]"
          >
            <a-input
              v-model="emitForm.positionName"
              @input="mychange"
              :max-length="10"
              placeholder="请输入职位名称"
            />
          </a-form-item>
          <a-form-item
            field="positionWork"
            label="职责描述："
            :rules="[{ required: true, message: '请输入职责描述' }]"
          >
            <a-input
              v-model="emitForm.positionWork"
              @input="mychange"
              :max-length="10"
              placeholder="请输入职责描述"
            />
          </a-form-item>
          <a-form-item
            field="production"
            label="职位介绍："
            :rules="[{ required: true, message: '请输入职位介绍' }]"
          >
            <a-input
              v-model="emitForm.production"
              @input="mychange"
              :max-length="10"
              placeholder="请输入职位介绍"
            />
          </a-form-item>
        </a-form>
      </a-modal>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, reactive, watch, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import useLoading from "@/hooks/loading";
import { getStateConstant } from "@/api/icon";
import { editorship, delate, idDetails } from "@/api/position";
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
    emitForm.positionName = emitForm.positionName.replace(/\s+/g, "");
    emitForm.positionWork = emitForm.positionWork.replace(/\s+/g, "");
    emitForm.production = emitForm.production.replace(/\s+/g, "");
  });
};
const generateFormModel = () => {
  return {
    positionName: "",
    positionWork: "",
    production: "",
  };
};

const emitForm: any = reactive({
  positionName: "",
  positionWork: "",
  production: "",
});

const { loading, setLoading } = useLoading(true);
const renderData: any = ref([]);
const form = ref(generateFormModel());
const cloneColumns = ref<Column[]>([]);
const showColumns = ref<Column[]>([]);
const size = ref<SizeProps>("medium");

// 获取职位
const data = ref();
// const getList = async () => {
//   const res = await getStateConstant();
//   res.data.forEach((item: any) => {
//     item.label = item.name;
//     delete item.name;
//     item.value = item.id;
//     delete item.id;
//   });
//   data.value = res.data;
//   data.value.unshift({
//     value: "a",
//     label: "全部",
//   });
// };
const columns = computed<TableColumnData[]>(() => [
  {
    title: "序号",
    dataIndex: "id",
    // render: ({ rowIndex }) => rowIndex + 1,
    align: "center",
    width: 30,
  },
  {
    title: "职位名称",
    dataIndex: "positionName",
    align: "center",
    width: 150,
  },
  // {
  //   title: "职位",
  //   dataIndex: "positionId",
  //   align: "center",
  //   width: 120,
  // },
  {
    title: "职责描述",
    dataIndex: "positionWork",
    align: "center",
    width: 160,
  },
  {
    title: "职位介绍",
    dataIndex: "production",
    align: "center",
    width: 160,
  },
  // {
  //   title: "性别",
  //   dataIndex: "gender",
  //   slotName: "openStatus",
  //   align: "center",
  //   width: 80,
  // },
  {
    title: "操作",
    dataIndex: "operations",
    slotName: "operations",
    align: "center",
    width: 260,
  },
]);
// 表格数据
const fetchData = async (params?: any) => {
  setLoading(true);
  try {
    const { data } = await getStateConstant(params);
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
  fetchData({ organId: localStorage.getItem("userOrganId") });
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
  emitForm.positionName = "";
  emitForm.positionWork = "";
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
  // if (emitForm.uid == "") {
  //   delete emitForm.uid;
  // }
  emitForm.id = emitForm.userId;
  emitForm.organId = localStorage.getItem("userOrganId");
  delete emitForm.userId;
  if (!emitForm.positionName) {
    Message.error({
      content: "请输入职位名称",
    });
    return false;
  }
  if (!emitForm.positionWork) {
    Message.error({
      content: "请输入职责描述",
    });
    return false;
  }
  if (!emitForm.production) {
    Message.error({
      content: "请输入职位介绍",
    });
    return false;
  }
  // 增加
  try {
    setLoading(true);
    const res: any = await editorship(emitForm);
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
  fetchData({ organId: localStorage.getItem("userOrganId") });
};

// 获取详情
const detailData: any = reactive({ data: [] });
const systemDetail = async () => {
  setLoading(true);
  try {
    const res: any = await idDetails({ userId: emitForm.userId });
    detailData.data = res.data;
    emitForm.positionName = detailData.data.positionName;
    emitForm.positionWork = detailData.data.positionWork;
    emitForm.production = detailData.data.production;
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};
// 查找
const search = async () => {
  // const formData = JSON.parse(JSON.stringify(form.value));
  // formData.positionId = formData.positionId == "a" ? "" : formData.positionId;
  await fetchData({
    // loginName: formData.loginName,
    // positionId: formData.positionId,
    organId: localStorage.getItem("userOrganId"),
  });
};
const reset = () => {
  form.value = generateFormModel();
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

const file: any = ref({});
// 弹框
const visible: any = ref(false);
const fileSrc: any = ref({});
const imgFlag: any = ref(false);
</script>

<script lang="ts">
export default {
  name: "position",
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
