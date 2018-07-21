require.config({
    path: {
        'jquery': './jquery',
        'httpclient': './httpclient',
        'alert':'./alert'
    }
})

require(['jquery', 'httpclient','alert'], function ($, http,Jalert) {
    $(function(){
        var yan = makeid(4);
        $('.yanzheng').text(yan);
        $('.j-btn-login').on('click',function(e){
            if($(e.target).prop('class') == 'j-login'){
                if(!/^1[3-8]\d{9}$/i.test($('#username').val())){
                    Jalert('请输入正确的用户名');
                    return  false;
                }
                if(!/^[^\s]{6,20}$/i.test($('#upassword').val())){
                    Jalert('请输入正确的密码格式');
                    return  false;
                }
                if($('#affirm').val().toUpperCase() != $('.yanzheng').text()){
                    Jalert('请输入正确的验证码');
                    return  false;
                }
                http.post('login',{
                    username:$('#username').val(),
                    password:$('#upassword').val()
                }).then(function(res){
                    if(res.status){
                        console.log(res)
                        window.localStorage.setItem('token', res.data.token);
                        window.localStorage.setItem('username',res.data.username);
                        window.location.href = './index.html';
                    }else{
                        Jalert('密码错误');
                    }
                    
                });
            }
            if($(e.target).prop('class') == 'j-register'){
                window.location.href = './register.html'
            }
        });
    });
    // 随机生成验证码
    function makeid(n){
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        for( var i=1; i <=n; i++ ){
        text += possible.charAt(Math.random()*possible.length);
        }
        return text;
    }
});

