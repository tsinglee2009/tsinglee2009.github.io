//定义一个函数判断是手机端还是pc端
function isMobile() {
    if (window.navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) {
        return true; // 移动端
    } else {
        return false; // PC端
    }
}

//    判断后的操作
var curIsMobile = location.href.match('m.index.html') != null;
console.log('-------------------- curIsMobile : ' + curIsMobile)

if (isMobile() != curIsMobile) {
    // location.href = curIsMobile ? './index.html' : './m.index.html';

    console.log('start replace, cur : ' + curIsMobile + ' href=' + location.href + ', change to ' + (curIsMobile ? './index.html' : './m.index.html'));

    location.replace(curIsMobile ? './index.html' : './m.index.html')

    console.log('complete replace, href=' + location.href)
}
