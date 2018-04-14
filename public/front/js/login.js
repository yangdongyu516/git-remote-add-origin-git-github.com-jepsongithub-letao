$(function () { 
  //点击登陆按钮，获取输入的用户名和密码
  $('#btnLogin').click(function () { 
    var username = $('[name=username]').val();
    var password = $('[name=password]').val();

    if (!username){
      mui.toast("请输入用户名");
      return;
    }
    if( !password ) {
      mui.toast("请输入密码");
      return;
    }
    $.ajax({
      url:'/user/login',
      type:'post',
      data:{
        username:username,
        password:password
      },
      success:function (info) { 
        // console.log(info)
        if(info.error){
          mui.toast("用户名或密码错误")
        }
        if(info.success) {
          //说明登陆成功，需要跳转
          // (1) 直接访问的, 跳到会员中心页
          // (2) 拦截过来的(从购物车, 商品详情等), 需要跳转回到前一个页面
          if(location.search.indexOf("retUrl")!==-1) {
            //说明存在retUrl
            //需要获取 retUrl的值，进行跳转
            location.href=location.search.replace("?retUrl=","")
          }else {
            //说明没有retUrl
            location.href = "user.html"
          }
        }
       }
    })
   })
 })