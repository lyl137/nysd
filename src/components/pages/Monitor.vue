<template>
  <div>
    <!-- <p>{{ message }}</p> -->
    <!-- <button @click="duankai">断开连接</button> -->
    <div class="moni">
      <div class="environment">

<el-card class="box-card">
<el-descriptions title="环境温度">
  <el-descriptions-item label="温度">{{wd}}­°C</el-descriptions-item>
  <!-- <el-descriptions-item label="版本号">{{bbh}}</el-descriptions-item>
  <el-descriptions-item label="百分比">{{bfb}}</el-descriptions-item> -->
</el-descriptions>
</el-card>

<el-card class="box-card">
<el-descriptions title="环境湿度">
  <el-descriptions-item label="湿度">{{sd}}%</el-descriptions-item>
</el-descriptions>
</el-card>

<el-card class="box-card">
<el-descriptions title="光照强度">
  <el-descriptions-item label="光照">{{ gz }}Lux</el-descriptions-item>
</el-descriptions>
</el-card>

</div>
<img class="moniVideo" id="videoStream" src="http://192.168.43.46:8080/?action=stream" alt="Video Stream"/>
</div>

<br>
    <el-card style="margin-bottom: 20px">
      <div ref="echarts1" style="height: 300px"></div>
    </el-card>

  </div>
