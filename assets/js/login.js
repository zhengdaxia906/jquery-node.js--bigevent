

$(function(){


    $('#link_reg').on('click',function(){
        $('.login-box').hide()
        $('.reg-box').show()
    })

    $('#link_login').on('click',function(){
        $('.login-box').show()
        $('.reg-box').hide()
    })

   

})
let form = layui.form
let layer = layui.layer
let data = { 
    username:$('#form_reg[name=username]').val(),password:$('#form_reg[name=password]').val()
}
// 自定义校验规则
form.verify({
    pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
    // 校验俩次密码是否一致的规则
    repwd: function(value){
       let pwd = $('.reg-box [name=password]').val()
       if(pwd!==value){
           return '俩次密码不同，请检查！'
       }
    }
})
// 注册请求
$('#form_reg').on('submit', function(e) {
    // 1. 阻止默认的提交行为
    e.preventDefault()
    // 2. 发起Ajax的POST请求

    $.post('/api/reguser', data, function(res) {
      if (res.status !== 0) {
        return layer.msg('失败！！')
      }
      layer.msg('注册成功，请登录！')
      // 模拟人的点击行为
      $('#link_login').click()
    })
  })
// 登录请求
$('#form_login').submit(function(e){
    e.preventDefault()
    $.ajax({
        url:'/api/login',
        method:'POST',
        data:$(this).serialize(),
        success:function(res){
            if(res.status!==0){
                return layer.msg('登录失败')
            }
            layer.msg('登陆成功！')
            localStorage.setItem('token',res.token)
            location.href = './index.html'
        }
    })
})