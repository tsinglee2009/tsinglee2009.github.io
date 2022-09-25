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
    var seckillElement;
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
        // 快捷列表
        handle_types_list();
        // 京东秒杀
        hanlde_seckill();
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
        return document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop || 0;
    }

    function clientHeight() {
        return document.documentElement.clientHeight;
    }

    function clientWidth() {
        return document.documentElement.clientWidth;
    }

    // 初始化快捷列表
    function handle_types_list() {

        var parentElement = document.querySelector('.jd_types_area');

        var list_pages = parentElement.querySelector('.pages');
        list_pages.list_pos = 0;
        list_pages.list_cnt = list_pages.children.length;

        var list_ctrl = parentElement.querySelector('.points');
        for (var i = 0; i < list_ctrl.children.length; i++) {
            list_ctrl.children[i].style.display = 'none'
        }
        for (var i = 0; i < list_pages.list_cnt; i++) {
            if (i < list_ctrl.children.length) {
                list_ctrl.children[i].style.display = 'inline-block'
            } else {
                var cloned = list_ctrl.children[0].cloneNode(true);
                list_ctrl.appendChild(cloned);
            }
        }

        list_pages.refresh_ctrl = function(pos) {
            var list_ctrl = parentElement.querySelector('.points');
            for (var i = 0; i < list_pages.list_cnt; i++) {
                var item = list_ctrl.children[i];
                item.classList.remove('cur');
                if (i == pos) item.classList.add('cur');
            }
        }
        list_pages.refresh_ctrl(list_pages.list_pos);
        
        attach_drag_handler(list_pages, clientWidth() * .1,
            // on start drag
            // function() {
                
            // },
            null,
            // on end drag
            function(dir) {

                if (dir == 0) {
                    
                } else if (dir > 0) {

                    if (list_pages.list_pos > 0) {

                        list_pages.list_pos--;
                        list_pages.style.left = list_pages.list_pos * -100 + '%';
                        list_pages.refresh_ctrl(list_pages.list_pos);
                    }

                } else {

                    if (list_pages.list_pos < list_pages.list_cnt - 1) {

                        list_pages.list_pos++;
                        list_pages.style.left = list_pages.list_pos * -100 + '%';
                        list_pages.refresh_ctrl(list_pages.list_pos);
                    }
                }
            });
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
        for (var i = 0; i < ctrlElement.children.length; i++) {
            var item = ctrlElement.children[i];
            item.style.display = 'none';
            item.classList.remove('point_focus');
        }
        for (var i = 0; i < list_count; i++) {

            if (i < ctrlElement.children.length) {
                var item = ctrlElement.children[i];
                item.style.display = 'inline-block';
            } else {
                var item = ctrlElement.children[0].cloneNode(true);
                ctrlElement.appendChild(item);
            }            
        }
        
        // 位置刷新
        listElement.style.left = '-100%';
        ctrlElement.children[0].classList.add('point_focus');

        // 自动播放
        listElement.anim_pos = 0;
        listElement.anim_cnt = list_count;
        restart_carousel_anim();

        // 拖拽事件
        attach_drag_handler(listElement, clientWidth() * 0.1,
            // on drag start
            function() {
                stop_carousel_anim();
            },
            // on drag end
            function(dir) {
                if (dir == 0) {
                    update_carousel_points(listElement.anim_pos);
                    restart_carousel_anim();
                } else if (dir > 0) {
                    play_carousel_anim_backward(restart_carousel_anim);
                } else {
                    play_carousel_anim(restart_carousel_anim);
                }
            });
    }

    // 更新轮播图控制点
    function update_carousel_points(focus_pos) {
        for (var i = 0; i < listElement.anim_cnt; i++) {
            ctrlElement.children[i].classList.remove('point_focus');
        }
        ctrlElement.children[focus_pos].classList.add('point_focus');
    }

    function restart_carousel_anim() {
        stop_carousel_anim();
        listElement.anim_play = setInterval(play_carousel_anim, 3000);
    }

    function stop_carousel_anim() {
        clearInterval(listElement.trs_method);
        clearInterval(listElement.anim_play);
    }

    // 轮播图自动播放
    function play_carousel_anim(callback) {

        update_carousel_points((listElement.anim_pos + 1) % listElement.anim_cnt);

        transition_curve(listElement, 200,
            // update
            function(y) {
                var pos = listElement.anim_pos + 1 + y;
                listElement.style.left = (pos * -100) + '%';
            },
            // end
            function() {
                listElement.anim_pos++;
                //  -1 [ 0 1 2 .... cnt-1 ] cnt
                if (listElement.anim_pos == listElement.anim_cnt) {
                    listElement.anim_pos = 0;
                }

                if (callback) callback();
            });
    }

    function play_carousel_anim_backward(callback) {

        update_carousel_points((listElement.anim_pos - 1 + listElement.anim_cnt) % listElement.anim_cnt);

        transition_curve(listElement, 200,
            // update
            function(y) {
                var pos = listElement.anim_pos + 1 - y;
                listElement.style.left = (pos * -100) + '%';
            },
            // end
            function() {
                //  -1 [ 0 1 2 .... cnt-1 ] cnt
                listElement.anim_pos = (listElement.anim_pos - 1 + listElement.anim_cnt) % listElement.anim_cnt;

                if (callback) callback();
            });
    }

    function hanlde_seckill() {

        seckillElement = document.querySelector('.seckill_content');
        seckillElement.cd_start = seckillElement.querySelector('.cd_start')
        seckillElement.cd_hour = seckillElement.querySelector('.cd_hour')
        seckillElement.cd_min = seckillElement.querySelector('.cd_minute')
        seckillElement.cd_sec = seckillElement.querySelector('.cd_second')
        seckillElement.cd_zones = [ 20, 16, 14, 12, 0 ] // 秒杀时间段：12:00 16:00 20:00 00:00
        seckillElement.fresh_method = function() {

            var date = new Date();
            var hour = date.getHours();

            for (var i = 0; i < seckillElement.cd_zones.length; i++) {
                var zone = seckillElement.cd_zones[i];
                if (hour >= zone) {
                    
                    var total_hours = i == 0 ? (24 - zone) : (seckillElement.cd_zones[i - 1] - zone);

                    var total_secs = total_hours * 60 * 60;
                    var elapsed_secs = (hour - zone) * 60 * 60 + date.getMinutes() * 60 + date.getSeconds();
                    var cd_secs = total_secs - elapsed_secs;

                    var cd_hour = Math.floor(cd_secs / 3600);
                    var cd_min = Math.floor(cd_secs / 60) % 60;
                    var cd_sec = cd_secs % 60;

                    seckillElement.cd_start.innerHTML = zone > 9 ? zone : ('0' + zone);
                    seckillElement.cd_hour.innerHTML = cd_hour > 9 ? cd_hour : ('0' + cd_hour);
                    seckillElement.cd_min.innerHTML = cd_min > 9 ? cd_min : ('0' + cd_min);
                    seckillElement.cd_sec.innerHTML = cd_sec > 9 ? cd_sec : ('0' + cd_sec);

                    break;
                }
            }
        }
        seckillElement.fresh_method();
        setInterval(seckillElement.fresh_method, 1000);
    }

    // drag_method 拖拽事件封装
    // threshold : 拖拽最小识别距离
    // on_drag_start : 开始拖拽事件回调
    // on_drag_end : 结束拖拽事件回调
    function attach_drag_handler(obj, threshold, on_drag_start, on_drag_end) {

        obj.drag_threshold = Math.max(5, Math.abs(threshold));

        obj.addEventListener('touchstart', function(e) {

            console.log('-- touchstart ' + e.changedTouches[0].clientX);
            // e.stopPropagation();
            // e.preventDefault();
            
            this.drag_enabled = true;
            this.drag_posx = e.changedTouches[0].clientX;

            if (on_drag_start) on_drag_start();

            this.addEventListener('touchend', function(e) {

                console.log('\ttouchend ' + e.changedTouches[0].clientX);
                // e.stopPropagation();
                // e.preventDefault();

                if (this.drag_enabled) {

                    var offset = e.changedTouches[0].clientX - this.drag_posx;
                    this.drag_posx = e.changedTouches[0].clientX;
        
                    if (offset < - this.drag_threshold) {
                        console.log('左滑动')
                        if (on_drag_end) on_drag_end(-1);                        
                    } else if (offset > this.drag_threshold) {
                        console.log('右滑动')
                        if (on_drag_end) on_drag_end(1);
                    } else {
                        if (on_drag_end) on_drag_end(0);
                    }
                }
                
                this.drag_enabled = false;

            }, false);

        })
    }

    // trs_method 缓动封装
    // duration : ms
    // on_update : function(value)
    // on_end : end of transition
    function transition_curve(obj, duration, on_update, on_end) {

        clearInterval(obj.trs_method);

        obj.trs_time = 0;
        obj.trs_method = setInterval(function() {

            obj.trs_time = Math.min(obj.trs_time + 16, duration);
            var t = obj.trs_time / duration;

            if (on_update) {
                // curve is linear, so on_update(t)
                on_update(t);
            }
            
            if (t === 1) {
                clearInterval(obj.trs_method);
                if (on_end) on_end();
            }

        }, 16);
    }

}());