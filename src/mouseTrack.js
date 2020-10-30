import store from './store';
import config from './config';
import BufferJob from './bufferJob';
import { isInRise, pxToVw, pxToVh } from './util';

const domId = 'cw_mouse_track';
/**
 * 鼠标轨迹
 */
class MouseTrack {
  // 鼠标事件所在的 DOM 容器
  container = null;
  // DOM 元素
  target = null;
  // 鼠标轨迹同步频率
  interval = 300;
  // 启用状态，本地状态
  enabled = false;
  // 是否启用鼠标轨迹，来自教室端的控制
  get enableMouseTrack() {
    return store.user ? store.user.enableMouseTrack : true;
  }
  // 当前是否具备课件控制权
  get hasControl() {
    return store.user ? store.user.hasControl : true;
  }
  // 鼠标指针图片
  get cursorUrl() {
    return store.user && store.user.cursorUrl ? store.user.cursorUrl : 'https://sdk.herewhite.com/resource/mouse-cursor/selector-cursor.png';
  }
  constructor() {
    // 为了在回调中使用 `this`，这个绑定是必不可少的
    this.onMouseMove = this.onMouseMove.bind(this);

    if (document.readyState === 'loading') {  // 此时加载尚未完成
      document.addEventListener('DOMContentLoaded', this.init);
    } else {  // 此时`DOMContentLoaded` 已经被触发
      this.init();
    }
  }

  init() {
    // 必须要使用课件的 canvas ，直接在 document.body 上监听是收不到事件响应的，似乎是被 cocos 阻止事件冒泡了
    this.container = document.getElementById('GameCanvas') || document.querySelector('canvas');
    this.interval = store.user && store.user.interval ? store.user.interval : 300;
    // 先清除，这样就可以重复 new 不影响了
    this.clean();
    if (isInRise()) {
      this.createTarget();
      // 初始化时，调用 check 判断是否启用
      this.check();
    }
  }
  // 创建一个模拟的鼠标指针元素
  createTarget() {
    const size = '26px';
    const dom = document.createElement('div');
    dom.id = domId;
    // 鼠标事件穿透
    dom.style.pointerEvents = 'none';
    dom.style.position = 'fixed';
    dom.style.left = '-' + size;
    dom.style.top = '-' + size;
    // 块级元素
    dom.style.display = 'inline-block';
    dom.style.width = size;
    dom.style.height = size;
    dom.style.background = `url(${this.cursorUrl}) no-repeat`;
    dom.style.backgroundSize = 'cover';
    document.body.appendChild(dom);
    this.target = dom;
  }
  onMouseMove({ pageX, pageY }) {
    const x = pxToVw(pageX);
    const y = pxToVh(pageY);
    this.move(x, y);
    // 加入消息缓冲任务队列
    new BufferJob({
      target: 'SDK',
      behavior: config.behaviors.mouseTrack,
      content: {
        x,
        y
      },
      interval: this.interval,
    });
  }
  // x、y 是带单位的
  move(x, y) {
    const target = this.target;
    if (target) {
      target.style.left = x;
      target.style.top = y;
    }
  }
  // 清除
  clean() {
    const target = document.getElementById(domId);
    if (target) {
      document.body.style.cursor = null;
      document.body.removeChild(target);
      this.container.removeEventListener('mousemove', this.onMouseMove);
    }
  }
  // 启用鼠标轨迹发送
  enable() {
    if (!this.enabled) {
      this.container.addEventListener('mousemove', this.onMouseMove);
      this.enabled = true;
    }
  }
  // 禁用鼠标轨迹发送
  disable() {
    this.container.removeEventListener('mousemove', this.onMouseMove);
    this.enabled = false;
  }
  // 检查当前应该启用还是禁用，并执行
  check() {
    if (this.enableMouseTrack) {
      // 隐藏系统鼠标样式
      document.body.style.cursor = 'none';
      if (this.hasControl) {
        this.enable();
      } else {
        this.disable();
      }
    } else {
      // 恢复系统鼠标样式
      document.body.style.cursor = null;
      this.disable();
    }
  }
}

export default MouseTrack;
