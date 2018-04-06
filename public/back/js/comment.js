
  //配置小圆环
  NProgress.configure({ showSpinner: false });

  // NProgress.start();  //开启进度条
  // setTimeout(() => {
  //   //关闭进度条
  //   NProgress.done();
  // }, 500);

//ajaxStart 所有的ajax 开始的时候调用
  $(document).ajaxStart(function () {
    NProgress.start();
  });

$(document).ajaxStop(function(){
  //模拟网络延迟
  setTimeout(() => {
    NProgress.done();
  }, 500);
})


$(function () {
  //1.二级分类切换功能
  $('.category').click(function () { 
    $(this).next().stop().slideToggle();
   })


   //2.顶部菜单栏切换显示功能
   $('.icon_menu').click(function () { 
     //让模态框显示
     $('.lt_aside').toggleClass("hidemenu");
     $('.lt_main').toggleClass("hidemenu");
     $('.lt_topbar').toggleClass("hidemenu");
    })


  $('.icon_logout').click(function () { 
    //模态框显示
    $('#logoutModal').modal("show")
   })

   //在外面注册logoutBtn退出按钮的点击事件
   $('#logoutBtn').click(function () { 
    //  console.log(1)
    $.ajax({
      url:'/employee/employeeLogout',
      type:'get',
      dataType:'json',
      success:function (info) { 
        // console.log(info)
        if(info.success){
          location.href="login.html"
        }
       }
    })
    })
})