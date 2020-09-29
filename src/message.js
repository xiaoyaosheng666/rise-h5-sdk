import EventEmitter from './eventEmitter';
import config from './config';

const riseObserver = new EventEmitter();
/**
 * 接受的消息队列，课件 ready 之前的消息先暂存到队列中，等待 SDK 收到课件的 ready 通知后渲染
 */
const queue = [];

const courseware = {
  // 课件是否已加载。以收到 课件的 init 通知为准
  isLoad: false,
  // 课件是否已准备就绪：用户可以操作了.以收到 课件的 ready 通知为准
  isReady: false,
}

const state = {
  // 如果收到历史操作消息后，课件还没 load ，那需要先把历史消息挂起，等 load 后再渲染。（标准 SDK 消息）
  historyMsg: null,
  // 历史操作是否已同步
  isHistorySynchronized: false,
  // SDK 准备就绪
  isReady: false,
}
// Object.defineProperty(state, 'isReady', {
//   get() {
//     return state.isLoad && state.isHistorySynchronized;
//   }
// });

const action = {
  render(data) {
    return riseObserver.emit(data.behavior, data);
  },
  onLoad() {
    state.isLoad = true;
    // 检测同步课件的操作
    if (!state.isHistorySynchronized && state.historyMsg) {
      action.syncHistory();
    }
  },
  // 同步课件的历史操作
  syncHistory() {
    // 必须要在课件 load 之后再同步
    if (!state.isLoad) {
      return false;
    }
    // list 是 rise 存储的去重后的所有的历史操作
    const list = state.historyMsg.content.list;
    if (!list || list.length === 0) {
      this.onSyncHistoryFinish();
      return true;
    }
    const next = function (i) {
      if (i === list.length - 1) {
        this.onSyncHistoryFinish();
      } else {
        const data = list[i];
        action.render(list[i]).then(() => {
          i++;
          if (data.timeout) {
            setTimeout(() => {
              next(i);
            }, data.timeout);
          } else {
            next(i);
          }
        });
      }
    }
    next(0);
  },
  // 历史同步完成
  onSyncHistoryFinish() {
    // 清空挂起的历史消息
    state.historyMsg = null;
    // 标记历史同步完成
    state.isHistorySynchronized = true;
  },
  // 队列中的消息执行渲染
  flushQueue() {
    if (state.isReady) {
      while (queue.length > 0) {
        action.render(queue[0]);
        queue.splice(0, 1);
      }
    }
  }
}

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
  // 特殊的 behavior
  if (data.behavior === config.behaviors.history) {
    action.syncHistory(data);
    return;
  }
  // 如果已经 ready ，则直接渲染。否则加入队列等待渲染
  if (state.isReady) {
    action.render(data);
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
  // 特殊的 behavior
  if (data.behavior === 'load') {
    action.onLoad();
  }
  if (data && data.behavior) {
    window.parent.postMessage && window.parent.postMessage(data, '*');
  }
}

export {
  postToRise,
  riseObserver
}
