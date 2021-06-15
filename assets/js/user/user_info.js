$(function () {
    let form = layui.form
    let layer = layui.layer

    form.verify({
        nickname:function (value) {
            if(value.length > 6){
                return'昵称长度必须为1~6个字符'
            }          
        }
    })

    initUserInfo()

    function initUserInfo() {
        $.ajax({
            method:'GET',
            url:'/my/userinfo',
            success:function (res) {
                if(res.status !==0){
                    return layer.msg('获取信息失败！')
                }
                console.log(res);
                form.val('formUserInfo',res.data)
            }            
        })
    }

    // 重置按钮
    $('#btnReset').on('click',function (e) {
        e.preventDefault()
        initUserInfo()
    })

    // 提交按钮
    $('.layui-form').on('submit',function (e) {
        e.preventDefault()
        $.ajax({
            method:'POST',
            url:'/my/userinfo',
            data:$(this).serialize(),
            success:function(res){
                if(res.status!==0){
                    return layer.msg('更新失败')
                }
                layer.msg('成功')
                window.parent.getUserInfo()
            }
        })
    })

})