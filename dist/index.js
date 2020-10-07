(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/bufferJob.js":
/*!**************************!*\
  !*** ./src/bufferJob.js ***!
  \**************************/
/*! exports provided: jobs, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"jobs\", function() { return jobs; });\n/* harmony import */ var _message__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./message */ \"./src/message.js\");\n/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util */ \"./src/util.js\");\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\n\n\nvar jobs = new Map();\n/**\r\n * 定时任务创建工厂，按照时间间隔为 key 为维度创建定时任务。如果已存在对应的时间间隔任务，则直接加入该任务的队列中（bufferMap）\r\n */\n\nvar BufferJob = // Number,定时任务执行间隔，默认取 config 配置的，如果传递了数值 interval，则是 interval 毫秒间隔\n// Map,缓冲数据，定时发送。间隔期内新数据会替换掉未发送的数据\n// Number,定时任务,setInterval 返回值\n// data 是 SDK消息传输的格式\nfunction BufferJob(data) {\n  var _this = this;\n\n  _classCallCheck(this, BufferJob);\n\n  _defineProperty(this, \"interval\", null);\n\n  _defineProperty(this, \"bufferMap\", null);\n\n  _defineProperty(this, \"timer\", null);\n\n  var jobKey = Object(_util__WEBPACK_IMPORTED_MODULE_1__[\"getJobKey\"])(data);\n\n  if (jobKey < 0) {\n    throw new Error('interval 设置错误，无法创建定时任务');\n  } // 属性 interval\n\n\n  this.interval = jobKey; // 渲染 key\n\n  var actionKey = Object(_util__WEBPACK_IMPORTED_MODULE_1__[\"getActionKey\"])(data);\n\n  if (jobs.has(jobKey)) {\n    var job = jobs.get(jobKey); // 添加或覆盖子任务\n\n    job.bufferMap.set(actionKey, data);\n    return job;\n  } else {\n    // 属性 bufferMap\n    this.bufferMap = new Map();\n    this.bufferMap.set(actionKey, data); // 属性 timer\n\n    this.timer = setInterval(function () {\n      var bufferMap = _this.bufferMap;\n\n      if (bufferMap.size > 0) {\n        bufferMap.forEach(function (value, key) {\n          Object(_message__WEBPACK_IMPORTED_MODULE_0__[\"postToRise\"])(value);\n          bufferMap[\"delete\"](key);\n        });\n      } else {\n        clearInterval(_this.timer);\n        jobs[\"delete\"](jobKey);\n      }\n    }, this.interval);\n    jobs.set(jobKey, this);\n    return this;\n  }\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (BufferJob);\n\n//# sourceURL=webpack:///./src/bufferJob.js?");

/***/ }),

/***/ "./src/config.js":
/*!***********************!*\
  !*** ./src/config.js ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  // 定时任务默认时间间隔 100 毫秒\n  interval: 100,\n  // 特殊的 behavior\n  behaviors: {\n    // sdk init，直播教室会通过此行为传递用户数据\n    sdkInit: '$sdk_init',\n    // rise 同步历史\n    history: '$rise_history',\n    // 课件的 load\n    load: 'init',\n    ready: 'ready',\n    // 场景切换\n    setScene: 'setScene',\n    // 媒体相关\n    mediaProgress: 'mediaProgress'\n  }\n});\n\n//# sourceURL=webpack:///./src/config.js?");

/***/ }),

