<template>
  <div class="container">
    <Breadcrumb :items="['查看信息','供货商管理']" />
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
                <a-form-item field="originName" label="供货商名称">
                  <a-input
                    :style="{ width: '320px' }"
                    v-model="form.originName"
                    placeholder="请输入供货商名称"
                    allow-clear
                    :max-length="100"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="16">
                <a-form-item field="legalPerson" label="代表人">
                  <a-input
                    :style="{ width: '320px' }"
                    v-model="form.legalPerson"
                    placeholder="请输入代表人"
                    allow-clear
                    :max-length="100"
                  />
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
          <a-button type="text" size="small" @click="editDetails(record.id)">
            编辑
          </a-button>
          <a-popconfirm content="确定删除吗?" type="error" @ok="del(record.id)">
            <a-button type="text" size="small" status="danger"> 删除 </a-button>
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
            field="originName"
            label="供货商名称："
            :rules="[{ required: true, message: '请输入供货商名称' }]"
          >
            <a-input
              v-model="emitForm.originName"
              @input="mychange"
              :max-length="10"
              placeholder="请输入供货商名称"
            />
          </a-form-item>
          <a-form-item
            field="establishedTime"
            label="创立时间："
          >
            <a-date-picker
              placeholder="请选择创立时间"
              v-model="emitForm.establishedTime"
              style="width: 200px"
            />
          </a-form-item>
          <a-form-item
            field="legalPerson"
            label="代表人"
            :rules="[{ required: true, message: '请输入代表人' }]"
          >
            <a-input
              v-model="emitForm.legalPerson"
              @input="mychange"
              :max-length="10"
              placeholder="请输入代表人"
            />
          </a-form-item>
          <a-form-item
            field="organType"
            label="机构类型"
          >
            <!--  <a-select
              v-model="emitForm.organType"
              placeholder="请选择机构类型"
              :options="data.slice(1)"
            >
            </a-select> -->
            <a-input
              v-model="emitForm.organType"
              @input="mychange"
              :max-length="10"
              placeholder="请输入机构类型"
            />
          </a-form-item>
          <a-form-item
            field="address"
            label="机构地址"
          >
            <a-input
              v-model="emitForm.address"
              @input="mychange"
              :max-length="10"
              placeholder="请输入机构地址"
            />
          </a-form-item>
          <a-form-item
            field="memberNum"
            label="成员规模"
          >
            <a-input-number
              v-model="emitForm.memberNum"
              @input="mychange"
              :max-length="10"
              placeholder="请输入成员规模"
            />
          </a-form-item>
          <a-form-item
            field="production"
            label="供货商介绍"
          >
            <a-input
              v-model="emitForm.production"
              @input="mychange"
              :max-length="20"
              placeholder="请输入供货商介绍"
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
import {
  editorialOrganization,
  delate,
  idDetails,
  listDetails,
} from "@/api/supplier";
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
    emitForm.originName = emitForm.originName.replace(/\s+/g, "");
  });
};
const generateFormModel = () => {
  return {
    originName: "",
    establishedTime: "",
    legalPerson: "",
    organType: "",
    address: "",
    memberNum: "",
    production: "",
  };
};

const emitForm: any = reactive({
  originName: "",
  establishedTime: "",
  legalPerson: "",
  organType: "",
  address: "",
  memberNum: "",
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
//   const userOrganId = localStorage.getItem("userOrganId");
//   const res = await getStateConstant({ organId: userOrganId });
//   res.data.forEach((item: any) => {
//     item.label = item.positionName;
//     delete item.positionName;
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
    align: "center",
    width: 30,
  },
  {
    title: "供货商名称",
    dataIndex: "originName",
    align: "center",
    width: 150,
  },
  {
    title: "创立时间",
    dataIndex: "establishedTime",
    align: "center",
    width: 120,
  },
  {
    title: "代表人",
    dataIndex: "legalPerson",
    align: "center",
    width: 160,
  },
  {
    title: "机构类型",
    dataIndex: "organType",
    align: "center",
    width: 80,
  },
  {
    title: "机构地址",
    dataIndex: "address",
    align: "center",
    width: 100,
  },
  {
    title: "成员规模",
    dataIndex: "memberNum",
    align: "center",
    width: 100,
  },
  {
    title: "供货商介绍",
    dataIndex: "production",
    align: "center",
    width: 150,
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
  // getList();
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
  emitForm.originName = "";
  emitForm.establishedTime = "";
  emitForm.legalPerson = "";
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
  if (!emitForm.originName) {
    Message.error({
      content: "请输入供货商名称",
    });
    return false;
  }
  if (!emitForm.legalPerson) {
    Message.error({
      content: "请输入代表人",
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

// 获取详情
const detailData: any = reactive({ data: [] });
const systemDetail = async () => {
  setLoading(true);
  try {
    const res: any = await idDetails({ userId: emitForm.userId });
    detailData.data = res.data;
    emitForm.originName = detailData.data.originName;
    emitForm.establishedTime = detailData.data.establishedTime;
    emitForm.legalPerson = detailData.data.legalPerson;
    emitForm.organType = detailData.data.organType;
    emitForm.address = detailData.data.address;
    emitForm.memberNum = detailData.data.memberNum;
    emitForm.production = detailData.data.production;
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
  await fetchData({
    originName: formData.originName,
    legalPerson: formData.legalPerson,
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
  name: "supplier",
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
