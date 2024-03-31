<template>
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
const { visible, limitWidth, limitHeight } = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  fileSrc: {
    type: Object,
    default: () => { }
  },
  limitWidth: {
    type: Number,
    default: 81
  },
  limitHeight: {
    type: Number,
    default: 81
  }
})
const emit = defineEmits<{
  (e: 'handleConfirm', visible: boolean): void,
  (e: 'handleClose', visible: boolean): void
}>()

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
}
</script>

<style lang="scss" scoped></style>