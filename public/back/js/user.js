$(function () { 

  var currentPage=1;
  var pageSize=5;
  
  // 进入页面先渲染
  render();
  function render() {
    $.ajax({
      type: 'get',
      dataType: 'json',
      url: '/user/queryUser',
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      success: function (info) {
        console.log(info)
        // isDelete表示用户的启用状态，1就是启用，0就是禁用
        $('.lt_content tbody').html(template('tpl', info))
      

        //配置分页
        $("#pagintor").bootstrapPaginator({
          bootstrapMajorVersion: 3,//默认是2，如果是bootstrap3版本，这个参数必填
          currentPage: info.page,//当前页
          totalPages: Math.ceil( info.total / info.size ),//总页数
          
          onPageClicked: function (a, b, c, page) {
            //为按钮绑定点击事件 page:当前点击的按钮值

            //page 当前点击的页码
            currentPage=page;
            //调用render重新渲染页面
            render();
          }
        });
      
      }
    })

  }


  //通过事件委托 给禁用 启用按钮注册点击事件
  $('.lt_content tbody').on('click','.btn',function () { 
    //弹出模态框
    $('#userModal').modal("show");

    // 拿到点击按钮的对应数据id
    var id= $(this).parent().data('id');
    //获取用户将要设置成的状态
    var isDelete = $(this).hasClass("btn-danger") ? 0 : 1;
    // console.log(isDelete)

    //更新状态
    //绑定点击事件，先解绑再绑定，可以保证事件不会被多次绑定
    $('#submitBtn').off().on("click",function () { 
        $.ajax({
          url:'/user/updateUser',
          data:{
            id:id,
            isDelete:isDelete
          },
          type:'post',
          dataType:"json",
          success:function ( info ) {
            // console.log(info)
            if(info .success) {
              $("#userModal").modal("hide")
              render();
            }
          }

        })
     })
   })
 })