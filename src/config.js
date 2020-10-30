export default {
  // 定时任务默认时间间隔 100 毫秒
  interval: 100,
  // 特殊的 behavior
  behaviors: {
    // sdk init，直播教室会通过此行为传递用户数据
    sdkInit: '$sdk_init',
    // rise 同步历史
    history: '$rise_history',
    // 课件的 load
    load: 'init',
    ready: 'ready',
    // 场景切换
    setScene: 'setScene',
    // 媒体相关
    mouseTrack: '$cw_mouseTrack',
  }
}