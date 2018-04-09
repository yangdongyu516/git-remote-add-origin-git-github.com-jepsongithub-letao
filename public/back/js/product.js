$(function () { 

  var currentPage=1;
  var pageSize=2;
  var picArr=[];//用于存储图片对象
  render();
  function render() { 

    $.ajax({
      url: '/product/queryProductDetailList',
      type:'get',
      data:{
        page:currentPage,
        pageSize:pageSize
      },
      success:function (info) { 
        // console.log(info)
        $('.lt_content tbody').html(template('productTmp',info))

        //分页初始化
        $("#pagintor").bootstrapPaginator({
          bootstrapMajorVersion: 3, //默认是2，如果是bootstrap3版本，这个参数必填
          currentPage: info.page, //当前页
          totalPages: Math.ceil( info.total / info.size ), //总页数
          onPageClicked: function (a, b, c, page) {
            //为按钮绑定点击事件 page:当前点击的按钮值
            currentPage=page;
            render();
          },
          itemTexts: function (type,  page,  current) {
            // console.log(type, page, current)
            switch (type) {
              case "first":

                return "首页";

              case "last":

                return "尾页";

              case "next":
                
                return "下一页";
              
              case "prev":

                return "上一页";
  
              case "page":
              
                return page;
            }
           },
          tooltipTitles: function (type,  page,  current) {
            switch (type) {
              case "first":

                return "首页";

              case "last":

                return "尾页";

              case "next":

                return "下一页";

              case "prev":

                return "上一页";

              case "page":

                return page;
            }


           },
          useBootstrapTooltip: true
           
        
        
         });
       }
    })

   }

   //上架下架功能

  //点击添加按钮，显示模态框
  $('.mb_20').click(function () { 
    $('#addModal').modal("show")
    //发送ajax请求，渲染二级分类下拉框
    $.ajax({
      url: '/category/querySecondCategoryPaging',
      type:'get',
      data:{
        page:1,
        pageSize:100
      },
      success:function (info) { 
        // console.log(info)
        $('.dropdown-menu').html(template('dropdownTmp',info))
       }
    })
   })
 
   //通过事件委托 给下拉菜单的每一项注册点击事件
  $('.dropdown-menu').on('click','a',function () { 
    var id= $(this).data("id");
    var txt=$(this).text();
    // console.log(id);
    $('#dropdownText').text(txt);//更换下拉菜单的选中项
    //把选中的那个选项对应的id存在隐藏域中
    $('[name="brandId"]').val(id);
    //更新校验状态
    $('#form').data('bootstrapValidator').updateStatus('brandId', 'VALID')
   })
   
   //配置图片上传的回调函数
   $("#fileupload").fileupload({
     dataType: "json",
     //每一张图片上传，都会响应一次(多张图片上传时，
     //也是有顺序的，内部是一张一张的上传给服务器的)

     //data：图片上传后的对象，通过e.result.picAddr可以获取上传后的图片地址
     done: function (e, data) {
      //  console.log(data);
       var picObj = data.result; //获取图片对象
       var picAddr = picObj.picAddr; //获取图片地址

       //新的到的图片对象，应该推到数组的最前面 unshift
       picArr.unshift( picObj );
       //新的图片，应该添加到imgBox最前面去
       $('#imgBox').prepend('<img src="'+picAddr+'" width="100" alt="">')
     
      //如果上传的图片个数大于三个,需要将数组中最旧的那个(最后一个)删除
      if( picArr.length > 3) {
        //删除数组中的最后一项
        picArr.pop();
        //还需要删除页面中已经渲染的最后一项的那张图片
        $('#imgBox img:last-of-type').remove();
      }

      //如果处理后，图片数组的长度为3，说明已经选择了3张图片
      if( picArr.length === 3) {
        $('#form').data('bootstrapValidator').updateStatus('picStatus', 'VALID');
      }
    }
   });
  
   //配置表单校验
   $('#form').bootstrapValidator({
     //重置默认排除项
    excluded: [],

    // 配置图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    //配置校验字段
    fields: {
      //二级分类id，归属品牌
      brandId:{
        //配置校验规则
        validators:{
          notEmpty:{
            message:"请选择二级分类"
          }
        }
      },
      proName:{
        validators: {
          notEmpty: {
            message: "请选择商品名称"
          }
        }
      },
      proDesc: {
        validators: {
          notEmpty: {
            message: "请输入商品描述"
          }
        }
      },
      num: {
        validators: {
          notEmpty: {
            message: "请输入商品库存"
          },
          //正则校验
          regexp:{
            regexp:/^[1-9]\d*$/,
            message:'商品库存格式，必须是非0开头的数字'
          }
        }
      },
      size: {
        validators: {
          notEmpty: {
            message: "请输入商品尺码"
          },
          //正则校验
          regexp:{
            regexp:/^\d{2}-\d{2}$/,
            message:'尺码格式，必须是32-40'
          }
        }
      },
      oldPrice: {
        validators: {
          notEmpty: {
            message: "请输入商品原价"
          }
        }
      },
      price: {
        validators: {
          notEmpty: {
            message: "请输入商品价格"
          }
        }
      },
      // 标记图片是否上传满三张
      picStatus: {
        validators: {
          notEmpty: {
            message: "请上传3张图片"
          }
        }
      }
    }
   })

   //注册校验成功事件
   $('#form').on('success.form.bv',function (e) { 
     //组织默认的提交
     e.preventDefault();
     //表单提交得到的参数字符串
     var params=$('#form').serialize();

    //  console.log(picArr)

     //在参数的基础上拼接图片的参数
     //$picName1=xx&picAddr1=xx
     //$picName2=xx&picAddr2=xx
     //$picName3=xx&picAddr3=xx
     params += "&picName1=" + picArr[0].picName + "&picAddr1=" + picArr[0].picAddr;
     params += "&picName2=" + picArr[1].picName + "&picAddr2=" + picArr[1].picAddr;
     params += "&picName3=" + picArr[2].picName + "&picAddr3=" + picArr[2].picAddr;
    
     //通过 ajax进行添加请求
     $.ajax({
      url: '/product/addProduct',
      type:'post',
      data:params,
      success:function (info) { 
        console.log(info)
        if(info.success) {
          //关闭模态框
          $('#addModal').modal('hide');
          //重置校验状态和文本内容
          $('#form').data('bootstrapValidator').resetForm(true)
          //重新渲染第一页
          currentPage = 1;
          render();

          //手动重置下拉菜单
          $('#dropdownText').text("请选择二级分类")

          //删除结构中的所有图片
          $('#imgBox img').remove();
          //重置数组 picArr
          picArr = [];
        }
       }
     })
    })
  })