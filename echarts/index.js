// pages/device/index.js
import * as echarts from '../components/ec-canvas/echarts';

//是否清理echarts实例
var clearCharts = true;
//图表容器
var testChartsObj = {};
//定时器编号
var SI;

/**
 * 初始化图表
 * @param {*} canvas 
 * @param {*} width 
 * @param {*} height 
 * @param {*} dpr 
 */
function initChart(canvas, width, height, dpr){
  var id = canvas.canvasId;
  console.log(">>>echart init>>>")
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr
  });
  canvas.setChart(chart);
  chart.setOption(getOption());
  testChartsObj[id] = chart;
  return chart;
}

Page({
  data: {
    ec: {
      onInit: initChart
    },
    list: []
  }, 
  onLoad: function () {
    
    wx.onMemoryWarning(function () {
      console.log('>>>onMemoryWarningReceive');
      clearInterval(SI);
    })

    var that = this;
    SI = setInterval(function(){
      that.reloadData();
    }, 3000);
  },
  onUnload: function(){
    this.clearCharts();
    clearInterval(SI);
  },
  loadData: function(){
    var that = this;
    var list = [];
    for(var i=0;i<6;i++){
      var num = uuid();
      list.push({'sbh':num});
    }
    that.setData({
      list: list
    })
  },
  reloadData: function(){
    this.clearCharts();
    this.loadData();
  },
  /**
   * 清理echarts实例时
   * 1、点我进入，图表显示，点击返回，IOS就闪退
   * 不清理echarts实例时
   * 1、点我进入，图表显示，点击返回，多进入返回几次，IOS就闪退
   * 2、点我进入，图表显示，下拉刷新几下，IOS也会闪退
   * 安卓清不清理echarts实例，都是正常的
   */
  clearCharts: function(){
    if(clearCharts){
      var array = Object.values(testChartsObj);
      for(var i=0;i<array.length;i++){
        var chart = array[i];
        console.log(">>>chart.dispose")
        chart.dispose();
      }
      testChartsObj = {};
    }
  },
  /**
   * 下拉刷新
   */
  onPullDownRefresh: function(){
    this.reloadData();
    setTimeout(function () {
      wx.stopPullDownRefresh();
    }, 500);
  }
})

//图表配置项
function getOption() {
  var option = {
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      name: 'A',
      type: 'line',
      smooth: true,
      data: [18, 36, 65, 30, 78, 40, 33]
    }]
  };
  return option
}

function uuid() {
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";
 
  var uuid = s.join("");
  return uuid
}