</template>
<script>
import * as echarts from "echarts";
import * as mqtt from "mqtt/dist/mqtt.min";
export default {
  name: 'monitor',
  data() {
    return {
      mqttfalg: true,
      // message: "连接mqtt",
      mqttvalue: "mqtt接收的值",
      options: {
        connectTimeout: 4000, //超时时间
        clientId:
          "a1Y6RUaWDcj.temperature|securemode=2,signmethod=hmacsha256,timestamp=1712837342085|", //id
        username: "temperature&a1Y6RUaWDcj", //用户名
        password: "5236ab0c22a6083185d3f940123f792155118b5845b1458d6de970ff947f6348", //密码
        cleanSession: false,
        keepAlive: 60, //心跳值，心跳值太大可能会连接不成功，这个参考文档
      },
      client: null,
      wd: "",
      kg1: false,
      sd: "",
      kg2: false,
      gz: "",
      kg3: false,
      // bbh: "",
      // bfb: "",
    }
  },
  mounted() {
    // 默认连接可以手动设置连接
    this.connect();
    var mycharts1 = echarts.init(this.$refs.echarts1);
    var option1 = {
      title:{
          text:'降水量/温度监测统计图',
          left:'center',
          textStyle:{
            color:"#fff",
          }
        },
    backgroundColor: '#1b2735',
    tooltip: {//提示框组件
        trigger: 'axis',//触发类型 柱状图
        axisPointer:{type:'shadow'} //触发效果 移动上去 背景效果
    },    
    xAxis: [//x轴
        {
            type: 'category',//坐标轴类型 离散
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月','9月','10月','11月','12月'],//数据
            axisTick:false,//是否显示刻度
            axisLine: {//坐标轴样式
                show: true,//是否显示
                lineStyle: {//线的样式
                    type:'dashed'//线的类型 虚线
                },
            },
             axisLabel: {
                color: "#DEDEDE"
                }
        },
    ],
    yAxis: [//y轴
        {
            min: 0,//最小
            max: 250,//最大
            interval: 50,//相差
            name: '降水量(mm)',//名称
            type: 'value',//连续类型
            axisLine: {//坐标轴样式
                show: false, //不显示
            },
            splitLine: {//分隔辅助线
                lineStyle: {
                     type:'dashed',//线的类型 虚线0
                     opacity:0.2//透明度
                },
            },
            axisLabel: {
                    formatter: '{value}'
                  } 
        },
        {
          min: 0,//最小
            max: 50,//最大
            interval: 5,//相差
            name: '温度(­°C)',//名称
            type: 'value',//连续类型
            axisLine: {//坐标轴样式
                show: false, //不显示
            },
            splitLine: {//分隔辅助线
                lineStyle: {
                     type:'dashed',//线的类型 虚线0
                     opacity:0.2//透明度
                },
            },
            axisLabel: {
                    formatter: '{value}'
                  }
             
        },
    ],
    series: [//系统列表   
        {
            name: '温度',//名称
            type: 'bar',//类型
            barWidth :11,//宽度
            data: [10, 25, 9, 20, 21, 11, 13, 17,21,22,25,21],//数值
            z:2,
            yAxisIndex : '1',
            itemStyle: {
                color: {//渐变色
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    type: 'linear',
                    global: false,
                     colorStops: [
                        {
                            offset: 0,
                            color: 'rgba(6, 244, 231)',
                        },
                        {
                            offset: 1,
                            color: 'rgba(6, 244, 231,0)',
                        },
                    ],
                },
            },
        },
        {
            name: '降水量',
            type: 'bar',
            barWidth : 11,
            data: [100, 240, 90, 200, 210, 110, 130, 30,90,100,120,125],
            z:1,
            itemStyle: {
                color: {
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    type: 'linear',
                    global: false,
                    colorStops: [
                    {
                        offset: 0,
                        color: 'rgba(3, 181, 243)',
                    },
                    {
                        offset: 1,
                        color: 'rgba(2, 190, 251,0)',
                    },
                    ],
                  
                },
            },
        },
         {
            name: "",	
           	barGap: '-220%',
            type: 'bar',
            z:0,
            data: [110, 250, 100, 210, 220, 120, 140, 40,100,110,130,135],
            barWidth: '48px',
            itemStyle: {
                normal: {
                    color: '#fff', // 0% 处的颜色
                     opacity:0.1//透明度
                }
            },
        },
    ],
    legend: {
        right: '70',
        data:['降水量','温度'],
        textStyle: {
            // 图例文字的样式
            color: '#fff',
            fontSize: 14,
            padding: [2, 0, 0, 2], 
            fontWeight: 100,
        },
    },
};
mycharts1.setOption(option1);

  },
  beforeDestroy() {
    this.disconnect(); // 销毁组件时断开连接
  },
  methods: {
    connect() {
      if (this.mqttfalg) {
        // 默认连接的协议
        this.client = mqtt.connect(
          "ws://a1Y6RUaWDcj.iot-as-mqtt.cn-shanghai.aliyuncs.com:443",
          this.options
        );

        this.client.on("connect", (e) => {
          this.message = `连接成功${e}`;
          // 设置mqttFlag为false，确保connect方法只执行一次
          this.mqttfalg = false;
          console.log("连接成功", e);
          // 订阅的设备配置
          this.client.subscribe(
            "/sys/a1Y6RUaWDcj/temperature/thing/service/property/set/sys/a1Y6RUaWDcj/temperature/thing/service/property/set ",
            { qos: 0 },
            (error) => {
              if (error) {
                console.log(error);
              } else {
                console.log("订阅成功");
              }
            }
          );
        });

        this.client.on("error", (error) => {
          console.log("连接出错", error);
        });

        this.client.on("message", (topic, message) => {
          this.mqttvalue = JSON.parse(message.toString());
          this.wd = this.mqttvalue.params.temperature;
          this.sd = this.mqttvalue.params.humidity;
          this.gz = this.mqttvalue.params.light;
          // this.bbh = this.mqttvalue.params.Brightness; //版本号
          // this.bfb = this.mqttvalue.params.IpcVersion; //百分比
        });
      }
    },
    disconnect() {
      if (this.client) {
        this.client.end();
        console.log("断开连接");
      }
    },
    // duankai() {
    //   this.client.end();
    //   console.log("断开");
    // },
  }
}
</script>

<style>
.moniVideo {
  width: 100%;
  height: 360px;
  margin-right: 30px;
  border: 2px solid #1b2735;
}
.moni {
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-around;
}

.environment {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.box-card{
  width: 300px;
}
</style>