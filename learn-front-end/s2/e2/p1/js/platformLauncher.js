;(function (){

    var eleMask;
    var cachedBodyStyle;
    var curIsMobileHtml = isMobileHtml();

    // 当前html页面是否是移动端的
    function isMobileHtml() {
        return location.href.match('m.index.html') != null;
    }

    //定义一个函数判断是手机端还是pc端
    function isMobile() {
        if (window.navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) {
            return true; // 移动端
        } else {
            return false; // PC端
        }
    }

    if (isMobile() != curIsMobileHtml) {
        // 显示对应平台页面
        location.replace(curIsMobileHtml ? './index.html' : './m.index.html')
    } else {
        // 启动时全屏遮罩提示
        var storageKey = curIsMobileHtml ? '-mobile-mask-tips-had-show-' : '-pc-mask-tips-had-show-';

        if (sessionStorage.getItem(storageKey) !== 'true') {
            sessionStorage.setItem(storageKey, 'true');
            
            window.addEventListener('load', attachLaucherWelcomeElement);
        }
    }

    // 附加遮罩提示
    function attachLaucherWelcomeElement() {
        
        // create element
        eleMask = document.createElement('div')
        eleMask.className = 'launcher-mask-tips'
        eleMask.style.position = 'fixed';
        eleMask.style.top = '0';
        eleMask.style.left = '0';
        eleMask.style.zIndex = '999';
        eleMask.style.width = '100vw';
        eleMask.style.height = '100vh';
        eleMask.style.backgroundColor = 'rgba(0,0,0,.5)';
        eleMask.style.display = 'flex';
        eleMask.style.justifyContent = 'space-around';
        eleMask.style.alignItems = 'center';
        eleMask.style.textAlign = 'center';

        var eleSpan = document.createElement('span')
        eleSpan.style.color = '#fff';
        eleSpan.style.fontSize = '5vw';
        eleSpan.style.textShadow = '4px 4px 4px #C00';
        eleSpan.innerHTML = curIsMobileHtml ?
                            '自适应平台功能<br>已自动为您切换成了<b>移动端页面</b>' :
                            '自适应平台功能<br>已自动为您切换成了<b>电脑端页面</b>' ;

        eleMask.appendChild(eleSpan)
        document.body.appendChild(eleMask)

        // 滚动禁止
        cachedBodyStyle = document.body.style;
        document.body.style.position = 'fixed';
        document.body.style.overflow = 'hidden';
        document.body.style.width = '100%'

        // add event
        eleMask.addEventListener('mouseup', deattachLaucherWelcomElement);
    }

    // 移除遮罩提示
    function deattachLaucherWelcomElement() {

        document.body.removeChild(eleMask)

        // 滚动还原
        document.body.style = cachedBodyStyle;
    }

    console.log('-- platform laucher done ! --')

}());