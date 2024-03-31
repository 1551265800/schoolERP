<template>
  <div class="container">
    <!-- <Breadcrumb :items="['查看信息', '预采购单（供货商）']" /> -->
    <a-card class="general-card" style="padding-top: 20px;margin-top: 10px;">
      <a-row>
        <a-col :flex="1">
          <a-form :model="form" :label-col-props="{ span: 8 }" :wrapper-col-props="{ span: 18 }" label-align="right"
            auto-label-width>
            <a-row :gutter="16">
              <a-col :span="16">
                <a-form-item field="foodName">
                  <a-input-search :style="{ width: '300px' }" v-model="form.foodName" placeholder="请输入食材名称" allow-clear
                    :max-length="100" search-button style="position: relative; right: 20px;" @search="search" />
                  <a-button @click="reset">
                    <template #icon>
                      <icon-refresh />
                    </template>
                    刷新
                  </a-button>
                </a-form-item>
                <a-form-item field="school">
                  <a-select :style="{ width: '300px' }" v-model="form.school" placeholder="请选择学校" :options="data2"
                    style="position: relative; right: 20px;" @change="search" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="16">
              <a-col :span="16">
                <a-form-item field="time">
                  <a-button type="primary" @click="cTime" style="margin-bottom: 10px;position: relative; right: 15px;">
                    选择时间
                  </a-button>
                  <div v-if="!showTime" style="font-size: 18px; font-weight: 600;">
                    {{ form.time }}
                  </div>
                  <a-radio-group v-model="form.time" :options="timeOptions" @change="timeChange" v-if="showTime">
                    <template #label="{ data }">
                      <a-tag style="margin-top: 5px;">{{ data.label }}</a-tag>
                    </template>
                  </a-radio-group>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
      </a-row>
      <!-- <a-divider style="margin-top: 20px" /> -->
      <div class="list">
        <div class="item" v-for="(v, index ) in renderData" :key="index">
          <div class="item-left">
            <!-- <image :src="v.pictureAddress" mode=""></image> -->
            <!-- <text>{{v.mealName}}</text> -->
          </div>
          <div class="item-right">
            <div class="line">
              <text class="title">
                {{ v.foodName }}
              </text>
              <br>
              <text class="chef">采购数量：{{ v.quantity }}</text>
              <br>
              <text class="chef">验收数量：{{ v.acceptanceQuantity }}</text>
              <br>
              <text class="chef">单价：{{ v.utilPrice }}</text>
              <br>
              <text class="chef">时间：{{ v.useDate }}</text>
              <br>
              <!-- <text class="warning" v-if="v.isReady">未备齐</text> -->
              <!-- 		<text class="error" v-if="v.useStatus == -1">退回</text>
						<text class="error" v-if="v.useStatus == 1 && v.drug_status == 0">待发药</text> -->
              <!-- <text class="success" v-if="!v.isReady">已备齐</text> -->
            </div>
          </div>
          <div class="LYbtn2" @click="editDetails(v.id)">
            <a-button type="primary"> 修改单价 </a-button>
          </div>
          <!-- <a-popconfirm content="确定删除吗?" type="error" @ok="del(v.id)" v-if="v.isSystem">
            <div class="LYbtn2">
              <a-button type="primary" status="warning"> 删除 </a-button>
            </div>
          </a-popconfirm> -->
        </div>
      </div>
      <!--    <a-table row-key="id" :loading="loading" :columns="(cloneColumns as TableColumnData[])" :data="renderData"
        :bordered="{ cell: true }" :size="size" :pagination="true">
        <template #operations2="{ record, rowIndex }">
          <a-button type="text" size="small" @click="editDetails(record.id)">
            修改单价
          </a-button>
        </template>
        <template #isReady="{ record, rowIndex }">
          <a-button type="text" size="small" @click="modifyAndPrepare(record)">
            修改备齐状态
          </a-button>
          <br />
          <view v-if="record.isReady == '-'"><icon-close-circle-fill :size="15" style="color: #fe163e" />未备齐
          </view>
          <view v-else>
            <icon-check-circle-fill :size="15" style="color: #00b42a" />已备齐
          </view>
        </template>
      </a-table> -->
      <a-modal v-model:visible="isShow" :title="or ? '新增' : '编辑'" @cancel="myClose" @before-ok="handleBeforeOk"
        unmount-on-close width="300px">
        <a-form :model="emitForm" auto-label-width>
          <a-form-item field="foodName" label="食材名称" :rules="[{ required: false, message: '请输入食材名称' }]" disabled>
            <a-input v-model="emitForm.foodName" @input="mychange" :max-length="10" placeholder="请输入食材名称" />
          </a-form-item>
          <a-form-item field="utilPrice" label="单价(元)">
            <a-input-number v-model="emitForm.utilPrice" :min="0" :max-length="10" placeholder="请输入单价" />
          </a-form-item>
          <!-- <a-form-item field="quantity" label="采购数量">
            <a-input-number v-model="emitForm.quantity" @input="mychange" :max-length="10" placeholder="请输入采购数量"
              disabled />
          </a-form-item> -->
          <!-- <a-form-item field="useDate" label="使用日期">
            <a-select :options="timeOptions" v-model="emitForm.useDate" disabled />
          </a-form-item> -->

          <!--  <a-button
            type="primary"
            style="width: 60px; margin: 20px 100px"
            @click="addMenu"
            >增加</a-button
          > -->
          <!-- <a-form-item field="useTo" label="订购人名称">
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
  editorialOrganization2,
  delate,
  idDetails,
  listSupplier,
  putPic,
  foodMaterial,
  supplierCategory,
  listSchool2
} from "@/api/advancePurchaseOrder";
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
  showTime.value = false;
  search();
};
let showTime: any = ref(false);
const cTime = () => {
  showTime.value = !showTime.value;
}
const timeOptions: any = ref();
// const typeData = reactive([
//   {
//     lable: "荤菜",
//     value: "荤菜",
//   }
// ]);
const typeChange = (rowIndex: any) => { };
const mychange = () => {
  nextTick(() => {
    emitForm.foodName = emitForm.foodName.replace(/\s+/g, "");
  });
};
const generateFormModel = () => {
  return {
    foodName: "",
    quantity: "",
    supplierName: "",
    time: "",
    school: "",
  };
};
const emitForm: any = reactive({
  foodName: "",
  quantity: "",
  utilPrice: "",
});

