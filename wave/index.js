// pages/device/index.js
import * as echarts from '../components/ec-canvas/echarts';
import * as liquidFill from '../components/ec-canvas/echarts-liquidfill.min';

//是否清理echarts实例
var clearCharts = true;
//图表容器
var testChartsObj = {};
//定时器编号
var STO,SI;

Page({
  data: {
    ec: {},
    list: []
  }, 
  onLoad: function () {
    var that = this;

    wx.onMemoryWarning(function () {
      console.log('>>>onMemoryWarningReceive');
      clearInterval(SI);
    })

    that.reloadData();
    SI = setInterval(function(){
      that.reloadData();
    }, 3000);
  },
  onUnload: function(){
    this.clearCharts();
    clearInterval(SI);
    clearTimeout(STO);
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
   */
  clearCharts: function(){
    if(clearCharts){
      var array = Object.keys(testChartsObj);
      for(var i=0;i<array.length;i++){
        var key = array[i];
        var chart = testChartsObj[key];
        if(chart){
          chart.dispose();
          console.log(">>>" + key + '，isDisposed: ' + chart.isDisposed());
        }
      }
      testChartsObj = {};
    }
  },
  /**
   * 下拉刷新
   */
  onPullDownRefresh: function(){
    this.reloadData();
    STO = setTimeout(function () {
      wx.stopPullDownRefresh();
    }, 500);
  },
  initCharts: function(options){
    var canvas = options.detail.canvas;
    var width = options.detail.width;
    var height = options.detail.height;
    var dpr = options.detail.dpr;
    
    var id = canvas.canvasId;
    console.log('>>>'+id+'，echart init>>>')
    
    var chartData = options.target.dataset.device;
    var level = chartData.level;
    
    // 获取组件的 canvas、width、height 后的回调函数
    // 在这里初始化图表
    const chart = echarts.init(canvas, null, {
      width: width,
      height: height,
      devicePixelRatio: dpr // new
    });
    // let data = [value, value, value, ];
  
    var waveList = [
      {'label':'舒适', 'color':'67,209,100'},
      {'label':'适宜', 'color':'255,255,0'},
      {'label':'净化', 'color':'255,165,0'},
      {'label':'净化', 'color':'255,0,0'},
      {'label':'净化', 'color':'128,0,128'},
      {'label':'净化', 'color':'139,0,0'}];
    var wave = waveList[level];
    var optParam = {
      'waveValue': 0.2,
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
  var color = 'rgba('+waveColor+',1)';
  var backgroundColor = 'rgba('+waveColor+',0.3)';
  const option = {
    series: [{
        type: 'liquidFill',
        radius: '90%',
        waveAnimation: false,
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