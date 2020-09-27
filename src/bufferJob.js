import { postToRise } from './message';
import { getActionKey, getJobKey } from './util';

export const jobs = new Map();
/**
 * 定时任务创建工厂，按照时间间隔为 key 为维度创建定时任务。如果已存在对应的时间间隔任务，则直接加入该任务的队列中（bufferMap）
 */
class BufferJob {
  // Number,定时任务执行间隔，默认取 config 配置的，如果传递了数值 interval，则是 interval 毫秒间隔
  interval = null;
  // Map,缓冲数据，定时发送。间隔期内新数据会替换掉未发送的数据
  bufferMap = null;
  // Number,定时任务,setInterval 返回值
  timer = null;
  // data 是 SDK消息传输的格式
  constructor(data) {
    const jobKey = getJobKey(data);
    if (jobKey < 0) {
      throw new Error('interval 设置错误，无法创建定时任务');
    }
    // 属性 interval
    this.interval = jobKey;
    // 渲染 key
    const actionKey = getActionKey(data);
    if (jobs.has(jobKey)) {
      const job = jobs.get(jobKey);
      // 添加或覆盖子任务
      job.bufferMap.set(actionKey, data);
      return job;
    } else {
      // 属性 bufferMap
      this.bufferMap = new Map();
      this.bufferMap.set(actionKey, data);
      // 属性 timer
      this.timer = setInterval(() => {
        const bufferMap = this.bufferMap;
        if (bufferMap.size > 0) {
          bufferMap.forEach((value, key) => {
            postToRise(value);
            bufferMap.delete(key);
          });
        } else {
          clearInterval(this.timer);
          jobs.delete(jobKey);
        }
      }, this.interval);
      jobs.set(jobKey, this);
      return this;
    }
  }
}

export default BufferJob;
