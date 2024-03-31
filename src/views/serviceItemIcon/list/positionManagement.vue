<template>
  <div class="container">
    <Breadcrumb :items="['查看信息', '职责管理']" />
    <a-card class="general-card" style="padding-top: 20px">
      <a-row>
        <a-col :flex="1">
          <a-form :model="form" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }" label-align="right"
            auto-label-width>
            <a-row :gutter="16">
              <a-col :span="16">
                <a-form-item field="appName" label="执行人">
                  <a-input :style="{ width: '320px' }" v-model="form.executorId" placeholder="请输入执行人" allow-clear
                    :max-length="100" />
                </a-form-item>
              </a-col>
              <a-col :span="16">
                <a-form-item field="school" label="组织">
                  <a-select :style="{ width: '320px' }" v-model="form.school" placeholder="全部" :options="data2"
                    style="position: relative; " @change="search" />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
          <a-col :flex="'86px'" style="text-align: left">
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
        </a-col>
      </a-row>
      <a-divider style="margin-top: 20px" />
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
      <a-table row-key="id" :loading="loading" :columns="(cloneColumns as TableColumnData[])" :data="renderData"
        :bordered="{ cell: true }" :size="size" :pagination="true">
        <template #operations="{ record, rowIndex }">
          <a-button type="text" size="small" @click="editDetails(record.id)">
            编辑
          </a-button>
          <a-popconfirm content="确定删除吗?" type="error" @ok="del(record.id)">
            <a-button type="text" size="small" status="danger"> 删除 </a-button>
          </a-popconfirm>
        </template>
        <template #isExecuted="{ record, rowIndex }">
          <a-switch v-model="record.isExecuted" @change="(val) => { changeSwitch(val, record.id) }" />
        </template>
      </a-table>
      <a-modal v-model:visible="isShow" :title="or ? '新增' : '编辑'" @cancel="myClose" @before-ok="handleBeforeOk"
        unmount-on-close>
        <a-form :model="emitForm" auto-label-width>
          <a-form-item field="executorId" label="执行人：" :rules="[{ required: true, message: '请选择执行人' }]">
            <a-select v-model="emitForm.executorId" placeholder="请选择执行人" :options="data.slice(1)">
            </a-select>
          </a-form-item>
          <a-form-item field="respName" label="职责：" :rules="[{ required: true, message: '请输入职责名称' }]">
            <a-input v-model="emitForm.respName" @input="mychange" :max-length="10" placeholder="请输入职责" />
          </a-form-item>
          <a-form-item field="organizationId" label="组织名称：" :rules="[{ required: true, message: '请输入组织名称' }]">
            <a-select v-model="emitForm.organizationId" placeholder="请选择组织名称" :options="data2.slice(1)">
            </a-select>
          </a-form-item>
          <a-form-item field="managerId" label="验收人：" :rules="[{ required: true, message: '请选择验收人' }]">
            <a-select v-model="emitForm.managerId" placeholder="请选择验收人" :options="data.slice(1)">
            </a-select>
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
  listOfResponsibilities,
  listDetails,
  delatePos,
  newResponsibilities,
  getResponsibilityById,
} from "@/api/icon";
import {
  listSchool
} from "@/api/advancePurchaseOrder";
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
    emitForm.executorId = emitForm.executorId.replace(/\s+/g, "");
  });
};
const generateFormModel = () => {
  return {
    executorId: "",
    respName: "",
    school: "",
    organizationId: "",
    managerId: "",
  };
};

const emitForm: any = reactive({
  executorId: "",
  respName: "",
  organizationId: "",
  managerId: "",
});

const { loading, setLoading } = useLoading(true);
const renderData: any = ref([]);
const form = ref(generateFormModel());
const cloneColumns = ref<Column[]>([]);
const showColumns = ref<Column[]>([]);
const size = ref<SizeProps>("medium");

// 获取职位
const data = ref();
const data2 = ref();
const getList = async () => {
  const userOrganId = localStorage.getItem("userOrganId");
  const res = await listDetails({ organId: userOrganId });
  res.data.forEach((item: any) => {
    item.label = item.loginName;
    delete item.loginName;
    item.value = item.id;
    delete item.id;
  });
  data.value = res.data;
  data.value.unshift({
    value: "a",
    label: "全部",
  });

  const res2 = await listSchool();
  res2.data.forEach((item: any) => {
    item.label = item.organName;
    item.value = item.id;
  });
  data2.value = res2.data;
  data2.value.unshift({
    value: "a",
    label: "全部",
  });
  // form.value.school = res2.data[0].id;
};
const columns = computed<TableColumnData[]>(() => [
  // {
  //   title: "序号",
  //   dataIndex: "id",
  //   // render: ({ rowIndex }) => rowIndex + 1,
  //   align: "center",
  // },
  {
    title: "职责名称",
    dataIndex: "respName",
    align: "center",
    width: 120,
  },
  {
    title: "组织名称",
    dataIndex: "organName",
    align: "center",
    width: 120,
  },
  {
    title: "执行人",
    dataIndex: "executorName",
    align: "center",
    width: 150,
  },
  {
    title: "验收人",
    dataIndex: "managerName",
    align: "center",
    width: 120,
  },
  {
    title: "修改人",
    dataIndex: "modifiedBy",
    align: "center",
    width: 120,
  },
  {
    title: "开启状态",
    dataIndex: "isExecuted",
    slotName: "isExecuted",
    align: "center",
    width: 120,
  },
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
    const { data } = await listOfResponsibilities(params);
    console.log(data);

    if (data.length == 0) {
      renderData.value = data;
      return;
    }
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
  emitForm.executorId = "";
  emitForm.respName = "";
  emitForm.organizationId = "";
  emitForm.managerId = "";
  emitForm.id = "";
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
  if (!emitForm.executorId) {
    Message.error({
      content: "请输入执行人",
    });
    return false;
  }
  if (!emitForm.respName) {
    Message.error({
      content: "请输入职责名称",
    });
    return false;
  }
  if (!emitForm.organizationId) {
    Message.error({
      content: "请选择组织名称",
    });
    return false;
  }
  // 增加
  try {
    setLoading(true);
    // emitForm.modifiedBy
    const res = await newResponsibilities(emitForm);
    if (res.mag) {
      Message.success({
        content: res.mag,
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
      }, 200);
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
  emitForm.id = uid;
  await systemDetail();
  isShow.value = true;
};
const del = async (uid: any) => {
  await delatePos(uid);
  fetchData({});
};

// 获取详情
const detailData: any = reactive({ data: [] });
const systemDetail = async () => {
  setLoading(true);
  try {
    const res: any = await getResponsibilityById({ id: emitForm.id });
    detailData.data = res.data;
    emitForm.executorId = detailData.data.executorId;
    emitForm.organizationId = detailData.data.organId;
    emitForm.managerId = detailData.data.managerId;
    emitForm.respName = detailData.data.respName;
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
  formData.school = formData.school == "a" ? "" : formData.school;
  await fetchData({
    executorName: formData.executorId,
    organizationId: formData.school,
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

const changeSwitch = async (val: any, id: any) => {
  console.log(val);
  try {
    setLoading(true);
    // emitForm.modifiedBy
    const res = await newResponsibilities({
      id: id,
      isExecuted: val
    });
    if (res.mag) {
      Message.success({
        content: res.mag,
      });
    } else {
      Message.success({
        content: "操作成功",
      });
    }
    await search();
    setLoading(false);
  } catch (error) {
    setLoading(false);
    return false;
  }

}
</script>

<script lang="ts">
export default {
  name: "positionManagement",
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
