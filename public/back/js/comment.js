//在一进入页面就判断是否登陆，如果没有登陆，拦截到登陆页
//如果后端响应头中设置了 Content - Type: application / json
// jquery 会自动识别, 将返回数据类型, 当成json字符串解析成对象

//判断当前页是不是登陆页,如果是登陆页 就不再判断是否登陆
  if(location.href.indexOf("login.html")===-1){
    $.ajax({
      url:'/employee/checkRootLogin',
      dataType:'json',
      type:'get',
      success:function (info) { 
        // console.log(info)
        if(info.success) {
          console.log("登陆了")
        }
        if(info.error==400) {
          location.href="login.html";
        }
       }
    })
  }



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

    //3.模态框显示
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