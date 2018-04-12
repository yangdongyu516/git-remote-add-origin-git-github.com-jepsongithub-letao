$(function () { 

  function render() {
    $('.lt_product').html('<div class="loading"></div>');
    var obj = {};
    // 获取搜索框中的文本
    obj.proName = $('.lt_search input').val();
    obj.page = 1;
    obj.pageSize = 100;
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
          $('.lt_product').html(template('productTpl',info) )
        }
      })
    }, 500)
   }
  
  var txt = getSearch("txt");//引号没加。。。
  console.log(txt);//得到的时undefined 为什么？
  $('.lt_search input').val(txt)//同步地址栏中传递的参数，放入到input框中
  render();//页面进入时 根据搜索框中的内容渲染 调用render()方法，会获取input中的内容放入obj进行请求

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