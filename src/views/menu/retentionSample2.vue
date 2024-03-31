<template>
  <div class="container">
    <a-modal v-model:visible="takeVis" hide-cancel>
      <a-col class="addbusiness">
        <iframe id="myiframe" src="http://erp.yiyue.dongkai.dongyingnews.cn/take.html" width="100%" height="100%"
          frameborder="0"></iframe>
      </a-col>
    </a-modal>
    <Breadcrumb :items="['菜品管理', '菜品留样']"  class="mytable"/>
    <a-card class="general-card" style="padding-top: 20px">
      <div class="small2">
        <a-row>
          <a-col :flex="1">
            <a-form :model="form" :label-col-props="{ span: 8 }" :wrapper-col-props="{ span: 18 }" label-align="right"
              auto-label-width>
              <a-row :gutter="16">
                <a-col :span="16">
                  <a-form-item field="mealName" label="菜品名称">
                    <!-- <a-select
                    v-model="form.mealName"
                    placeholder="请选择菜品名称"
                    :options="data"
                    style="width: 250px"
                  ></a-select> -->
                    <a-input v-model="form.mealName" placeholder="请输入菜品名称" style="width: 250px"></a-input>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="16">
                <a-col :span="16">
                  <a-form-item field="time" label="出库时间">
                    <a-date-picker v-model="form.time" style="width: 350px" format="YYYY-MM-DD" />
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
      </div>
      <a-table row-key="id" :loading="loading" :columns="(cloneColumns as TableColumnData[])" :data="renderData"
        :bordered="{ cell: true }" :size="size" :pagination="true">
        <template #useStatus="{ record, rowIndex }">
          <view v-if="record.useStatus == '未确认'">
            <icon-close-circle-fill :size="15" style="color: #fe163e" />未确认
          </view>
          <view v-else>
            <icon-check-circle-fill :size="15" style="color: #00b42a" />已确认
          </view>
          <a-button type="text" size="small" @click="myCG(record)">
            状态修改
          </a-button>
        </template>
        <template #operations="{ record, rowIndex }">
          <!-- <a-button type="text" size="small" @click="editDetails(record.id)">
            编辑
          </a-button> -->
          <!-- <a-button type="primary" size="small" @click="take(record)">
            生成留样
          </a-button> -->
          <br>
          <a-button type="text" size="small" @click="deliveryFromStorage(record)">
            编辑
          </a-button>
          <a-popconfirm content="确定删除吗?" type="error" @ok="del(record.id)">
            <a-button type="text" size="small" status="danger"> 删除 </a-button>
          </a-popconfirm>
        </template>
        <template #pictureAddress="{ record, rowIndex }">
          <div class="small1">
            {{ record.mealName }}
          </div>
          <a-image :src="record.pictureAddress" width="160" />
        </template>
      </a-table>
      <a-modal v-model:visible="isShow" :title="or ? '新增' : '编辑'" @cancel="myClose" @before-ok="handleBeforeOk"
        unmount-on-close set>
        <a-form :model="emitForm" auto-label-width>
          <a-form-item field="mealName" label="食材名称" :rules="[{ required: true, message: ' ' }]">
            <a-input v-model="emitForm.mealName" @input="mychange" :max-length="10" placeholder="请输入食材名称" />
          </a-form-item>
          <a-form-item field="pictureAddress" label="留样图片：" :rules="[{ required: true, message: ' ' }]">
            <a-space direction="vertical" :style="{ width: '100%' }">
              <a-upload v-model="emitForm2.pictureAddress" :fileList="file ? [file] : []" :show-file-list="false"
                @change="onChange" @progress="onProgress" :custom-request="customRequest">
                <template #upload-button>
                  <div :class="`arco-upload-list-item${file && file.status === 'error'
                      ? ' arco-upload-list-item-error'
                      : ''
                    }`">
                    <div class="arco-upload-list-picture custom-upload-avatar"
                      v-if="(file && file.url) || emitForm2.pictureAddress">
                      <img :src="emitForm2.pictureAddress" />
                      <div class="arco-upload-list-picture-mask">
                        <IconEdit />
                      </div>
                      <a-progress v-if="file.status === 'uploading' && file.percent < 100" :percent="file.percent"
                        type="circle" size="mini" :style="{
                          position: 'absolute',
                          left: '50%',
                          top: '50%',
                          transform: 'translateX(-50%) translateY(-50%)',
                        }" />
                    </div>
                    <div class="arco-upload-picture-card" v-else>
                      <div class="arco-upload-picture-card-text">
                        <IconPlus />
                        <div style="margin-top: 10px; font-weight: 600">
                          上传
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </a-upload>
            </a-space>
          </a-form-item>
          <a-form-item field="quantity" label="留样量(g)" :rules="[{ required: true, message: '请输入留样量' }]">
            <a-input-number v-model="emitForm.quantity" @input="mychange" :max-length="10" placeholder="请输入留样量" />
          </a-form-item>
          <a-form-item field="chef" label="厨师" :rules="[{ required: false, message: ' ' }]">
            <a-input v-model="emitForm.chef" @input="mychange" :max-length="10" placeholder="请输入厨师" />
          </a-form-item>
          <a-form-item field="operator" label="操作人" :rules="[{ required: false, message: ' ' }]">
            <a-input v-model="emitForm.operator" @input="mychange" :max-length="10" placeholder="请输入操作人" />
          </a-form-item>
        </a-form>
      </a-modal>
      <a-modal v-model:visible="isShow2" title="编辑" @cancel="myClose2" @before-ok="handleBeforeOk2" unmount-on-close width="320px">
        <a-form :model="emitForm2" auto-label-width>
          <a-form-item field="quantity" label="留样量(g)" :rules="[{ required: true, message: ' ' }]">
            <a-input-number v-model="emitForm2.quantity" @input="mychange" :max-length="10" placeholder="请输入留样量" />
          </a-form-item>
          <a-form-item field="pictureAddress" label="留样图片：" :rules="[{ required: true, message: ' ' }]">
            <a-space direction="vertical" :style="{ width: '100%' }">
              <a-upload v-model="emitForm2.pictureAddress" :fileList="file ? [file] : []" :show-file-list="false"
                @change="onChange" @progress="onProgress" :custom-request="customRequest">
                <template #upload-button>
                  <div :class="`arco-upload-list-item${file && file.status === 'error'
                      ? ' arco-upload-list-item-error'
                      : ''
                    }`">
                    <div class="arco-upload-list-picture custom-upload-avatar"
                      v-if="(file && file.url) || emitForm2.pictureAddress">
                      <img :src="emitForm2.pictureAddress" />
                      <div class="arco-upload-list-picture-mask">
                        <IconEdit />
                      </div>
                      <a-progress v-if="file.status === 'uploading' && file.percent < 100" :percent="file.percent"
                        type="circle" size="mini" :style="{
                          position: 'absolute',
                          left: '50%',
                          top: '50%',
                          transform: 'translateX(-50%) translateY(-50%)',
                        }" />
                    </div>
                    <div class="arco-upload-picture-card" v-else>
                      <div class="arco-upload-picture-card-text">
                        <IconPlus />
                        <div style="margin-top: 10px; font-weight: 600">
                          上传
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </a-upload>
            </a-space>
          </a-form-item>
          <a-form-item field="chef" label="厨师" :rules="[{ required: false, message: ' ' }]">
            <a-input v-model="emitForm2.chef" @input="mychange" :max-length="10" placeholder="请输入厨师" />
          </a-form-item>
          <a-form-item field="operator" label="操作人" :rules="[{ required: false, message: ' ' }]">
            <a-input v-model="emitForm2.operator" @input="mychange" :max-length="10" placeholder="请输入操作人" />
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
  edit,
  delate,
  idDetails,
  listDetails,
  goodlistDetails,
  supplierDetails,
} from "@/api/retentionSample";
import { putPic } from "@/api/goods";
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
  // nextTick(() => {
  //   emitForm.mealName = emitForm.mealName.replace(/\s+/g, "");
  // });
};
const generateFormModel = () => {
  return {
    mealName: "",
    quantity: "",
    notes: "",
    time: "",
    originName: "",
    pictureAddress: "",
  };
};

const emitForm: any = reactive({
  mealName: "",
  quantity: "",
  notes: "",
});
const emitForm2: any = reactive({
  mealName: "",
  quantity: "",
});

const { loading, setLoading } = useLoading(true);
const renderData: any = ref([]);
const form: any = ref(generateFormModel());
const cloneColumns = ref<Column[]>([]);
const showColumns = ref<Column[]>([]);
const size = ref<SizeProps>("medium");

// 获取职位
const data = ref();
const data2 = ref();
const takeVis = ref(false);
const getList = async () => {
  const res = await goodlistDetails();
  res.data.forEach((item: any) => {
    item.label = item.mealName;
    delete item.mealName;
    item.value = item.id;
    delete item.id;
  });
  const res2 = await supplierDetails();
  res2.data.forEach((item: any) => {
    item.label = item.originName;
    item.value = item.originName;
  });
  data.value = res.data;
  data2.value = res2.data;
  data.value.unshift({
    value: "a",
    label: "全部",
  });
};

const columns = computed<TableColumnData[]>(() => [
  {
    title: "操作",
    dataIndex: "operations",
    slotName: "operations",
    align: "center",
    width: 10,
  },
  {
    title: "留样内容",
    dataIndex: "pictureAddress",
    slotName: "pictureAddress",
    align: "center",
  },
  {
    title: "确认状态",
    dataIndex: "useStatus",
    slotName: "useStatus",
    align: "center",
    width: 80,
  },
  {
    title: "菜品名称",
    dataIndex: "mealName",
    align: "center",
    width: 100,
  },
  {
    title: "厨师",
    dataIndex: "chef",
    align: "center",
    width: 100,
  },
  {
    title: "操作人",
    dataIndex: "operator",
    align: "center",
    width: 80,
  },
  {
    title: "留样量(g)",
    dataIndex: "quantity",
    align: "center",
    width: 100,
  },
  {
    title: "时间",
    dataIndex: "useDate",
    align: "center",
    width: 120,
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
onMounted(() => {
  // getList();
  search();
});
// 新增业务
const isShow = ref(false);
const isShow2 = ref(false);
const addNew = () => {
  or.value = true;
  isShow.value = true;
};
const addShow = (val: any) => {
  isShow.value = val;
};
const myClose = () => {
  emitForm.mealName = "";
  emitForm.pictureAddress = "";
  emitForm.quantity = "";
  emitForm.useTo = "";
  emitForm.notes = "";
  emitForm.id = "";
  emitForm.userId = "";
  emitForm2.pictureAddress = "";
  emitForm.chef = "";
  emitForm.operator = "";
  isShow.value = false;
  isShow2.value = false;
  file.value = {};
};
const myClose2 = () => {
  emitForm2.quantity = "";
  emitForm2.pictureAddress = "";
  emitForm2.chef = "";
  emitForm2.operator = "";
  isShow2.value = false;
};
const isShowError = (val: any) => {
  isShow.value = val;
};

const handleBeforeOk = async (done: any) => {
  if (!emitForm.mealName) {
    Message.error({
      content: "请输入菜品名称",
    });
    return false;
  }
  if (!emitForm.pictureAddress) {
    Message.error({
      content: "请选择图片",
    });
    return false;
  }
  if (!emitForm.quantity) {
    Message.error({
      content: "请输入留样量",
    });
    return false;
  }
  // if (!emitForm.chef) {
  //   Message.error({
  //     content: "请输入厨师",
  //   });
  //   return false;
  // }
  // if (!emitForm.operator) {
  //   Message.error({
  //     content: "请输入操作人",
  //   });
  //   return false;
  // }
  if (emitForm.mealName != "a") {
    emitForm.mealName = emitForm.mealName;
  }
  emitForm.inspector = localStorage.getItem("username");
  // delete emitForm.mealName;
  // 增加

  try {
    setLoading(true);
    const res: any = await edit(emitForm);
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
const handleBeforeOk2 = async (done: any) => {
  delete emitForm2.mealName;
  if (!emitForm2.pictureAddress) {
    Message.error({
      content: "请选择图片",
    });
    return false;
  }
  if (!emitForm2.quantity) {
    Message.error({
      content: "请输入留样量",
    });
    return false;
  }
  // if (!emitForm2.chef) {
  //   Message.error({
  //     content: "请输入厨师",
  //   });
  //   return false;
  // }
  // if (!emitForm2.operator) {
  //   Message.error({
  //     content: "请输入操作人",
  //   });
  //   return false;
  // }

  console.log("编辑");
  try {
    setLoading(true);
    const res: any = await edit(emitForm2);
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
  search();
};

// 获取详情
const detailData: any = reactive({ data: [] });
const systemDetail = async () => {
  setLoading(true);
  try {
    const res: any = await idDetails({ userId: emitForm.userId });
    detailData.data = res.data;
    // emitForm.mealName = detailData.data.mealName;
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};
const search = async () => {
  const formData = JSON.parse(JSON.stringify(form.value));
  formData.foodId = formData.foodId == "a" ? "" : formData.foodId;
  await fetchData({
    mealName: formData.mealName,
    useDate: formData.time,
  });
};
const reset = () => {
  form.value = generateFormModel();
  search();
};
const deliveryFromStorage = async (info: any) => {
  isShow2.value = true;
  let newObj = Object.fromEntries(
    Object.entries(info).filter(([key, value]) => value != "-")
  );
  emitForm2.pictureAddress = newObj.pictureAddress;
  emitForm2.quantity = newObj.quantity;
  emitForm2.chef = newObj.chef;
  emitForm2.operator = newObj.operator;
  emitForm2.id = newObj.id;
};
const take = async (info: any) => {
  takeVis.value = !takeVis.value;
  var iframe: any = document.getElementById("myiframe");
  iframe.contentWindow.postMessage(
    "https://mkyp.oss-cn-shanghai.aliyuncs.com/zhdc_meal_image/2023/12/03/34f1b8d8-af76-4b4b-b65a-b10656b3aafb.png",
    "*"
  );
  setTimeout(() => {
    takeVis.value = false;
  }, 500);
  // window.android.printNetPic(
  //   "https://mkyp.oss-cn-shanghai.aliyuncs.com/zhdc_meal_image/2023/12/03/f284defc-390a-4418-bc6a-4d1fca3c68f0.png"
  // );
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
const onChange: any = (_: any, currentFile: any) => {
  file.value = {
    ...currentFile,
    // url: URL.createObjectURL(currentFile.file),
  };
};
const onProgress = (currentFile: any) => {
  file.value = currentFile;
};

const customRequest: any = (option: any, item: any) => {
  const { onError, onSuccess, fileItem } = option;
  const formData = new FormData();
  const id: any = router.currentRoute.value.query.id;
  formData.append("file", fileItem.file);

  putPic(formData)
    .then((res: any) => {
      onSuccess(res);
      // 上传图片成功
      console.log(res.message);
      emitForm.pictureAddress = res.message;
      emitForm2.pictureAddress = res.message;
    })
    .catch((err: any) => {
      onError();
    });
};

const myCG = async (id: any) => {
  try {
    setLoading(true);
    if (id.useStatus == "未确认") {
      id.useStatus = "已确认";
    } else {
      id.useStatus = "未确认";
    }
    let newObj = Object.fromEntries(
      Object.entries(id).filter(([key, value]) => value != "-")
    );
    const res: any = await edit(newObj);
    if (res.msg) {
      Message.success({
        content: res.msg,
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
};
</script>
<script lang="ts">
export default {
  name: "retentionSample2",
};
</script>

<style scoped lang="less">
@media (max-width: 480px) {
  .small2 {
    display: none;
  }
}

@media (min-width: 481px) {
  .small1 {
    display: none;
  }
}

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
