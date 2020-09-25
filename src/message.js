// 接受的消息队列，load 事件之前的消息先暂存到队列中，等待 load 之后再渲染
const queue = [];
// 是否已 load 事件
let isLoad = false;
/**
 * 接收消息
 */
window.addEventListener('message', function (evt) {
  // 不在 Rise 集成环境中的话，无需接收消息
  if (window === window.top) {
    return;
  }
  const data = evt.data;
  if (!data || !data.behavior) {
    return;
  }
  // 如果已经 load 并且 redis同步完成，则直接渲染。否则加入队列等待渲染
  if (isLoad && queue.length === 0) {
    riseObserver.emit(data.behavior, data);
  } else {
    queue.push(data);
  }
});
/**
 * 发送消息
 * @param {Object} data 
 */
function postToRise(data) {
  // 不在 Rise 集成环境中的话，无需发送消息
  if (window === window.top) {
    return false;
  }
  console.log('sdk data:', data);
  if (data && data.behavior) {
    window.parent.postMessage && window.parent.postMessage(data, '*');
  }
}

export {
  postToRise
}
