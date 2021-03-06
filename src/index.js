import { postToRise, riseObserver } from './message';
import BufferJob from './bufferJob';
import waitOn from './waitOn';
import store from './store';

const version = process.env.version;

console.log('SDK Version:', version);

const callRiseIframe = function (data) {
  if (data.interval) {
    // 加入缓冲任务队列
    new BufferJob(data);
  } else if (data.waitOn && data.waitOn.length > 0) {
    // 设置延迟执行大于定时执行队列延迟来实现等待队列完成
    waitOn(data);
  }
  else {
    postToRise(data);
  }
};
// 获取 rise 用户信息
function getRiseUserInfo() {
  return store.user;
}

export {
  riseObserver,
  callRiseIframe,
  getRiseUserInfo
}
