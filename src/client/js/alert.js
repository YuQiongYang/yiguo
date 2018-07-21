define(function() {
    /** mobile web toast提示框
     * 使用方式：
     *      webToast("屌丝逆袭了","bottom",1000);
     *      webToast("出任SEO","bottom");
     *      webToast("赢取白富美",1000);
     *      webToast("走向人生巅峰");
     */
    function webToast(){
        //默认设置
        var dcfg={
            msg:"提示信息",
            postion:"top",//展示位置，可能值：bottom,top,middle,默认top：是因为在mobile web环境下，输入法在底部会遮挡toast提示框
            time:500,//展示时间
        };
        //*********************以下为参数处理******************
        var len = arguments.length;
        var arg0 =arguments[0];
        if(arguments.length>0){
        dcfg.msg =arguments[0];
        dcfg.msg=arg0;
        
        var arg1 =arguments[1];
        var regx = /(bottom|top|middle)/i;
        var numRegx = /[1-9]\d*/;
        if(regx.test(arg1)){
            dcfg.postion=arg1;
        }else if(numRegx.test(arg1)){
            dcfg.time=arg1;
        }
        
        var arg2 =arguments[2];
        var numRegx = /[1-9]\d*/;
        if(numRegx.test(arg2)){
            dcfg.time=arg2;
        }
        }
    //*********************以上为参数处理******************
    var ret = "<div class='web_toast'><div class='cx_mask_transparent'></div>" + dcfg.msg + "</div>";
        if ($(".web_toast").length <= 0) {
        $("body").append(ret);
        } else {//如果页面有web_toast 先清除之前的样式
            $(".web_toast").css("left","");
        
            ret = "<div class='cx_mask_transparent'></div>" + dcfg.msg;
        $(".web_toast").html(ret);
        }
        var w = $(".web_toast").width(),ww = $(window).width();
        $(".web_toast").fadeIn();
        $(".web_toast").css("left",(ww-w)/2-20);
        if("bottom"==dcfg.postion){
        $(".web_toast").css("bottom",100);
        $(".web_toast").css("top","");//这里为什么要置空，自己琢磨，我就不告诉
        }else if("top"==dcfg.postion){
        $(".web_toast").css("bottom","");
        $(".web_toast").css("top",300);
        }else if("middle"==dcfg.postion){
        $(".web_toast").css("bottom","");
        $(".web_toast").css("top","");
        var h = $(".web_toast").height(),hh = $(window).height();
        $(".web_toast").css("bottom",(hh-h)/2-20);
        }
        setTimeout(function() {	
        $(".web_toast").fadeOut();	
        }, dcfg.time);
    }
    return  webToast;
});