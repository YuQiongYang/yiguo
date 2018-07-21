
define(['jquery','httpclient','alert'],function($,http){
    function users(){
        //点击跳转
        $('.name').on('click',function(){
            window.location.href = './login.html';
        });

        //发起ajax请求
        http.post('userdata',{
            username:window.localStorage.getItem('username')
        }).then(function(res){
            console.log(res)
            if(res.status === true){
                
                $('.balance').text(res.data[0].balance);
                $('.youB').text(res.data[0].youB);
                $('.name').text(window.localStorage.getItem('username'));

            }else{
                window.localStorage.removeItem('username');
                window.localStorage.removeItem('token');
                // Jalert('登录信息已失效，请重新登陆');
            }
            
        });

        //设置
        $('.setting').on('click',function(){
            window.location.href = './setting.htm'
        });

        
    }

    return users;
   
});
