$(function () { 

  var currentPage=1;
  var pageSize=5;
  render()
  function render() { 
    $.ajax({
      url: '/category/querySecondCategoryPaging',
      type: 'get',
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: 'json',
      success: function (info) {
        console.log(info)
        $('.lt_content tbody').html(template('secondTmp', info))

        // 配置分页
        $('#pagintor').bootstrapPaginator({
          bootstrapMajorVersion: 3,//默认是2，如果是3版本，需要指定

          currentPage: info.page,//当前页
          totalPages: Math.ceil(info.total / info.size),//总页数
          onPageClicked: function (a, b, c, page) {
            //为按钮绑定点击事件 page:当前点击的按钮值
            currentPage = page;
            render();
          }
        })
      }
    })
   }
 

  $('.mb_20').click(function () { 
    $('#addModal').modal("show")

    //请求一级分类名称，渲染下拉菜单
    $.ajax({
      url:'/category/queryTopCategoryPaging',
      type:'get',
      data:{
        page:1,
        pageSize:100
      },
      success:function (info) { 
        console.log(info)
        $('.dropdown-menu').html(template('dropdownTmp',info))
       }
    })
   })

   //1.通过事件委托给a注册点击事件 下拉框功能
   $('.dropdown-menu').on('click','a',function () { 

    //选中的文本
    var txt=$(this).text();
    var id=$(this).data('id');

    //修改文本内容
     $('#dropdownText').text(txt);
    //将选中的id设置到input表单元素中
    $('[name="categoryId"]').val(id);

    //配置校验
    //参数一：字段
    //参数二：检验状态
    //参数三：配置规则,来配置我们的提示文本
     $('#form').data("bootstrapValidator").updateStatus("categoryId", "VALID");//更新校验状态的
    })

  //2.配置图片上传
  $("#fileupload").fileupload({
    dataType: "json",
    //e：事件对象
    //data：图片上传后的对象，通过e.result.picAddr可以获取上传后的图片地址
    done: function (e, data) {
      console.log(data);
      //存储服务器返回的图片地址
      var picAddr = data.result.picAddr;
      //设置给预览框显示
      $('#imgBox img').attr('src',picAddr);
      //将图片地址存储在隐藏域标签中，用于提交
      $('[name="brandLogo"]').val(picAddr);

      //更新表单校验状态
      $('#form').data("bootstrapValidator").updateStatus("brandLogo", "VALID");
    }
  });

  //3.配置表单校验
  $('#form').bootstrapValidator({
    //默认情况下不会校验隐藏域标签 因此需要修改不校验类型
    excluded:[],
    //配置校验时显示的图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    //制定校验字段
    fields: {
      //校验用户名，对应name表单的name属性
      categoryId:{
        validators:{
          //不能为空
          notEmpty:{
            message:'请选择一级分类'
          }
        }
      },
      brandName:{
        validators: {
          //不能为空
          notEmpty: {
            message: '请输入二级分类'
          }
        }
      },
      brandLogo:{
        validators: {
          //不能为空
          notEmpty: {
            message: '选择上传图片'
          }
        }
      }
    }
  })

  //4.配置校验成功的事件
  $("#form").on('success.form.bv', function (e) {
    e.preventDefault();//组织submit的提交
    //使用ajax提交逻辑
    $.ajax({
      url:'/category/addSecondCategory',
      type:'post',
      data:$('#form').serialize(),
      success:function (info) { 
        // console.log(info)
        if(info.success) {
          //隐藏模态框，重新渲染页面
          $('#addModal').modal("hide");
          currentPage=1;
          render();
          //重置表单内容和状态
          $('#form').data("bootstrapValidator").resetForm(true);
          //重置下拉菜单
          $('#dropdownText').text('请选择一级分类');
          //重置图片框
          $('#imgBox img').attr('src','images/none.png')
        }
       }
    })
  });

  })

 

