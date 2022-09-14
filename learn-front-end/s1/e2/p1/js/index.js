// 滚动条在最上方
var isOnTop = true;

// 默认初始位置为0，初始化时验证一下
function initScrollStatus() {

    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    onTopStatusChanged(scrollTop == 0);
}

// 内容滑动到底部或顶部的检测
function checkScrolledToBottomOrTop() {

    // 滚动条滚动时距离顶部的距离
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

    // // 可视区的高度
    // var clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
    // // 滚动条的总高度
    // var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
    // // 滚动条到底部
    // if (scrollTop + clientHeight >= scrollHeight) {
    //     console.log("滚动到底部了");
    // }

    onTopStatusChanged(scrollTop == 0);
}

// 内容区域到达顶部的事件
function onTopStatusChanged(newStatus) {

    if (newStatus == isOnTop) return;
    isOnTop = newStatus;

    // console.log(isOnTop ? "Reach top ..." : "Exit top ...");

    if (isOnTop) {
        document.getElementById('main_navbar').classList.remove('scrollOffTop');
        document.getElementById('main_navbar').classList.add('scrollOnTop');
    } else {
        document.getElementById('main_navbar').classList.remove('scrollOnTop');
        document.getElementById('main_navbar').classList.add('scrollOffTop');
    }
}

// 简易滚动轮播图
function onInterval() {

    // console.log("开始变换");
    onTopStatusChanged(!isOnTop);

    setTimeout(function() {
        // console.log("更新active目标")
    }, 2000);
}

window.onload = initScrollStatus;
window.onscroll = checkScrolledToBottomOrTop;
// window.setInterval(onInterval, 5000);