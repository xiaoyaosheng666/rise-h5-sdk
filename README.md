# Rise课件对接说明

## SDK
引入 `rise_h5_sdk.js` ，即可使用 window.riseObserver 对象和 window.callRiseIframe 函数 

## 同屏关键操作：
1. 通过 riseObserver.on(key,fn) 注册所有需要同步的渲染相关函数（**fn是纯粹的渲染行为函数**）
2. 本地触发事件时，通过调用 callRiseIframe(data) 函数即可发送到其他用户端
3. 其他端收到同步消息后，SDK 会调用 riseObserver.emit(key,data) 触发之前注册的自定义事件进行渲染

#### 渲染函数说明：
通过  riseObserver.on(key,fn) 注册的渲染函数需要 return 一个 Promise,在渲染执行完成后 resolve.
这是为了在同步多个渲染函数时，可以确保上一个渲染函数已执行完毕再执行下一个渲染。（例如：当前渲染函数依赖于上一个渲染函数动态生成的dom时就很有用）

#### callRiseIframe的参数格式：
```javascript
// 注意：同步过程中会根据  target + behavior 进行去重处理，所以这两个参数定义时请尽量可以描述准确当前的行为
{
    target: 'dom selector', // 必填，dom 选择器，推荐使用 id选择器，比如：#test1，要求可以使用 document.querySelector 函数定位到
    behavior: 'key', // 必填，在  riseObserver.on(key,fn) 中注册的自定义事件名称 key
	location:{
	 layer:1, // 必填，当前课件的层级，课件的切换深度
	 page:1, // 必填，当前 behavior 发生时所处的课件页码。不能翻页时设置 -1
	 scene:1, // 必填，当前 behavior 发生时所处的是该页内第几个场景。不能切换场景时设置 -1
	},
    event: 'click', // 事件类型
    content: {},   // 自定义参数内容
    interval: false, // 像鼠标移动这类事件触发太频繁，需要控制频率，否则通信过于频繁会丢失数据。SDK 内置了实现，只需要指定 interval = true 即可
    waitOn: [] // 例如 mousemove 事件的队列还没发送完毕，此时执行 mouseup 相关渲染可能会丢失部分 mousemove 数据。使用此字段指定需要等待某个behavior队列执行完毕再触发
}
```



## 特定的 behavior：
特定的 behavior 是需要第三方必须注册的事件:

behavior  | 参数 | 说明
------------- | ------------- | -------------
load |  | 课件加载完成事件
setLocation  |obj:{layer:Number,page:Number,scence:Number}  | 控制课件的翻页，参数说明： layer:课件层级，page:进入课件的第几页，scence:进入page页的第几个场景
mediaProgress  | num:Number  | 媒体资源（音、视频）的播放进度事件
mediaPlay  |   | 媒体资源（音、视频）的播放事件
mediaPause  |   | 媒体资源（音、视频）的播放停止事件
mediaStopAll  |   | 暂停所有的媒体资源（音、视频）播放

1.使用  riseObserver.on(key,fn) 注册这些 behavior,例如:
```javascript
riseObserver.on('setPage',function(page){
  // 课件翻页到第 page 页
})
```
## 需要第三方主动发起的调用:
### 1.课件加载完成通知
需要第三方在课件加载完成后，主动发起一次 `load`   通知:
```javascript
// 课件已加载完成
callRiseIframe({
  target: '#course', // 课件选择器
  behavior: 'load', // 表示是课件加载完成通知
  // 必填，参考上方 callRiseIframe的参数格式 说明
  location:{
	 layer:1,
	 page:1,
	 scene:1,
	},
  event: 'load',
  content: {
    totalPage: 10, // 此课件总页数
	currentPage:1, // 当前所处的页数，如果所处的是导航地图页，设置  -1
  },
  interval: false,
  waitOn: []
})
```
### 2.媒体资源的播放、停止事件通知：
当媒体资源进行播放时发起 `mediaPlay`   通知;
当媒体资源停止播放时发起 `mediaPause`   通知;
当媒体资源的播放进度变更时候发起  `mediaProgress`   通知（为了防止频繁通知，暂定3秒发起一次通知）;


## 示例DEMO：
联系瑞思技术人员

## 如何测试？
多屏互动必须在瑞思提供的网址内进行：

同时打开两个浏览器窗口，分别加载以下地址：
[https://h5demo.riselinkedu.com/](https://h5demo.riselinkedu.com/)


默认打开的是瑞思提供的示例DEMO：在其中一个窗口的课件进行操作，另一个窗口的课件会自动同步对应的操作。

你也可以在右上方的输入框输入你的本地网址进行调式