/***/ "./src/eventEmitter.js":
/*!*****************************!*\
  !*** ./src/eventEmitter.js ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nfunction EventEmitter() {\n  this.listeners = {};\n  this.maxListener = 50;\n}\n\nEventEmitter.prototype.on = function (event, cb) {\n  var listeners = this.listeners;\n\n  if (listeners[event] && listeners[event].length >= this.maxListener) {\n    throw console.error('监听器的最大数量是%d,您已超出限制', this.maxListener);\n  }\n\n  if (listeners[event] instanceof Array) {\n    if (listeners[event].indexOf(cb) === -1) {\n      listeners[event].push(cb);\n    }\n  } else {\n    listeners[event] = [].concat(cb);\n  }\n};\n\nEventEmitter.prototype.addListener = EventEmitter.prototype.on;\n/**\r\n * 触发事件\r\n * @param {String} event 事件名\r\n */\n\nEventEmitter.prototype.emit = function (event) {\n  var args = Array.prototype.slice.call(arguments);\n  args.shift();\n  var list = this.listeners[event] || [];\n  list.forEach(function (cb) {\n    cb.apply(null, args);\n  });\n};\n\nEventEmitter.prototype.listeners = function (event) {\n  return this.listeners[event];\n};\n\nEventEmitter.prototype.setMaxListeners = function (num) {\n  this.maxListener = num;\n};\n\nEventEmitter.prototype.removeListener = function (event, listener) {\n  var listeners = this.listeners;\n  var arr = listeners[event] || [];\n  var i = arr.indexOf(listener);\n\n  if (i >= 0) {\n    listeners[event].splice(i, 1);\n  }\n};\n\nEventEmitter.prototype.removeAllListener = function (event) {\n  this.listeners[event] = [];\n};\n\nEventEmitter.prototype.once = function (event, listener) {\n  var self = this;\n\n  function fn() {\n    var args = Array.prototype.slice.call(arguments);\n    listener.apply(null, args);\n    self.removeListener(event, fn);\n  }\n\n  this.on(event, fn);\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (EventEmitter);\n\n//# sourceURL=webpack:///./src/eventEmitter.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! exports provided: riseObserver, callRiseIframe, getRiseUserInfo */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"callRiseIframe\", function() { return callRiseIframe; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getRiseUserInfo\", function() { return getRiseUserInfo; });\n/* harmony import */ var _message__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./message */ \"./src/message.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"riseObserver\", function() { return _message__WEBPACK_IMPORTED_MODULE_0__[\"riseObserver\"]; });\n\n/* harmony import */ var _bufferJob__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./bufferJob */ \"./src/bufferJob.js\");\n/* harmony import */ var _waitOn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./waitOn */ \"./src/waitOn.js\");\n/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./store */ \"./src/store.js\");\n\n\n\n\n\nvar callRiseIframe = function callRiseIframe(data) {\n  if (data.interval) {\n    // 加入缓冲任务队列\n    new _bufferJob__WEBPACK_IMPORTED_MODULE_1__[\"default\"](data);\n  } else if (data.waitOn && data.waitOn.length > 0) {\n    // 设置延迟执行大于定时执行队列延迟来实现等待队列完成\n    Object(_waitOn__WEBPACK_IMPORTED_MODULE_2__[\"default\"])(data);\n  } else {\n    Object(_message__WEBPACK_IMPORTED_MODULE_0__[\"postToRise\"])(data);\n  }\n}; // 获取 rise 用户信息\n\n\nfunction getRiseUserInfo() {\n  return _store__WEBPACK_IMPORTED_MODULE_3__[\"default\"].user;\n}\n\n\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/log.js":
/*!********************!*\
  !*** ./src/log.js ***!
  \********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nfunction log(mess) {\n  if (typeof mess === 'string') {\n    console.log(\"%c SDK:\".concat(mess), 'color:green');\n  } else {\n    console.log(\"%c SDK:\".concat(JSON.stringify(mess)), 'color:green');\n  }\n\n  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {\n    args[_key - 1] = arguments[_key];\n  }\n\n  console.log(args);\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (log);\n\n//# sourceURL=webpack:///./src/log.js?");

/***/ }),

/***/ "./src/message.js":
/*!************************!*\
  !*** ./src/message.js ***!
  \************************/
