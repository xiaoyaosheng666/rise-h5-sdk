import EventEmitter from './eventEmitter';
import config from './config';

const riseObserver = new EventEmitter();
/**
 * 接受的消息队列，课件 ready 之前的消息先暂存到队列中，等待 SDK 收到课件的 ready 通知后渲染
 */
const queue = [];

// 课件状态
const courseware = {
  // 课件是否已加载。以收到 课件的 init 通知为准
  isLoad: false,
  // 课件是否已准备就绪：用户可以操作了.以收到 课件的 ready 通知为准
  isReady: false,
}

const state = {
  // 如果收到历史操作消息后，课件还没 load ，那需要先把历史消息挂起，等 load 后再渲染。（标准 SDK 消息）
  historyMsg: null,
  // 从历史行为中取的最近的一次 setScene 行为
  lastScene: null,
  // 历史操作是否已同步
  isHistorySynchronized: false,
  // SDK 准备就绪
  isReady: false
}

const action = {
  render(data) {
    return riseObserver.emit(data.behavior, data);
  },
  onLoad() {
    state.isLoad = true;
    this.setScene();
  },
  // 如果有 setScene ，则会通知课件设置场景
  setScene() {
    if (!state.historyMsg) {
      // 如果还没收到历史消息，稍后再询问执行
      setTimeout(() => {
        action.setScene();
      }, 50);
      return false;
    }
    // list 是 rise 存储的去重后的所有的历史操作
    const list = state.historyMsg.content.list;
    if (list && list.length > 0) {
      // 找出 setScene behavior
      const scenes = list.filter(p => p.behavior === config.behaviors.setScene);
      if (scenes && scenes.length > 0) {
        const lastScene = scenes[scenes.length - 1];
        // 记录到 state 上，后面的历史行为同步函数会用到
        state.lastScene = lastScene;
        action.render(lastScene);
      }
    }

    this.onReady();
  },
  // SDK Ready
  onReady() {
    state.isReady = true;
    // sdk ready 通知
    action.render({
      behavior: config.behaviors.ready
    });
  },
  // 课件 Ready
  onCoursewareReady() {
    courseware.isReady = true;
    this.syncHistory();
  },
  // 同步课件的历史行为
  syncHistory() {
    // 要在课件 ready 之后
    if (!courseware.isReady) {
      return false;
    }
    // list 是 rise 存储的去重后的所有的历史操作
    const list = state.historyMsg.content.list;
    if (!list || list.length === 0) {
      this.onSyncHistoryFinish();
      return true;
    }
    // 历史行为中最近的 setScene
    let lastScene = state.lastScene;
    // 要渲染的行为
    let renderList = null;
    if (lastScene) {
      renderList = list.filter(p => p.timestamp > lastScene.timestamp);
    } else {
      renderList = list;
    }
    // 依次渲染
    const next = function (i) {
      if (i === renderList.length) {
        // 同步完成
        this.onSyncHistoryFinish();
      } else {
        const data = renderList[i];
        // 依次渲染
        action.render(data).then(() => {
          i++;
          if (data.timeout) {
            // 如果当前行为设置了执行消耗时间，那下一个行为要等待此间隔
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
    // 挂起的消息进行渲染
    action.flushQueue();
  },
  // 队列中的消息执行渲染
  flushQueue() {
    if (state.isHistorySynchronized) {
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
    state.historyMsg = data;
    return;
  }
  // 如果历史同步已经完成 ，则直接渲染。否则加入队列等待渲染
  if (state.isHistorySynchronized) {
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
  if (!data || !data.behavior) {
    return;
  }
  console.log('sdk data:', data);
  // 特殊的 behavior
  if (data.behavior === config.behaviors.load) {
    action.onLoad();
  } else if (data.behavior === config.behaviors.ready) {
    action.onCoursewareReady();
  } else {
    window.parent.postMessage && window.parent.postMessage(data, '*');
  }
}

export {
  postToRise,
  riseObserver
}
