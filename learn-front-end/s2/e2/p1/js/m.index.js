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
    var listElement;
    var ctrlElement;
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
        listElement = document.querySelector('.carousel_list');
        ctrlElement = document.querySelector('.carousel_points');
        // 初始位置为0
        var gotopElement = document.querySelector('.jd_go_top');
        gotopElement.style.display = 'none';
        // 状态查询
        var needShow = localStorage.getItem(skipOpenWithAppKey) !== '1';
        refresh_content_open_with_app(needShow);
        // 轮播图
        handle_carousel();
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

    // init carousel 轮播图
    function handle_carousel() {

        // 实际元素个数
        var list_count = listElement.children.length;

        // 初始化元素节点
        var clonedFirst = listElement.children[0].cloneNode(true);
        var clonedLast = listElement.children[list_count - 1].cloneNode(true);
        listElement.insertBefore(clonedLast, listElement.children[0]);
        listElement.appendChild(clonedFirst);

        // 初始化控制节点
        var points_count = ctrlElement.children.length;
        var first_point = ctrlElement.children[0];

        for (var i = 0; i < points_count; i++) {
            var item = ctrlElement.children[i];
            item.display = 'none';
            item.classList.remove('point_focus');
        }
        for (var i = 0; i < list_count; i++) {
            var item;
            if (i < points_count) {
                item = first_point.cloneNode(true);
                ctrlElement.appendChild(item);
            } else {
                item = ctrlElement.children[i];
            }            
            item.display = 'block';
        }
        
        // 位置刷新
        listElement.style.left = '-100%';
        first_point.classList.add('point_focus');

        // 自动播放
        listElement.anim_pos = 0;
        listElement.anim_cnt = list_count;
        listElement.anim_play = setInterval(play_carousel_anim, 6000);

        // 触摸暂停
        listElement.addEventListener('touchstart', play_drag_carousel);
    }

    // 更新轮播图控制点
    function update_carousel_points() {
        for (var i = 0; i < listElement.anim_cnt; i++) {
            ctrlElement.children[i].classList.remove('point_focus');
        }
        ctrlElement.children[listElement.anim_pos].classList.add('point_focus');
    }

    function restart_carousel_anim() {
        listElement.anim_play = setInterval(play_carousel_anim, 6000);
    }

    function stop_carousel_anim() {
        
        clearInterval(listElement.anim_play);
        clearInterval(listElement.trs_method);
    }

    // 轮播图自动播放
    function play_carousel_anim() {

        transition_curve(listElement, 500,
            // update
            function(y) {
                var pos = listElement.anim_pos + 1 + y;
                listElement.style.left = '-' + (pos * 100) + '%';
            },
            // end
            function() {
                listElement.anim_pos++;

                //  -1 [ 0 1 2 .... cnt-1 ] cnt
                if (listElement.anim_pos == listElement.anim_cnt) {
                    listElement.anim_pos = 0;
                }

                update_carousel_points();
            });
    }

    // 拖拽轮播图
    function play_drag_carousel(e) {

        stop_carousel_anim();

        listElement.addEventListener('touchend', function() {

            restart_carousel_anim();

        });
    }

    // duration : ms
    // on_update : function(value)
    // on_end : end of transition
    function transition_curve(obj, duration, on_update, on_end) {

        clearInterval(obj.trs_method);

        obj.trs_time = 0;
        obj.trs_method = setInterval(function() {

            obj.trs_time = Math.min(obj.trs_time + 16, duration);
            var y = obj.trs_time / duration;

            if (on_update) {
                on_update(y);
            }
                
            if (y === 1) {
                if (on_end) on_end();
                clearInterval(obj.trs_method);
            }

        }, 16);
    }

}());