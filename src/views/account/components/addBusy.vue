<template>
  <div>
    <a-modal
      v-if="props.isShow"
      v-model:visible="props.isShow"
      :footer="false"
      @cancel="handleCancel"
      title-align="start"
      width="1200px"
      title="新增"
    >
      <!-- <template #title> 新增</template> -->
      <a-form
        :model="form"
        auto-label-width
        label-align="left"
        @submit="editorList"
        class="box"
        ref="formRef"
      >
        <a-form-item
          field="strategyName"
          label="服务套餐名称:"
          :validate-trigger="['change', 'input']"
          :rules="formt.strategyName"
          class="a-form-item"
        >
          <a-input
            class="form-input"
            v-model="form.strategyName"
            placeholder="请输入服务套餐名称"
            allow-clear
            @input="form.strategyName = form.strategyName.replace(/\s+/g, '')"
          />
        </a-form-item>
        <a-form-item
          field="strategyValue"
          label="策略标识:"
          :rules="formt.strategyValue"
          :validate-trigger="['change', 'input']"
        >
          <a-input
            class="form-input"
            v-model="form.strategyValue"
            placeholder="请输入策略标识"
            allow-clear
            @input="form.strategyValue = form.strategyValue.replace(/\s+/g, '')"
          />
        </a-form-item>
        <a-form-item
          field="brand"
          label="商品品牌:"
          :rules="[{ required: true, message: '请输入商品品牌' }]"
          :validate-trigger="['change', 'input']"
        >
          <a-select
            :style="{ width: '55%' }"
            v-model="form.brand"
            placeholder="请选择"
            :options="brandData.data"
            :field-names="fieldNames"
          >
          </a-select>
        </a-form-item>
        <a-form-item
          field="strategyEnum"
          label="商品编码:"
          :rules="formt.strategyEnum"
          :validate-trigger="['change', 'input']"
        >
          <a-input
            class="form-input"
            v-model="form.strategyEnum"
            placeholder="请输入商品编码"
            allow-clear
            @input="form.strategyEnum = form.strategyEnum.replace(/\s+/g, '')"
          >
            <template #prefix v-if="form.brand">
              <template v-if="form.brand == '1'"> cy- </template>
              <template v-else> ym- </template>
            </template>
          </a-input>
        </a-form-item>

        <a-form-item
          field="serviceTime"
          label="有效期:"
          :rules="formt.serviceTime"
          :validate-trigger="['change', 'input']"
        >
          <a-input
            class="form-input"
            v-model="form.serviceTime"
            placeholder="请输入有效期"
            :max-length="5"
            allow-clear
            @input="form.serviceTime = form.serviceTime.replace(/^(0+)|[^\d]+/g, '')
            "
          >
            <template #append> 天</template>
          </a-input>
        </a-form-item>
        <a-form-item
          label="权益信息:"
          :rules="[{ required: true }]"
          :validate-trigger="['change', 'input']"
        >
          <div class="message">
            <a-button
              type="primary"
              @click="addTable"
              style="margin-bottom: 10px"
              class="add"
              >添加</a-button
            >
            <a-table
              :columns="columns"
              :data="tableData"
              :pagination="false"
              column-resizable
              v-if="addTableClick === true"
            >
              <template #serviceName="{ record }">
                <a-input v-model="record.serviceName" 
                :max-length="15" 
                @input="record.serviceName=record.serviceName.replace(/\s+/g,'')"
                
                />
              </template>
              <template #totalNum="{ record }">
                <div class="group">
                  <a-radio-group v-model="record.totalNum" class="radio">
                    <div class="radioTimes">
                      <a-radio :value="-1">不限次</a-radio>
                      <a-radio
                        :value="record.totalNum >= 0 ? record.totalNum : 0"
                      >
                        限次
                      </a-radio>
                    </div>
                  </a-radio-group>
                  <div v-if="record.totalNum >= 0">
                    <a-input-number
                      v-model="record.totalNum"
                      size="medium"
                      class="input"
                      :formatter="formatter"
                      :min="1"
                      :hide-button="true"
                    />次
                  </div>
                </div>
              </template>
              <template #serviceType="{ rowIndex,record }">
                <a-input
                  v-model="tableData[rowIndex].serviceType"
                  :max-length="30"
                  @input="record.serviceType=record.serviceType.replace(/\s+/g,'')"

                />
              </template>
              <template #serviceIcon="{ record, rowIndex }">
                <div @click="have(rowIndex)">
                  <a-upload
                    :customRequest="customRequest2"
                    :show-file-list="false"
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
                          v-if="record.serviceIcon"
                        >
                          <!-- <img :src="file.base64" v-if="file.base64" /> -->
                          <img :src="record.serviceIcon" />
                        </div>
                        <div class="arco-upload-picture-card" v-else>
                          <div class="arco-upload-picture-card-text">
                            <IconPlus />
                          </div>
                        </div>
                      </div>
                    </template>
                  </a-upload>
                  <upload
                    v-if="ulvisible"
                    :visible="true"
                    :fileSrc="fileSrc"
                    @handleConfirm="handleConfirm"
                    @handleClose="handleClose"
                  >
                  </upload>
                </div>
              </template>
              <template #delete="{ rowIndex, record }">
                <a-button type="primary" @click="delData(rowIndex, record.uid)"
                  >删除</a-button
                >
              </template>
            </a-table>
          </div>
        </a-form-item>

        <a-space class="button">
          <a-button @click="handleCancel" class="cancleButton">取消</a-button>
          <a-button type="primary" html-type="submit">确定</a-button>
        </a-space>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import {
  defineProps,
  defineEmits,
  ref,
  reactive,
  computed,
  watch,
  getCurrentInstance,
  nextTick,
} from "vue";
import type { TableColumnData } from "@arco-design/web-vue/es/table/interface";
import { Message } from "@arco-design/web-vue";
import {
  getsystem,
  detail,
  PolicyRecord,
  delstrategyService,
  createService,
  editeService,
  uploadIcon,
  getType
} from "@/api/account";
import { listDetails, credential } from "@/api/icon";
import useLoading from "@/hooks/loading";
import { VueCropper } from "vue-cropper";
import upload from "@/components/fileUpload/upload.vue";

