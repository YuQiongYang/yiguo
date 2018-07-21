require.config({
    path: {
        'jquery': './jquery',
        'httpclient': './httpclient',
        'user': './user',
        'shop': './shop',
        'alert': './alert',
        'classify':'./classify',
        'demo':'./demo',
        'main':'./main'
    }
})

require(['jquery', 'httpclient', 'user', 'shop','classify','main'], function ($, http, user, shop,classify,index) {

    //底部操作
    $(function(){

        //加载底部
        $('.j-footer').load('./footer.html',function(){
            var idxName = location.search.slice(1);
            var obj = {};
            var arr = idxName.split('=');
            obj[arr[0]] = arr[1];
        
            if(obj.page == 'shop'){
                $(".j-footer-in > .active").removeClass('active');
                $('#shop').addClass('active');
                $('.j-main').load('./shop.html',function(){
                    shop(); 
                });
            }
            if(obj.page == 'classify'){
                $(".j-footer-in > .active").removeClass('active');
                $('#classify').addClass('active');
                $('.j-main').load('./classify.html',function(){
                    classify(); 
                });
                
            }
            if(obj.page == 'user'){
                $(".j-footer-in > .active").removeClass('active');
                $('#user').addClass('active');
                $('.j-main').load('./user.html',function(){
                    user(); 
                });
            }
        });

        //默认执行
        $('.j-main').load('./main.html',function(){
            index();
        });

        //点击事件
        $('.j-footer').on('click', function (e) {
            $(".j-footer-in > .active").removeClass('active');
            if ($(e.target).prop('class') || $(e.target).prop('id')) {
                var idname = $(e.target).prop('id') || $(e.target).parent().prop('id');
                $('#' + idname).addClass('active');
                if (idname == 'user') {
                $('.j-main').load('./user.html',function(){
                    user();
                });
                }
                if (idname == 'shop') {
                    $('.j-main').load('./shop.html',function(){
                        shop();
                    });
                }
                if (idname == 'eat') {
                    $('.j-main').load('./eat.html',function(){});
                }
                if (idname == 'classify') {
                    $('.j-main').load('./classify.html',function(){
                        classify();
                    });
                }
                if (idname == 'index') {
                    $('.j-main').load('./main.html',function(){
                        index();
                    });
                
                }
            };
        });  

        
    })
});