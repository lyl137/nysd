<template>
  <div>
   <!-- 添加 -->
   <el-row>
      <el-button class="add" type="primary" @click="dialogFormVisible = true; field = {}">+新增订单</el-button>
   </el-row>
   <br>

   <!-- 表格-start -->
   <template>
            <el-table :data="orderData" border :max-height="tableHeight">
                <el-table-column prop="id" label="序号" width="60" header-align="center"
                    align="center"></el-table-column>
                <el-table-column prop="date" label="下单日期" width="100" header-align="center"
                    align="center"></el-table-column>
                <el-table-column prop="orderid" label="订单编号" width="120" header-align="center"
                    align="center"></el-table-column>
                <el-table-column prop="name" label="客户姓名" width="100" header-align="center"
                    align="center"></el-table-column>
                    <el-table-column prop="address" label="收货地址" width="160" header-align="center"
                    align="center"></el-table-column>
                    <el-table-column prop="product" label="购买产品" width="160" header-align="center"
                    align="center"></el-table-column>
                    <el-table-column prop="state" label="订单状态" width="160" header-align="center"
                    align="center"></el-table-column>
                <el-table-column label="操作" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini">编辑</el-button>
                        <el-button type="danger" size="mini">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </template>
   <!-- 表格-end -->
<br>
    <el-card style="margin-bottom: 20px">
      <div ref="echarts1" style="height: 300px"></div>
    </el-card>
  </div>
</template>
<script>
import * as echarts from "echarts";
export default {
  name: 'order',
  data() {
    return {
      dialogFormVisible:false,
      orderData:[
         {id:1,date:"2023/04/30",orderid:12345678910,name:"lyl",address:"xxx",product:"苹果",state:"已发货"},
         {id:2,date:"2023/05/03",orderid:12345678910,name:"sx",address:"xxx",product:"草莓",state:"未发货"},
         {id:3,date:"2023/05/05",orderid:12345678910,name:"cf",address:"xxx",product:"黄桃",state:"未发货"},
         {id:4,date:"2023/05/05",orderid:12345678910,name:"dyq",address:"xxx",product:"芭乐",state:"已发货"},
         {id:5,date:"2023/05/05",orderid:12345678910,name:"ywb",address:"xxx",product:"番茄",state:"已发货"},
         {id:6,date:"2023/05/06",orderid:12345678910,name:"krr",address:"xxx",product:"花生",state:"已发货"},
         {id:7,date:"2023/05/06",orderid:12345678910,name:"lll",address:"xxx",product:"蓝莓",state:"已发货"},
         {id:8,date:"2023/05/06",orderid:12345678910,name:"wjq",address:"xxx",product:"葡萄",state:"已发货"},
         {id:9,date:"2023/05/06",orderid:12345678910,name:"lxl",address:"xxx",product:"菠萝",state:"已发货"},
      ],
      tableHeight:window.innerHeight-300,
    }
  },
  mounted(){
    var mycharts1 = echarts.init(this.$refs.echarts1);
    var option1 = {
      title:{
          text:'各作物订单量统计图',
          left:'center',
          textStyle:{
            color:"#fff",
          }
        },
     
   // 背景色
   backgroundColor: "#303031",
   // 鼠标悬浮提示
   tooltip: {
      trigger: "axis",
      axisPointer: {
         type: "shadow",
      },
      backgroundColor: "rgba(9, 24, 48, 0.5)",
      borderColor: "rgba(75, 253, 238, 0.4)",
      textStyle: {
         color: "#FFf",
      },
   },
   // 图表填充盒子比例
   grid: {
      left: "20",
      right: "20",
      bottom: "20",
      top: "50",
      containLabel: true,
   },
   // x轴配置
   xAxis: {
      type: "category",
      data: ["草莓","黄桃","芭乐","番茄","花生","苹果","香蕉","芒果","石榴","西瓜","菠萝","葡萄","蓝莓"],
      // x轴线的样式
      axisLine: {
         lineStyle: {
            color: "rgba(118, 169, 250, .8)",
         },
      },
      // 是否显示x轴刻度尺
      axisTick: {
         show: false,
      },
      // x轴文字配置
      axisLabel: {
         interval: 0,
         formatter: function (value) {
            // 当文字长度大于2时,使用slice方法截取字符串并拼接省略号；否则直接返回原文字
            if (value.length > 2) {
               return `${value.slice(0, 2)}...`;
            } else {
               return value;
            }
         },
         color: "#fff",
         // 默认x轴字体大小
         fontSize: 12,
         // margin:文字到x轴的距离
         margin: 5,
      },
   },
   // y轴配置
   yAxis: {
      name: '订单量',//名称
      // // interval: 10,
      type: "value",
      axisTick: {
         show: false,
      },
      // y轴线样式
      axisLine: {
         show: false,
         lineStyle: {
            color: "#DCE2E8",
         },
      },
      // y轴文字样式
      axisLabel: {
         color: "#FFF",
      },
      // y轴每一条横线样式
      splitLine: {
         show: true,
         lineStyle: {
            type: "dashed",
            color: "rgba(118, 169, 250, .5)",
         },
      },
   },

   series: [
      {
         name: "订单量",
         // 柱子宽度
         barWidth: 100,
         // 塔尖柱子类型
         type: "pictorialBar",
         barCategoryGap: "0",
         // 必须引入该项
         symbol:
            "path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z",
         itemStyle: {
            //barBorderRadius: 5,
            //渐变色
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
               {
                  offset: 0,
                  color: "#00F6FF",
               },
               {
                  offset: 1,
                  color: "rgba(15, 31, 56, 0)",
               },
            ]),
         },
         // 柱状图上方数据
         label: {
            show: true,
            position: "top",
            color: "#FFF",
         },
         data: [200, 350, 250, 780, 860, 920, 480, 650, 100,300,500,400,900],
         z: 10,
      },
   ],

};
mycharts1.setOption(option1);
  }
}
</script>

<style>
.add {
    margin-left: 880px;
}
</style>