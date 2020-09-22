function EventEmitter() {
  this.listeners = {};
  this.maxListener = 50;
}

EventEmitter.prototype.on = function (event, cb) {
  var listeners = this.listeners;
  if (listeners[event] && listeners[event].length >= this.maxListener) {
    throw console.error('监听器的最大数量是%d,您已超出限制', this.maxListener)
  }
  if (listeners[event] instanceof Array) {
    if (listeners[event].indexOf(cb) === -1) {
      listeners[event].push(cb);
    }
  } else {
    listeners[event] = [].concat(cb);
  }
}
EventEmitter.prototype.addListener = EventEmitter.prototype.on;

/**
 * 触发事件，返回 Promise
 * @param {String} event 事件名
 */
EventEmitter.prototype.emit = function (event) {
  var args = Array.prototype.slice.call(arguments);
  args.shift();
  const list = this.listeners[event] || [];
  // 事件包装成 Promise
  const promiseList = list.map(item => {
    const result = cb.apply(null, args);
    if (result instanceof Promise) {
      return result;
    } else {
      return new Promise(r => r(result));
    }
  });
  return Promise.all(promiseList);
}

EventEmitter.prototype.listeners = function (event) {
  return this.listeners[event];
}

EventEmitter.prototype.setMaxListeners = function (num) {
  this.maxListener = num;
}

EventEmitter.prototype.removeListener = function (event, listener) {
  var listeners = this.listeners;
  var arr = listeners[event] || [];
  var i = arr.indexOf(listener);
  if (i >= 0) {
    listeners[event].splice(i, 1);
  }
}

EventEmitter.prototype.removeAllListener = function (event) {
  this.listeners[event] = [];
}

EventEmitter.prototype.once = function (event, listener) {
  var self = this;
  function fn() {
    var args = Array.prototype.slice.call(arguments);
    listener.apply(null, args);
    self.removeListener(event, fn);
  }
  this.on(event, fn)
}
/* ---EventEmitter end--- */

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
/**
 * 接收消息
 */
window.addEventListener('message', function (evt) {
  // 不在 Rise 集成环境中的话，无需接收消息
  if (window === window.top) {
    return false;
  }
  const data = evt.data;
  if (data && data.behavior) {
    riseObserver.emit(data.behavior, data);
  }
});
// 缓冲数据，定时发送。间隔期内新数据会替换掉未发送的数据
const bufferMap = new Map();
const fastTimerDelay = 100;

const fastTimer = setInterval(() => {
  if (bufferMap.size > 0) {
    bufferMap.forEach((value, key) => {
      postToRise(value);
      bufferMap.delete(key);
    });
  }
}, fastTimerDelay);

const riseObserver = new EventEmitter();
const callRiseIframe = function (data) {
  if (data.interval) {
    bufferMap.set(data.behavior, data);
  } else if (data.waitOn && data.waitOn.length > 0) {
    // 设置延迟执行大于定时执行队列延迟来实现等待队列完成
    setTimeout(() => {
      postToRise(data);
    }, fastTimerDelay + 1);
  }
  else {
    postToRise(data);
  }
};

window.riseObserver = riseObserver;
window.callRiseIframe = callRiseIframe;

export {
  riseObserver,
  callRiseIframe
}
