require.config({
    path: {
        'jquery': './jquery',
        'httpclient': './httpclient',
    }
})

define(['jquery', 'httpclient'], function ($, http) {
    return  function () {
        $(window).scroll(function () {
            if (scrollY > 600) {
                $('.jumpTop').css({
                    'display': 'block'
                })
            } else {
                $('.jumpTop').css({
                    'display': 'none'
                })
            }
        });
        http.post('indx_goods').then(function (res) {
            // console.log(res)
            for (var i = 0; i < 5; i++) {
                var i_arr = [];
                var ii_arr = [];
                res.data.forEach(function (item) {
                    if (item.floor == i + 1) {
                        i_arr.push(item);
                    }
                })
                var src;
                i_arr.forEach(function (item) {
                    if (item.type) {
                        src = item.src;
                    } else {
                        ii_arr.push(item);
                    }
                })
                var lis = '<li>' +
                    '<img src="https:' + src + '" alt="">' +
                    '</li>';
                var swiperConter = '<div class="swiper-container"></div>';
                var swiperWrapper = $('<div class="swiper-wrapper"></div>');
                for (var j = 0; j < ii_arr.length - 1; j++) {

                    var everyi =
                        '<div class="swiper-slide" data-id ="' + ii_arr[j]._id + '">' +
                        '<div class="pic"><img src ="https:' + ii_arr[j].src + '"/></div>' +
                        '<div class="info">' +
                        '<p class="name">' + ii_arr[j].name + '</p>' +
                        '<p class="saletip"><span>' + ii_arr[j].saletip + '</span></p>' +
                        '<p class="price"><strong>' + ii_arr[j].price + '</strong>/' + ii_arr[i].unit + '</p>' +
                        '</div>';
                    $(everyi).appendTo(swiperWrapper);
                    // console.log(swiperWrapper)
                }
                $('.big').append($(lis).append($(swiperConter).append(swiperWrapper)));
                for (var m = 0; m < $('.saletip span').length; m++) {
                    if ($($('.saletip span')[m]).text() == '') {
                        $($('.saletip span')[m]).css({
                            "border": "none"
                        })
                    }
                }
               
                
                // if(.text() == null){

                //     
                // }
                var swiper = new Swiper('.swiper-container', {
                    slidesPerView: 3,
                    spaceBetween: 30,
                    freeMode: true,
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                    },
                });
            }
            $('.swiper-slide', '.swiper-wrapper', '.swiper-container', 'li', '.big').click(function (e) {
                if($(e.target).parent().parent().attr('data-id')){
                    window.location.href = "details.html?main;" + $(e.target).parent().parent().attr('data-id');
                }else if($(e.target).parent().parent().parent().attr('data-id')){
                    window.location.href = "details.html?main;" + $(e.target).parent().parent().parent().attr('data-id');
                }
                
            })
            // var fruit = [];
            // for (var j = 0; j < res.data.length; j++) {
            //     if (res.data[j].CommodityTag == 11) {
            //         fruit.push(res.data[j]);
            //     }
            // }


        });
        http.post('goodslist').then(function (res) {
            for (var i = 0; i < 11; i++) {
                var li = '<li data-id="' + res.data[i]._id + '">' +
                    '<div class="lm_l">' +
                    '<img src="' + res.data[i].SmallPic + '" alt="">' +
                    '</div>' +
                    '<div class="lm_r">' +
                    '<p class="name">' + res.data[i].CommodityName + '</p>' +
                    '<p>' + res.data[i].SubTitle + '</p>' +
                    '<i>' + res.data[i].PromotionTag + '</i>' +
                    '<p>' +
                    '<span class="pr">' + res.data[i].SellPrice + '</span>' +
                    '<span>' + res.data[i].OriginalPrice + '</span>' +
                    '<sapn>' + res.data[i].Spec + '</sapn>' +
                    '</p>' +
                    '</div>' +
                    '</li>';
                $(li).appendTo('main .prolist');
            }
            $('.prolist li').click(function(){
                window.location.href = "details.html?main;" + $(this).attr('data-id');
            })
        })
      
    }
   

    // })
    


    //})
})