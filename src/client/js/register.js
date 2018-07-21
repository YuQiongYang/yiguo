require.config({
    path: {
        'jquery': './jquery',
        'httpclient': './httpclient',
        'alert':'./alert'
    }
})

require(['jquery', 'httpclient','alert'], function ($, http,Jalert) {
    $(function(){
        $('.btn-register').on('click',function(){
                if(!/^1[3-8]\d{9}$/i.test($('#username').val())){
                    Jalert('请输入正确的用户名');
                    return  false;
                }
                if(!/^[^\s]{6,20}$/i.test($('#upassword').val())){
                    Jalert('请输入正确的密码格式');
                    return  false;
                }
                if($('#upassword').val() != $('#password').val()){
                    Jalert('请输入两次一样的密码');
                    return  false;
                }
            http.post('adduser',{
                username:$('#username').val(),
                password:$('#upassword').val()
            }).then(function(res){
                if(res.status == true){
                    window.localStorage.setItem('username', res.data.username);
                    window.localStorage.setItem('token', res.data.token);
                    window.location.href = './index.html';
                }else if(res.status == false){
                    Jalert(res.message);
                }
            });
        });
    });
});