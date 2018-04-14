$(function () { 

  //页面进入应该请求用户信息进行渲染
  //如果用户没有登陆，应该跳转到login页面
  $.ajax({
    url:'/user/queryUserMessage',
    type:'get',
    dataType:'json',
    success:function ( info ) { 
      // console.log(info);
     if(info.error===400){
       location.href='login.html';
     }
      $(".user_info").html(template("userTpl", info));
     }
  })

  // 点击退出按钮，请求后台，进行退出，应该跳转到login页面
  $(".loginOut").click(function () { 
    $.ajax({
      url:'/user/logout',
      type:'get',
      success:function (info) { 
        if(info.success){
          location.href="login.html";  
        }
       }
    })
   });
 })