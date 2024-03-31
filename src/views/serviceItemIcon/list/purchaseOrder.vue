<template>
  <div class="container">
    <Breadcrumb :items="['查看信息', '生成采购单']" />
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
                <a-form-item field="time" label="时间">
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
      <a-row style="margin-bottom: 16px">
        <a-col class="addbusiness">
          <a-space>
            <a-button type="primary" @click="addNew()">
              <icon-plus />
              添加
            </a-button>
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
          <!-- <a-button type="text" size="small" @click="editDetails(record.id)">
            编辑
          </a-button> -->
          <a-button
            type="text"
            size="small"
            @click="
              deliveryFromStorage(record.id, record.quantity, record.utilPrice)
            "
          >
            修改
          </a-button>

           <a-popconfirm content="确定删除吗?" type="error" @ok="del(record.id)">
            <a-button type="text" size="small" status="danger"> 删除 </a-button>
          </a-popconfirm>
        </template>
        <template #pictureAddress="{ record, rowIndex }">
          <a-image :src="record.pictureAddress" width="160" />
        </template>
        <template #purchasedConfirm="{ record, rowIndex }">
          <view v-if="!record.purchasedConfirm">
            <icon-close-circle-fill :size="15" style="color: #fe163e" />未确认
          </view>
          <view v-else>
            <icon-check-circle-fill :size="15" style="color: #00b42a" />已确认
          </view>
          <a-button type="text" size="small" @click="myCG(record)">
            采购状态修改
          </a-button>
        </template>
        <template #inReceiptConfirm="{ record, rowIndex }">
          <view v-if="!record.inReceiptConfirm"
            ><icon-close-circle-fill :size="15" style="color: #fe163e" />未入库
          </view>
          <view v-else>
            <icon-check-circle-fill :size="15" style="color: #00b42a" />已入库
          </view>
          <a-button type="text" size="small" @click="myConfim(record.id)">
            入库状态修改
          </a-button>
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
            field="foodName"
            label="食材名称："
            :rules="[{ required: true, message: '请选择食材名称' }]"
          >
            <a-select
              v-model="emitForm.foodName"
              placeholder="请选择食材名称"
              :options="data.slice(1)"
            ></a-select>
          </a-form-item>
          <a-form-item
            field="quantity"
            label="食材数量"
            :rules="[{ required: true, message: '请输入食材数量' }]"
          >
            <a-input-number
              v-model="emitForm.quantity"
              @input="mychange"
              :max-length="10"
              placeholder="请输入食材数量"
            />
          </a-form-item>
          <!--  <a-form-item field="notes" label="备注">
            <a-input
              v-model="emitForm.notes"
              @input="mychange"
              :max-length="10"
              placeholder="请输入备注"
            />
          </a-form-item> -->
        </a-form>
      </a-modal>
      <a-modal
        v-model:visible="isShow2"
        title="修改"
        @cancel="myClose2"
        @before-ok="handleBeforeOk2"
        unmount-on-close
      >
        <a-form :model="emitForm2" auto-label-width>
          <a-form-item
            field="quantity"
            label="采购数量"
            :rules="[{ required: true, message: ' ' }]"
          >
            <a-input-number
              v-model="emitForm2.quantity"
              @input="mychange"
              :max-length="10"
              placeholder="请输入采购数量"
            />
          </a-form-item>
          <a-form-item
            field="utilPrice"
            label="食材单价"
            :rules="[{ required: false, message: ' ' }]"
          >
            <a-input-number
              v-model="emitForm2.utilPrice"
              @input="mychange"
              :max-length="10"
              placeholder="请输入食材单价"
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
  edit,
  delate,
  idDetails,
  listDetails,
  goodlistDetails,
  newDelivery,
  supplierDetails,
  confirm,
  down,
} from "@/api/purchaseOrder";
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
const generateFormModel = () => {
  return {
    foodName: "",
    quantity: "",
    // notes: "",
    time: "",
    beforeDate: "",
    afterDate: "",
    pictureAddress: "",
  };
};

