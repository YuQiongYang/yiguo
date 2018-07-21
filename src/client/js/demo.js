(function(e) {
    if (void 0 == window.define) {
        var d = {},
            h = d.exports = {};
        e(null, h, d);
        window.popTipShow = window.notification = d.exports;
    } else define(e);
})(function(require, exports, module) {
    function e(a) {
        this._options = d.extend({
            mode: "msg",
            text: "\u7f51\u9875\u63d0\u793a",
            useTap: !1
        }, a || {});
        this._init()
    }
    var d = $,
        h = d(window),
        c = d('<div class="c-float-popWrap msgMode hide">'+
				   '<div class="weui_mask_transparent"></div>'+
				   '<div class="c-float-modePop">'+
					   '<div class="warnMsg"></div>'+
					   '<div class="content"></div>'+
					   '<div class="doBtn">'+
					   '<button class="cancel">\u53d6\u6d88</button>'+
					   '<button class="ok">\u786e\u5b9a</button>'+
					   '</div>'+
				   '</div>'+
			   '</div>'),
		//c = d('<div class="error-tips hide"><p class="warnMsg"></p></div>'),
		m = c.find(".warnMsg"),
        n = c.find(".content"),
        o = c.find(".doBtn .ok"),
        p = c.find(".doBtn .cancel"),
        j = !1,
        f;
    d.extend(e.prototype, {
        _init: function() {
            var a = this,
                b = a._options,
                g = b.mode,
                k = b.text,
                e = b.content,
                f = b.callback,
                l = b.background,
                t = b.btns,
                b = b.useTap ? "tap" : "click",
                i = c.attr("class"),
                i = i.replace(/(msg|alert|confirm)Mode/i, g + "Mode");
            c.attr("class", i);
            l && c.css("background", l);
            k && m.html(k);
            e && n.html(e);
            t && o.html(t[0]);
            t && p.html(t[1]);
			
			if("alert"==g){//解决一个按钮时的宽度
				o.css("width", "100%");
			}else{
				o.css("width", "");
			}
			
            o.off(b).on(b, function(b) {
                f.call(a, b, !0);
            });
            p.off(b).on(b, function(b) {
                f.call(a, b, !1)
            });
            j || (j = !0, d("body").append(c), h.on("resize",
                function() {
                    setTimeout(function() {
                        a._pos()
                    }, 500)
                }))
        },
        _pos: function() {
            var a = document,
                b = a.documentElement,
                g = a.body,
                e, d, f;
            this.isHide() || (a = g.scrollTop, g = g.scrollLeft, e = b.clientWidth, b = b.clientHeight, d = c.width(), f = c.height(), c.css({
                top: a + (b - f) / 2,
                left: g + (e - d) / 2
            }))
        },
        isShow: function() {
            return c.hasClass("show")
        },
        isHide: function() {
            return c.hasClass("hide")
        },
        _cbShow: function() {
            var a = this._options.onShow;
            c.css("opacity", "1").addClass("show");
            a && a.call(this)
        },
        show: function() {
            var a = this;
            f && (clearTimeout(f), f = void 0);
            a.isShow() ? a._cbShow() : (c.css("opacity", "0").removeClass("hide"), a._pos(), setTimeout(function() {
                a._cbShow()
            }, 300), setTimeout(function() {
                c.animate({
                    opacity: "1"
                }, 300, "linear")
            }, 1))
        },
        _cbHide: function() {
            var a = this._options.onHide;
            c.css("opacity", "0").addClass("hide");
            a && a.call(this)
        },
        hide: function() {
            var a = this;
            a.isHide() ? a._cbHide() : (c.css("opacity", "1").removeClass("show"), setTimeout(function() {
                a._cbHide()
            }, 300), setTimeout(function() {
                c.animate({
                    opacity: "0"
                }, 300, "linear")
            }, 1))
        },
        flash: function(a) {
            var b = this;
            opt = b._options;
            opt.onShow = function() {
                f = setTimeout(function() {
                    f && b.hide()
                }, a)
            };
            b.show()
        }
    });
    module.exports = new function() {
        this.simple = function(a, b, c) {
            2 == arguments.length && "number" == typeof arguments[1] && (c = arguments[1], b = void 0);
            var d = new e({
                mode: "msg",
                text: a,
                background: b
            });
            d.flash(c || 2E3);
            return d
        };
        this.msg = function(a, b) {
            var d = new e({
                mode: "msg",
                text: a
            });
			d.show();
            return d
        };
        this.alert = function(a, s, b, c) {
            var d = new e({
                mode: "alert",
                text: a,
				content: s,
				btns:b,
                callback: c
            });
			d.show();
            return d
        };
        this.confirm = function(a, b, c, f) {
            var d = new e({
                mode: "confirm",
                text: a,
                content: b,
                btns:c,
                callback: f
            });
            d.show();
            return d
        };
        this.pop = function(a) {
            return new e(a)
        }
    }
});

