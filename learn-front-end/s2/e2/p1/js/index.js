;(function(){

    var commonArgs = {};
    commonArgs.inited = false;

    window.addEventListener('load', on_load)
    window.addEventListener('scroll', on_scroll)

    function on_load() {

        handle_top_ads();
        handle_float_action();
        handle_carousel();

        commonArgs.inited = true;
    }

    function on_scroll() {

        if (!commonArgs.inited) return;

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

}());