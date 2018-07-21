require.config({
    path: {
        'jquery': './jquery',
        'httpclient': './httpclient',
        'alert':'./alert'
    }
})

require(['jquery','httpclient','alert'],function($,http,Jalert){
    $(function(){
        $('.lt_l a').on('click',function(){
            window.history.back(-1);
        });
        //修改密码
        $('.btn').on('click',function(){
            if($('#oldpassword').val() == ''){
                Jalert('请输入密码');
                return  false;
            }
            if(!/^[^\s]{6,20}$/i.test($('#newpassword').val())){
                Jalert('请输入正确的密码格式');
                return  false;
            }
            if($('#newpassword').val() != $('#pwdaffirm').val()){
                Jalert('两次密码不一致');
                return  false;
            }else{
                http.post('changepwd',{
                    username:window.localStorage.getItem('username'),
                    password:$('#oldpassword').val(),
                    newpwd:$('#pwdaffirm').val()
                }).then(function(res){
                    if(res.status){
                        Jalert('修改密码成功');
                        window.localStorage.clear('username');
                        window.localStorage.clear('token');
                        window.location.href = './login.html'
                    }else{
                        Jalert('原密码错误');
                    }
                });
            }
        });
    });
});