const { loading, setLoading } = useLoading(true);
// let { ctx: that, proxy }: any = getCurrentInstance()
// that.$forceUpdata()
// 表单
const generateFormModel = () => {
  return {
    strategyName: "",
    strategyValue: "",
    strategyEnum: "",
    brand: "",
    serviceTime: "",
    uid: "",
    status: "",
  };
};
// 表单校验
const validateField = (value: any, e: any): any => {
  let reg = /^[^\s]*$/;
  if (!reg.test(value)) {
    e("不能输入空格");
  }
};
const validateServiceTime = (value: any, e: any): any => {
  let reg = /^[0-9]*[1-9][0-9]*$/;
  if (!reg.test(value)) {
    e("只能输入正整数");
  }
};
const formt: any = reactive({
  strategyName: [
    { required: true, message: "请输入服务套餐名称" },
    { validator: validateField },
  ],
  strategyValue: [
    { required: true, message: "请输入策略标识" },
    { validator: validateField },
  ],
  strategyEnum: [
    { required: true, message: "请输入商品编码" },
    { validator: validateField },
  ],
  serviceTime: [
    { required: true, message: "请输入有效期" },
    { validator: validateServiceTime },
  ],
});
const formatter = (value: any) => {
  if (value) {
    value = value.replace(/^(0+)|[^\d]+/g, "").slice(0, 5);
  }
  return value;
};

const fieldNames = { value: "id", label: "name" };
const brandData: any = reactive({ data: [] });
// const brandStatus = async (type: "brandEnum") => {
//   try {
//     const { data } = await getType(type);
//     brandData.data = data.map((item: any) => {
//       return item;
//     });
//   } catch (err) {
//     // you can report use errorHandler or other
//   }
// };
// brandStatus("brandEnum");
// 表格
const form = ref(generateFormModel());
const props: any = defineProps({
  isShow: {
    type: Boolean,
    defalut: "false",
  },
});

// 添加表格
const addTableClick = ref(false);

const columns = computed<TableColumnData[]>(() => [
  {
    title: "序号",
    dataIndex: "order",
    slotName: "order",
    render: ({ rowIndex }) => rowIndex + 1,
    width: 80,
    align: "center",
  },
  {
    title: "权益名称",
    dataIndex: "serviceName",
    slotName: "serviceName",
    width: 150,
    align: "center",
  },
  {
    title: "权益次数",
    dataIndex: "totalNum",
    slotName: "totalNum",
    width: 300,
    align: "center",
  },
  {
    title: "策略标识",
    dataIndex: "serviceType",
    slotName: "serviceType",
    width: 200,
    align: "center",
  },
  {
    title: "权益icon",
    dataIndex: "serviceIcon",
    slotName: "serviceIcon",
    align: "center",
  },
  {
    dataIndex: "delete",
    slotName: "delete",
    align: "center",
  },
]);
// const tableData=ref<PolicyRecord[]>([]);
const tableData = reactive([
  {
    order: "",
    serviceName: "",
    totalNum: -2,
    serviceType: "",
    serviceIcon: "",
  },
]);
tableData.length = 0;

// 添加
const addTable: any = () => {
  addTableClick.value = true;
  if (tableData.length < 100) {
    tableData.push({
      order: "",
      serviceName: "",
      totalNum: -2,
      serviceType: "",
      serviceIcon: "",
    });
  } else {
    return;
  }
};

// 删除
const delData = (rowIndex: any, uid: any) => {
  tableData.splice(rowIndex, 1);
};