/*! exports provided: postToRise, riseObserver */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"postToRise\", function() { return postToRise; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"riseObserver\", function() { return riseObserver; });\n/* harmony import */ var _eventEmitter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./eventEmitter */ \"./src/eventEmitter.js\");\n/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./config */ \"./src/config.js\");\n/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./store */ \"./src/store.js\");\n/* harmony import */ var _log__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./log */ \"./src/log.js\");\n\n\n\n\nvar riseObserver = new _eventEmitter__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\n/**\r\n * 接受的消息队列，课件 ready 之前的消息先暂存到队列中，等待 SDK 收到课件的 ready 通知后渲染\r\n */\n\nvar queue = []; // mediaProgress behavior 最新进度记录，用来规避无限重复互发\n\nvar mediaProgressMap = new Map(); // 课件状态\n\nvar courseware = {\n  // 课件是否已加载。以收到 课件的 init 通知为准\n  isLoad: false,\n  // 课件是否已准备就绪：用户可以操作了.以收到 课件的 ready 通知为准\n  isReady: false\n};\nvar state = {\n  // 如果收到历史操作消息后，课件还没 load ，那需要先把历史消息挂起，等 load 后再渲染。（标准 SDK 消息）\n  historyMsg: null,\n  // 从历史行为中取的最近的一次 setScene 行为\n  lastScene: null,\n  // 历史操作是否已同步\n  isHistorySynchronized: false,\n  // SDK 准备就绪\n  isReady: false\n};\nvar action = {\n  render: function render(data) {\n    return riseObserver.emit(data.behavior, data);\n  },\n  onLoad: function onLoad() {\n    Object(_log__WEBPACK_IMPORTED_MODULE_3__[\"default\"])('课件 init');\n    state.isLoad = true;\n    action.setScene();\n  },\n  // 如果有 setScene ，则会通知课件设置场景\n  setScene: function setScene() {\n    if (!state.historyMsg) {\n      // 如果还没收到历史消息，稍后再询问执行\n      setTimeout(function () {\n        action.setScene();\n      }, 50);\n      return false;\n    } // list 是 rise 存储的去重后的所有的历史操作\n\n\n    var list = state.historyMsg.content.list;\n\n    if (list && list.length > 0) {\n      // 找出 setScene behavior\n      var scenes = list.filter(function (p) {\n        return p.behavior === _config__WEBPACK_IMPORTED_MODULE_1__[\"default\"].behaviors.setScene;\n      });\n\n      if (scenes && scenes.length > 0) {\n        var lastScene = scenes[scenes.length - 1]; // 记录到 state 上，后面的历史行为同步函数会用到\n\n        state.lastScene = lastScene;\n        Object(_log__WEBPACK_IMPORTED_MODULE_3__[\"default\"])('setScene', lastScene);\n        action.render(lastScene);\n      }\n    }\n\n    action.onReady();\n  },\n  // SDK Ready\n  onReady: function onReady() {\n    Object(_log__WEBPACK_IMPORTED_MODULE_3__[\"default\"])('SDK ready');\n    state.isReady = true; // sdk ready 通知\n\n    action.render({\n      behavior: _config__WEBPACK_IMPORTED_MODULE_1__[\"default\"].behaviors.ready\n    });\n  },\n  // 课件 Ready\n  onCoursewareReady: function onCoursewareReady() {\n    Object(_log__WEBPACK_IMPORTED_MODULE_3__[\"default\"])('课件 ready');\n    courseware.isReady = true;\n    action.syncHistory();\n  },\n  // 同步课件的历史行为\n  syncHistory: function syncHistory() {\n    // 要在课件 ready 之后\n    if (!courseware.isReady) {\n      return false;\n    } // list 是 rise 存储的去重后的所有的历史操作\n\n\n    var list = state.historyMsg.content.list;\n\n    if (!list || list.length === 0) {\n      action.onSyncHistoryFinish();\n      return true;\n    } // 历史行为中最近的 setScene\n\n\n    var lastScene = state.lastScene; // 要渲染的行为\n\n    var renderList = null;\n\n    if (lastScene) {\n      renderList = list.filter(function (p) {\n        return p.timestamp > lastScene.timestamp;\n      });\n    } else {\n      renderList = list;\n    }\n\n    Object(_log__WEBPACK_IMPORTED_MODULE_3__[\"default\"])('历史同步', renderList); // 依次渲染\n\n    var next = function next(i) {\n      if (i === renderList.length) {\n        // 同步完成\n        action.onSyncHistoryFinish();\n      } else {\n        var data = renderList[i]; // 依次渲染\n\n        action.render(data);\n        i++;\n\n        if (data.timeout) {\n          // 如果当前行为设置了执行消耗时间，那下一个行为要等待此间隔\n          setTimeout(function () {\n            next(i);\n          }, data.timeout);\n        } else {\n          next(i);\n        }\n      }\n    };\n\n    next(0);\n  },\n  // 历史同步完成\n  onSyncHistoryFinish: function onSyncHistoryFinish() {\n    Object(_log__WEBPACK_IMPORTED_MODULE_3__[\"default\"])('历史同步完成'); // 清空挂起的历史消息\n\n    state.historyMsg = null; // 标记历史同步完成\n\n    state.isHistorySynchronized = true; // 挂起的消息进行渲染\n\n    action.flushQueue();\n  },\n  // 队列中的消息执行渲染\n  flushQueue: function flushQueue() {\n    Object(_log__WEBPACK_IMPORTED_MODULE_3__[\"default\"])('队列执行', queue.length);\n\n    if (state.isHistorySynchronized) {\n      while (queue.length > 0) {\n        action.render(queue[0]);\n        queue.splice(0, 1);\n      }\n    }\n  },\n  // 媒体进度 behavior\n  onMediaProgressBehavior: function onMediaProgressBehavior(data) {\n    var key = data.target;\n    var value = mediaProgressMap.get(key);\n    var currentTime = data.content.currentTime;\n\n    if (value && Math.abs(currentTime - value) < 3) {\n      // 这是个重复发送的消息，标记为停止转发\n      data.offline = true;\n    }\n\n    mediaProgressMap.set(key, currentTime);\n  }\n};\n/**\r\n * 接收消息\r\n */\n\nwindow.addEventListener('message', function (evt) {\n  // 不在 Rise 集成环境中的话，无需接收消息\n  if (window === window.top) {\n    return;\n  }\n\n  var data = evt.data;\n\n  if (!data || !data.behavior) {\n    return;\n  }\n\n  Object(_log__WEBPACK_IMPORTED_MODULE_3__[\"default\"])('message', data); // 特殊的 behavior\n\n  if (data.behavior === _config__WEBPACK_IMPORTED_MODULE_1__[\"default\"].behaviors.history) {\n    // 历史数据\n    state.historyMsg = data;\n    return;\n  } else if (data.behavior === _config__WEBPACK_IMPORTED_MODULE_1__[\"default\"].behaviors.sdkInit) {\n    // 初始化数据\n    _store__WEBPACK_IMPORTED_MODULE_2__[\"mutations\"].setUser(data.content);\n    return;\n  } // 如果历史同步已经完成 ，则直接渲染。否则加入队列等待渲染（setScene 除外，不做任何限制）\n\n\n  if (state.isHistorySynchronized || data.behavior === _config__WEBPACK_IMPORTED_MODULE_1__[\"default\"].behaviors.setScene) {\n    action.render(data);\n  } else {\n    queue.push(data);\n  }\n});\n/**\r\n * 发送消息\r\n * @param {Object} data \r\n */\n\nfunction postToRise(data) {\n  // 不在 Rise 集成环境中的话，无需发送消息\n  if (window === window.top) {\n    return false;\n  }\n\n  if (!data || !data.behavior) {\n    return;\n  } // 特殊的 behavior\n\n\n  if (data.behavior === _config__WEBPACK_IMPORTED_MODULE_1__[\"default\"].behaviors.ready) {\n    action.onCoursewareReady();\n  } else {\n    Object(_log__WEBPACK_IMPORTED_MODULE_3__[\"default\"])('send', data);\n\n    if (data.behavior === _config__WEBPACK_IMPORTED_MODULE_1__[\"default\"].behaviors.load) {\n      // 课件 load 无需转发给其他端\n      data.offline = true;\n      action.onLoad();\n    } else if (data.behavior === _config__WEBPACK_IMPORTED_MODULE_1__[\"default\"].behaviors.mediaProgress) {\n      action.onMediaProgressBehavior(data);\n    }\n\n    window.parent.postMessage && window.parent.postMessage(data, '*');\n  }\n}\n\n\n\n//# sourceURL=webpack:///./src/message.js?");