const emitForm: any = reactive({
  foodName: "",
  quantity: "",
  // notes: "",
});
const emitForm2: any = reactive({
  foodName: "",
  utilPrice: "",
  quantity: "",
  // notes: "",
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
  // const res2 = await supplierDetails();
  // res2.data.forEach((item: any) => {
  //   item.label = item.originName;
  //   item.value = item.originName;
  // });
  data.value = res.data;
  // data2.value = res2.data;
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
    title: "是否确认采购",
    dataIndex: "purchasedConfirm",
    slotName: "purchasedConfirm",
    align: "center",
    width: 100,
  },
  {
    title: "是否已经入库",
    dataIndex: "inReceiptConfirm",
    slotName: "inReceiptConfirm",
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
    title: "库存量",
    dataIndex: "inventory",
    align: "center",
    width: 100,
  },
  {
    title: "采购量",
    dataIndex: "quantity",
    align: "center",
    width: 100,
  },
  {
    title: "需求量",
    dataIndex: "allNeed",
    align: "center",
    width: 100,
  },
  {
    title: "食材单价（元）",
    dataIndex: "utilPrice",
    align: "center",
    width: 100,
  },
  // {
  //   title: "采购原因",
  //   dataIndex: "reason",
  //   align: "center",
  //   width: 150,
  // },
  {
    title: "创建时间",
    dataIndex: "createDate",
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
    // const result = data.map((obj: any) => {
    //   const modifiedObj: any = {};
    //   for (const prop in obj) {
    //     if (!obj[prop]) {
    //       modifiedObj[prop] = "-";
    //     } else {
    //       modifiedObj[prop] = obj[prop];
    //     }
    //   }
    //   return modifiedObj;
    // });
    // renderData.value = result;
    renderData.value = data;
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
  emitForm.id = "";
  emitForm.userId = "";
  isShow.value = false;
  isShow2.value = false;
  file.value = {};
};
const myClose2 = () => {
  emitForm2.quantity = "";
  // emitForm2.notes = "";
  emitForm2.useTo = "";
  emitForm2.utilPrice = "";
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
  if (!emitForm.quantity) {
    Message.error({
      content: "请输入食材数量",
    });
    return false;
  }
  if (emitForm.foodName != "a") {
    emitForm.foodId = emitForm.foodName;
  }
  emitForm.inspector = localStorage.getItem("username");
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
const myCG = async (id: any) => {
  try {
    setLoading(true);
    id.purchasedConfirm = !id.purchasedConfirm;
    const res: any = await edit(id);
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
        myClose2();
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
      content: "请输入采购数量",
    });
    return false;
  }
  /* if (!emitForm2.utilPrice) {
    Message.error({
      content: "请输入食材单价",
    });
    return false;
  } */

  // console.log("出库");
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
  fetchData({});
};

// 获取详情
const detailData: any = reactive({ data: [] });
const systemDetail = async () => {
  setLoading(true);
  try {
    const res: any = await idDetails({ userId: emitForm.userId });
    detailData.data = res.data;
    // emitForm.foodName = detailData.data.foodName;
    // emitForm.pictureAddress = detailData.data.pictureAddress;
    // emitForm.inputTime = detailData.data.inputTime;
    // emitForm.foodClassify = detailData.data.foodClassify;
    // emitForm.quantity = detailData.data.quantity;
    // emitForm.unit = detailData.data.unit;
    // emitForm.utilPrice = detailData.data.utilPrice;
    // emitForm.reason = detailData.data.reason;
    // emitForm.useTo = detailData.data.useTo;
    // emitForm.originName = detailData.data.originName;
    // emitForm.foodStatus = detailData.data.foodStatus;
    // emitForm.notes = detailData.data.notes;
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};
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
const quantity: any = ref("");
const deliveryFromStorage = async (id: any, quantity: any, utilPrice: any) => {
  isShow2.value = true;
  emitForm2.id = id;
  emitForm2.quantity = quantity;
  emitForm2.utilPrice = utilPrice;
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
// const onChange: any = (_: any, currentFile: any) => {
//   file.value = {
//     ...currentFile,
//     // url: URL.createObjectURL(currentFile.file),
//   };
// };
// const onProgress = (currentFile: any) => {
//   file.value = currentFile;
// };

// const customRequest: any = (option: any, item: any) => {
//   const { onError, onSuccess, fileItem } = option;
//   const formData = new FormData();
//   const id: any = router.currentRoute.value.query.id;
//   formData.append("file", fileItem.file);

//   putPic(formData)
//     .then((res: any) => {
//       onSuccess(res);
//       // 上传图片成功
//       console.log(res.message);
//       emitForm.pictureAddress = res.message;
//     })
//     .catch((err: any) => {
//       onError();
//     });
// };
const myConfim = async (id: any) => {
  await confirm(id);
  fetchData({});
};

// 下载表格
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
</script>

<script lang="ts">
export default {
  name: "listView",
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
