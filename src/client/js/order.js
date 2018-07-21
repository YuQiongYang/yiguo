require.config({
    path: {
        'jquery': './jquery',
        'httpclient': './httpclient',
        'alert':'./alert'
    }
})

require(['jquery','httpclient'],function($,http){
    $(function(){
        http.post('order', {
            username: window.localStorage.getItem('username'),
            SpCart: window.localStorage.getItem('list')
        }).then(function (res) {
            console.log(res);
            if(res.status){
                $('.name-span').text(res.username);
                var data = res.SpCart;
                $('.num').text(data.length);

                var datas = data.map(function(item,id){
                    return '<li><img src="'+item.SmallPic+'"></img></li>'
                });
                $('.commodity-show').html(datas);
                
                var sum = 0;
                for(var i = 0 ;i<data.length;i++){
                    sum += data[i].SellPrice*data[i].qty
                }
                console.log(sum)
                
                $('.price span').text('￥'+ sum);
            }
            // window.localStorage.setItem('goodslist',JSON.stringify(res.SpCart))

        });
    });
});