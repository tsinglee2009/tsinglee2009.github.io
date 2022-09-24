;(function(){

    // start here
    window.addEventListener('load', init_document)
    window.addEventListener('scroll', on_content_scrolled)

    // localStorage keys
    var skipOpenWithAppKey = '-skip-open-with-app-';
    // sessionStorage keys
    var storageKey = '-storage-key-'
    // special class name
    var topFlagClass = 'top_actived'
    var offTopClass = 'scroll_off_top';
    // 
    var inited = false;
    // elements
    var searchElement;
    var backtopElement;
    // 
    var onSrolledState;
    var scrolledOffTop;
    var isShowBacktoTop;

    // 需要初始化的内容
    function init_document() {
        // 
        searchElement = document.querySelector('.jd_search_area'); // 搜索栏
        backtopElement = document.querySelector('.jd_go_top'); // 返回顶部
        backtopElement.addEventListener('click', onclick_back_to_top);
        // 初始位置为0
        var gotopElement = document.querySelector('.jd_go_top');
        gotopElement.style.display = 'none';
        // 状态查询
        var needShow = localStorage.getItem(skipOpenWithAppKey) !== '1';
        refresh_content_open_with_app(needShow);
        // init done
        inited = true;

        // 搜索栏刷新
        on_content_scrolled();
    }
    
    // 提示打开京东App
    function refresh_content_open_with_app(needShow) {   
        // 查找元素
        var topElement = document.querySelector('.jd_top_bar'); // 顶部提示框
        var downElement = document.querySelector('.jd_open_app'); // 底部提示框
        var topHolderEle = document.querySelector('.jd_top_bar_holder'); // 顶部占位符
        // 设置元素
        if (needShow) {
            topElement.style.display = 'flex';
            downElement.style.display = 'block';
            searchElement.classList.remove(topFlagClass)
            searchElement.classList.add(topFlagClass)
            topHolderEle.classList.remove(topFlagClass)
            topHolderEle.classList.add(topFlagClass)

            // 设置关闭事件
            topElement.querySelector('.js_btn_close').onclick = on_close_open_with_app;
            topElement.querySelector('.js_btn_open').onclick = on_close_open_with_app;
            downElement.onclick = on_close_open_with_app;

        } else {
            topElement.style.display = 'none';
            downElement.style.display = 'none';
            searchElement.classList.remove(topFlagClass)
            topHolderEle.classList.remove(topFlagClass)
        }
    }
    
    // 关闭了打开京东app的弹框
    function on_close_open_with_app() {
        localStorage.setItem(skipOpenWithAppKey, '1');
        refresh_content_open_with_app(false);
    }

    function on_content_scrolled() {

        if (!inited)
        {
            return;
        }

        // 更新搜索栏
        onSrolledState = scrollTop() > 0;
        if (scrolledOffTop !== onSrolledState) {

            searchElement.classList.remove(offTopClass)
            if (onSrolledState) searchElement.classList.add(offTopClass)

            scrolledOffTop = onSrolledState;
        }
        
        // 更新返回顶部按钮
        if (scrollTop() > clientHeight()) {
            if (!isShowBacktoTop) {
                backtopElement.style.display = 'block';
                isShowBacktoTop = true;
            }
        } else {
            if (isShowBacktoTop) {
                backtopElement.style.display = 'none';
                isShowBacktoTop = false;
            }
        }
    }

    // 返回顶部
    function onclick_back_to_top() {

        clearInterval(backtopElement.timer);

        backtopElement.timer_value = scrollTop();
        backtopElement.timer_speed = backtopElement.timer_value / 200; // 0.2秒回到顶部

        backtopElement.timer = setInterval(function () {

            backtopElement.timer_value = Math.max(0, backtopElement.timer_value - backtopElement.timer_speed * 16);
            window.scroll(0, backtopElement.timer_value);

            if (backtopElement.timer_value == 0) {
                clearInterval(backtopElement.timer);
            }
        }, 16);
    }

    function scrollTop() {
        return document.documentElement.scrollTop;
    }

    function clientHeight() {
        return document.documentElement.clientHeight;
    }

}());