require.config({
    path: {
        'jquery': './jquery',
        'httpclient': './httpclient',
        'alert':'./alert'
    }
})

require(['jquery','httpclient','alert'],function($,http,alert){
    $(function(){
        $('.lt_l a').on('click',function(){
            // window.history.back(-1);
            window.location.href = './index.html?page=user';
        });
        
        if(window.localStorage.getItem('token')){
            var username =  window.localStorage.getItem('username');

            var res = '<li class="list"><a href="javascript:;"><span>修改登陆密码</span><em></em></a></li>'+
                        '<li class="list"><a href="javascript:;"><span>修改支付密码</span><i></i><em></em></a></li>'+
                        '<li class="list"><a href="javascript:;"><span>更换手机号码</span><i></i><em></em></a></li>'
            $('.amend').html(res);
           
            var  btn = '<div class="btn"><a href="javascript:;">退出登录</a></div>'
            $('.j-setting').append(btn);

            //显示手机号码
            $('.amend  li:last-child i').text(username).css({'color':'#333'});

            //修改密码
            $('.amend  li:first-child a').on('click',function(){
                window.location.href = './amend.html'
            });

            $('.btn').click(function(){
                alert('退出登录成功');
                window.localStorage.removeItem('username');
                window.localStorage.removeItem('token');
                window.location.href = './index.html';
            });
        }
    });
});