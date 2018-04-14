$(function () { 
  //当前页
  var currentPage=1;
  // 每次加载多少条
  var pageSize=4;

  function render(callback) {
    var obj = {};
    // 获取搜索框中的文本
    obj.proName = $('.lt_search input').val();
    obj.page = currentPage;
    obj.pageSize = pageSize;
    //加上我们一些可传可不传的参数
    var $current = $('.lt_sort .current');

    if($current.length > 0) {
      // console.log(111);
      //如果有这个类，说明需要排序,需要加参数，
      //参数名和参数值(1升序，2降序)
      var sortName = $current.data('type');
      var sortValue= $current.find('i').hasClass('fa-angle-down') ? 2 : 1
      obj[sortName] = sortValue;
    }

    setTimeout(function () {
      $.ajax({
        url: '/product/queryProduct',
        type: 'get',
        data: obj,
        success: function (info) {
          console.log(info)
          callback(info)
        }
      })
    }, 500)
   }
  
  var txt = getSearch("txt");//引号没加。。。
  console.log(txt);//得到的时undefined 为什么？
  $('.lt_search input').val(txt)//同步地址栏中传递的参数，放入到input框中
  
  // 下拉刷新
  //下拉刷新初始化
mui.init({
  pullRefresh: {
    container: ".mui-scroll-wrapper", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
    down: {
      style: "circle", //必选，下拉刷新样式，目前支持原生5+ ‘circle’ 样式
      color: "#2BD009", //可选，默认“#2BD009” 下拉刷新控件颜色
      auto: true, //可选,默认false.首次加载自动上拉刷新一次
      callback: function() {
        currentPage = 1;//重置当前页
        render(function (info) {
          $(".lt_product").html(template("productTpl", info));

          // 数据渲染完成之后, 需要停止下拉刷新
          // 注意: 文档中有问题, 需要调用 pullRefresh() 生成一个实例,
          // 这个实例可以访问到原型上的 endPulldownToRefresh 方法, 方法可以结束下拉刷新
          mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
         });
      } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
    },
    up: {
      contentrefresh : "正在加载...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
      contentnomore:'没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
      callback :function () { 
        currentPage++;
        render(function (info) {
          if(info.data.length>0){
            //有数据，追加
            $(".lt_product").append(template("productTpl", info));

            mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh();
          }else {
            //结束上拉加载
            mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh(true);
          }
         })
       } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；      
    }
  }
});


  // 点击搜索时，进行渲染，渲染方法中会自动获取input框中的内容
  $('.lt_search button').click(function () { 
    render();
    // 将历史记录重新存到数组中
    var txt = $('.lt_search input').val();
    var history = localStorage.getItem('search_list')||"[]";
    var arr= JSON.parse(history);
    var index = arr.indexOf(txt);
    if(index!==-1){
      //说明有这个数据,需要删除之后从新存储
      arr.splice(index,1);
    }
    if (arr.length >= 10) {
      arr.pop();//超过十条删除
    }
    arr.unshift(txt);
    localStorage.setItem('search_list',JSON.stringify(arr))
   })
   
   //点击排序，需要重新渲染
  $('.lt_sort a[data-type]').click(function () {
    //判断当前点击的 a 有没有current类
    //如果有,切换类
    if ($(this).hasClass("current")) {
      $(this).find("i").toggleClass("fa-angle-up").toggleClass("fa-angle-down");
    } else{
      //如果没有这个类 添加类 进行排他
      $(this).addClass("current").siblings().removeClass("current");
      //重置所有的箭头状态
      $(".lt_sort a i").removeClass("fa-angle-up").addClass("fa-angle-down");
    }
    render();
   })
 })