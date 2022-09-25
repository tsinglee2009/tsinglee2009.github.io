;(function(){

    var commonArgs = {};
    commonArgs.inited = false;

    window.addEventListener('load', on_load)
    window.addEventListener('scroll', on_scroll)

    function on_load() {

        handle_fixed_areas();
        handle_top_ads();
        handle_float_action();
        handle_carousel();
        hanlde_seckill();
        handle_seckill_list();
        handle_nice_goods_list();

        commonArgs.inited = true;
    }

    function on_scroll() {

        if (!commonArgs.inited) return;

        if (getSeckillScrollTop() == 0) {
            if (commonArgs.is_off_top) {
                commonArgs.is_off_top = false;
                commonArgs.top_search_area.classList.remove('pin_top');
                commonArgs.elevartor_area.classList.remove('pin_top');
            }
        } else {
            if (!commonArgs.is_off_top) {
                commonArgs.is_off_top = true;
                commonArgs.top_search_area.classList.add('pin_top');
                commonArgs.elevartor_area.classList.add('pin_top');
            }
        }

    }

    function handle_fixed_areas() {
        commonArgs.is_off_top = false;
        commonArgs.top_search_area = document.querySelector('.top_area')
        commonArgs.seckill_area = document.querySelector('.jd_secskill')
        commonArgs.elevartor_area = document.querySelector('.elevator_list')

        var btn_backto_top = commonArgs.elevartor_area.querySelector('.elevator_top')
        btn_backto_top.addEventListener('click', (e) => window.scroll(0, 0))
    }

    function handle_top_ads() {

        var element = document.querySelector('.jd_top_ads')
        var btnClose = element.querySelector('.jd_btn_close_top_ads')
        btnClose.addEventListener('click', function(e) {
            element.style.display = 'none'
            e.preventDefault()
        })
    }

    function handle_float_action() {

        var element = document.querySelector('.float_act')
        var banner = element.querySelector('.board_content')
        banner.parentNode.style.display = 'none'
        banner.trs_width = 0;
        banner.trs_speed = 300;
        var btn = element.querySelector('.board_show')
        btn.style.cursor = 'pointer'
        btn.addEventListener('mouseenter', function() {
            // 1. 正常情况下，直接设置宽度，通过css的transition做过渡动画
            // banner.style.width = '100%'

            // 2. 实现线性伸展动画
            banner.parentNode.style.display = 'inline-block'
            banner.trs_distance = 100 - banner.trs_width;
            var src_seconds = banner.trs_distance / banner.trs_speed;
            transition_curve(banner, src_seconds * 1000,
                // on update
                function(t, dt) {
                    banner.trs_width += banner.trs_distance * dt;
                    banner.style.width = banner.trs_width + '%'
                },
                // on finish
                function() {
                    banner.trs_width = 100;
                    banner.style.width = '100%'
                });
        })
        btn.addEventListener('mouseleave', function() {
            // 1. 正常情况下，直接设置宽度，通过css的transition做过渡动画
            // banner.style.width = '0'

            // 2. 实现线性收缩动画
            banner.parentNode.style.display = 'inline-block'
            banner.trs_distance = banner.trs_width;
            var src_seconds = banner.trs_distance / banner.trs_speed;
            transition_curve(banner, src_seconds * 1000,
                // on update
                function(t, dt) {
                    banner.trs_width -= banner.trs_distance * dt;
                    banner.style.width = banner.trs_width + '%'
                },
                // on finish
                function() {
                    banner.trs_width = 0;
                    banner.style.width = '0%'
                    banner.parentNode.style.display = 'none'
                });
        })
    }

    function handle_carousel() {

        var element = document.querySelector('.jd_carousel')
        var listElement = element.querySelector('.carousel_content_list')
        var pointsElement = element.querySelector('.carousel_control_list')
        var btnLeft = element.querySelector('.btn_left')
        var btnRight = element.querySelector('.btn_right')

        commonArgs.pointsElement = pointsElement;
        commonArgs.carouselElement = listElement;

        // init list 

        for (var i = 1; i < listElement.children.length; i++) {
            listElement.children[i].style.opacity = 0
        }
        listElement.children[0].style.opacity = 1
        listElement.cur_pos = 0;

        // init points

        for (var i = 0; i < pointsElement.children.length; i++) {
            if (i >= listElement.children.length)
                pointsElement.children[i].style.display = 'none'
            pointsElement.children[i].classList.remove('focus')
        }
        for (var i = 0; i < listElement.children.length; i++) {
            if (i >= pointsElement.children.length) {
                var cloned = pointsElement.children[0].cloneNode(true)
                pointsElement.appendChild(cloned)
            }

            var point_item = pointsElement.children[i];
            point_item.idx = i;

            point_item.addEventListener('mouseenter', (e) => {
                update_carousel_focus_index(e.target.idx)
            })
        }
        pointsElement.last_focus_idx = 0
        pointsElement.children[0].classList.add('focus')

        // init events

        element.addEventListener('mouseenter', (e) => {
            clearInterval(element.anim_play)
        })

        element.addEventListener('mouseleave', (e) => {
            start_carousel_anim_play(element);
        })

        btnLeft.addEventListener('click', (e) => {
            var new_idx = (pointsElement.last_focus_idx - 1 + listElement.children.length) % listElement.children.length;
            update_carousel_focus_index(new_idx)
            e.preventDefault()
        })

        btnRight.addEventListener('click', (e) => {
            var new_idx = (pointsElement.last_focus_idx + 1) % listElement.children.length;
            update_carousel_focus_index(new_idx)
            e.preventDefault()
        })

        start_carousel_anim_play(element);
    }

    function start_carousel_anim_play(element) {

        element.anim_play = setInterval(() => {
            var new_idx = (commonArgs.pointsElement.last_focus_idx + 1) % commonArgs.carouselElement.children.length;
            update_carousel_focus_index(new_idx)
        }, 3000);
    }

    function update_carousel_focus_index(idx) {

        lastIdx = commonArgs.pointsElement.last_focus_idx
        commonArgs.pointsElement.children[lastIdx].classList.remove('focus')
        // commonArgs.carouselElement.children[lastIdx].style.opacity = 0

        commonArgs.pointsElement.last_focus_idx = idx
        commonArgs.pointsElement.children[idx].classList.add('focus')
        // commonArgs.carouselElement.children[idx].style.opacity = 1

        // transition
        var obj_old = commonArgs.carouselElement.children[lastIdx]
        transition_curve(obj_old, 200,
            (t) =>  obj_old.style.opacity = 1 - t,
            () => obj_old.style.opacity = 0 )

        var obj_new = commonArgs.carouselElement.children[idx]
        transition_curve(obj_new, 200,
            (t) =>  obj_new.style.opacity = t,
            () => obj_new.style.opacity = 1 )
    }

    function hanlde_seckill() {

        seckillElement = document.querySelector('.count_down');
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

    function handle_seckill_list() {
        var parentElement = document.querySelector('.jd_secskill_list_view')
        var listElement = parentElement.querySelector('.jd_secskill_list_content')
        var btnLeft = parentElement.querySelector('.btn_left')
        var btnRight = parentElement.querySelector('.btn_right')

        // update list
        var items_per_page = 4;

        var space_item_cnt = (4 - listElement.children.length % items_per_page) % 4;
        for (var i = 0; i < space_item_cnt; i++) {
            var space_item = listElement.children[0].cloneNode(false);
            listElement.appendChild(space_item);
        }
        for (var i = 0; i < items_per_page; i++) {
            var cloned = listElement.children[i].cloneNode(true);
            listElement.appendChild(cloned)
        }

        // init page data
        listElement.total_pages = Math.ceil(listElement.children.length / items_per_page);
        listElement.cur_page = 0
        listElement.style.width = listElement.total_pages * items_per_page * 200 + 'px';

        // regist btn event
        btnLeft.addEventListener('click', () => {

            if (listElement.cur_page == 0) {
                listElement.cur_page = listElement.total_pages - 1;
            }

            transition_curve(listElement, 300,
                (t) => {
                    listElement.style.left = (listElement.cur_page - t) * -100 + '%';
                },
                () => {
                    listElement.cur_page--;
                    listElement.style.left = listElement.cur_page * -100 + '%';
                });

        })

        btnRight.addEventListener('click', () => {

            if (listElement.cur_page == listElement.total_pages - 1) {
                listElement.cur_page = 0;
            }

            transition_curve(listElement, 300,
                (t) => {
                    listElement.style.left = (listElement.cur_page + t) * -100 + '%';
                },
                () => {
                    listElement.cur_page++;
                    listElement.style.left = listElement.cur_page * -100 + '%';
                });

        })
    }

    function handle_nice_goods_list() {

        var parentElement = document.querySelector('.nice_list')
        var listElement = parentElement.querySelector('.nice_list_content')
        var ctrlElement = parentElement.querySelector('.nice_ctrl')
        var sliderBar = ctrlElement.querySelector('.nice_slider_bar')

        var width_per_item = 198;
        var items_per_page = 5;
        for (var i = 0; i < items_per_page; i++) {
            var cloned = listElement.children[i].cloneNode(true);
            listElement.appendChild(cloned)
        }

        listElement.total_width = width_per_item * listElement.children.length;
        listElement.style.width = listElement.total_width + 'px';

        // auto moving
        listElement.auto_moving_enabled = true;
        listElement.moving_pos = 0;
        listElement.moving_pos_max = listElement.total_width - items_per_page * width_per_item;
        listElement.style.left = 0;
        setInterval(() => {
            
            if (listElement.auto_moving_enabled) {

                listElement.moving_pos = (listElement.moving_pos + 1) % listElement.moving_pos_max;
                listElement.style.left = -listElement.moving_pos + 'px';
            }
            
        }, 16);

        // hover and show slider
        ctrlElement.style.display = 'none'
        parentElement.addEventListener('mouseenter', () => {
            listElement.auto_moving_enabled = false;
            ctrlElement.style.display = 'block';

            sliderBar.slide_value = listElement.moving_pos / listElement.moving_pos_max
            sliderBar.style.left = sliderBar.slide_value * sliderBar.slide_distance_max + 'px';
        })
        parentElement.addEventListener('mouseleave', () => {
            listElement.auto_moving_enabled = true;
            ctrlElement.style.display = 'none'
        })

        // slider draged
        var bar_size = items_per_page / listElement.children.length;
        register_ctrl_slider(ctrlElement, sliderBar, bar_size,
                            (t) => {
                                listElement.moving_pos = listElement.moving_pos_max * t;
                                listElement.style.left = -listElement.moving_pos + 'px';
                            });

    }

    function register_ctrl_slider(slider, slider_bar, bar_size, on_slide) {

        var slider_width = parseFloat(getCss(slider, 'width'));
        var padding_left = parseFloat(getCss(slider, 'padding-left'));
        var padding_right = parseFloat(getCss(slider, 'padding-right'));
        slider_width = slider_width - padding_left - padding_right;
        
        slider_bar.style.width = slider_width * bar_size + 'px';
        slider_bar.slide_distance_max = slider_width * (1 - bar_size);

        slider_bar.slide_value = 0;
        slider_bar.style.left = 0;

        slider_bar.addEventListener('mousedown', (e) => {
            slider_bar.slide_enabled = true;
            slider_bar.slide_last_x = e.clientX;
            
            slider_bar.addEventListener('mousemove', (e) => {

                if (slider_bar.slide_enabled) {
                    
                    var offset = e.clientX - slider_bar.slide_last_x;

                    if (offset != 0) {

                        slider_bar.slide_value = Math.max(0, Math.min(slider_bar.slide_value + offset / slider_bar.slide_distance_max, 1));
                        slider_bar.slide_last_x = e.clientX;

                        // 更新slider显示
                        slider_bar.style.left = slider_bar.slide_value * slider_bar.slide_distance_max + 'px';
                        // 更新内容显示
                        if (on_slide) on_slide(slider_bar.slide_value);
                    }
                }

                e.preventDefault()
                e.stopPropagation()
            })

            slider_bar.addEventListener('mouseup', () => {
                slider_bar.slide_enabled = false;
            })
            
        })
        
    }

    // 获取元素css属性，从网上摘下来的
    function getCss(curEle, attr) {

        var val = null,reg = null;  
        if("getComputedStyle" in window){  
            val = window.getComputedStyle(curEle,null)[attr];  
        } else {   //ie6~8不支持上面属性  
            //不兼容  
            if(attr === "opacity"){  
                val = curEle.currentStyle["filter"];   //'alpha(opacity=12,345)'  
                reg = /^alphaopacity=(\d+(?:\.\d+)?)opacity=(\d+(?:\.\d+)?)$/i;  
                val = reg.test(val)?reg.exec(val)[1]/100:1;  
            } else {  
                val = curEle.currentStyle[attr];  
            }  
        }  
        reg = /^(-?\d+(\.\d)?)(px|pt|em|rem)?$/i;  
        return reg.test(val)?parseFloat(val):val;   
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
            var dt = 16 / duration;

            if (on_update) {
                // curve is linear, so on_update(t)
                on_update(t, dt);
            }
            
            if (t === 1) {
                clearInterval(obj.trs_method);
                if (on_end) on_end();
            }

        }, 16);
    }

    function getSeckillScrollTop() {
        var fixed_top_offset = 90;
        var val = Math.max(0, scrollTop() + fixed_top_offset - commonArgs.seckill_area.offsetTop);       
        return val;
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

}());