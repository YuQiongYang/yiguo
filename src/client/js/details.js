require.config({
    path: {
        'jquery': './jquery',
        'httpclient': './httpclient',
        'alert':'./alert'
    }
});
define(['jquery', 'httpclient','alert'], function ($, http,Jalert) {
    //$(function () {

    var id = window.location.search.slice(1).split(';')[1];
    var page = window.location.search.slice(1).split(';')[0];
    var swiper = new Swiper('.swiper-container', {
        pagination: {
            el: '.swiper-pagination',
            dynamicBullets: true,
        },
    });

    http.post('indx_goods').then(function (res) {
        res.data.forEach(function (item) {
            if (item._id == id) {
                var detail = '<div class="banner">' +
                    '<a class="forback" href ="../client/index.html"></a>' +
                    '<div class="swiper-container">' +
                    '<div class="swiper-wrapper">' +
                    '<div class="swiper-slide"><img src="https:' + item.src + '" alt=""></div>' +
                    '<div class="swiper-slide"><img src="https:' + item.src + '" alt=""></div>' +
                    '<div class="swiper-slide"><img src="https:' + item.src + '" alt=""></div>' +
                    '</div>' +
                    '<div class="swiper-pagination"></div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="productInfo">' +
                    '<p class="title">' + item.name + '</p>' +
                    '<p class="subhead">' +
                    '<span>' + item.saletip + '</span>' +
                    '</p>' +
                    '<div class="price">' +
                    '<p class="salepri">' + item.price + '</p>' +
                    '<p class="originalpri"></p>' +
                    '</div>' +
                    '<p class="sevenday">.不支持七天无理由退货</p>' +
                    '</div>' +
                    '<div class="sale">' +
                    '<p class="promotion">促销</p>' +
                    '<i class="label">全网</i>' +
                    '<p class="tip">' + item.saletip + '</p>' +
                    '<i class="goback fa fa-angle-right"></i>' +
                    '</div>' +
                    '<div class="norms">' +
                    '<p class="owned size">规格<span>' + item.unit + '</span></p>' +
                    '<div class="owned num">数量<p><i class="pre">-</i><span>1</span><i class = "next">+</i></p></div>' +
                    '</di>';
                $(detail).appendTo($('main'));
                $('.num').click(function (e) {
                    if ($(e.target).is('.pre')) {
                        if ($(this).find('span').text() > 0){
                            var num = parseInt($(this).find('span').text());
                            num--;
                            $(this).find('span').text(num);
                        }
                    } else if ($(e.target).is('.next')) {
                        var num = parseInt($(this).find('span').text());
                        num++;
                        $(this).find('span').text(num);

                    }
                })
                $('.car').click(function () {
                    window.location.href = '../client/index.html?page=shop'
                })
            }
        })
    })
    http.post('goodslist').then(function (res) {
        res.data.forEach(function (item) {
            if (item._id == id) {
                var detail = '<div class="banner">' +
                    '<i class="forback"></i>' +
                    '<div class="swiper-container">' +
                    '<div class="swiper-wrapper">' +
                    '<div class="swiper-slide"><img src="' + item.SmallPic + '" alt=""></div>' +
                    '<div class="swiper-slide"><img src="' + item.SmallPic + '" alt=""></div>' +
                    '<div class="swiper-slide"><img src="' + item.SmallPic + '" alt=""></div>' +
                    '</div>' +
                    '<div class="swiper-pagination"></div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="productInfo">' +
                    '<p class="title">' + item.CommodityName + '</p>' +
                    '<p class="subhead">' +
                    '<span>' + item.PromotionTag + '</span>' +
                    '</p>' +
                    '<div class="price">' +
                    '<p class="salepri">￥' + item.SellPrice + '</p>' +
                    '<p class="originalpri"></p>' +
                    '</div>' +
                    '<p class="sevenday">.不支持七天无理由退货</p>' +
                    '</div>' +
                    '<div class="sale">' +
                    '<p class="promotion">促销</p>' +
                    '<i class="label">全网</i>' +
                    '<p class="tip">' + item.PromotionTag + '</p>' +
                    '<i class="goback fa fa-angle-right"></i>' +
                    '</div>' +
                    '<div class="norms">' +
                    '<p class="owned size">规格<span>' + item.Spec + '</span></p>' +
                    '<div class="owned num">数量<p><i class="pre">-</i><span>1</span><i class = "next">+</i></p></div>' +
                    '</di>';
                $(detail).appendTo($('main'));
                $('.num').click(function (e) {
                    if ($(e.target).is('.pre')) {
                        if ($(this).find('span').text() > 0) {
                            var num = parseInt($(this).find('span').text());
                            num--;
                            $(this).find('span').text(num);
                        }
                    } else if ($(e.target).is('.next')) {
                        var num = parseInt($(this).find('span').text());
                        num++;
                        $(this).find('span').text(num);

                    }
                })
                $('.car').click(function () {
                    window.location.href = '../client/index.html?page=shop'
                })
                $('.forback').click(function () {
                    if (page == 'main') {
                        window.location.href = "../client/index.html";
                    }
                    if (page == 'list') {
                        window.history.back(-1);
                    }
                })
            }
        })
    })
    $('.account').click(function () {
        if ($(this).parent().siblings('main').find('.pre').siblings('span').text() > 0) {
            var l = false;
            var lres = window.localStorage.getItem('goodslist');
            lres = JSON.parse(lres);
            if (lres == null) {
                lres = [];
                lres.push({
                    _id: window.location.search.slice(1).split(';')[1],
                    CommodityName: $(this).parent().siblings('main').find('.title').text(),
                    SellPrice: $(this).parent().siblings('main').find('.salepri').text().slice(1),
                    SmallPic: $(this).parent().siblings('main').find('img').attr('src'),
                    qty: $(this).parent().siblings('main').find('.pre').siblings('span').text()
                })
            } else {
                lres.forEach(function (item) {
                
                    if (item._id == window.location.search.slice(1).split(';')[1]) {
                        item.qty = item.qty*1 + $(this).parent().siblings('main').find('.pre').siblings('span').text() * 1;
                        l = true;
                    }
                }.bind(this))
                if (!l) {
                    lres.push({
                        _id: window.location.search.slice(1).split(';')[1],
                        CommodityName: $(this).parent().siblings('main').find('.title').text(),
                        SellPrice: $(this).parent().siblings('main').find('.salepri').text().slice(1),
                        SmallPic: $(this).parent().siblings('main').find('img').attr('src'),
                        qty: $(this).parent().siblings('main').find('.pre').siblings('span').text()
                    })
                }
            }
            Jalert('加入购物车成功')
            window.localStorage.setItem('goodslist', JSON.stringify(lres));
        }

    })

    //})
});