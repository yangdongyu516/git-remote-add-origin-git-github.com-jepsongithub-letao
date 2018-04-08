$(function () { 
var currentPage=1;
var pageSize=5;
  render()
  
  function render() { 

    $.ajax({
      url:'/category/queryTopCategoryPaging',
      data:{
        pageSize: pageSize,
        page:currentPage
      },
      type:'get',
      success:function (info) { 
        console.log(info)
        $('.lt_content tbody').html(template('firstTmp',info))

        //配置分页
        $("#pagintor").bootstrapPaginator({
          bootstrapMajorVersion: 3,//默认是2，如果是bootstrap3版本，这个参数必填
          currentPage: info.page,//当前页
          totalPages: Math.ceil(info.total / info.size),//总页数

          onPageClicked: function (a, b, c, page) {
            //为按钮绑定点击事件 page:当前点击的按钮值

            //page 当前点击的页码
            currentPage = page;
            //调用render重新渲染页面
            render();
          }
        });

       }
    })    
   }

  //  点击添加分类，模态框显示
   $('.mb_20').on('click',function () { 
    //  console.log(1)
    $('#addModal').modal("show")
    })

    //配置表单校验
    $('#form').bootstrapValidator({

       // 配置图标
       feedbackIcons: {
         valid: 'glyphicon glyphicon-ok',
         invalid: 'glyphicon glyphicon-remove',
         validating: 'glyphicon glyphicon-refresh'
       },

      //指定校验字段
      fields:{
        //校验分类输入框,对应name表单的name属性
        categoryName:{
          //校验规则
          validators:{
            //不能为空
            notEmpty:{
              message:'请输入一级分类名称'
            }
          }
        }
      }
    })

    //注册表单验证成功事件
    $('#form').on('success.form.bv',function (e) { 
      e.preventDefault();//此处可以不写，
      //因为通过html5的form属性与表单外的按钮进行关联之后，自动提交会自动失效

      $.ajax({
        url:'/category/addTopCategory',
        type:'post',
        data:$('#form').serialize(),
        success:function (info) {
          // console.log(info)
          if(info.success) {
            // 关闭模态框,重新渲染页面
            $('#addModal').modal('hide');
            render();
            //重置表单校验状态和内容
            $('#form').data('bootstrapValidator').resetForm(true);
          }
         }
      })
     })
 })