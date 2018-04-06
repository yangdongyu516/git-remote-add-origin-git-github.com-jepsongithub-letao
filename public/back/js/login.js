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
          }
        }
      }
    }
  })
})