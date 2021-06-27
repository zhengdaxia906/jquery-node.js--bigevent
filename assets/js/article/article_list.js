$(function () {
  var layer = layui.layer
  var form  = layui.form
  var laypage = layui.laypage
  // time过滤器
  template.defaults.imports.dateFormat = function (date) {
    const dt = new Date(date)
    var y = dt.getFullYear()
    var m = padZero(dt.getMonth())
    var d = padZero(dt.getDay())
    var hh = padZero(dt.getHours())
    var mm = padZero(dt.getMinutes())
    var ss = padZero(dt.getSeconds())

    return y +'-' + m + '-' + d + '-' + hh +':' + mm + ':' + ':' +ss

  }
  // 补0的函数
  function padZero(n) {
    return n>9 ? n :'0' + n
  }

  
  var  q={
    pagenum:'1',
    pagesize:'2',
    cate_id:'',
    state:''
  }
  initTable()
  initCate()

// 渲染列表数据
function initTable() {
  $.ajax({
    method: 'GET',
    url: '/my/article/list',
    data: q,
    success: function(res) {
      if (res.status !== 0) {
        return layer.msg('获取文章列表失败！')
      }
      // 使用模板引擎渲染页面的数据
      var htmlStr = template('tpl-table', res)
      $('tbody').html(htmlStr)
      // 调用渲染分页的方法
      renderPage(res.total)
    }
  })
}


// 初始化文章分类
  // 初始化文章分类的方法
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('获取分类数据失败！')
        }
        // 调用模板引擎渲染分类的可选项
        var htmlStr = template('tpl-cate', res)

        console.log(htmlStr);
        $('[name=cate_id]').html(htmlStr)
        // 通过 layui 重新渲染表单区域的UI结构
        form.render()
      }
    })
  }


  // 筛选按钮
  $('#form-search').on('submit',function (e) {
    e.preventDefault()
    
    var cate_id = $('[name = cate_id]').val()
    var state = $('[name = state]').val()

    // 改变q的值以获取筛选后的列表数据
    q.cate_id = cate_id
    q.state = state
    
    initTable()
  })

  // 分页方法
  function renderPage(total) {
    
      //执行一个laypage实例
      laypage.render({
        elem: 'pageBox' , //这里是id值但不需要加#
        count: total, //数据总数，从服务端得到
        limit: q.pagesize, //每页显示几条数据
        curr: q.pagenum ,//默认选中的页
        layout:['count','limit','page','prev','next','skip'],
        limits:[3,5,10,20],


        jump: function (obj,first) {
          q.pagenum = obj.curr
          q.pagesize = obj.limit
          if(!first){
            initTable()
          }
        }
      });
  }

  // 删除文章按钮
  $('tbody').on('click','.btn-delete',function () {
    var id = $(this).attr('data-id')
    var len = $('.btn-delete').length

    layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
      $.ajax({
        method:'GET',
        url:'/my/article/delete/' +id,
        success:function (res) {
          if(res.status !==0){
            return layer.msg('删除失败')
          }
          layer.msg('删除成功！')
          if(len===1){
            q.pagenum = q.pagenum = 1 ? 1:q.pagenum-1
          }
        }
      })
      
      layer.close(index);
    });
  })
  
})