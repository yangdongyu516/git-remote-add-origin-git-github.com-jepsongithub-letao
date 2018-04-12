$(function () { 

  //本地存储操作
  //约定：search_list 为键名

  //功能1：每次进入页面，渲染搜索历史记录
  //1.读取本地历史记录里面的数组
  //2.结合模板引擎进行渲染
  render();
  function render() {
    //因为一开始可能是没有数据的，如果没有数据就 []
    var arr = gethistory();
    $('.lt_history').html( template( "history_tpl",{ arr:arr } ))

   }

    //用于获取本地存储的数据
   function gethistory() {
     var history = localStorage.getItem("search_list") || "[]";
     var arr = JSON.parse(history);
     return arr;
    }


    //功能二:删除单条数据
    //注册事件委托，点击小红叉的时候拿到当前数据的索引,
    //取出本地存储的数据，从数据中删除对应索引的数据
  $('.lt_history').on('click','.btn_delete',function () {

    var that=this;
    mui.confirm("你确认要删除么?", "温馨提示", ["确定", "取消"], function (e) {

      if(e.index===0) {
        var index = $(that).data('index');//拿到该条数据的索引
        //取出本地存储的数据
        var arr = gethistory();

        arr.splice(index, 1);//删除对应数据

        localStorage.setItem("search_list", JSON.stringify(arr));//重新存储

        render();//重新渲染
      }
    
   })
  })
 

   //功能三：清空搜索记录
   //点击清空所有记录，弹出模态框，
   //选择确定时移除本地存储的数组
  $('.lt_history').on('click','.btn_empty',function () { 
    mui.confirm("你确定要删除吗？","温馨提示",["确定","取消"],function (e) { 
      if(e.index===0) {
        localStorage.removeItem("search_list");
        render();
      }
     })
   })
   

  //  功能四:添加历史搜索
  //点击搜索，拿到输入框中的文本,进行本地持久化
  //条件：历史记录的条数不能超过10条  arr.length
  //不能重复 indexOf

  $('.lt_search button').click(function () {
   
    // 拿到输入框的文本，不能为空
    var txt = $(this).prev().val().trim();

    if(txt=='') {
      mui.toast("请输入搜索关键字");
      return;
    }

    //拿到数组
    var arr = gethistory();
    //存储规则：不能重复，不能超过10条
    if(arr.indexOf( txt ) !== -1){
      //获取该数据的索引
      index = arr.indexOf( txt )
      //删除该条数据
      arr.splice(index,1)
      
    }
    // 如果超过10条，删除最后一条
    if(arr.length>=10) {
      arr.pop();
    }
    // 存储到数组中
    arr.unshift( txt );
    localStorage.setItem('search_list',JSON.stringify(arr));

    render();//重新渲染
    $('.lt_search input').val("");//清空文本框

    // 跳转到搜索列表页, 将搜索关键字传递到searchList.html
    location.href = "searchList.html?txt=" + txt;
   })

 
  })