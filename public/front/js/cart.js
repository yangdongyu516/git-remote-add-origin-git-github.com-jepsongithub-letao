$(function () {
//请求购物车数据，渲染到页面中
function render() {
  setTimeout(() => {
    $.ajax({
      url: "/cart/queryCart",
      type: "get",
      success: function(info) {
        console.log(info)
        $("#productList").html(template("cartTpl", { list: info }));
        //手动结束下拉刷新
        mui(".mui-scroll-wrapper").pullRefresh().endPulldownToRefresh();
      }
    }); 
  }, 500);
}
//下拉刷新初始化
mui.init({
  pullRefresh: {
    container: ".mui-scroll-wrapper", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
    down: {
      style: "circle", //必选，下拉刷新样式，目前支持原生5+ ‘circle’ 样式
      color: "#2BD009", //可选，默认“#2BD009” 下拉刷新控件颜色
      auto: true, //可选,默认false.首次加载自动上拉刷新一次
      callback: function() {
        render();
      } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
    }
  }
});

  //删除功能
  $("#productList").on("tap", ".btn_delete", function() {
     var id = $(this).data("id");
    mui.confirm('您是否要删除该商品','温馨提示',['确认','取消'],function (e) { 
        // console.log(e)
        //确认删除
        if(e.index==0) {
          $.ajax({
            url: "/cart/deleteCart",
            data: {
              id: [id]
            },
            type: "get",
            success: function(info) {
              if (info.success) {
                mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading();
              }
            }
          });
        }
     })
    
  });

  //编辑功能
  $("#productList").on("tap", ".btn_edit",function () {
    // console.log(this.dataset)
    var id = $(this).data("id");
    console.log(id)
    var htmlStr=template('modalTpl',this.dataset)
    htmlStr=htmlStr.replace(/\n/g,"");//去除换行

    mui.confirm(htmlStr,'温馨提示',['确认','取消'],function (e) { 
      if(e.index==0) {
        //点击确认 拿到选择的尺码和数量 发送ajax请求
        var size = $('.lt_size span.current').text();
        var num = $('.lt_num input').val();
        $.ajax({
          url:'/cart/updateCart',
          type:'post',
          data:{
            id:id,
            size:size,
            num:num
          },
          success:function (info) { 
            // console.log(info);
           if(info.success) {
              mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading();
           }
           }
        })
      }
     })

     //渲染模态框结束后，重新初始化input框
     mui(".mui-numbox").numbox(); 
   });

  //  选择尺码功能/注册委托事件
  $('body').on('tap','.lt_size span',function () { 
      $(this).addClass('current')
    })
 
  //结算总价格功能
  $('#productList').on('change','.ck',function () { 
    // console.log($(this).data('price'))
    var $checks = $('.ck:checked');//拿到所有被选中的选项框

    var total=0;
    $checks.each(function (i,v) { 
      var price = $(v).data('price');//当前的物品单价
      var num = $(v).data('num')//当前物品的购买数量
      total += price * num;
     })
    //  console.log(total)
    total=total.toFixed(2);
    $('.total').text(total);
   })
 
 })

