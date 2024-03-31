<template>
  <div class="container">
    <Breadcrumb :items="['查看信息', '人员管理']" />
    <a-card class="general-card" style="padding-top: 20px">
      <a-row>
        <a-col :flex="1">
          <a-form :model="form" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }" label-align="right"
            auto-label-width>
            <a-row :gutter="16">
              <a-col :span="16">
                <a-form-item field="appName" label="姓名">
                  <a-input :style="{ width: '320px' }" v-model="form.loginName" placeholder="请输入姓名" allow-clear
                    :max-length="100" />
                </a-form-item>
              </a-col>
              <a-col :span="16">
                <a-form-item field="openStatus" label="职位">
                  <a-select :style="{ width: '320px' }" v-model="form.positionId" :placeholder="$t('list.form.all')"
                    :options="data">
                  </a-select>
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
            <a-button type="text" size="small" status="danger"> 删除 </a-button>
          </a-popconfirm>
        </template>
      </a-table>
      <a-modal v-model:visible="isShow" :title="or ? '新增' : '编辑'" @cancel="myClose" @before-ok="handleBeforeOk"
        unmount-on-close>
        <a-form :model="emitForm" auto-label-width>
          <a-form-item field="loginName" label="姓名：" :rules="[{ required: true, message: '请输入姓名' }]">
            <a-input v-model="emitForm.loginName" @input="mychange" :max-length="10" placeholder="请输入姓名" />
          </a-form-item>
          <a-form-item field="positionId" label="职位：" :rules="[{ required: true, message: '请输入职位' }]">
            <a-select v-model="emitForm.positionId" placeholder="请选择职位" :options="data.slice(1)">
            </a-select>
          </a-form-item>
          <a-form-item field="organizationId" label="组织名称：" :rules="[{ required: true, message: '请输入组织名称' }]">
            <a-select v-model="emitForm.organizationId" placeholder="请选择组织名称" :options="data2.slice(1)">
            </a-select>
          </a-form-item>
          <a-form-item field="birthday" label="出生日期：" :rules="[{ required: true, message: '请选择出生日期' }]">
            <a-date-picker placeholder="请选择出生日期" v-model="emitForm.birthday" style="width: 200px" />
          </a-form-item>

          <a-form-item field="entryTime" label="入职日期：" :rules="[{ required: true, message: '请选择入职日期' }]">
            <a-date-picker placeholder="请选择入职日期" v-model="emitForm.entryTime" style="width: 200px" />
          </a-form-item>

          <a-form-item field="gender" label="性别：" :rules="[{ required: true, message: '请选择性别' }]">
            <a-radio-group v-model="emitForm.gender">
              <a-radio value="男">男</a-radio>
              <a-radio value="女">女</a-radio>
            </a-radio-group>
          </a-form-item>
          <!-- {{ emitForm.respStrArray }} -->

          <a-form-item field="respStrArray" label="职责：">
            <!-- <a-input-tag :style="{ width: '320px' }" placeholder="按回车输入" allow-clear v-model="emitForm.respStrArray" /> -->
            <a-select  :style="{ width: '360px' }" placeholder="请选择职责" multiple
              scrollbar="true" :options="data3" v-model="emitForm.respStrArray">

            </a-select>
          </a-form-item>
          <!-- <a-form-item>
            <div style="font-size: 13px; color: rgb(110, 110, 110); user-select: none;">
              职责输入请按回车键!
            </div>
          </a-form-item> -->
        </a-form>
      </a-modal>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, reactive, watch, onMounted } from "vue";
import useLoading from "@/hooks/loading";
import {
  listDetails,
  getStateConstant,
  delate,
  iconAdd,
  idDetails,
  listOfResponsibilities2
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
    emitForm.loginName = emitForm.loginName.replace(/\s+/g, "");
  });
};
const generateFormModel = () => {
  return {
    loginName: "",
    positionId: "",
    birthday: "",
    entryTime: "",
    id: "",
    gender: "",
    respStrArray: "",
    school: ""
  };
};

const emitForm: any = reactive({
  loginName: "",
  positionId: "",
  birthday: "",
  organizationId: "",
  entryTime: "",
  id: "",
  userId:"",
  gender: "",
  respStrArray: "",
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
const data3 = ref();
const getList = async () => {
  const userOrganId = localStorage.getItem("userOrganId");
  const res = await getStateConstant({ organId: userOrganId });
  res.data.forEach((item: any) => {
    item.label = item.positionName;
    delete item.positionName;
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
  const res3 = await listOfResponsibilities2({});
  res3.data.forEach((item: any) => {
    item.label = item.respName;
    item.value = item.respName;
  });
  data3.value = res3.data;
};
const columns = computed<TableColumnData[]>(() => [
  // {
  //   title: "序号",
  //   dataIndex: "id",
  //   // render: ({ rowIndex }) => rowIndex + 1,
  //   align: "center",
  //   width: 30,
  // },
  {
    title: "姓名",
    dataIndex: "loginName",
    align: "center",
    width: 150,
  },
  {
    title: "职位",
    dataIndex: "positionName",
    align: "center",
    width: 120,
  },
  {
    title: "出生日期",
    dataIndex: "birthday",
    align: "center",
    width: 160,
  },
  {
    title: "入职时间",
    dataIndex: "entryTime",
    align: "center",
    width: 160,
  },
  {
    title: "性别",
    dataIndex: "gender",
    slotName: "openStatus",
    align: "center",
    width: 80,
  },
  {
    title: "组织名称",
    dataIndex: "organizationName",
    align: "center",
    width: 80,
  },
  // {
  //   title: "职责名称",
  //   dataIndex: "respStrArray",
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
  emitForm.loginName = "";
  emitForm.positionId = "";
  emitForm.organizationId = "";
  emitForm.birthday = "";
  emitForm.entryTime = "";
  emitForm.gender = "";
  emitForm.respStrArray = "";
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
  if (!emitForm.loginName) {
    Message.error({
      content: "请输入姓名",
    });
    return false;
  }
  if (!emitForm.positionId) {
    Message.error({
      content: "请选择职位",
    });
    return false;
  }
  if (!emitForm.organizationId) {
    Message.error({
      content: "请选择组织名称",
    });
    return false;
  }
  if (!emitForm.birthday) {
    Message.error({
      content: "请选择出生日期",
    });
    return false;
  }
  if (!emitForm.entryTime) {
    Message.error({
      content: "请选择入职日期",
    });
    return false;
  }
  if (!emitForm.gender) {
    Message.error({
      content: "请选择性别",
    });
    return false;
  }
  // 增加
  try {
    setLoading(true);
    const res = await iconAdd(emitForm);
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
  emitForm.id = uid;
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
    const res: any = await idDetails({ id: emitForm.id });
    detailData.data = res.data;
    if (detailData.positionId != 0) {
      emitForm.positionId = detailData.data.positionId;
    }
    emitForm.organizationId = detailData.data.organizationId;
    emitForm.respStrArray = detailData.data.respStrArray;
    emitForm.loginName = detailData.data.loginName;
    emitForm.birthday = detailData.data.birthday;
    emitForm.entryTime = detailData.data.entryTime;
    emitForm.gender = detailData.data.gender;
    emitForm.userId = detailData.data.userId;
    // emitForm.respStrArray = detailData.data.respStrArray;
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
  formData.positionId = formData.positionId == "a" ? "" : formData.positionId;
  formData.school = formData.school == "a" ? "" : formData.school;
  await fetchData({
    loginName: formData.loginName,
    positionId: formData.positionId,
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
</script>

<script lang="ts">
export default {
  name: "informationManagement",
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