const buildsystem = async (
  data: any = {
    strategyName: form.value.strategyName,
    strategyValue: form.value.strategyValue,
    strategyEnum: form.value.strategyEnum,
    brand: form.value.brand,
    serviceTime: form.value.serviceTime,
    strategyServiceAddRequests: [...tableData],
  }
) => {
  try {
    if (form.value.brand == "1") {
      data.strategyEnum = "cy-" + form.value.strategyEnum;
    } else {
      data.strategyEnum = "ym-" + form.value.strategyEnum;
    }
    const res: any = await createService(data);
    if (res.code === 0) {
      Message.success({
        content: res.msg,
      });
    } else {
      Message.error({
        content: res.msg,
      });
    }
  } catch (err) {}
};
const formRef = ref();
const emit = defineEmits(["isShow", "addShow", "isShowError"]);
const handleCancel = () => {
  emit("addShow", false);
  addTableClick.value = false;
  tableData.length = 0;
  // formRef.value.resetFields();
  form.value = generateFormModel();
};

const file: any = ref({});
// 弹框
const ulvisible: any = ref(false);
const fileSrc: any = ref({});
const imgFlag: any = ref(false);
// 自定义上传
const customRequest2: any = async (options: any) => {
  // 校验文件宽高
  const file = options.fileItem;
  const reader = new FileReader();
  // 使用 Promise 包装 reader.onload 事件
  await new Promise((resolve) => {
    reader.onload = (e) => {
      const img = new Image();
      img.src = file.url;
      img.onload = () => {
        const width = img.width;
        const height = img.height;
        if (width < 81 || height < 81) {
          Message.error("图片过小，图片尺寸为81*81像素");
          imgFlag.value = true;
        } else {
          imgFlag.value = false;
        }
        resolve(true); // 执行完成后调用 resolve() 来通知 Promise 已完成
      };
    };
    reader.readAsDataURL(new Blob([file]));
  });

  if (imgFlag.value) {
    return false;
  }
  const isJpgOrPng =
    options.fileItem.file.type === "image/jpeg" ||
    options.fileItem.file.type === "image/png" ||
    options.fileItem.file.type === "image/jpg";
  if (!isJpgOrPng) {
    Message.error("格式错误,只能上传jpg、jpeg、png");
    return false;
  }
  const { fileItem } = options;
  fileSrc.value = fileItem;
  ulvisible.value = true;
  return true;
};
const index = ref();
const have = (rowIndex: any) => {
  index.value = rowIndex;
};
// 模态框确认
const handleConfirm = async (val: any) => {
  // 此处因为没有文件名 重新增加了一个文件 并改成原来的图片名字
  const reNamedFile = new File([val.file], fileSrc._rawValue.file.name);
  try {
    const formData = new FormData();
    formData.append("file", reNamedFile);
    const res = await uploadIcon(formData);
    tableData[index.value].serviceIcon = res.data;
    file.value = val;
    ulvisible.value = false;
  } catch (error) {}
};
// 模态框取消
const handleClose = (val: boolean) => {
  ulvisible.value = val;
};
// 确定
const editorList = ({ values, errors }: any) => {
  if (errors == undefined && tableData.length !== 0) {
    const sn = ref();
    const stN = ref(); //权益次数
    const st = ref(); //策略标识
    const sI = ref();
    tableData.forEach((item: any) => {
      if (item.serviceName == "") {
        sn.value = item.serviceName;
      }
      if (item.totalNum == 0 || item.totalNum == -2) {
        stN.value = item.totalNum;
      }
      if (item.serviceType == "") {
        st.value = item.serviceType;
      }
      if (item.serviceIcon == "") {
        sI.value = item.serviceIcon;
      }
    });
    if (sn.value == "" && stN.value == -2 && st.value == "" && sI.value == "") {
      emit("isShow", true);
      Message.error("请将权益信息填写完整");
    } else if (sn.value == "") {
      Message.error("请补充权益名称");
      emit("isShow", true);
    } else if (stN.value == 0 || stN.value == -2) {
      Message.error("请补充权益次数");
      emit("isShow", true);
    } else if (st.value == "") {
      Message.error("请补充策略标识");
      emit("isShow", true);
    } else if (sI.value == "") {
      Message.error("请补充权益Icon");
      emit("isShow", true);
    } else {
      buildsystem();
      emit("isShow", false);
      addTableClick.value = false;
      form.value = generateFormModel();
      tableData.length = 0;
    }
  } else if (tableData.length === 0) {
    Message.error("请将权益信息填写完整");
    //   emit("isShowError", true);
  }
};
</script>

<style scoped lang="less">
.textarea {
  margin-top: 20px;
}

.accountspan {
  display: inline-block;
  width: 200px;
  margin-left: 15px;
}

.account {
  display: flex;
  justify-content: start;
}

.space {
  display: flex;
  justify-content: end;
}

.button {
  display: flex;
  justify-content: end;
  margin-top: 50px;
}
.form-input {
  width: 55%;
}
.cancleButton {
  margin-right: 10px;
}

.message {
  display: flex;
  flex-direction: column;
  .add {
    width: 50px;
  }
}
.box {
  margin-left: 25px;
  width: 1100px;
}
.group {
  display: flex;
  flex-direction: row;
}
.radio {
  display: flex;
  flex-direction: row;
  .radioTimes {
    display: flex;
    flex-direction: row;
  }
}
.input {
  width: 80px;
}
</style>
