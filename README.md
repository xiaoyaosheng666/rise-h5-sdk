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
	page:1, // 必填，当前 behavior 发生时所处的课件页码
	scene:1, // 必填，当前 behavior 发生时所处的是该页内第几个场景
    event: 'click', // 事件类型
    content: {},   // 自定义参数内容
    interval: false, // 像鼠标移动这类事件触发太频繁，需要控制频率，否则通信过于频繁会丢失数据。SDK 内置了实现，只需要指定 interval = true 即可
    waitOn: [] // 例如 mousemove 事件的队列还没发送完毕，此时执行 mouseup 相关渲染可能会丢失部分 mousemove 数据。使用此字段指定需要等待某个behavior队列执行完毕再触发
}
```



## 特定的 behavior：
特定的 behavior 是需要第三方在全局注册的事件:

behavior  | 参数 | 说明
------------- | ------------- | -------------
load |  | 课件加载完成事件
setPage  |page:Number  | 控制课件的翻页
setScene  | num:Number  | 控制课件的场景切换，例如课件某个页面中有多个场景的情况
mediaProgress  | num:Number  | 媒体资源（音、视频）的播放进度事件


#### 示例DEMO：
联系瑞思技术人员

### 如何测试？
多屏互动必须在瑞思提供的网址内进行：

同时打开两个浏览器窗口，分别加载以下两个地址：

[https://dev.web.riselinkedu.com/test/test_teacher_2/test_teacher_2/Nathan](https://dev.web.riselinkedu.com/test/test_teacher_2/test_teacher_2/Nathan)

[https://dev.web.riselinkedu.com/test/develop_auto_12/f1d78d92c23954fd1c4d159fb65f19d2/george](https://dev.web.riselinkedu.com/test/develop_auto_12/f1d78d92c23954fd1c4d159fb65f19d2/george)

默认打开的是瑞思提供的示例DEMO：在其中一个窗口的课件进行操作，另一个窗口的课件会自动同步对应的操作。

你也可以在左上方的输入框输入你的本地网址进行调式