$(function () { 
  //1.获取地址栏参数传递过来的 productId
  //2.发送ajax请求，获取对应的商品数据
  //3.根据数据渲染页面

  var productId = getSearch("productId");//产品id

  $.ajax({
    url:'/product/queryProductDetail',
    type:"get",
    data:{
      id: productId
    },
    success:function ( info ) { 
      console.log( info )
      $('#productDetail').html(template('productTpl', info))

      //重新初始化轮播图
      var gallery = mui('.mui-slider');
      gallery.slider({
        interval:1000
      });
      //重新初始化input 
      mui('.mui-numbox').numbox()
     }
  });

  // 选择尺码的功能
  $('.lt_main').on('click','.lt_size span',function () { 
    $(this).addClass('current').siblings().removeClass('current');
   })

   //加入购物车的功能
   //点击按钮，获取用户选择的尺码和数量(productId已有)
   //发送ajax请求，加入购物车
      //(1)如果没登陆,跳转到登陆页面
      //(2)如果登陆了，加入到购物车 ，弹出提示框：加入购物车成功

      $('.addcart').click(function () { 
        var size = $('.lt_size span.current').text();
        var num = $('.mui-numbox-input').val();

        if( !size ) {
          mui.toast("请选择尺码")
          //没有选择尺码，应该啥都不做
          return;
        }

        $.ajax({
          url:'/cart/addCart',
          type:'post',
          data:{
            productId:productId,
            num:num,
            size:size
          },
          success:function (info) { 
            console.log(info)
            // 说明登陆了
            if (info.success) {
              mui.confirm("添加成功", "温馨提示", ["去购物车", "继续浏览"], function (e) {
                if (e.index === 0) {
                  // 前往购物车
                  location.href = "cart.html";
                }
              })
            };
            //说明没登陆
            if (info.error == 400) {
              //跳转到登陆页面
              //跳转到登陆页，登陆完成，还要跳转回来，因此需要将当前页面的地址传递过去
              //(1)如果是直接访问登陆页，应该在登陆完成之后跳转到个人中心
              //(2)如果是从其他页面被拦截到登陆页时，需要跳转回来，所以应该将当前的地址传递过去
              location.href = "login.html?retUrl=" + location.href;
            }
           }
        })
       })
 })