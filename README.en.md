# rise-h5-sdk

[中文](README.md)

## General Usage

import `rise-h5-sdk.js` ，then the  “window.riseObserver” object and “window.callRiseIframe”、”window.getRiseUserInfo” functions will be available to use

or
`npm install rise-h5-sdk --save`
```javascript
import { riseObserver, callRiseIframe, getRiseUserInfo } from 'rise-h5-sdk'
```
## Process Diagram
![image](/readme/seq_en.png)
> _ IMPORTANT _：behavior = setScene will be sent instantly without any restriction

#### How to work
1. Send ‘init’ message when the courseware  was loaded
2. SDK will pull the history messages，from which you will get the latest  “behavior = setScene” message for scene syncing
3. SDK will send “ready” message
4. Courseware responds a “ready” message
5. SDK will send history messages to courseware  which will be replayed on the courseware side
6. Events in, events out

## Key Process：
1. register all rendering functions(fn) need to be sync **riseObserver.on(key,fn)** 
2. Using **callRiseIframe(data)** to sync events to other clients
3. Once the client received this event message，**riseObserver.emit(key,data)** will reproduce the same event to happen(function) on local machine 

#### callRiseIframe parameters：
```javascript
// target + behavior’ combination will be used to handle duplication removing
{
    target: '', // required，object selector(eg. id selector）
    behavior: 'key', // required，event name(key) which mapped to the ‘key’ of riseObserver.on(key,fn) 
    page:'', // required，current behavior page
    content: {},   // custom message body(object)
    offline:false, // （false by default）sync to other clients
    interval: 0, // in case this event happens too often，set a reasonable sync frequency（ms）
}
```

#### getRiseUserInfo 
```javascript
// Get current user info
const userInfo = getRiseUserInfo();
return values
{
  isTeacher: false, 
  hasControl: false, // Whether the user was authorized to control the courseware at the current time 
}
```

## Speicial behavior as reserved words：

- init
- ready
- setScene
- mediaPlay
- mediaPause
- mediaProgress
- mediaStopAll
- $setUrl

> _ IMPORTANT _：In order to ensure that there is no conflict in future SDK versions, the third party should also avoid using the behavior beginning with '$'

### SDK initiated behavior：
Third-party registered behavior for SDK later use:

behavior  | content custom parameters| description
------------- | ------------- | -------------
setScene  |  | for scene syncing

behavior register:
```javascript
riseObserver.on('setScene',function(data){
   const key = data.content.key;
  // switch scene mapped to the ‘key’
})
```

### Third party initiated behaviors:

behavior  | content custom parameters| description
------------- | ------------- | -------------
init | | courseware initilized
ready | | courseware ready for sync
mediaPlay  |  | Media playing event
mediaPause  |  | Media paused event
$setUrl  | {url:String}  | set courseware URL （current ）

#### 1.courseware initialization  

‘init’ behavior must be called once the courseware finished loading 
```javascript
callRiseIframe({
  target: '#course',
  behavior: 'init',
  page:'courseware1-lesson1',
  scene:'courseware1-lesson1',
  content: {}
})
```
Once the ‘init’ event received, history events will be started to triggered for progress syncing

#### 2.Media resources：

Media resources playing and pause events must be processed using ‘mediaPlay’ and  ‘mediaPause’ behavior names

## How to test？
To simulate multiple player interaction, open multiple windows of the following URL and login to the classroom：

[https://h5demo.riselinkedu.com/](https://h5demo.riselinkedu.com/)

Input the courseware URL on the top right textarea and click the confirm button, the synchronization will be ready to function after the courseware loaded.
