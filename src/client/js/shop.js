define(['jquery', 'httpclient', 'demo'], function ($, http, dem) {
    function shop() {
         var lra = [];
        //猜你喜欢
        http.post('goodslist').then(function (res) {
            if (res.status == true) {
                var data = res.data;

                //随机取出10个数组
                var datas1 = [];
                for (var i = 0; i < 10; i++) {
                    datas1.push(data[parseInt(Math.random() * 64)]);
                }

                var car = datas1.map(function (item) {
                    return '<li data-id='+item._id+'>' +
                        '<img src="' + item.SmallPic + '"/>' +
                        '<div class="txt">' +
                        '<h2>' + item.CommodityName + '</h2>' +
                        '<p class="red">￥<b>' + item.OriginalPrice + '</b></p>' +
                        '<a href="javasrcipt:;" class="goods-btn"></a>' +
                        '</div>' +
                        '</li>';
                });
                $('.j-goods').html(car);

               
                //添加商品购车
                $('.goods-btn').click(function (e) {
                    var l = false;
                    var lres = window.localStorage.getItem('goodslist');
                    lres = JSON.parse(lres);
                    if (lres == null) {
                        lres = [];
                        lres.push({
                            _id: $(this).parent().parent().attr('data-id'),
                            CommodityName: $(this).parent().children('h2').text(),
                            SellPrice: $(this).parent().children('p').children('b').text(),
                            SmallPic: $(this).parent().parent().find('img').attr('src'),
                            qty: 1
                        })
                    } else {
                        lres.forEach(function (item) {
                            if (item._id ==  $(this).parent().parent().attr('data-id')) {
                                item.qty++;
                                l = true;
                            }
                        }.bind(this))
                        if (!l) {
                            lres.push({
                                _id: $(this).parent().parent().attr('data-id'),
                                CommodityName: $(this).parent().children('h2').text(),
                                SellPrice: $(this).parent().children('p').children('b').text(),
                                SmallPic: $(this).parent().parent().find('img').attr('src'),
                                qty: 1
                            })
                        }
                    }
        
                    window.localStorage.setItem('goodslist', JSON.stringify(lres));
                    var lrs = datas(lres);
                    //更新购物车
                    $('.shop-nogoods').html('');
                    $('.shop-nogoods').append(lrs);
                    btn();

                     //全选按钮
                    $('.check', '.shop-total').on('click', function () {
                        if ($('.shop-total').find('.check i').prop('class') == 'activ') {

                            $('.shop-total').find('.check i').removeClass("activ");
                            $('.one').find('.check i').prop('class', 'checkI');

                            $('.shop-total').find('.text b').text('0.00');
                            $('.shop-total').find('.btn a').text('去结算(0)');

                            $('.shop-total').find('.btn a').prop('class', 'no')

                            $('.shop-express').html('全场满100元包邮,还差<span class="red">100.00</span>元包邮');

                        } else {
                            $('.shop-total').find('.check i').prop('class', 'activ');
                            $('.one').find('.check i').prop('class', 'active');
                            // 总价
                            var str = 0;
                            for (var i = 0; i < $('.one').find('.text').find('b').length; i++) {
                                str += $('.one').find('.text').find('b')[i].innerText * 1;
                            }
                            $('.shop-total').find('.text b').text(str.toFixed(2));
                            $('.shop-total').find('.btn a').prop('class', 'red')
                            $('.shop-total').find('.btn a').text('去结算(' + data.length + ')');

                            var num = ($('.shop-total .text b').text() * 1 - $('.shop-express span').text() * 1).toFixed(2);
                            if (num > 100) {
                                $('.shop-express').text('全场满100元包邮,已包邮');
                            } else {
                                num = ($('.shop-total .text b').text() * 1 + $('.shop-express span').text() * 1).toFixed(2);
                                $('.shop-express').html('全场满100元包邮,还差<span class="red">' + num + '</span>元包邮');
                            }
                            $('.shop-total').find('.btn a').text('去结算(' + data.length + ')');

                        }
                    });
                    //单选/del/加减
                    $('.one', '.shop-nogoods').on('click', function (e) {
                        var data = lres;
                        //del 
                        if ($(e.target).parent().hasClass('del')) {
                            var one = $(e.target).parents('.one');
                            for (var i = 0; i < data.length; i++) {
                                if (data[i]['_id'] == $(e.target).parent().parent().data('guid')) {
                                    dem.confirm('', '确定删除吗', [],
                                        function (e) {
                                            var button = $(e.target).attr('class');
                                            if (button == 'ok') {
                                                this.hide();
                                            
                                                var c = one.data('guid')
                                                for (var j = 0; j < data.length; j++) {
                                                    if (data[j]._id == c) {
                                                        data.splice(j, 1);
                                                    }
                                                }
                                                one.html('');
                                                one.css({
                                                    'border': '0'
                                                });
                                                window.localStorage.setItem('goodslist', JSON.stringify(data));
                                            }

                                            if (button == 'cancel') {
                                                this.hide();
                                            }
                                        });
                                }else if(data[i]['_id'] == $(e.target).parent().parent().data('guid')){

                                }
                            };

                            if (data.length == 0) {
                                nogoods();
                            }
                            if(window.localStorage.getItem('goodslist') == '[]'){
                                nogoods()
                            }
                            console.log(data.length)
                        }


                        var text = $(e.target).parent().parent().children('.text').children('p').children('strong').children('b');

                        //减
                        if ($(e.target).hasClass('cut')) {
                            if ($(e.target).next().text() * 1 == 1) {
                                return false;
                            } else {
                                for (var i = 0; i < data.length; i++) {
                                    if (data[i]._id == $(e.target).parent().parent().data('guid')) {
                                        data[i].qty--;
                                        window.localStorage.setItem('goodslist', JSON.stringify(data));
                                        $(e.target).next().text(data[i].qty)
                                        $(text).text((data[i].qty * data[i].SellPrice).toFixed(2));
                                    }
                                }
                            }
                        }

                        //加
                        if ($(e.target).hasClass('add')) {
                            for (var i = 0; i < data.length; i++) {
                                if (data[i]._id == $(e.target).parent().parent().data('guid')) {
                                    data[i].qty++;
                                    window.localStorage.setItem('goodslist', JSON.stringify(data));
                                    $(e.target).siblings('.input').text(data[i].qty);
                                    $(text).text((data[i].qty * data[i].SellPrice).toFixed(2));
                                }
                            }
                        }

                    });
                }) 
               
            }
        });

        var data;
        if (window.localStorage.getItem('token')) {
            $('.shop-Login').html('');
            $('.shop-express').css({
                'position': 'relative',
                'top': '0'
            });
            $('.shop-nogoods').css({
                'marginTop': '10px',
            })
            close();

            if (window.localStorage.getItem('goodslist') == '[]') {
                nogoods();
            }

            if (window.localStorage.getItem('goodslist')) {
                http.post('buycart', {
                    username: window.localStorage.getItem('username'),
                    SpCart: window.localStorage.getItem('goodslist')
                }).then(function (res) {
                        data = res.SpCart;
                        $('.shop-nogoods').css({'padding': '0'})
                        var car = datas(data);
                        $('.shop-nogoods').html(car);
                        btn(true);
                        if(data.length <= 0){
                            nogoods();
                        }
                });
            }
            

        } else {
            close(true);
            nogoods();
            //本地存储数据
            if (window.localStorage.getItem('goodslist')) {
                var str = window.localStorage.getItem('goodslist');
                var data = JSON.parse(str);

                $('.shop-nogoods').css({
                    'padding': '0'
                })
                var car = datas(data);
                $('.shop-nogoods').html(car);
                btn();
            }
            if (window.localStorage.getItem('goodslist') == null) {
                nogoods();
            }
            if(window.localStorage.getItem('goodslist') == '[]'){
                nogoods()
            }
        }
        //购物车功能
        function btn() {

            //全选按钮
            $('.check', '.shop-total').on('click', function () {
                if ($('.shop-total').find('.check i').prop('class') == 'activ') {

                    $('.shop-total').find('.check i').removeClass("activ");
                    $('.one').find('.check i').prop('class', 'checkI');

                    $('.shop-total').find('.text b').text('0.00');
                    $('.shop-total').find('.btn a').text('去结算(0)');

                    $('.shop-total').find('.btn a').prop('class', 'no')

                    $('.shop-express').html('全场满100元包邮,还差<span class="red">100.00</span>元包邮');

                } else {
                    $('.shop-total').find('.check i').prop('class', 'activ');
                    $('.one').find('.check i').prop('class', 'active');
                    // 总价
                    var str = 0;
                    for (var i = 0; i < $('.one').find('.text').find('b').length; i++) {
                        str += $('.one').find('.text').find('b')[i].innerText * 1;
                    }
                    $('.shop-total').find('.text b').text(str.toFixed(2));
                    $('.shop-total').find('.btn a').prop('class', 'red')
                    $('.shop-total').find('.btn a').text('去结算(' + data.length + ')');

                    var num = ($('.shop-total .text b').text() * 1 - $('.shop-express span').text() * 1).toFixed(2);
                    if (num > 100) {
                        $('.shop-express').text('全场满100元包邮,已包邮');
                    } else {
                        num = ($('.shop-total .text b').text() * 1 + $('.shop-express span').text() * 1).toFixed(2);
                        $('.shop-express').html('全场满100元包邮,还差<span class="red">' + num + '</span>元包邮');
                    }
                    $('.shop-total').find('.btn a').text('去结算(' + data.length + ')');

                }
            });

            //单选/del/加减
            $('.one', '.shop-nogoods').on('click', function (e) {
                //单选
                if ($(e.target).prop('class') == 'checkI') {
                    $(e.target).prop('class', 'active');
                    sum();
                    $('.shop-total').find('.btn a').prop('class', 'red');
                    var num = Math.abs($('.shop-total .text b').text() * 1 - $('.shop-express span').text() * 1).toFixed(2);

                    if (num > 100) {
                        $('.shop-express').text('全场满100元包邮,已包邮');
                    } else {
                        $('.shop-express').html('全场满100元包邮,还差<span class="red">' + num + '</span>元包邮');
                    }

                } else if ($(e.target).prop('class') == 'active') {
                    $(e.target).prop('class', 'checkI');
                    $('.shop-total').find('.check i').removeClass("activ");
                    sum();
                    $('.shop-total').find('.btn a').prop('class', 'no');
                    $('.shop-total .text b').text('0.00')
                    $('.shop-express').html('全场满100元包邮,还差<span class="red">100.00</span>元包邮');
                }


                //del 
                if ($(e.target).parent().hasClass('del')) {
                    var one = $(e.target).parents('.one');
                    for (var i = 0; i < data.length; i++) {
                        if (data[i]['_id'] == $(e.target).parent().parent().data('guid')) {
                            dem.confirm('', '确定删除吗', [],
                                function (e) {
                                    var button = $(e.target).attr('class');
                                    if (button == 'ok') {
                                        this.hide();
                                       
                                        var c = one.data('guid')
                                        for (var j = 0; j < data.length; j++) {
                                            if (data[j]._id == c) {
                                                data.splice(j, 1);
                                            }
                                        }
                                        one.html('');
                                        one.css({
                                            'border': '0'
                                        });
                                        window.localStorage.setItem('goodslist', JSON.stringify(data));
                                    }

                                    if (button == 'cancel') {
                                        this.hide();
                                    }
                                    if(window.localStorage.getItem('goodslist') == '[]'){
                                        nogoods()
                                    }
                                });
                        }else if(data[i]['_id'] == $(e.target).parent().parent().data('guid')){

                        }
                    };

                    if (data.length == 0) {
                        nogoods();
                    }
                }


                var text = $(e.target).parent().parent().children('.text').children('p').children('strong').children('b');

                //减
                if ($(e.target).hasClass('cut')) {
                    if ($(e.target).next().text() * 1 == 1) {
                        return false;
                    } else {
                        for (var i = 0; i < data.length; i++) {
                            if (data[i]._id == $(e.target).parent().parent().data('guid')) {
                                data[i].qty--;
                                window.localStorage.setItem('goodslist', JSON.stringify(data));
                                $(e.target).next().text(data[i].qty)
                                $(text).text((data[i].qty * data[i].SellPrice).toFixed(2));
                            }
                        }
                    }
                }

                //加
                if ($(e.target).hasClass('add')) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i]._id == $(e.target).parent().parent().data('guid')) {
                            data[i].qty++;
                            window.localStorage.setItem('goodslist', JSON.stringify(data));
                            $(e.target).siblings('.input').text(data[i].qty);
                            $(text).text((data[i].qty * data[i].SellPrice).toFixed(2));
                        }
                    }
                }

            });



        }

        //结算
        function close(falst) {
            //点击当前btn把数据发送到后台进入订单页界面
            $('.btn', '.shop-total').on('click', function (e) {
                if ($(e.target).hasClass('red')) {
                    if ($('i', '.check', '.one', '.shop-nogoods').hasClass('active')) {
                        var stuID = [];
                        for (var i = 0; i < $('.active', '.check', '.one', '.shop-nogoods').length; i++) {
                            stuID.push($($('.active', '.check', '.one', '.shop-nogoods')[i]).parent().parent().data('guid'))
                        }

                        var goods = []
                        for (var i = 0; i < data.length; i++) {
                            if (data[i]._id == stuID[i]) {
                                goods.push(data[i]);
                            } else if (data[i]._id == stuID) {
                                goods.push(data[i]);
                            }
                        }
                        http.post('order', {
                            username: window.localStorage.getItem('username'),
                            SpCart: JSON.stringify(goods)
                        }).then(function (res) {
                            if (res.status) {
                                window.localStorage.setItem('list', JSON.stringify(res.SpCart))
                                window.location.href = './order.html';
                            }

                        });
                    }
                }
            });
            if (falst) {
                $('.btn', '.shop-total').on('click', function (e) {
                    window.location.href = './login.html';
                })
            }
        }

        //单选
        function sum() {
            var sumbuy = 0;
            for (var i = 0; i < $(".active").parent().parent().length; i++) {
                sumbuy += $($(".active").parent().parent()[i]).data().pirce * 1 || 0;
            }
            var qty = i - 1;
            if (qty == 0) {
                $('.shop-total').find('.btn a').prop('class', 'no')
            } else {
                $('.shop-total').find('.btn a').text('去结算(' + qty + ')');
                $('.shop-total').find('.text b').text(sumbuy);
            }
            if (!$('.one').find('.check i').hasClass('checkI')) {
                $('.shop-total').find('.check i').prop('class', 'activ');
            } else {
                $('.shop-total').find('.check i').prop('class', 'no');
            }



        }

        //遍历数据
        function datas(data) {
            var car = data.map(function (item) {
                return '<div class="one" data-guid="' + item._id + '" data-pirce="' + item.qty * item.SellPrice + '">' +
                    '<div class="check"><i class="checkI"></i></div>' +
                    '<div class="img"><img src="' + item.SmallPic + '"></div>' +
                    '<div class="text">' +
                    '<h2 class="elli2">' + item.CommodityName + '</h2>' +
                    '<div class="tag"></div>' +
                    '<p><strong class="red">￥<b>' + item.qty * item.SellPrice + '</b></strong></p>' +
                    '</div>' +
                    '<div class="del"><i></i></div>' +
                    '<div class="num">' +
                    '<span class="cut j-click"><i></i></span>' +
                    '<span class="input line-bottom">' + item.qty + '</span>' +
                    '<span class="add j-click"><i></i></span>' +
                    '</div>'
                '</div>';
            });
            return car;
        }

        //car没有数据 出现的样式
        function nogoods() {
            $('.shop-nogoods').html(
                '<div class="nogoods-icon"></div>' +
                '<p>购物车空空的，快去逛逛吧！</p>' +
                '<div class="btn">' +
                '<a>去逛逛</a>' +
                '</div>')
        }

    }
    return shop;

});