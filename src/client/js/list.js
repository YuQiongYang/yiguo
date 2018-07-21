require.config({
    path: {
        'jquery': './jquery.js',
        'httpclient': './httpclient.js',
        'alert':'./alert'
    }
})
define(['jquery', 'httpclient','alert'], function ($, http,Jalert) {
    function list() {
        //创建新的li
        function createLi(res) {
            for (var i = 0; i < res.length; i++) {
                var li = '<li data-id="' + res[i]._id + '">' +
                    '<div class="lm_l">' +
                    '<img src="' + res[i].SmallPic + '" alt="">' +
                    '</div>' +
                    '<div class="lm_r">' +
                    '<p class="name">' + res[i].CommodityName + '</p>' +
                    '<p>' + res[i].SubTitle + '</p>' +
                    '<i>' + res[i].PromotionTag + '</i>' +
                    '<p>' +
                    '<span class="pr">' + res[i].SellPrice + '</span>' +
                    '<span>' + res[i].OriginalPrice + '</span>' +
                    '<sapn>' + res[i].Spec + '</sapn>' +
                    '<i class="fa fa-plus addgood"></i>' +
                    '</p>' +
                    '</div>' +
                    '</li>';
                $(li).appendTo('main ul')
            }
            $('.addgood').click(function (e) {
                var l = false;
                var lres = window.localStorage.getItem('goodslist');
                lres = JSON.parse(lres);
                if (lres == null) {
                    lres = [];
                    lres.push({
                        _id: $(this).parent().parent().parent().attr('data-id'),
                        CommodityName: $(this).parent().siblings('.name').text(),
                        SellPrice: $(this).siblings('.pr').text(),
                        SmallPic: $(this).parent().parent().siblings('.lm_l').find('img').attr('src'),
                        qty: 1
                    })
                } else {
                    console.log(555)
                    lres.forEach(function (item) {
                        if (item._id == $(this).parent().parent().parent().attr('data-id')) {
                            item.qty++;
                            l = true;
                        }
                    }.bind(this))
                    if (!l) {
                        lres.push({
                            _id: $(this).parent().parent().parent().attr('data-id'),
                            CommodityName: $(this).parent().siblings('.name').text(),
                            SellPrice: $(this).siblings('.pr').text(),
                            SmallPic: $(this).parent().parent().siblings('.lm_l').find('img').attr('src'),
                            qty: 1
                        })
                    }
                }
                    Jalert('添加购物车成功')
                window.localStorage.setItem('goodslist', JSON.stringify(lres));
            })
            $('main>ul>li').click(function(e){
                if(!$(e.target).is('.fa')){
                    window.location.href = "../client/details.html?list;" + $(this).attr('data-id');
                }
                
            })
        }
        //销量排序
        function filter() {
            if (window.location.search.slice(1).split(';')[0] == 'fruits') {
                http.post('goodslist').then(function (res) {
                    console.log(res)
                    var l_url = decodeURI(window.location.search.slice(1).split(';')[1]);
                    var res = res.data;
                    var arr = [];
                    if (l_url == '全部') {
                        createLi(res);
                    } else {
                        res.forEach(function (item) {
                            if (item.CommodityName.indexOf(l_url) > 0) {
                                arr.push(item);
                            }
                        })
                        createLi(arr);
                    }
                })
            } else if (window.location.search.slice(1).split(';')[0] == 'meat') {
                http.post('meat_goodsData').then(function (res) {
                    var l_url = decodeURI(window.location.search.slice(1).split(';')[1]);
                    var res = res.data;
                    var arr = [];
                    if (l_url == '全部') {
                        createLi(res);
                    } else {
                        res.forEach(function (item) {
                            if (item.CommodityTag.indexOf(l_url) == 0) {
                                arr.push(item);
                            }
                        })
                        createLi(arr);
                    }
                })
            }


        }
        //倒序和顺序
        function judge(n, res) {
            if (n == 0) {
                for (var i = 0; i < res.length; i++) {
                    for (var j = 0; j < res.length - 1 - i; j++) {
                        if (res[j].SellPrice < res[j + 1].SellPrice) {
                            var middle = res[j];
                            res[j] = res[j + 1];
                            res[j + 1] = middle;
                        }
                    }
                }

            }
            if (n == 1) {
                for (var i = 0; i < res.length; i++) {
                    for (var j = 0; j < res.length - 1 - i; j++) {
                        if (res[j].SellPrice > res[j + 1].SellPrice) {
                            var middle = res[j];
                            res[j] = res[j + 1];
                            res[j + 1] = middle;
                        }
                    }
                }
            }
        }
        //价格排序
        function filterPrc(n) {
            if (window.location.search.slice(1).split(';')[0] == 'fruits') {
                apipri('goodslist');
            } else if (window.location.search.slice(1).split(';')[0] == 'meat') {
                apipri('meat_goodsData');
            }

            function apipri(apis) {
                http.post('' + apis).then(function (res) {
                    var l_url = decodeURI(window.location.search.slice(1).split(';')[1]);
                    var res = res.data;
                    var oldres = res;
                    var arr = [];
                    if (l_url == '全部') {
                        judge(n, res);
                        createLi(res);
                    } else {
                        res.forEach(function (item) {
                            if (item.CommodityName.indexOf(l_url) > 0) {
                                arr.push(item);
                            }
                        })
                        judge(n, arr);
                        createLi(arr);
                    }

                })
            }

        }
        filter();
        var s = 0;
        //点击哪个即按哪个排序
        $('.nav').click(function (e) {
            $(this).find('span').css({
                'border-bottom': 'none',
                'color': '#000'
            })
            $('main ul').text('');
            if ($(e.target).text().trim() == '销量') {
                filter();
                $(e.target).css({
                    'border-bottom': '.026667rem solid #11B57C',
                    'box-sizing': 'border-box',
                    'color': '#11B57C'
                })
            }
            if ($(e.target).text().trim() == '价格') {
                if (s > 1) {
                    s = 0;
                }
                filterPrc(s);

                $(e.target).css({
                    'border-bottom': '.026667rem solid #11B57C',
                    'box-sizing': 'border-box',
                    'color': '#11B57C'
                })
                s++;
            }
        })
        $('.fix a:last-child').click(function () {
            window.scrollTo(0, 0);
        })
        $('.fix a:first-child').click(function () {
            window,location.href = '../client/index.html?page=shop';
        })
        //跳转到前一个页面
        $('.lt_l a').click(function () {
            window.location.href = '../client/index.html?page=classify';
        })
    }
    list();
    return list;
})