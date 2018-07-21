define(['jquery', 'httpclient'], function ($, http) {
    return function(){
        
        $('.cr').text('')
        $('.cl>ul>li:first-child').css({
            "border-left": '.026667rem solid #11B57C',
            "backgroundColor": "#fff"
        });
        http.post('kinds').then(function(res){
            var c_data = res.data[0].fruits;
            for(var i=0;i<c_data.length;i++){
                var c_every = '<a href = "../client/list.html?fruits;'+ c_data[i].name +'"><img src ="'+ c_data[i].src +'" /><br/>'+ c_data[i].name +'</a>';
                $(c_every).appendTo($('.cr')); 
            }
        })
        $('.cl>ul>li').click(function () {
            $(this).parent().parent().siblings('.cr').text('');
            $(this).siblings('.cl>ul>li').css({
                "border-left": 'none',
                "backgroundColor": "#f4f4f4"
            })
            $(this).css({
                "border-left": '.026667rem solid #11B57C',
                "backgroundColor": "#fff"
            })
            http.post('kinds').then(function(res){
                var c_data = res.data[0][$(this).attr('data-name')];
                for(var i=0;i<c_data.length;i++){
                    var c_every = '<a href = "../client/list.html?'+  $(this).attr('data-name')+ ';' +c_data[i].name  +'"><img src ="'+ c_data[i].src +'" /><br/>'+ c_data[i].name +'</a>';
                    $(c_every).appendTo($('.cr')); 

                }
            }.bind(this))
        })
        
    }
});