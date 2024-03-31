<template>
  <div class="container">
    <Breadcrumb :items="['menu.system', '出入库']" class="mytable" />
    <a-card class="general-card" style="padding-top: 20px">
      <a-row>
        <a-col :flex="1">
          <a-form :model="form" :label-col-props="{ span: 8 }" :wrapper-col-props="{ span: 18 }" label-align="right"
            auto-label-width>
            <a-row :gutter="16">
              <a-col :span="16">
                <a-form-item field="foodName" label="食材名称">
                  <a-select v-model="form.foodName" placeholder="请选择食材名称" :options="data" style="width: 250px"
                    allow-search></a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="16" class="mytable">
              <a-col :span="16">
                <a-form-item field="time" label="出库时间">
                  <a-range-picker v-model="form.time" style="width: 350px" show-time format="YYYY-MM-DD HH:mm:ss"
                    @ok="onOk" />
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
      <a-divider style="margin-top: 20px" class="mytable" />
      <a-row style="margin-bottom: 16px; margin-top: 10px;">
        <a-col class="addbusiness">
          <a-space>
            <a-button type="primary" @click="addNew()">
              <icon-plus />
              入库
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <div class="list liuyang">
        <div class="item" v-for="(v, index ) in renderData" :key="index">
          <div class="item-left">
            <image :src="v.pictureAddress" mode=""></image>
            <img :src="v.pictureAddress" alt="">
          </div>
          <div class="item-right">
            <div class="line">
              <text class="title">
                {{ v.foodName }}
              </text>
              <br>
              <text class="chef">采购数量：{{ v.quantity }}</text>
              <br>
              <text class="chef">单价：{{ v.utilPrice }}</text>
              <br>
              <text class="chef">时间：{{ v.createDate.substring(v.createDate.length - 8, v.createDate.length) }}</text>
              <br>
            </div>
          </div>
          <!--  <a-button type="primary" size="small" @click="editDetails(v.id)">
            编辑
          </a-button> -->

          <div class="LYbtn3" @click="editDetails(v.id)">
            <icon-edit size="30" />
          </div>
          <a-popconfirm content="确定删除吗?" type="error" @ok="del(v.id)">
            <div class="LYbtn2">
              <!-- <a-button type="primary" status="warning"> 删除 </a-button> -->
              <icon-close-circle size="30" />
            </div>


          </a-popconfirm>
        </div>
      </div>
      <a-table row-key="id" :loading="loading" :columns="(cloneColumns as TableColumnData[])" :data="renderData"
        :bordered="{ cell: true }" :size="size" :pagination="true" class="mytable">
        <template #operations="{ record, rowIndex }">
          <a-button type="text" size="small" @click="editDetails(record.id)">
            编辑
          </a-button>
          <a-button type="text" size="small" @click="deliveryFromStorage(record.foodId, record.quantity)">
            出库
          </a-button>
          <a-popconfirm content="确定删除吗?" type="error" @ok="del(record.id)">
            <a-button type="text" size="small" status="danger"> 删除 </a-button>
          </a-popconfirm>
        </template>
        <template #pictureAddress="{ record, rowIndex }">
          <a-image :src="record.pictureAddress" width="160" />
        </template>
      </a-table>
      <a-modal v-model:visible="isShow" :title="or ? '入库' : '编辑'" @cancel="myClose" @before-ok="handleBeforeOk"
        :width="myWidth" unmount-on-close>
        <a-form :model="emitForm" auto-label-width>
          <a-form-item field="foodName" label="食材名称：" :rules="[{ required: true, message: '请选择食材名称' }]">
            <a-select allow-search v-model="emitForm.foodName" placeholder="请选择食材名称" :options="data.slice(1)"
              @change="foodChange"></a-select>
            <!-- @change="foodChange"></a-select> -->
          </a-form-item>
          <a-form-item field="originId" label="供应商名称：" :rules="[{ required: true, message: '请选择供应商名称：' }]">
            <a-select v-model="emitForm.originId" placeholder="请选择供应商名称：" :options="data2"></a-select>
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
          <a-form-item field="quantity" label="食材数量" :rules="[{ required: true, message: '请输入食材数量' }]">
            <a-input-number v-model="emitForm.quantity" @input="mychange" :max-length="10" placeholder="请输入食材数量" />
          </a-form-item>
          <a-form-item field="useTo" label="食材用途">
            <a-input v-model="emitForm.useTo" @input="mychange" :max-length="10" placeholder="请输入食材用途" />
          </a-form-item>
          <a-form-item field="notes" label="备注">
            <a-input v-model="emitForm.notes" @input="mychange" :max-length="10" placeholder="请输入备注" />
          </a-form-item>
        </a-form>
      </a-modal>
      <a-modal v-model:visible="isShow2" title="出库" @cancel="myClose2" @before-ok="handleBeforeOk2" unmount-on-close>
        <a-form :model="emitForm2" auto-label-width>
          <a-form-item field="quantity" label="出库数量" :rules="[{ required: true, message: ' ' }]">
            <a-input-number v-model="emitForm2.quantity" @input="mychange" :max-length="10" placeholder="请输入出库数量" />
          </a-form-item>
          <a-form-item field="useTo" label="出库原因">
            <a-input v-model="emitForm2.useTo" @input="mychange" :max-length="10" placeholder="请输入出库原因" />
          </a-form-item>
          <a-form-item field="notes" label="备注">
            <a-input v-model="emitForm2.notes" @input="mychange" :max-length="10" placeholder="请输入备注" />
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
  newDelivery,
  supplierDetails,
  foodDetails,
} from "@/api/IOStorage";

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
  //   emitForm.foodName = emitForm.foodName.replace(/\s+/g, "");
  // });
};
const myWidth = ref();
if (document.body.clientWidth <= 480) {
  myWidth.value = "100%"
}else{
  myWidth.value = ""
}

