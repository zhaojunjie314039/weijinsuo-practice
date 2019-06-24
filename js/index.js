$(function () {
    /*动态轮播图*/
    banner();
    /*移动端页签*/
    initMobileTab();
    /*初始工具提示*/
    $('[data-toggle="tooltip"]').tooltip();
});
/*动态轮播图*/
var banner = function () {
    var getData = function (callback) {
        /*判断是否缓存了数据*/
        if(window.data){
            callback && callback(window.data);
        }else {
            /*利用ajax获取轮播图数据*/
            $.ajax({
                type:'get',
                url:'js/data.json',
                dataType:'json',
                data:'',
                success:function (data) {
                    /*添加变量data，实现数据缓存*/
                    window.data = data;
                    callback && callback(window.data);
                }
            });
        }
    }
    var render = function () {
        getData(function (data) {
            /*判断当前硬件环境是PC还是移动 */
            var isMobile = $(window).width() < 768 ? true : false;
            //console.log(isMobile);
            /*开始使用*/
            /*<% console.log(list); %> 模版引擎内不可使用外部变量 log不识别 */
            var pointHtml = template('pointTemplate',{list:data});
            //console.log(pointHtml);
            var imageHtml = template('imageTemplate',{list:data,isMobile:isMobile});
            //console.log(imageHtml);
            /*2.3 把字符渲染页面当中*/
            $('.carousel-indicators').html(pointHtml);
            $('.carousel-inner').html(imageHtml);
        });
    }
    /*3.测试功能 页面尺寸发生改变事件resize*/
    $(window).on('resize',function () {
        render();
        /*通过js主动触发某个事件*/
    }).trigger('resize');
    /*4.移动端手势切换*/
    var startX = 0;
    var distanceX = 0;
    var isMove = false;
    /*originalEvent 代表js原生事件*/
    $('.wjs_banner').on('touchstart',function (e) {
        startX = e.originalEvent.touches[0].clientX;
    }).on('touchmove',function (e) {
        var moveX = e.originalEvent.touches[0].clientX;
        distanceX = moveX - startX;
        isMove = true;
    }).on('touchend',function (e) {
        /*距离足够 50px 一定要滑动过*/
        if(isMove && Math.abs(distanceX) > 50){
            /*手势*/
            /*左滑手势*/
            if(distanceX < 0){
                //console.log('next');
                $('.carousel').carousel('next');
            }
            /*右滑手势*/
            else {
                //console.log('prev');
                $('.carousel').carousel('prev');
            }
        }
        startX = 0;
        distanceX = 0;
        isMove = false;
    });
}

var initMobileTab = function () {
    /*1.解决换行问题*/
    var $navTabs = $('.wjs_product .nav-tabs');
    var width = 0;
    $navTabs.find('li').each(function (i, item) {
        var $currLi = $(this);//$(item);
        /*
        * width()  内容
        * innerWidth() 内容+内边距
        * outerWidth() 内容+内边距+边框
        * outerWidth(true) 内容+内边距+边框+外边距
        * */
        var liWidth = $currLi.outerWidth(true);
        width += liWidth;
    });
    console.log(width);
    $navTabs.width(width);

    /*2.修改结构使之区域滑动的结构*/
    //加一个父容器给 .nav-tabs 叫  .nav-tabs-parent

    /*3.自己实现滑动效果 或者 使用iscroll */
    new IScroll($('.nav-tabs-parent')[0],{
        scrollX:true,
        scrollY:false,
        click:true
    });
}
