$(function () {
  var layer = layui.layer
  var form = layui.form

  initCate()
  initEditor()

  // 加载文章分类
  function initCate() {
    $.ajax({
      method:'GET',
      url:'/my/article/cates',
      success:function (res) {
        if(res.status!==0){
          return layer.msg('初始化文章分类失败')
        }
        var htmlStr = template('tpl-cate',res)
         $('[name=cate_id]').html(htmlStr)
        
         form.render()
      }
    })
  }


  // 图片剪裁器三步骤

  // 1初始化
  var $image = $('#image')
  // 2裁剪选项
  var options={
    aspectRatio: 400/200,
    preview:'.img-preview'
  }
  // 3初始化裁剪区域
  $image.cropper(options)


  // 点击选择封面按钮
  $('#btnChooseImage').on('click',function () {
    $('#coverFile').click()
  })

  // 监听coverFile的change事件,获取用户选择的文件列表
  $('#coverFile').on('change',function (e) {
    var files = e.target.files

    if(files.length ===0){
      return
    }
    // 根据文件创建对应的url地址
    var newImgURL = URL.createObjectURL(files[0])
    // 为裁剪区域重新设置图片
    $image
    .cropper('destroy')
    .attr('src',newImgURL)
    .cropper(options)
  })

  //  定义文章默认发布状态
  var art_state = '已发布'

  // 存为草稿
  $('#btnSave').on('click',function () {
    art_state='草稿'
  })
  // 发布按钮
  $('#form-pub').on('submit',function (e) {
    e.preventDefault()
    // 基于form表单创建一个FormData对象
    var fd = new FormData($(this)[0])

    fd.append('state',art_state)

    // 将封面裁剪后的图片输出为一个文件对象
    $image
    .cropper('getCroppedCanvas',{
      width:400,
      height:200
    })
    .toBlob(function (blob) {
      fd.append('cover_img',blob)

      // 发起请求
      publishArticle(fd)

    })

  })

  function publishArticle(fd) {
    $.ajax({
      method:'POST',
      url:'/my/article/add',
      data:fd,
      // 如果提交是FormData格式数据还需添加下面俩个配置项
      contentType:false,
      processData:false,

      success:function (res) {
        if(res.status!==0){
          return layer.msg('发布失败')
        }
        layer.msg('发布成功!')

        location.href = './article_list.html'

        // parent.$(dom1,parent.doucment).trigger('topEvent');
      }
    })
  }
})
