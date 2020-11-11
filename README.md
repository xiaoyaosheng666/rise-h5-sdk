# rise 课件对接说明

引入 `rise-h5-sdk.js` ，即可使用 window.riseObserver 对象和 window.callRiseIframe、window.getRiseUserInfo 函数

或者使用:   `npm install rise-h5-sdk --save`
```javascript
import { riseObserver, callRiseIframe, getRiseUserInfo } from 'rise-h5-sdk'
```
## 流程图
![image](/readme/seq.png)
> 注：behavior = setScene 的消息 SDK 不会做限制，即时发送。

#### 流程说明
1. 课件加载后发送 init 消息
2. SDK 会拉取历史消息，从历史消息中取最近的一次 behavior = setScene 的消息推给课件，没有则不推送
3. SDK 发送 ready 消息
4. 课件收到 SDK ready 后，回发一个 ready
5. SDK收到课件的 ready 后，会依次推送去重后的历史消息给课件。（如果有第2步的 setScene 则这里会过滤只推送 setScene 时间点后的消息）
6. 进入正常的收发消息阶段

## 同屏关键操作：
1. 通过 **riseObserver.on(key,fn)** 注册所有需要同步的渲染相关函数（**fn是纯粹的渲染行为函数**）
2. 本地触发事件时，通过调用 **callRiseIframe(data)** 函数即可发送到其他用户端
3. 其他端收到同步消息后，SDK 会调用 **riseObserver.emit(key,data)** 触发之前注册的自定义事件进行渲染

#### callRiseIframe的参数格式：
```javascript
// 注意：历史操作同步过程中会根据  target + behavior 进行去重处理，所以这两个参数定义时请尽量描述准确当前的行为
{
    target: '目标对象', // 必填，目标对象选择器，推荐使用 id选择器，你可以根据这个 target 识别是哪个元素
    behavior: 'key', // 必填，在  riseObserver.on(key,fn) 中注册的自定义事件名称 key
	// page 和 scene 大部分时候是一样的。一般当一个页面有多个场景时会不一致，scene 比 page 颗粒度更细
    page:'页码标识', // 必填，当前 behavior 发生时所处的页码（全课件下页码唯一）。 rise 需要这个字段来对应白板的页码
    scene:'场景标识', // 必填，当前 behavior 发生时所处的 场景，你可以根据 scene 识别是哪个场景
    content: {},   // 自定义参数内容，你可以随意定义你需要的参数， content 本身必须是个对象
    offline:false, // 表示此消息是否不需要通过 信道 发送给其他用户。默认 false，会同步给其他用户
    interval: 0, // 像鼠标移动这类事件触发太频繁，需要控制频率，否则通信过于频繁会丢失数据。SDK 内置了实现，只需要指定 interval = 毫秒数 即可
    timeout:0, // 延迟执行，毫秒。当前行为需要执行的时间，下一个行为会保持和这个行为的执行间隔
    waitOn: [] // 例如 mousemove 事件的队列还没发送完毕，此时执行 mouseup 相关渲染可能会丢失部分 mousemove 数据。使用此字段指定需要等待某个behavior队列执行完毕再触发。在 interval 有值时才有效
}
```
#### getRiseUserInfo 函数
```javascript
// 获取当前用户信息
const userInfo = getRiseUserInfo();
// 返回值
{
  isTeacher: false, // 是否是老师
  hasControl: false, // 当前用户是否对课件有控制权。注意：此字段会动态变化，所以课件方使用时，需实时调用 getRiseUserInfo() 函数获取
}
```

## 特定的 behavior：

这些 behavior 是 SDK 中留做特殊用途的声明,其他渲染函数定义请避开下列保留词：

- init
- ready
- setScene
- mediaPlay
- mediaPause
- mediaProgress
- mediaStopAll
- $setUrl

> 注：另外为了保证日后 SDK 扩展不冲突，第三方也避免使用 $ 开头的 behavior

### SDK会主动发起的调用：
需要第三方提前注册好相应的 behavior 事件，供 SDK 后续调用:

behavior  | content自定义参数 | 说明
------------- | ------------- | -------------
setScene  |  | 控制切换到指定场景，一般在同步最新进度时 SDK 会主动将历史消息中最近的一次 behavior = setScene  的发给课件
mediaStopAll  |   | 暂停所有的媒体资源（音、视频）播放

使用  riseObserver.on(key,fn) 注册这些 behavior,例如:
```javascript
riseObserver.on('setScene',function(data){
   const key = data.content.key;
  // 课件切换到 key 对应的场景
})

riseObserver.on('mediaStopAll',function(data){
  // 暂停所有的音视频播放
})
```

### 需要第三方主动发起的调用:

behavior  | 参数（放在 content 上） | 说明
------------- | ------------- | -------------
init | | 课件初始化事件，课件同步的操作会在 SDK 收到 init 通知后进行。参考流程图
ready | | 课件已准备就绪，可以进入正常的收发通信过程。参考流程图
mediaPlay  |  | 音、视频的播放通知
mediaPause  |  | 音、视频的停止播放通知
setScene  |  | 课件切换场景（包含翻页）后，应主动发起一次 behavior = setScene 消息，标记当前课件的最新场景。这样后进入教室的用户可以快速定位到当前场景
$setUrl  | {url:String}  | 改变课件所属 iframe 的 src 地址。一般用于切换到另一个课件（会清空已保存的历史进度）

#### 1.课件初始化完成通知
需要第三方在课件加载完成后，主动发起一次 `init`   通知:
```javascript
// 课件已加载完成，参数含义参考上方 callRiseIframe 的参数说明
callRiseIframe({
  target: '#course', // 课件选择器
  behavior: 'init', // 表示是课件初始化完成
  page:'courseware1-lesson1',
  scene:'courseware1-lesson1',
  content: {}
})
```
SDK 收到 init 通知后，会推送 历史数据（如果有） 进行同步进度。过程简述如下：

1. 拉取去重后的历史记录
2. 找到最近的一个 setScene 并调用
3. 将最近的一个 setScene 之后的消息依次推送给课件

#### 2.音、视频的播放、停止事件通知：
当音、视频进行播放时发起 `mediaPlay`   通知;  
当音、视频停止播放时发起 `mediaPause`   通知;  

注：媒体资源 rise 会在直播教室做特殊处理，所以需要按照上述约定的命名 behavior，在限定了 behavior 命名的情况下，第三方可根据 target 自行识别元素目标


## 示例DEMO：
联系 RISE 提供。

## 如何测试？
多屏互动必须在瑞思提供的网址内进行，同时打开两个浏览器窗口，分别加载以下地址：

[https://h5demo.riselinkedu.com/](https://h5demo.riselinkedu.com/)

使用瑞思提供的账号登录后进入直播间

在右上方的输入框输入课件地址，点击 confirm：在其中一个窗口的课件进行操作，另一个窗口的课件会自动同步对应的操作。

你也可以在右上方的输入框输入你的本地网址进行调式