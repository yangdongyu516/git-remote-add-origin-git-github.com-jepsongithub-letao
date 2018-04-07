$(function () { 
  //基于准备好的dom，初始化echarts实例
  var echarts1 = echarts.init(document.querySelector('.echarts_1'));
  // 指定图表的配置项和数据
  var option1 = {
    title: {
      text: '2017年注册人数'
    },
    // 提示框组件
    tooltip: {},
    // 图例
    legend: {
      data: ['人数']
    },
    // x轴的数据
    xAxis: {
      data: ["1月", "2月", "3月", "4月", "5月", "6月"]
    },
    // y轴的数据
    yAxis: {},
    //数据
    series: [{
      name: '人数',
      type: 'bar',
      data: [1000, 1600, 1800,2000 , 2200, 2000]
    }]
  }

  echarts1.setOption(option1);


  var echarts2 = echarts.init(document.querySelector('.echarts_2'));
  // 指定图表的配置项和数据
  option2 = {
    title: {
      text: '热门品牌销售',
      subtext: '2017年6月',
      x: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: ['耐克', '阿迪', '新百伦', '李宁', '阿迪王']
    },
    series: [
      {
        name: '品牌',
        type: 'pie',
        //圆的大小
        radius: '55%',
        //圆心位置
        center: ['50%', '60%'],
        data: [
          { value: 335, name: '耐克' },
          { value: 310, name: '阿迪' },
          { value: 234, name: '新百伦' },
          { value: 135, name: '李宁' },
          { value: 1548, name: '阿迪王' }
        ],
        itemStyle: {
          //设置阴影效果
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };


  echarts2.setOption(option2);
 })