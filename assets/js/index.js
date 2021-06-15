
$(function () {
    getUserInfo();

})

// 监听退出按钮
$('#btnLogout').on('click',function () {
    layer.confirm('确定退出？', {icon: 3, title:'提示'}, function(index){
        localStorage.removeItem('token')
        location.href='./login.html'
        
        layer.close(index);
      });
})




// 拿到用户信息
function getUserInfo() {
    $.ajax({
        method:"GET",
        url:'/my/userinfo',      
        success:function (res) {
            if(res.status!== 0){
                return  layui.layer.msg('获取用户信息失！')
                
            }
            // 成功获取传入头像数据
            renderAvatar(res.data)
        },
        // 执行完成时执行complete ，防止不登录手动直接访问主页
        // complete:function (res) {
        //     console.log(res);
        //     if(res.responseJSON.status ===1&&res.responseJSON.message==='身份认证失败！'){
        //         // 强制清空token.并跳回原来的注册登录页
                
        //         localStorage.removeItem('token')
        //         location.href='./login.html'
        //     }
        // }
    })
}
// 渲染用户头像
function renderAvatar(user) {
    // 1. 获取用户的名称
    var name = user.nickname || user.username
    // 2. 设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 3. 按需渲染用户的头像
    if (user.user_pic !== null) {
      // 3.1 渲染图片头像
      $('.layui-nav-img')
        .attr('src', user.user_pic)
        .show()
      $('.text-avatar').hide()
    } else {
      // 3.2 渲染文本头像
      $('.layui-nav-img').hide()
      var first = name[0].toUpperCase()
      $('.text-avatar')
        .html(first)
        .show()
    }
  }