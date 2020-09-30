export default {
  // 定时任务默认时间间隔 100 毫秒
  interval: 100,
  // 特殊的 behavior
  behaviors: {
    // rise 同步历史
    history: '$rise_history',
    // 课件的 load
    load: 'init',
    ready: 'ready',
    // 场景切换
    setScene: 'setScene',
    // 媒体相关
    mediaProgress:'mediaProgress'
  }
}