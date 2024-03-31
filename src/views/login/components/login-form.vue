<template>
  <div class="login-form-wrapper" style="width: 90%;">
    <div class="login-form-title">{{ $t("login.form.title") }}</div>
    <!--     <div class="login-form-sub-title">{{ $t('login.form.title') }}</div> -->
    <div class="login-form-error-msg">{{ errorMessage }}</div>
    <a-form ref="loginForm" :model="userInfo" class="login-form" auto-label-width @submit="handleSubmit">
      <a-form-item field="username" :rules="[
        { required: true, message: $t('login.form.userName.errMsg') },
        { maxLength: 100, message: '最大长度为100' },
      ]" :validate-trigger="['change', 'blur']" hide-label>
        <a-input allow-clear max-length="100" v-model="userInfo.username"
          :placeholder="$t('login.form.userName.placeholder')">
          <template #prefix>
            <icon-user />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item field="password" :rules="[
        { required: true, message: $t('login.form.password.errMsg') },
        { maxLength: 100, message: '最大长度为100' },
      ]" :validate-trigger="['change', 'blur']" hide-label>
        <a-input-password max-length="100" v-model="userInfo.password"
          :placeholder="$t('login.form.password.placeholder')" allow-clear>
          <template #prefix>
            <icon-lock />
          </template>
        </a-input-password>
      </a-form-item>
      <!-- 图片验证码 -->
      <!-- <a-form-item
        field="code"
        :rules="[
          { required: true, message: $t('login.form.verificationCode.errMsg') },
        ]"
        :validate-trigger="['change', 'blur']"
        hide-label
      >
        <a-input
          v-model="userInfo.code"
          :placeholder="$t('login.form.password.verificationCode.placeholder')"
          :max-length="4"
          style="width: 200px"
          class="code"
        >
          <template #prefix>
            <icon-safe />
          </template>
        </a-input>
        <div style="position: relative" @click="fearch">
          <img
            :src=code
            alt=""
            class="login-img"
          />
          <span class="login-img-text" @click="fearch">换一张</span>
        </div>
      </a-form-item> -->

      <a-space :size="16" direction="vertical">
        <div class="login-form-password-actions">
          <a-checkbox checked="rememberPassword" :model-value="loginConfig.rememberPassword"
            @change="setRememberPassword as any">
            {{ $t("login.form.rememberPassword") }}
          </a-checkbox>
        </div>

        <a-button type="primary" html-type="submit" :loading="loading" long class="login-btn">
          {{ $t("login.form.login") }}
        </a-button>
        <!--   <a-button type="text" long class="login-form-register-btn">
          {{ $t('login.form.register') }}
        </a-button> -->
      </a-space>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import { Message, getLocale } from "@arco-design/web-vue";
import { ValidatedError } from "@arco-design/web-vue/es/form/interface";
import { useI18n } from "vue-i18n";
import { useStorage } from "@vueuse/core";
import { useUserStore, useLoginStore } from "@/store";
import useLoading from "@/hooks/loading";
import type { LoginData } from "@/api/user";
import { login } from "@/api/login";
import { random } from "lodash";
import { dir } from "console";

import { DEFAULT_LAYOUT } from "@/router/routes/base";
import informationManagement from "@/views/serviceItemIcon/list/index.vue";
import organization from "@/views/serviceItemIcon/list/organization.vue";
import position from "@/views/serviceItemIcon/list/position.vue";
import supplier from "@/views/serviceItemIcon/list/supplier.vue";
import warehouseDetails from "@/views/account/list/warehouseDetails.vue";
import putInAndOutOfStorage from "@/views/account/list/index.vue";
import inventoryDetails from "@/views/account/list/inventoryDetails.vue";
import wareDetails from "@/views/account/list/wareDetails.vue";
import { appRoutes, formatModules } from "@/router/routes";


const router = useRouter();
const { t } = useI18n();
const errorMessage = ref("");
const { loading, setLoading } = useLoading();
const userStore = useUserStore();
const LoginStore = useLoginStore();
const code: any = ref();
const that = window;
// LoginStore.randomStr = Date.now()
code.value = "";
const loginConfig = useStorage("login-config", {
  rememberPassword: true,
  username: "", // 演示默认值
  password: "", // demo default value
  verificationCode: "",
});
const userInfo = reactive({
  username: loginConfig.value.username,
  password: loginConfig.value.password,
  // code: loginConfig.value.verificationCode,
  // randomStr:LoginStore.randomStr
});

// 登陆
const handleSubmit = async ({
  errors,
  values,
}: {
  errors: Record<string, ValidatedError> | undefined;
  values: Record<string, any>;
}) => {
  errorMessage.value = "";
  if (loading.value) return;
  if (!errors) {
    try {
      await userStore.login(values as LoginData);
      const { redirect, ...othersQuery } = router.currentRoute.value.query;
      const role: any = localStorage.getItem("roles");
      if (role == 3) {
        router.push({
          name: "supplierOrder",
        });
      } else {
        router.push({
          name: (redirect as string) || "Welcome",
          query: {
            ...othersQuery,
          },
        });
      }

      Message.success(t("login.form.login.success"));
      const { rememberPassword } = loginConfig.value;
      const { username, password } = values;
      // 实际生产环境需要进行加密存储。
      // The actual production environment requires encrypted storage.
      loginConfig.value.username = rememberPassword ? username : "";
      loginConfig.value.password = rememberPassword ? password : "";

      const transformComponent = (children: any) => {
        const componentMap: any = {
          informationManagement: informationManagement,
          organization: organization,
          position: position,
          supplier: supplier,
          warehouseDetails: warehouseDetails,
          putInAndOutOfStorage: putInAndOutOfStorage,
          inventoryDetails: inventoryDetails,
          wareDetails: wareDetails,
        };
        if (componentMap.hasOwnProperty(children)) {
          return componentMap[children];
        }
      };
    } catch (err: any) {
      errorMessage.value = err.response.data.msg;
      // fearch()
    } finally {
    }
  }
};

const setRememberPassword = (value: boolean) => {
  loginConfig.value.rememberPassword = value;
};

// const fearch = () => {
//   LoginStore.randomStr = Date.now()
//   obtainingTheVerificationCode({randomStr:LoginStore.randomStr}).then((res:any)=>{
//     code.value =  'data:image/png;base64,' +
//     window.btoa(
//       new Uint8Array(res).reduce(
//         (data, byte) => data + String.fromCharCode(byte),
//         ''
//       )
//     );
//   })
// };

onMounted(() => {
  // fearch()
});
</script>

<style lang="less" scoped>
.login-form {
  &-wrapper {
    width: 400px;
  }

  &-title {
    color: var(--color-text-1);
    font-weight: 500;
    font-size: 24px;
    line-height: 32px;
  }

  &-sub-title {
    color: var(--color-text-3);
    font-size: 16px;
    line-height: 24px;
  }

  &-error-msg {
    height: 32px;
    color: rgb(var(--red-6));
    line-height: 32px;
  }

  &-password-actions {
    /*   display: flex;
      justify-content: space-between; */
  }

  &-register-btn {
    color: var(--color-text-3) !important;
  }
}

.login-form-title {
  font-size: 24px;
  font-weight: bold;
}

/* .login-btn {
    position: relative;
    left: 108px;
    width: 200px;
  } */
.login-img {
  height: 40px;
  width: 120px;
  // background-color: aqua;
  margin-left: 10px;
  position: relative;
}

.login-img-text {
  font-size: 13px;
  position: relative;
  top: -13px;
  left: 11px;
  color: rgb(134, 140, 145);
}
</style>
