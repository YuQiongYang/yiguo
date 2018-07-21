require.config({
    paths: {
        'jquery': './jquery'
    }
})

define(['jquery'], function($){
    var baseUrl = "http://10.3.138.243:1000/";
    function filterUrl(_url){
        if(_url.startsWith('http')){
            return _url;
        }  
        return baseUrl + _url;
    }

    return {
        get: function(_url, _data){
            return new Promise(function(resolve, reject){
                $.ajax({
                    url: filterUrl(_url),
                    data: _data || {},
                    async:false,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'auth': window.localStorage.getItem('token')
                    },
                    success: function(res){                      
                        resolve(res);
                    }
                })
            })
        },
        post: function(_url, _data){
            return new Promise(function(resolve, reject){
                $.ajax({
                    url: filterUrl(_url),
                    data: _data || {},
                    type: 'post',
                    async:false,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'auth': window.localStorage.getItem('token')
                    },
                    success: function(res){                      
                        resolve(res);
                    }
                })
            })
        },
    }
})