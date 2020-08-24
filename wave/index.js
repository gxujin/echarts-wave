// pages/device/index.js
import * as echarts from '../components/ec-canvas/echarts';
import * as liquidFill from '../components/ec-canvas/echarts-liquidfill.min';

//是否清理echarts实例
var clearCharts = true;
//图表容器
var testChartsObj = {};
//定时器编号
var SI;

Page({
  data: {
    ec: {},
    list: []
  }, 
  onLoad: function () {
    
    wx.onMemoryWarning(function () {
      console.log('>>>onMemoryWarningReceive');
      clearInterval(SI);
    })

    var that = this;
    that.reloadData();
    SI = setInterval(function(){
      that.reloadData();
    }, 60000);
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
      list.push({'sbh':num, 'level': i});
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
  },
  initCharts: function(options){
    var canvas = options.detail.canvas;
    var width = options.detail.width;
    var height = options.detail.height;
    var dpr = options.detail.dpr;
    var chartData = options.target.dataset.device;
    var level = chartData.level;
    
    var id = canvas.canvasId;

    //发现存在图表实例，则销毁
    var existChartObj = testChartsObj[id];
    if(existChartObj){
      existChartObj.dispose();
      delete testChartsObj[id];
      console.log('>>>'+id+'，页面销毁、重新初始化');
    }else{
      console.log('>>>'+id+'，echart init>>>')
    }
    
    // 获取组件的 canvas、width、height 后的回调函数
    // 在这里初始化图表
    const chart = echarts.init(canvas, null, {
      width: width,
      height: height,
      devicePixelRatio: dpr // new
    });
    // let data = [value, value, value, ];
  
    var waveList = [
      {'level':'1','color':'67,209,100','label':'舒适'},
      {'level':'2', 'color':'255,255,0','label':'适宜'},
      {'level':'3', 'color':'255,165,0','label':'净化'},
      {'level':'4', 'color':'255,0,0','label':'净化'},
      {'level':'5', 'color':'128,0,128','label':'净化'},
      {'level':'6', 'color':'139,0,0','label':'净化'}];
    var wave = waveList[level];
    var optParam = {
      'waveValue': 0.6,
      'waveColor': wave.color,
      'waveLabel': wave.label
    };
    chart.setOption(setOption(optParam));
    // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
    // this.chart = chart;
    testChartsObj[id] = chart;
    // 注意这里一定要返回 chart 实例，否则会影响事件处理等
    return chart;
  }
})

function setOption(optParam){
  var waveValue = optParam.waveValue;
  var waveColor = optParam.waveColor;
  var waveLabel = optParam.waveLabel;
  var waveAnimation = true;
  var animation = true;
  if(!waveValue){
    waveAnimation = false;
    animation = false;
  }
  var color = 'rgba('+waveColor+',1)';
  var backgroundColor = 'rgba('+waveColor+',0.3)';
  const option = {
    series: [{
        type: 'liquidFill',
        radius: '90%',
        waveAnimation: waveAnimation,
        animation: animation,
        data: [{
            value: waveValue, 
            itemStyle: {
              color: color
            }
          }],
        label: {
            normal: {
                position: ['50%', '70%'],
                formatter: function(){
                  return waveLabel;
                },
                color: '#fff',
                insideColor: 'transparent',
                textStyle: {
                    fontSize: 16,
                    fontWeight: 'bold',
                    fontFamily: 'Microsoft YaHei'
                }
            }
        },
        outline: {
            show: true,
            borderDistance: 2,
            itemStyle: {
                borderColor: color,
                borderWidth: 1
            }
        },
        backgroundStyle: {
            color: backgroundColor
        }
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