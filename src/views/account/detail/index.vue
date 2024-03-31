<template>
  <div class="container">
  <Breadcrumb :items="['menu.account', 'menu.account.sojourn.list','menu.account.sojourn.detail']" />
     <a-space direction="vertical" :size="16" fill>
       <a-card class="general-card">
        <div class="text-top">
          <span>基本信息</span>
          <!-- <span class="status" style="background-color:#ec808d;color:#6d000e;font-size: 20px;" v-if="">分账状态：分账失败</span> -->
          <span class="status" style="background-color:#e6f7ff;border:1px solid #91d5ff;color: #1890ff;font-size: 20px;" >账户状态：{{basicInformation.basic.accountStatus}}</span>

          </div> 
      <!-- {{basicInformation.basic}} -->
        <a-row class="grid-demo" >
          <a-col :span="8">
            <div class="item">
             服务商ID: <span class="item_text">{{basicInformation.basic.subMchId}}</span>
            </div>
          </a-col>
          <a-col :span="8">
            <div class="item">
              服务商名称:
                <span class="item_text">{{basicInformation.basic.subMchName}}</span>
            </div>
          </a-col>
        </a-row>
        <a-row class="grid-demo">
          <a-col :span="8">
            <div class="item">
            业务类型: <span class="item_text">{{businessTypes.data}}</span>
          
            </div>
          </a-col>
          <a-col :span="8">
            <div class="item">
             商户编号: <span class="item_text">{{basicInformation.basic.subMchNo}}</span>
            </div>
          </a-col>
          <a-col :span="8">
            <div class="item">
              结算周期:<span class="item_text">{{basicInformation.basic.subMchSettleCycle}}</span>
            </div>
          </a-col>
        </a-row>
        
       </a-card>
     <a-card class="general-card">
      <div class="account">
        <div class="text">分账信息</div>
        <div class="tabs">
          <a-tabs default-active-key="1">
            <a-tab-pane key="1" :title="base.data[0]?.businessType">
              <div class="table">
                <!-- <a-table
                  :pagination="false"
                  :columns="account"
                  :bordered="{ cell: true }"
                  :size="size"
                  :data="base.data"
                >
                </a-table> -->
                <accountTable :data="base.data"></accountTable>

              </div>
            </a-tab-pane>
            <a-tab-pane key="2" :title="sojourn.data[0]?.businessType" class="jun">
             <div class="table">
                <!-- <a-table
                 :pagination="false"
                  :columns="account"
                  :bordered="{ cell: true }"
                  :size="size"
                  :data="sojourn.data"
                >
                </a-table> -->
                <accountTable :data="sojourn.data"></accountTable>

              </div>
            </a-tab-pane>
            <a-tab-pane key="3" :title="path.data[0]?.businessType">
               <div class="table">
                <!-- <a-table
                 :pagination="false"
                  :columns="account"
                  :bordered="{ cell: true }"
                  :size="size"
                  :data="path.data"
                >
                </a-table> -->
                <accountTable :data="path.data"></accountTable>
              </div>
            </a-tab-pane>
          </a-tabs>
        </div>
      </div> 
     </a-card>

     <a-card class="general-card">
 <div class="record">
        <div class="text">日志记录</div>
        <div class="record-table">
          <a-table
            row-key="id"
            :pagination="pagination"
            :columns="(cloneColumns as TableColumnData[])"
            :data="logInformation.data"
            :bordered="{ cell: true }"
            :size="size"
            @page-change="onPageChange"
          >
            <template #index="{ rowIndex }">
              {{
                rowIndex + 1 + (pagination.current - 1) * pagination.pageSize
              }}
            </template>
            <template #proportion="{ record }">
             {{ record.proportion=='-'?record.proportion:Number(record.proportion )
              .toFixed(2)
              .toString()
              .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")+'%' }}
            </template>
              <template #amount="{ record }">
             {{
              record.amount=='-'?record.amount:
              Number(record.amount)
              .toFixed(2)
              .toString()
              .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")+'元'
             }}
            </template>
          </a-table>
        </div>
      </div>
     </a-card>
    
     </a-space>
  </div>
</template>


<script setup lang="ts">
import { computed, ref, reactive, watch,onMounted} from "vue";
import { useI18n } from "vue-i18n";
import useLoading from "@/hooks/loading";
import { PolicyRecord} from "@/api/account";
import { Pagination } from "@/types/global";
import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
import type { TableColumnData } from "@arco-design/web-vue/es/table/interface";
import cloneDeep from "lodash/cloneDeep";
// import Sortable from 'sortablejs';
import { useRouter, useRoute } from "vue-router";
import  accountTable   from '../components/accountTable.vue'

const route = useRoute();
type SizeProps = 'mini' | 'small' | 'medium' | 'large';
type Column = TableColumnData & { checked?: true };

const { loading, setLoading } = useLoading(true);

const renderData = ref<PolicyRecord[]>([]);
// const form = ref(generateFormModel());
const cloneColumns = ref<Column[]>([]);
const showColumns = ref<Column[]>([]);
const size = ref<SizeProps>('medium');
// console.log(router);

const basePagination: any = {
    current: 1,
    pageSize:10 ,
  };
  const pagination = reactive({
    ...basePagination,
  });



 const columns = computed<TableColumnData[]>(() => [
    {
      title:"序号",
      dataIndex: 'id',
      align: "center",

   },  
     {
      title:"业务类型",
      dataIndex: 'subMchBusinessType',
      align: "center",

   }, 
    {
      title: "分账模式",
      dataIndex: 'pattern',
      align: "center",

   }, 
    {
      title:"分账方式",
      dataIndex: 'way',
      align: "center",

   }, 
    {
      title: "分账比例",
      dataIndex: 'proportion',
      slotName: 'proportion',
      align: "center",

   }, 
    {
      title: "分账金额",
      dataIndex: 'amount',
         slotName: 'amount',
      align: "center",

   },
   {
      title: "创建时间",
      dataIndex: 'createAt',
      align: "center",

   }, 
   {
      title: "账单编号",
      dataIndex: 'billNo',
      align: "center",

   }, 
     {
      title:"分账状态",
      dataIndex: 'status',
      align: "center",

   }
 ]);

//基本信息
const basicInformation: any = reactive({basic:[]});
const businessTypes:any=reactive({data:[]});
const fetchData = async (
  params: any = { merchantId: route.query.id }
) => {
  setLoading(true);
  try {
    const { data } = await merchantList(params);
    // null值为 -
    const result:any = {};
      for (const prop in data) {
        if (data[prop] === null) {
          result[prop] = "-";
        } else {
          result[prop] = data[prop];
        }
      }
    basicInformation.basic = result
    businessTypes.data=data.businessTypes.join()
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};

// 分账信息

const LegderbillList: any = reactive({ data: [] });
  // 基地商品
const base:any = reactive({
  data:[]
})
  // 旅居服务
const sojourn: any = reactive({
  data:[]
}) 
  // 路线商品
const path: any = reactive({
  data:[]
})
const LedgerBill = async (
  params: any = { merchantId: route.query.id }
) => {
  setLoading(true);
  try {
    const { data } = await getLedgerBill(params);
    console.log(data);
    
    LegderbillList.data = data
    base.data = [
     ...LegderbillList.data[0].ledgerBillConfigInfos
    ]
    sojourn.data = [
    ...LegderbillList.data[1].ledgerBillConfigInfos
    ]
    path.data = [
    ...LegderbillList.data[2].ledgerBillConfigInfos
  
   ]
    
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};


// 日志记录
const logInformation: any = reactive({data:[]});
const getlogData = async (
  params: any = {current: 1, size: 10, merchantId:route.query.id,}
) => {
  setLoading(true);
  try {
    const { data } = await getLoglist(params);
         //如果是null置为-
   const result = data.records.map((obj:any) => {
   const modifiedObj:any = {};
      for (const prop in obj) {
        if (obj[prop] === null) {
          modifiedObj[prop] = "-";
        } else {
          modifiedObj[prop] = obj[prop];
        }
      }
    return modifiedObj;
});
    logInformation.data=result
    pagination.current = data.current;
    pagination.total = data.total;
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};
const onPageChange = (current: number) => {
  getlogData({size:basePagination.pageSize,current, merchantId:route.query.id})

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

onMounted(() => {
  //获取id
  fetchData(route.query.id);
  LedgerBill(route.query.id);
  getlogData(route.query.id)
});
</script>

<script lang="ts">
export default {
  name: "DetailView",
};
</script>


<style lang="less">
.container {
    padding: 0 20px 20px 20px;
  }
  .general-card{
    padding-top: 20px;
    .text-top{
    display: flex;
    justify-content: space-between; 
  font-size: 16px;
  font-weight: bold;
    .status{
      font-weight: 400;
      display: inline-block;
      padding : 10px;
      border-radius: 5px;
    }
    }
  }
  .card_context {
    margin: 20px;
  }
  .grid-demo {
    // margin: 10px 0 20px 50px;
    margin-top: 15px;
    .item{
       font-size: 15px;
       font-weight: 600;
    }
    .item_text {
      color: #bcbcbc;
      font-size: 15px;
       font-weight: 400;
    }
  } 
   .text{
    margin-bottom: 20px;
  font-size: 16px;
  font-weight: bold;
  }

.account {
 

  .arco-tabs-tab:nth-child(2) {
    margin-left: 150px;
  }
  .arco-tabs-tab:nth-child(3) {
    margin-left: 150px;
  }
}
.record {
  .record-table {
    margin-top: 20px;
  }
}

.item .arco-form-item-label {
  font-size: 16px;
}
</style>