/***/ }),

/***/ "./src/store.js":
/*!**********************!*\
  !*** ./src/store.js ***!
  \**********************/
/*! exports provided: mutations, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"mutations\", function() { return mutations; });\nvar state = {\n  // 从直播教室获取的数据\n  user: null\n}; // 追踪设置\n\nvar mutations = {\n  setUser: function setUser(data) {\n    state.user = data;\n  }\n};\n/* harmony default export */ __webpack_exports__[\"default\"] = (state);\n\n//# sourceURL=webpack:///./src/store.js?");

/***/ }),

/***/ "./src/util.js":
/*!*********************!*\
  !*** ./src/util.js ***!
  \*********************/
/*! exports provided: getActionKey, getJobKey */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getActionKey\", function() { return getActionKey; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getJobKey\", function() { return getJobKey; });\n/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./config */ \"./src/config.js\");\n // 通信消息的唯一 key\n\nfunction getActionKey(data) {\n  var key = \"\".concat(data.target, \"-\").concat(data.behavior);\n  return key;\n} // 定时任务 key\n\nfunction getJobKey(data) {\n  var interval = data.interval; // 如果 interval 不是数值的话就默认是 100 毫秒的定时任务，否则就是 interval 毫秒的定时任务\n\n  var jobKey = typeof interval === 'number' ? interval : _config__WEBPACK_IMPORTED_MODULE_0__[\"default\"].interval;\n  return jobKey;\n}\n\n//# sourceURL=webpack:///./src/util.js?");

