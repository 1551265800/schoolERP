<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div>
    <a-modal
      v-model:visible="props.deleteShow"
      @ok="handOk"
      @cancel="handleCancel"
      title-align="start"
    >
      <template #title> 提示 </template>
      <div class="key">是否确认删除此服务套餐？</div>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from "vue";
import { deleteService ,delstrategyService} from "@/api/account";
import { Message } from '@arco-design/web-vue';

const props: any = defineProps({
  deleteShow: {
    type: Boolean,
    defalut: "false",
  },
  deleteUid: {
    type: String,
    required: true,
  },
});

// 删除接口
const deleteDatas = async () => {

  try {
    const res: any = await deleteService(props.deleteUid);
    if (res.code === 0) {
      Message.success({
        content: "成功",
      });
    } else {
      Message.error({
        content: res.data,
      });
    }
  } catch (err) {}
};
const emit=defineEmits(["deleteClose","deleteCancel"])
const handOk = () => {
  deleteDatas();
  emit("deleteClose");
};

const handleCancel = () => {
  emit("deleteCancel");
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
}
.cancleButton {
  margin-right: 10px;
}
.key{
  color:#999
}
</style>
