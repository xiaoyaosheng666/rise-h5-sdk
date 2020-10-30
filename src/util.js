import config from './config';

// 通信消息的唯一 key
export function getActionKey(data) {
  const key = `${data.target}-${data.behavior}`;
  return key;
}
// 定时任务 key
export function getJobKey(data) {
  const interval = data.interval;
  // 如果 interval 不是数值的话就默认是 100 毫秒的定时任务，否则就是 interval 毫秒的定时任务
  const jobKey = typeof interval === 'number' ? interval : config.interval;
  return jobKey;
}
// 是否在 rise 环境中
export function isInRise() {
  return window !== window.top;
}
// px 转成 vw / vh。多个屏幕间传输尺寸时，可保持效果一致
export function pxToVw(px) {
  const vw = Math.round(px / window.innerWidth * 10000) / 100;
  return `${vw}vw`;
}
export function pxToVh(px) {
  const vh = Math.round(px / window.innerHeight * 10000) / 100;
  return `${vh}vh`;
}