/***/ }),

/***/ "./src/waitOn.js":
/*!***********************!*\
  !*** ./src/waitOn.js ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _bufferJob__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./bufferJob */ \"./src/bufferJob.js\");\n/* harmony import */ var _message__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./message */ \"./src/message.js\");\nfunction _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === \"undefined\" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === \"number\") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError(\"Invalid attempt to iterate non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\"); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it[\"return\"] != null) it[\"return\"](); } finally { if (didErr) throw err; } } }; }\n\nfunction _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === \"string\") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === \"Object\" && o.constructor) n = o.constructor.name; if (n === \"Map\" || n === \"Set\") return Array.from(o); if (n === \"Arguments\" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }\n\nfunction _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }\n\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (function (data) {\n  // 只在当前 target 范围上的 behavior 作用\n  var actionKeys = data.waitOn.map(function (key) {\n    return \"\".concat(data.target, \"-\").concat(key);\n  });\n  var timeout = 0; // 遍历 jobs ，找到匹配的任务执行周期\n\n  var _iterator = _createForOfIteratorHelper(_bufferJob__WEBPACK_IMPORTED_MODULE_0__[\"jobs\"].values()),\n      _step;\n\n  try {\n    var _loop = function _loop() {\n      var value = _step.value;\n\n      if (!value.bufferMap) {\n        return \"continue\";\n      }\n\n      actionKeys.forEach(function (key) {\n        if (value.bufferMap.has(key)) {\n          // waitOn 依赖的任务取最大间隔的那个\n          timeout = Math.max(value.interval, timeout);\n        }\n      });\n    };\n\n    for (_iterator.s(); !(_step = _iterator.n()).done;) {\n      var _ret = _loop();\n\n      if (_ret === \"continue\") continue;\n    }\n  } catch (err) {\n    _iterator.e(err);\n  } finally {\n    _iterator.f();\n  }\n\n  setTimeout(function () {\n    Object(_message__WEBPACK_IMPORTED_MODULE_1__[\"postToRise\"])(data);\n  }, timeout + 1);\n});\n\n//# sourceURL=webpack:///./src/waitOn.js?");

/***/ })

/******/ });
});