const generateFormModel = () => {
  return {
    foodName: "",
    quantity: "",
    notes: "",
    time: "",
    beforeDate: "",
    afterDate: "",
    originId: "",
    pictureAddress: "",
  };
};

const emitForm: any = reactive({
  foodName: "",
  quantity: "",
  notes: "",
});
const emitForm2: any = reactive({
  foodName: "",
  quantity: "",
  notes: "",
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
const getList = async () => {
  const res = await goodlistDetails();
  res.data.forEach((item: any) => {
    item.label = item.foodName;
    delete item.foodName;
    item.value = item.id;
    delete item.id;
  });
  const res2 = await supplierDetails();
  res2.data.forEach((item: any) => {
    item.label = item.originName;
    item.value = item.id;
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
    title: "序号",
    dataIndex: "id",
    align: "center",
    width: 150,
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
    title: "入库操作人员",
    dataIndex: "inspector",
    align: "center",
    width: 100,
  },
  {
    title: "食材品类",
    dataIndex: "foodClassify",
    align: "center",
    width: 80,
  },
  {
    title: "食材图片",
    dataIndex: "pictureAddress",
    slotName: "pictureAddress",
    align: "center",
    width: 150,
  },
  {
    title: "食材数量",
    dataIndex: "quantity",
    align: "center",
    width: 100,
  },
  {
    title: "单位",
    dataIndex: "unit",
    align: "center",
    width: 100,
  },
  {
    title: "食材单价（元）",
    dataIndex: "foodPrice",
    align: "center",
    width: 100,
  },
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
    title: "入库时间",
    dataIndex: "createDate",
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
  fetchData({});
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
  emitForm.foodName = "";
  emitForm.pictureAddress = "";
  emitForm.quantity = "";
  emitForm.useTo = "";
  emitForm.notes = "";
  emitForm.originName = "";
  emitForm.originId = "";
  emitForm.id = "";
  emitForm.userId = "";
  isShow.value = false;
  isShow2.value = false;
  file.value = {};
};
const myClose2 = () => {
  emitForm2.quantity = "";
  emitForm2.notes = "";
  emitForm2.useTo = "";
  isShow2.value = false;
};
const isShowError = (val: any) => {
  isShow.value = val;
};

const handleBeforeOk = async (done: any) => {
  // if (emitForm.uid == "") {
  //   delete emitForm.uid;
  // }
  // emitForm.id = emitForm.userId;
  // delete emitForm.userId;
  if (!emitForm.foodName) {
    Message.error({
      content: "请选择食材",
    });
    return false;
  }
  if (!emitForm.originId) {
    Message.error({
      content: "请选择供应商",
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
      content: "请输入食材数量",
    });
    return false;
  }
  emitForm.inspector = localStorage.getItem("username");
  if (or.value == true) {
    if (emitForm.foodName != "a") {
      emitForm.foodId = emitForm.foodName;
    }
  }
  delete emitForm.foodName;

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
    myClose();
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
  if (!emitForm2.quantity) {
    Message.error({
      content: "请选择出库数量",
    });
    return false;
  }

  console.log("出库");
  try {
    setLoading(true);
    const res: any = await newDelivery(emitForm2);
    if (res.msg) {
      Message.success({
        content: res.msg,
      });
    } else {
      Message.success({
        content: "操作成功",
      });
    }
    myClose2();
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
    const res: any = await idDetails({ userId: emitForm.userId });
    detailData.data = res.data;
    emitForm.foodName = detailData.data.foodName;
    emitForm.pictureAddress = detailData.data.pictureAddress;
    emitForm.inputTime = detailData.data.inputTime;
    emitForm.foodClassify = detailData.data.foodClassify;
    emitForm.quantity = detailData.data.quantity;
    emitForm.unit = detailData.data.unit;
    emitForm.foodPrice = detailData.data.foodPrice;
    emitForm.reason = detailData.data.reason;
    emitForm.useTo = detailData.data.useTo;
    // emitForm.originName = detailData.data.originName;
    emitForm.originId = detailData.data.originId;
    emitForm.foodStatus = detailData.data.foodStatus;
    emitForm.notes = detailData.data.notes;
    emitForm.foodId = detailData.data.foodId;
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
    foodId: formData.foodName,
    afterDate: formData.afterDate,
    beforeDate: formData.beforeDate,
  });
};
const reset = () => {
  form.value = generateFormModel();
  search();
};
const quantity: any = ref("");
const deliveryFromStorage = async (id: any, quantity: any) => {
  emitForm2.quantity = ""
  isShow2.value = true;
  emitForm2.foodId = id;
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
//入库时食材名称修改
const foodChange = async (value: any) => {
  console.log(value);
  emitForm.foodId = value;
  // setLoading(true);
  // try {
  //   const { data } = await foodDetails({ foodId: value });
  //   console.log(data[0]);
  //   if (data.length > 0) {
  //     emitForm.originName = data[0].supplierName;
  //     // emitForm.quantity = data[0].quantity;
  //   }
  // } catch (err) {
  //   // you can report use errorHandler or other
  // } finally {
  //   // setLoading(false);
  // }
};
</script>

<script lang="ts">
export default {
  name: "listView",
};
</script>

<style scoped lang="less">
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
    margin: 10px auto;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    padding: 10px 5px;

    .LYbtn2 {
      position: absolute;
      right: -2px;
      top: 10px;
      border-radius: 7px;
      padding: 10px 20px;
    }

    .LYbtn3 {
      position: absolute;
      right: -2px;
      bottom: 10px;
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
      line-height: 30px;

      .title {
        font-weight: 700;
        font-size: 20px;
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