const { loading, setLoading } = useLoading(true);
const renderData: any = ref([]);
const form: any = ref(generateFormModel());
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
  // const res = await supplierCategory();
  // res.data.forEach((item: any) => {
  //   item.label = item.originName;
  //   item.value = item.id;
  // });
  // data.value = res.data;
  const time: any = await getTime();
  form.value.time = time.defaultTime;
  time.data.forEach((item: any) => {
    item.label = `${item.dateStr}(${item.weekStr})`;
    item.value = item.dateStr;
  });
  timeOptions.value = time.data;
  // console.log(data.value);

  const res2 = await listSchool2();
  res2.data.forEach((item: any) => {
    item.label = item.organName;
    item.value = item.id;
  });
  data2.value = res2.data;
  form.value.school = res2.data[0].id;
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
    width: 50,
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
  // {
  //   title: "操作",
  //   dataIndex: "operations",
  //   slotName: "operations",
  //   align: "center",
  //   width: 100,
  // },
  {
    title: "操作",
    dataIndex: "operations2",
    slotName: "operations2",
    align: "center",
    width: 50,
  },
  // {
  //   title: "是否备齐",
  //   dataIndex: "isReady",
  //   slotName: "isReady",
  //   align: "center",
  //   width: 50,
  // },
  {
    title: "食材名称",
    dataIndex: "foodName",
    align: "center",
    width: 90,
  },
  {
    title: "单价（元）",
    dataIndex: "utilPrice",
    align: "center",
    width: 60,
  },
  {
    title: "采购数量",
    dataIndex: "quantity",
    align: "center",
    width: 70,
  },
  // {
  //   title: "供货商名称",
  //   dataIndex: "supplierName",
  //   align: "center",
  //   width: 80,
  // },
  /* {
    title: "食材数量",
    dataIndex: "quantity",
    align: "center",
    width: 100,
  }, */
  // {
  //   title: "订购人名称",
  //   dataIndex: "operatorName",
  //   align: "center",
  //   width: 100,
  // },
  // {
  //   title: "订购组织名称",
  //   dataIndex: "organName",
  //   slotName: "organName",
  //   align: "center",
  //   width: 100,
  // },
  // {
  //   title: "总价（元）",
  //   dataIndex: "price",
  //   align: "center",
  //   width: 60,
  // },
  // {
  //   title: "使用日期",
  //   dataIndex: "useDate",
  //   align: "center",
  //   width: 150,
  // },
]);
// 表格数据
const fetchData = async (params?: any) => {
  setLoading(true);
  try {
    const { data } = await listSupplier(params);
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
onMounted(async () => {
  await getList();
  await search();
});
// 新增业务
const isShow = ref(false);
const addNew = () => {
  or.value = true;
  isShow.value = true;
  emitForm.useDate = form.value.time;
};
const addShow = (val: any) => {
  isShow.value = val;
};
const myClose = () => {
  emitForm.foodName = "";
  emitForm.quantity = "";
  emitForm.utilPrice = "";
  emitForm.id = "";
  emitForm.userId = "";
  emitForm.useDate = form.value.time;
  emitForm.organId = "";
  menuData = reactive([
    {
      foodName: "",
      foodStatus: "",
      foodQuantity: "",
    },
  ]);

  isShow.value = false;
};

const handleBeforeOk = async (done: any) => {
  emitForm.id = emitForm.userId;
  delete emitForm.userId;
  // 增加
  emitForm.organId = form.value.school
  try {
    setLoading(true);
    const res: any = await editorialOrganization2(emitForm);
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
const modifyAndPrepare = async (info: any) => {
  try {
    setLoading(true);
    const res: any = await editorialOrganization2({
      id: info.id,
      isReady: info.isReady == "-" ? true : false,
    });
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
        myClose();
      }, 1000);
    }
    await search();
    setLoading(false);
  } catch (error) {
    setLoading(false);
  }
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
    emitForm.foodName = detailData.data.foodName;
    emitForm.quantity = detailData.data.quantity;
    emitForm.useDate = detailData.data.useDate;
    emitForm.utilPrice = detailData.data.utilPrice;
    emitForm.acceptanceQuantity = detailData.data.acceptanceQuantity;
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
    useDate: form.value.time,
    organId: form.value.school,
  });
};
const reset = () => {
  let temp = form.value.time;
  form.value = generateFormModel();
  form.value.time = temp;
  form.value.school = data2.value[0].value;
  // form.value.time = year + "-" + month + "-" + day;
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
</script>

<script lang="ts">
export default {
  name: "supplierOrder",
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

      image {
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
