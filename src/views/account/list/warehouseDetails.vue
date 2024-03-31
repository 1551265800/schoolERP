<template>
  <div class="container">
    <Breadcrumb :items="['menu.system', '原材料详情']" class="mytable" />
    <a-card class="general-card" style="padding-top: 20px">
      <a-row>
        <a-col :flex="1">
          <a-form :model="form" :label-col-props="{ span: 8 }" :wrapper-col-props="{ span: 18 }" label-align="right"
            auto-label-width class="mytable">
            <a-row :gutter="16">
              <a-col :span="16">
                <a-form-item field="foodName" label="食材名称">
                  <a-input :style="{ width: '320px' }" v-model="form.foodName" placeholder="请输入食材名称" allow-clear
                    :max-length="100" />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
          <!-- <a-divider style="height: 35px" direction="vertical" /> -->
          <a-col :flex="'86px'" style="text-align: left">
            <a-space :size="9">
              <a-button type="primary" @click="search" class="mytable">
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
      <a-row style="margin-bottom: 16px" class="mytable">
        <a-col class="addbusiness">
          <a-space>
            <a-button type="primary" @click="addNew()">
              <icon-plus />
              新增
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <!-- <div class="list liuyang">
        <div class="item" v-for="(v, index ) in renderData2" :key="index">
           <div class="item-left">
            <image :src="v.pictureAddress" mode=""></image>
            <img :src="v.pictureAddress" alt="">
          </div>
          <div class="item-right">
            <div class="line">
              <text class="title">
                {{ v.foodName }}&nbsp;&nbsp;
              </text>
              <text class="chef">库存：{{ v.quantity }}&nbsp;&nbsp;</text>
              <text class="chef">单价：{{ v.utilPrice }}</text>
              <br>
              <text class="chef">时间：{{ v.createDate.substring(v.createDate.length - 8, v.createDate.length) }}</text>
              <br>
            </div>
          </div>
        </div>
      </div> -->
      <a-table row-key="id" :loading="loading" :columns="columns2" :data="renderData2" :bordered="{ cell: true }"
        :size="size" :pagination="false" class="liuyang" style="margin-top: 10px;">
      </a-table>
      <a-table row-key="id" :loading="loading" :columns="(cloneColumns as TableColumnData[])" :data="renderData"
        :bordered="{ cell: true }" :size="size" :pagination="true" class="mytable">
        <template #operations="{ record, rowIndex }">
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
      </a-table>
      <a-modal v-model:visible="isShow" :title="or ? '新增' : '编辑'" @cancel="myClose" @before-ok="handleBeforeOk"
        unmount-on-close>
        <a-form :model="emitForm" auto-label-width>
          <a-form-item field="foodName" label="食材名称：" :rules="[{ required: true, message: '请输入食材名称' }]">
            <a-input v-model="emitForm.foodName" @input="mychange" :max-length="10" placeholder="请输入食材名称" />
          </a-form-item>
          <a-form-item field="pictureAddress" label="食材图片：" :rules="[{ required: true, message: ' ' }]">
            <a-space direction="vertical" :style="{ width: '100%' }">
              <a-upload v-model="emitForm.pictureAddress" :fileList="file ? [file] : []" :show-file-list="false"
                @change="onChange" @progress="onProgress" :custom-request="customRequest">
                <template #upload-button>
                  <div :class="`arco-upload-list-item${file && file.status === 'error'
                    ? ' arco-upload-list-item-error'
                    : ''
                    }`">
                    <div class="arco-upload-list-picture custom-upload-avatar"
                      v-if="(file && file.url) || emitForm.pictureAddress">
                      <img :src="emitForm.pictureAddress" />
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
          <a-form-item field="inputTime" label="入库时间：" :rules="[{ required: true, message: '请选择出入库时间' }]">
            <a-date-picker placeholder="请选择入库时间" v-model="emitForm.inputTime" style="width: 200px" />
          </a-form-item>

          <a-form-item field="foodClassify" label="食材品类">
            <!--  <a-input
              v-model="emitForm.foodClassify"
              @input="mychange"
              :max-length="10"
              placeholder="请输入食材品类"
            /> -->
            <a-select v-model="emitForm.foodClassify" placeholder="请选择食材品类" :options="data"></a-select>
          </a-form-item>
          <!-- <a-form-item field="quantity" label="食材数量">
            <a-input
              v-model="emitForm.quantity"
              @input="mychange"
              :max-length="10"
              placeholder="请输入食材数量"
            />
          </a-form-item> -->
          <a-form-item field="unit" label="单位">
            <!-- <a-input
              v-model="emitForm.unit"
              @input="mychange"
              :max-length="10"
              placeholder="请输入食材数量"
            /> -->
            <a-select v-model="emitForm.unit" placeholder="请选择食材品类" :options="data2"></a-select>
          </a-form-item>
          <!-- <a-form-item field="foodPrice" label="食材单价(元)">
            <a-input-number
              v-model="emitForm.foodPrice"
              @input="mychange"
              placeholder="请输入食材单价"
            />
          </a-form-item> -->
          <a-form-item field="reason" label="入库原因">
            <a-input v-model="emitForm.reason" @input="mychange" :max-length="10" placeholder="请输入入库原因" />
          </a-form-item>
          <a-form-item field="originName" label="食材来源">
            <a-input v-model="emitForm.originName" @input="mychange" :max-length="10" placeholder="请输入食材来源" />
          </a-form-item>
          <a-form-item field="useTo" label="食材用途">
            <a-input v-model="emitForm.useTo" @input="mychange" :max-length="10" placeholder="请输入食材用途" />
          </a-form-item>
          <a-form-item field="foodStatus" label="入库状态">
            <a-input v-model="emitForm.foodStatus" @input="mychange" :max-length="10" placeholder="请输入入库状态" />
          </a-form-item>
          <a-form-item field="notes" label="备注">
            <a-input v-model="emitForm.notes" @input="mychange" :max-length="10" placeholder="请输入备注" />
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
  listDetails2,
  putPic,
  getCategory,
  unitCategory
} from "@/api/goods";
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
    emitForm.foodName = emitForm.foodName.replace(/\s+/g, "");
  });
};
const generateFormModel = () => {
  return {
    foodName: "",
    pictureAddress: "",
    inputTime: "",
    foodClassify: "",
    // quantity: "",
    unit: "",
    // foodPrice: "",
    reason: "",
    originName: "",
    useTo: "",
    foodStatus: "",
    notes: "",
  };
};

const emitForm: any = reactive({
  foodName: "",
  pictureAddress: "",
  inputTime: "",
  foodClassify: "",
  // quantity: "",
  unit: "",
  // foodPrice: "",
  reason: "",
  originName: "",
  useTo: "",
  foodStatus: "",
  notes: "",
});

const { loading, setLoading } = useLoading(true);
const renderData: any = ref([]);
const renderData2: any = ref([]);
const form = ref(generateFormModel());
const cloneColumns = ref<Column[]>([]);
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
const columns = computed<TableColumnData[]>(() => [
  {
    title: "序号",
    dataIndex: "id",
    align: "center",
    width: 50,
  },
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
    align: "center",
    width: 150,
  },
  {
    title: "食材图片",
    dataIndex: "pictureAddress",
    slotName: "pictureAddress",
    align: "center",
    width: 150,
  },
  {
    title: "入库时间",
    dataIndex: "inputTime",
    align: "center",
    width: 120,
  },
  {
    title: "食材品类",
    dataIndex: "foodClassify",
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
    title: "单位",
    dataIndex: "unit",
    align: "center",
    width: 100,
  },
  // {
  //   title: "食材单价（元）",
  //   dataIndex: "foodPrice",
  //   align: "center",
  //   width: 100,
  // },
  {
    title: "入库原因",
    dataIndex: "reason",
    align: "center",
    width: 150,
  },
  {
    title: "食材来源",
    dataIndex: "originName",
    align: "center",
    width: 150,
  },
  {
    title: "食材用途",
    dataIndex: "useTo",
    align: "center",
    width: 150,
  },
  {
    title: "入库状态",
    dataIndex: "foodStatus",
    align: "center",
    width: 150,
  },
  {
    title: "备注",
    dataIndex: "notes",
    align: "center",
    width: 150,
  },
]);
const columns2 = computed<TableColumnData[]>(() => [
  {
    title: "食材名称",
    dataIndex: "foodName",
    align: "center",
  },
  {
    title: "食材数量",
    dataIndex: "quantity",
    align: "center",
  },
  // {
  //   title: "单位",
  //   dataIndex: "unit",
  //   align: "center",
  //   width: 100,
  // },
  {
    title: "食材单价（元）",
    dataIndex: "foodPrice",
    align: "center",
  },
  // {
  //   title: "入库原因",
  //   dataIndex: "reason",
  //   align: "center",
  //   width: 150,
  // },
  // {
  //   title: "食材来源",
  //   dataIndex: "originName",
  //   align: "center",
  //   width: 150,
  // },
  // {
  //   title: "食材用途",
  //   dataIndex: "useTo",
  //   align: "center",
  //   width: 150,
  // },
  // {
  //   title: "入库状态",
  //   dataIndex: "foodStatus",
  //   align: "center",
  //   width: 150,
  // },
  // {
  //   title: "备注",
  //   dataIndex: "notes",
  //   align: "center",
  //   width: 150,
  // },
]);
// 表格数据
const fetchData = async (params?: any) => {
  setLoading(true);
  try {
    const { data } = await listDetails(params);
    const data2 = await listDetails2(params);
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
    renderData2.value = data2.data;
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
  emitForm.pictureAddress = "";
  emitForm.inputTime = "";
  emitForm.foodClassify = "";
  emitForm.foodClassify = "";
  // emitForm.quantity = "";
  emitForm.unit = "";
  emitForm.foodPrice = "";
  emitForm.reason = "";
  emitForm.originName = "";
  emitForm.useTo = "";
  emitForm.foodStatus = "";
  emitForm.notes = "";
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
  if (!emitForm.foodName) {
    Message.error({
      content: "请输入食材名称",
    });
    return false;
  }
  if (!emitForm.pictureAddress) {
    Message.error({
      content: "请上传图片",
    });
    return false;
  }
  if (!emitForm.inputTime) {
    Message.error({
      content: "请选择入库时间",
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
    emitForm.foodName = detailData.data.foodName;
    emitForm.pictureAddress = detailData.data.pictureAddress;
    emitForm.inputTime = detailData.data.inputTime;
    emitForm.foodClassify = detailData.data.foodClassify;
    // emitForm.quantity = detailData.data.quantity;
    emitForm.unit = detailData.data.unit;
    emitForm.foodPrice = detailData.data.foodPrice;
    emitForm.reason = detailData.data.reason;
    emitForm.useTo = detailData.data.useTo;
    emitForm.originName = detailData.data.originName;
    emitForm.foodStatus = detailData.data.foodStatus;
    emitForm.notes = detailData.data.notes;
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
    foodName: formData.foodName,
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
  name: "listView",
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
