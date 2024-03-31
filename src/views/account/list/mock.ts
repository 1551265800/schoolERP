import Mock from "mockjs";
import qs from "query-string";
import setupMock, { successResponseWrap } from "@/utils/setup-mock";
import { GetParams } from "@/types/global";

const { Random } = Mock;

const data = Mock.mock({
  "list|55": [
    {
      "subMchId|8": /[A-Z][a-z][-][0-9]/,
      "subMchName|1": ["机构名称"],
      "subMchNo|8": /[0-9]/,
      "accountStatus|1":["正常","已注销"],
      createdTime: Random.datetime(),
    },
  ],
});

setupMock({
  setup() {
    Mock.mock(new RegExp("/api/account/policy"), (params: GetParams) => {
      const { current = 1, pageSize = 10 } = qs.parseUrl(params.url).query;
      const p = current as number;
      const ps = pageSize as number;
      return successResponseWrap({
        list: data.list.slice((p - 1) * ps, p * ps),
        total: 55,
      });
    });

    //  Mock.mock(new RegExp("/merchant/account"), (params: any) => {
    //   return successResponseWrap({
    //     code: 0,
    //     msg: "",
    //     data: {
    //       subMchId: qs.parseUrl(params.url).query[0],
    //       subMchName: "服务商名称名称",
    //       subMchNo: "9854126874",
    //       subMchBizType: ["基地商品", "旅居服务", "路线产品"],
    //       subMchSettleCycle: "按单结算",
    //     },
    //   });
    //  });
    
    //  Mock.mock(new RegExp("/ledger-bill-config"), (params: any) => {
    //     return successResponseWrap({
    //       "code": 0,
    //       "msg": "获取成功",
    //       "data": [
    //         {
    //           "id": 1,
    //           "businessType": "基地商品",
    //           "subMchBusinessType": "旅居商城(基地)",
    //           "ledgerBillConfigInfos": [
    //             {
    //               "id": 1,
    //               "businessType": "基地商品",
    //               "pattern": "按阶段付费模式-出行前1日结算",
    //               "way": "按进货价分账",
    //               "days": 1,
    //               "proportion": 20.05
    //             },
    //             {
    //               "id": 2,
    //               "businessType": "基地商品",
    //               "pattern": "按阶段付费模式-进行中结算",
    //               "way": "按进货价分账",
    //               "days": null,
    //               "proportion": 30.55
    //             },
    //             {
    //               "id": 3,
    //               "businessType": "基地商品",
    //               "pattern": "按阶段付费模式-已完成结算",
    //               "way": "按进货价分账",
    //               "days": null,
    //               "proportion": 49.40
    //             }
    //           ]
    //         }]
    //     });
    // });
  },
});
