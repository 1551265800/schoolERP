<template>
  <div class="container">
    <Breadcrumb :items="['菜品管理', '菜品详情']" />
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
                  <a-input
                    :style="{ width: '320px' }"
                    v-model="form.mealName"
                    placeholder="请输入菜品名称"
                    allow-clear
                    :max-length="100"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="16">
                <a-form-item field="mealType" label="菜品类型">
                  <a-select
                    :style="{ width: '320px' }"
                    :options="typeData"
                    v-model="form.mealType"
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
            type="primary"
            @click="check(record)"
            v-if="record.haveOrdered == '-'"
          >
            确认点餐
          </a-button>
          <a-button
            type="primary"
            @click="delOrder(record)"
            status="warning"
            v-else
          >
            取消点餐
          </a-button>
        </template>
        <template #operations2="{ record, rowIndex }">
          <a-button type="text" size="small" @click="editDetails(record.id)">
            编辑
          </a-button>
          <a-popconfirm content="确定删除吗?" type="error" @ok="del(record.id)">
            <a-button type="text" size="small" status="danger"> 删除 </a-button>
          </a-popconfirm>
        </template>
        <template #pictureAddress="{ record, rowIndex }">
          <a-image :src="record.pictureAddress" width="160" />
        </template>
        <template #foodQuantityList="{ record, rowIndex }">
          <div v-for="food in record.foodQuantityList" :key="food.id">
            {{ food.foodName }}
          </div>
        </template>
        <template #haveOrdered="{ record, rowIndex }">
          <view v-if="record.haveOrdered == '-'"
            ><icon-close-circle-fill :size="15" style="color: #fe163e" />未点餐
          </view>
          <view v-else>
            <icon-check-circle-fill :size="15" style="color: #00b42a" />已点餐
          </view>
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
          <a-form-item
            field="mealName"
            label="菜品名称："
            :rules="[{ required: true, message: '请输入菜品名称' }]"
          >
            <a-input
              v-model="emitForm.mealName"
              @input="mychange"
              :max-length="10"
              placeholder="请输入菜品名称"
            />
          </a-form-item>
          <a-form-item
            field="pictureAddress"
            label="菜品图片："
            :rules="[{ required: true, message: ' ' }]"
          >
            <a-space direction="vertical" :style="{ width: '100%' }">
              <a-upload
                v-model="emitForm.pictureAddress"
                :fileList="file ? [file] : []"
                :show-file-list="false"
                @change="onChange"
                @progress="onProgress"
                :custom-request="customRequest"
              >
                <template #upload-button>
                  <div
                    :class="`arco-upload-list-item${
                      file && file.status === 'error'
                        ? ' arco-upload-list-item-error'
                        : ''
                    }`"
                  >
                    <div
                      class="arco-upload-list-picture custom-upload-avatar"
                      v-if="(file && file.url) || emitForm.pictureAddress"
                    >
                      <img :src="emitForm.pictureAddress" />
                      <div class="arco-upload-list-picture-mask">
                        <IconEdit />
                      </div>
                      <a-progress
                        v-if="file.status === 'uploading' && file.percent < 100"
                        :percent="file.percent"
                        type="circle"
                        size="mini"
                        :style="{
                          position: 'absolute',
                          left: '50%',
                          top: '50%',
                          transform: 'translateX(-50%) translateY(-50%)',
                        }"
                      />
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
          <a-form-item field="author" label="作者">
            <a-input
              v-model="emitForm.author"
              @input="mychange"
              :max-length="10"
              placeholder="请输入作者"
            />
          </a-form-item>
          <a-form-item field="mealType" label="菜品类型">
            <a-select :options="typeData" v-model="emitForm.mealType" />
          </a-form-item>
          <a-form-item field="production" label="菜品介绍">
            <a-input
              v-model="emitForm.production"
              @input="mychange"
              :max-length="10"
              placeholder="请输入菜品介绍"
            />
          </a-form-item>
          <a-button
            type="primary"
            style="width: 60px; margin: 20px 100px"
            @click="addMenu"
            >增加</a-button
          >
          <a-form-item field="foodQuantityList" label="菜品原料">
            <!-- <a-input
              v-model="emitForm.useTo"
              @input="mychange"
              :max-length="10"
              placeholder="请输入菜品介绍"
            /> -->
            <a-table
              :columns="columns2"
              :data="emitForm.foodQuantityList"
              :pagination="false"
            >
              <template #operations="{ record, rowIndex }">
                <a-button
                  type="text"
                  size="small"
                  @click="delMenu(rowIndex)"
                  status="danger"
                >
                  删除
                </a-button>
              </template>
              <template #foodName="{ rowIndex }">
                <a-select
                  allow-search
                  :options="data"
                  @change="() => handleChange(rowIndex)"
                  v-model="emitForm.foodQuantityList[rowIndex].foodName"
                />
              </template>
              <!-- <template #foodName="{ rowIndex }">
                <a-input
                  v-model="emitForm.foodQuantityList[rowIndex].foodName"
                />
              </template> -->
              <template #foodStatus="{ rowIndex }">
                <a-input
                  v-model="emitForm.foodQuantityList[rowIndex].foodStatus"
                />
              </template>
              <template #foodQuantity="{ rowIndex }">
                <a-input-number
                  v-model="emitForm.foodQuantityList[rowIndex].foodQuantity"
                />
              </template>
              <!-- <template #province="{ rowIndex }">
                <a-select
                  v-model="data[rowIndex].province"
                  @change="() => handleChange(rowIndex)"
                >
                  <a-option v-for="value of Object.keys(options)">{{
                    value
                  }}</a-option>
                </a-select>
              </template>
               -->
            </a-table>
          </a-form-item>
          <!-- <a-form-item field="useTo" label="菜品介绍">
            <a-input
              v-model="emitForm.useTo"
              @input="mychange"
              :max-length="10"
              placeholder="请输入菜品介绍"
            />
          </a-form-item> -->
          <!-- <a-form-item field="foodStatus" label="入库状态">
            <a-input
              v-model="emitForm.foodStatus"
              @input="mychange"
              :max-length="10"
              placeholder="请输入入库状态"
            />
          </a-form-item> -->
          <!-- <a-form-item field="notes" label="备注">
            <a-input
              v-model="emitForm.notes"
              @input="mychange"
              :max-length="10"
              placeholder="请输入备注"
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
import {
  editorialOrganization,
  delate,
  idDetails,
  listDetails,
  putPic,
  getCategory,
  unitCategory,
  foodMaterial,
} from "@/api/menu";
import { getTime, editorial, delateOrder } from "@/api/generateMenu";
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
const timeChange = (value: any) => {
  form.value.time = value;
  search();
};
const addMenu = () => {
  emitForm.foodQuantityList.push({
    foodName: "",
    foodStatus: "",
    foodQuantity: "",
  });
};
const delMenu = (index: any) => {
  if (emitForm.foodQuantityList.length > 1) {
    emitForm.foodQuantityList.splice(index, 1);
  }
};
const handleChange = (rowIndex: any) => {
  //  delete emitForm.foodQuantityList[rowIndex].mealId
  emitForm.foodQuantityList.forEach((item: any) => {
    data.value.forEach((item2: any) => {
      if (item.foodName == item2.foodName) {
        item.foodId = item2.id;
      }
    });
  });
};
const check = async (row: any) => {
  if (!form.value.time) {
    Message.warning("请先选择时间");
    return;
  }
  const send = {
    mealId: row.id,
    mealName: row.mealName,
    useDate: form.value.time,
    mealType: row.mealType,
  };
  const res: any = await editorial(send);
  if (res.message) {
    Message.success({
      content: res.message,
    });
  } else {
    Message.success({
      content: "操作成功",
    });
  }
  console.log(row);
  search();
};
const delOrder = async (row: any) => {
  if (!form.value.time) {
    Message.warning("请先选择时间");
    return;
  }
  const res: any = await delateOrder(row.mealOrderId);
  // if (res.message) {
  //   Message.success({
  //     content: res.message,
  //   });
  // } else {
  //   Message.success({
  //     content: "操作成功",
  //   });
  // }
  Message.success({
    content: "删除成功",
  });
  search();
};
const timeOptions = ref();
const typeData = reactive([
  {
    lable: "荤菜",
    value: "荤菜",
  },
  {
    lable: "素菜",
    value: "素菜",
  },
  {
    lable: "主食",
    value: "主食",
  },
  {
    lable: "粥类",
    value: "粥类",
  },
  {
    lable: "水果",
    value: "水果",
  },
  {
    lable: "其他",
    value: "其他",
  },
]);
const typeChange = (rowIndex: any) => {};
const mychange = () => {
  nextTick(() => {
    emitForm.mealName = emitForm.mealName.replace(/\s+/g, "");
  });
};
const generateFormModel = () => {
  return {
    mealName: "",
    pictureAddress: "",
    author: "",
    foodQuantityList: "",
    mealType: "",
    production: "",
    time: "",
    // useTo: "",
    // foodStatus: "",
    // notes: "",
  };
};
const emitForm: any = reactive({
  mealName: "",
  pictureAddress: "",
  foodQuantityList: "",
  author: "",
  mealType: "",
  production: "",
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
  const res = await foodMaterial();
  res.data.forEach((item: any) => {
    item.label = item.foodName;
    item.value = item.foodName;
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
const columns2: any = [
  {
    title: "操作",
    dataIndex: "operations",
    slotName: "operations",
    align: "center",
    width: 100,
  },
  {
    title: "食材名称",
    dataIndex: "foodName",
    slotName: "foodName",
    width: 130,
  },
  {
    title: "制作方式",
    dataIndex: "foodStatus",
    slotName: "foodStatus",
    width: 130,
  },
  {
    title: "食材系数",
    dataIndex: "foodQuantity",
    slotName: "foodQuantity",
    width: 130,
  },
];
let menuData: any = reactive([
  {
    foodName: "",
    foodStatus: "",
    foodQuantity: "",
  },
]);
const columns = computed<TableColumnData[]>(() => [
  // {
  //   title: "序号",
  //   dataIndex: "id",
  //   align: "center",
  //   width: 50,
  // },
  {
    title: "操作",
    dataIndex: "operations",
    slotName: "operations",
    align: "center",
    width: 100,
  },
  {
    title: "点餐状态",
    dataIndex: "haveOrdered",
    slotName: "haveOrdered",
    align: "center",
    width: 100,
  },
  {
    title: "菜品名称",
    dataIndex: "mealName",
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
    title: "作者",
    dataIndex: "author",
    align: "center",
    width: 120,
  },
  {
    title: "菜品类型",
    dataIndex: "mealType",
    align: "center",
    width: 80,
  },
  /* {
    title: "食材数量",
    dataIndex: "quantity",
    align: "center",
    width: 100,
  }, */
  {
    title: "菜品介绍",
    dataIndex: "production",
    align: "center",
    width: 100,
  },
  {
    title: "所需食材",
    dataIndex: "foodQuantityList",
    slotName: "foodQuantityList",
    align: "center",
    width: 100,
  },
  {
    title: "制作方法",
    dataIndex: "waysToMake",
    align: "center",
    width: 150,
  },
  {
    title: "创建时间",
    dataIndex: "createDate",
    align: "center",
    width: 150,
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
  getList();
  search();
});
// 新增业务
const isShow = ref(false);
const addNew = () => {
  or.value = true;
  emitForm.foodQuantityList = menuData;
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
  emitForm.foodQuantityList = "";
  emitForm.id = "";
  emitForm.userId = "";
  menuData = reactive([
    {
      foodName: "",
      foodStatus: "",
      foodQuantity: "",
    },
  ]);

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
  if (!emitForm.mealName) {
    Message.error({
      content: "请输入菜品名称",
    });
    return false;
  }
  if (!emitForm.pictureAddress) {
    Message.error({
      content: "请上传图片",
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
    emitForm.mealName = detailData.data.mealName;
    emitForm.pictureAddress = detailData.data.pictureAddress;
    emitForm.foodPrice = detailData.data.foodPrice;
    emitForm.author = detailData.data.author;
    emitForm.mealType = detailData.data.mealType;
    // emitForm.useTo = detailData.data.useTo;
    emitForm.production = detailData.data.production;
    if (detailData.data.foodQuantityList.length == 0) {
      emitForm.foodQuantityList = menuData;
    } else {
      emitForm.foodQuantityList = detailData.data.foodQuantityList;
    }
    // emitForm.foodStatus = detailData.data.foodStatus;
    // emitForm.notes = detailData.data.notes;
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};
// 上移下移是否置灰
const search = async () => {
  const formData = JSON.parse(JSON.stringify(form.value));
  // formData.positionId = formData.positionId == "a" ? "" : formData.positionId;
  await fetchData({
    mealName: formData.mealName,
    useDate: form.value.time,
    mealType: formData.mealType,
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
    })
    .catch((err: any) => {
      onError();
    });
};
</script>

<script lang="ts">
export default {
  name: "MenuList",
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
