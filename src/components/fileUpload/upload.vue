<template>
  <!-- <div>
     <a-upload :customRequest="customRequest2" :show-file-list="false">
                <template #upload-button>
                  <div :class="`arco-upload-list-item${file && file.status === 'error' ? ' arco-upload-list-item-error' : ''
                    }`">
                    <div class="arco-upload-list-picture custom-upload-avatar"
                      v-if="(file && file.base64) || serviceIcon">
                      <img :src="file.base64" v-if="file.base64" />
                      <img :src="serviceIcon" v-else>
                    </div>
                    <div class="arco-upload-picture-card" v-else>
                      <div class="arco-upload-picture-card-text">
                        <IconPlus />
                      </div>
                    </div>
                  </div>
                </template>
              </a-upload>
        </div> -->
  <div>
      <a-modal :visible="visible" @ok="handleOk" @cancel="handleCancel">
      <template #title>
        图片裁剪
      </template>
      <!-- 图片裁切插件 -->
      <VuePictureCropper 
      :boxStyle="{
        width: '100%',
        height: '100%',
        backgroundColor: '#f8f8f8',
        margin: 'auto',
      }" 
      :img="fileSrc.url" 
      :options="{
        viewMode: 1,
        dragMode: 'move',
        aspectRatio: 1,
        cropBoxResizable: false,
      }"
       :presetMode="{
        mode: 'fixedSize',
        width: 81,
        height: 81,
      }"/>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, defineEmits, reactive } from "vue"
import VuePictureCropper, { cropper } from 'vue-picture-cropper'
import { Message } from '@arco-design/web-vue';
// import { IconEdit, IconPlus } from '@arco-design/web-vue/es/icon';
const { visible, limitWidth, limitHeight } = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  fileSrc: {
    type: Object,
    default: () => { }
  },
  // serviceIcon: {
  //   type: String,
  //   require:true
  // },
  limitWidth: {
    type: Number,
    default: 81
  },
  limitHeight: {
    type: Number,
    default: 81
  },
})


const emit = defineEmits<{
  (e: 'handleConfirm', visible: boolean): void,
  (e: 'handleClose', visible: boolean): void
}>()
// const file: any = ref({});
// // 弹框
// const ulvisible: any = ref(false)
// const fileSrc: any = ref({})
// const imgFlag: any = ref(false)
// 自定义上传
// const customRequest2: any = async(options: any) => {
//    // 校验文件宽高
//    const file = options.fileItem;
//   const reader = new FileReader();
//  // 使用 Promise 包装 reader.onload 事件
//   await new Promise((resolve) => { 
//     reader.onload = (e) => {
//       const img = new Image();
//       img.src = file.url;
//       img.onload = () => {
//         const width = img.width;
//         const height = img.height;
//         if (width < 81 || height < 81) {
//           Message.error('图片过小，图片尺寸为81*81像素');
//           imgFlag.value = true;
//         } else {
//           imgFlag.value = false;
//         }
//         resolve(true); // 执行完成后调用 resolve() 来通知 Promise 已完成
//       };
//     };
//     reader.readAsDataURL(new Blob([file]));
//   });

//   if (imgFlag.value) {
//     return false;
//   }

//   const isJpgOrPng = options.fileItem.file.type === 'image/jpeg' || options.fileItem.file.type === 'image/png' || options.fileItem.file.type === 'image/jpg';
//   if (!isJpgOrPng) {
//     Message.error('格式错误,只能上传jpg、jpeg、png');
//     return false;
//   }
//   const { fileItem } = options
//   fileSrc.value = fileItem
//   ulvisible.value = true
//   return true
// }

const result:any = reactive({})
// 获取裁切结果
const handleOk = async ():Promise<void> => {
  const base64: string = cropper.getDataURL()
  // 获取生成的blob文件信息
  const blob: Blob = await cropper.getBlob()
  // 获取生成的file文件信息
  const file = await cropper.getFile({
    /* fileName: '123', */
  })
  // console.log({ base64, blob, file })
  // 把base64赋给结果展示区
  result.base64 = base64
  result.dataURL = blob
  result.file = file
  try {
    result.blobURL = URL.createObjectURL(blob)
  } catch (e) {
    result.blobURL = ''
  }
  emit('handleConfirm', result)
};
const handleCancel = () => {
  emit('handleClose', false)
  // ulvisible.value = false
}
</script>

<style lang="scss" scoped></style>