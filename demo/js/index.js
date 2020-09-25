const riseObserver = window.riseObserver;
const callRiseIframe = window.callRiseIframe;

const totalPage = 2; // 课件总页数

// 当前拖动状态信息
const dragInfo = {
  // 当前是否处于拖动中
  isDragging: false,
  // 当前拖动的 dom selector
  currentDragSelector: ''
}

// 方法封装
const utils = {
  // px 转成 百分比。多个屏幕间显示尺寸大小不一致时，可保持效果一致
  pxToPercentage(px, isW = true) {
    /// demo 中的比例是整个窗口尺寸，实际开发中请根据实际情况实现方法
    const denominator = isW ? window.innerWidth : window.innerHeight;
    const percentage = Math.round(px / denominator * 10000) / 100;
    return `${percentage}%`;
  },
  // 设置第几个提示信息显示
  setTipShow(index) {
    const children = document.querySelector('.title').children;
    for (let i = 0; i < children.length; i++) {
      const dom = children[i];
      if (i === index) {
        dom.classList.add('show');
      } else {
        dom.classList.remove('show');
      }
    }
  }
}

// 本地dom事件绑定
function eventInit() {
  // 乌龟点击
  const onTortoiseClick = function (event, target) {
    const dom = document.querySelector(target);
    const activeClassName = 'active';
    // 已点击过的乌龟不再响应
    if (dom && !dom.classList.contains(activeClassName)) {
      // 通信的数据载体格式
      const data = {
        target: target,
        behavior: 'rollCall',
        scene: 'page-1',
        content: {}
      }
      // 调用 callRiseIframe 方法即可将上述数据格式同步到其他用户
      callRiseIframe(data);
      // 本地进行渲染
      actionFn.rollCall(data);
    }
  };
  // 三个乌龟
  ['.tortoise-box-1', '.tortoise-box-2', '.tortoise-box-3'].forEach(key => {
    document.querySelector(key).addEventListener('click', event => onTortoiseClick(event, key));
  });
  // 下一页
  document.querySelector('.next-page').addEventListener('click', event => {
    const data = {
      target: '.next-page',
      behavior: 'setScene',
      // 当前所处的是第一页
      scene: 'page-1',
      // 要进入第二页
      content: {
        key: 'page-2'
      }
    }
    callRiseIframe(data);
    actionFn.setScene(data);
  });
  // 乌龟拖动
  document.querySelectorAll('.tt').forEach(dom => {
    dom.addEventListener('mousedown', function (event) {
      const pageDom = document.querySelector('.page.show');
      const [pageX, pageY] = [pageDom.offsetLeft, pageDom.offsetTop];
      const [domX, domY] = [this.parentNode.offsetLeft, this.parentNode.offsetTop];
      // 将像素转成百分比
      const percentageX = utils.pxToPercentage(pageX + domX, true);
      const percentageY = utils.pxToPercentage(pageY + domY, false);
      const data = {
        target: `#${event.target.id}`,
        behavior: 'moveStart',
        scene: 'page-2',
        content: { left: percentageX, top: percentageY }
      }
      callRiseIframe(data);
      actionFn.moveStart(data);
    });
  });
  document.addEventListener('mousemove', function (event) {
    // document.querySelector('#test-1').innerHTML = `${event.clientX},${event.clientY}`;
    if (dragInfo.isDragging) {
      const { clientX, clientY } = event;
      // 将像素转成百分比
      const percentageX = utils.pxToPercentage(clientX, true);
      const percentageY = utils.pxToPercentage(clientY, false);

      const data = {
        target: `#${event.target.id}`,
        behavior: 'move',
        scene: 'page-2',
        content: { left: percentageX, top: percentageY },
        // 鼠标移动事件太频繁，使用队列定时批量发送。SDK 内置了实现，只需要指定 interval = true 即可
        interval: true
      }
      callRiseIframe(data);
      actionFn.move(data);
    }
  });
  document.addEventListener('mouseup', function (event) {
    const data = {
      target: `#${event.target.id}`,
      behavior: 'moveEnd',
      scene: 'page-2',
      content: null,
      // 等待 move 队列发送完毕后再发出
      waitOn: ['move']
    }
    if (dragInfo.isDragging) {
      callRiseIframe(data);
    }
    actionFn.moveEnd();
  });
  // 媒体资源
  document.querySelectorAll('audio,video').forEach(item => {
    // 媒体资源播放事件通知
    item.addEventListener("play", function () {
      callRiseIframe({
        target: `#${item.id}`, // dom 元素有 id 属性
        behavior: 'mediaPlay',
        scene: 'page-1',
      });
    });
    // 媒体资源停止播放事件通知
    item.addEventListener("pause", function () {
      callRiseIframe({
        target: `#${item.id}`, // dom 元素有 id 属性
        behavior: 'mediaPause',
        scene: 'page-1',
      });
    });
    // 媒体资源播放进度通知SDK记录
    item.addEventListener("timeupdate", function () {
      callRiseIframe({
        target: `#${item.id}`, // dom 元素有 id 属性
        behavior: 'mediaProgress',
        scene: 'page-1',
        content: {
          currentTime: item.currentTime
        },
        // 正常的进度播放通知SDK无需转发同步到其他用户端，SDK只需记录最新进度
        offline: true,
        // 暂时先使用 SDK内置的 0.1秒间隔，后续看情况再决定是否调整延迟发送间隔
        interval: true
      });
    });
    // 用户手动更改媒体资源播放进度的发送信道消息通知其他用户同步
    item.addEventListener("seeking", function () {
      callRiseIframe({
        target: `#${item.id}`, // dom 元素有 id 属性
        behavior: 'mediaProgress',
        scene: 'page-1',
        content: {
          currentTime: item.currentTime
        }
      });
    });
  });
}

