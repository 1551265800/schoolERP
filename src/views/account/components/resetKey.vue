<template>
    <div>
         <a-modal v-model:visible="props.showDialog" @ok="handleOk" @cancel="handleCancel" title-align="start">
    <template #title>
    提示
    </template>
    <div class="key" v-if="props.retryStatus=='启用'">
      禁用后,此服务套餐不可用于展示在C端,是否确认?
    </div>
    <div class="key" v-if="props.retryStatus=='禁用'">
     启用后,此服务套餐可用于展示在C端,是否确认?
    </div>
  </a-modal>

    </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref } from 'vue';
import { Message } from '@arco-design/web-vue';
import {action} from '@/api/account'
const props:any = defineProps({
  showDialog: {
      type: Boolean,
       defalut: 'false',
  },
  uid: {
    type:String,
    require:true
  },
  retryStatus: {
    type: String ,
    require:true
   
  }
});
// 刷新秘钥
const resetSecret = async (
) => {
  try {
    const res: any = await action(props.uid );
    if (res.code === 0) {
    Message.success({
    content: '成功'})
    }else{
       Message.error({
    content: res.data})
    }

  } catch (err) {

  }
};

const emit=defineEmits(['closeKey','closeCancel'])
const handleOk = () => {
  resetSecret()
  emit('closeKey')
}
const handleCancel = () => {
  emit('closeCancel')
}
</script>

<style scoped>
.key{
  font-size: 16px;
  text-align: center;
  color:#999
}
</style>