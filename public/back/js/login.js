$(function(){
  //1.进行表单校验
  // 校验要求：(1)用户名不能为空
  //          (2)密码不能为空，且必须是6-12位
  $("#form").bootstrapValidator({
    // 配置图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    //对字段进行校验
    fields:{
      username:{
        //检验规则
        validators:{
          //非空校验
          notEmpty:{
            //为空时的提示信息
            message:"用户名不能为空"
          },
          stringLength: {
            min: 2,
            max: 6,
            message: "用户名长度必须是2-6位"
          },
          callback:{
            message:"用户名不存在"
          }
        }
      },
      password:{
        //校验法则
        validators:{
          //非空校验
          notEmpty:{
            message:"密码不能为空"
          },
          //长度校验
          stringLength:{
            min:6,
            max:12,
            message:"密码长度必须是6-12位"
          },
          callback:{
            message:"密码错误"
          }
        }
      }
    }
  });

  $("#form").on('success.form.bv', function (e) {
    var Formdata= $(this).serialize();
    e.preventDefault();
    $.ajax({
      data:Formdata,
      type:'post',
      url: "/employee/employeeLogin",
      dataType:'json',
      success:function (info) {
        console.log(info)
        var validator = $("#form").data('bootstrapValidator'); //获取validator 实例
        
        if(info.success){
          location.href="index.html"
        }
        if (info.error===1001){
          validator.updateStatus("password", "INVALID", "callback")
        }
        if(info.error===1000){
          validator.updateStatus('username', "INVALID","callback")
        }
      }
    })
  
  });

  //重置功能
  $('[type="reset"]').click(function(){
    $("#form").data('bootstrapValidator').resetForm(true);
  })
})