// 渲染函数
/// 渲染相关的动作最好抽取出来封装成 api 对外曝露，然后各个端同步的时候会调用响应的渲染API
const actionFn = {
  load() {
    // load 无需实现，只需要 通知 SDK 即可
  },
  // 翻页
  setScene(data) {
    const key = data.content.key;
    if (!key) {
      return;
    }
    document.querySelectorAll('.page').forEach((page, i) => {
      // 目标页显示
      if (page.classList.contains(key)) {
        page.classList.add('show');
        if (i === 1) {
          // 提示信息
          utils.setTipShow(2);
        } else {
          utils.setTipShow(0);
        }
      } else {
        // 其他页隐藏
        page.classList.remove('show');
        // 隐藏页下所有的音视频暂停播放
        page.querySelectorAll('audio,video').forEach(item => {
          item.classList.remove('show');
          item.pause();
        });
      }
    });
  },
  // 播放指定视频
  mediaPlay(data) {
    const target = document.querySelector(data.target);
    if (!target) {
      return;
    }
    if (target.paused) {
      target.play();
    }
  },
  // 暂停指定视频
  mediaPause(data) {
    const target = document.querySelector(data.target);
    if (!target) {
      return;
    }
    if (!target.paused) {
      target.pause();
    }
  },
  // 同步指定的视频进度
  mediaProgress(data) {
    const target = document.querySelector(data.target);
    if (!target) {
      return;
    }
    const currentTime = data.content.currentTime;
    if (currentTime) {
      target.currentTime = currentTime;
    }
  },
  // 停止所有的音视频播放
  mediaStopAll(data) {
    document.querySelectorAll('audio,video').forEach(item => {
      item.pause();
    });
  },
  // 乌龟点到
  rollCall(data) {
    // dom 激活
    const dom = document.querySelector(data.target);
    const activeClassName = 'active';
    if (dom && !dom.classList.contains(activeClassName)) {
      dom.classList.add(activeClassName);
    }
    const counter = document.querySelector('.tortoise-counter');
    let count = 0;
    if (counter && counter.textContent) {
      count = parseInt(counter.textContent);
    }
    count++;
    counter.textContent = count;
    if (count === 3) {
      utils.setTipShow(1);
      // 第三只乌龟点到后播放视频
      actionFn.playVideo();
    }
  },
  // 开始拖动
  moveStart(data) {
    dragInfo.isDragging = true;
    dragInfo.currentDragSelector = data.target;
    const dom = document.querySelector(data.target);
    if (dom) {
      dom.classList.add('fixed');
      dom.style.left = data.content.left;
      dom.style.top = data.content.top;
    }
  },
  // 拖动
  move(data) {
    if (dragInfo.currentDragSelector) {
      const dom = document.querySelector(dragInfo.currentDragSelector);
      if (dom && dragInfo.isDragging) {
        dom.style.left = data.content.left;
        dom.style.top = data.content.top;
      }
    }
  },
  // 拖动结束
  moveEnd() {
    dragInfo.isDragging = false;
    if (dragInfo.currentDragSelector) {
      const dom = document.querySelector(dragInfo.currentDragSelector);
      if (dom) {
        // 在移动的dom位置还原前记录当前坐标
        const clientX = dom.offsetLeft;
        const clientY = dom.offsetTop;
        dom.classList.remove('fixed');
        dom.style.left = '';
        dom.style.top = '';
        // 判断是否进入泳池范围
        const pageDom = document.querySelector('.page.show');
        const poolDom = document.querySelector('.pool');
        const poolXStart = pageDom.offsetLeft;
        const poolXEnd = poolXStart + pageDom.offsetWidth;
        const poolYStart = poolDom.offsetTop + pageDom.offsetTop;
        const poolYEnd = poolYStart + poolDom.offsetHeight;
        if (clientX > poolXStart && clientX < poolXEnd && clientY > poolYStart && clientY < poolYEnd) {
          /// 乌龟进入泳池
          // 1.岸上的乌龟隐藏
          dom.classList.add('hide');
          const poolTTDomList = document.querySelectorAll('.pool-tt');
          // 当前泳池中乌龟的数量
          const count = document.querySelectorAll('.pool-tt.show').length;
          if (count < poolTTDomList.length) {
            // 2.泳池中的乌龟显示 + 1
            poolTTDomList[count].classList.add('show');
            // 3.更新记牌器
            const counterDom = document.querySelector('.pool-tt-counter');
            counterDom.src = `img/box2_${count + 1}.png`;
            if (!counterDom.classList.contains('show')) {
              counterDom.classList.add('show');
            }
          }
        }
      }
      // 当前拖动dom变为空
      dragInfo.currentDragSelector = '';
    }
  },
  // 播放视频
  playVideo() {
    const target = document.querySelector('#video1');
    const activeClassName = 'show';
    if (!target.classList.contains(activeClassName)) {
      target.classList.add(activeClassName);
    }
    // 开始播放视频
    target.play();
  },
}

function init() {
  // 互动自定义事件注册
  Object.keys(actionFn).forEach(key => {
    // 注册自定义事件，事件对应的函数就是渲染相关函数
    // 其他端的同步是通过：riseObserver.emit(key) 触发自定义事件
    riseObserver.on(key, actionFn[key]);
  });
  // 本地dom事件绑定
  eventInit();

  // 课件加载完成通知
  callRiseIframe({
    target: `#app`,
    behavior: 'load',
    scene: 'page-1',
    content: null,
  });
}

init();


