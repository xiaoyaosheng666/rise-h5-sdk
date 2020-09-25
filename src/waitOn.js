import { jobs } from './bufferJob';
import { postToRise } from './message';

export default (data) => {
  // 只在当前 target 范围上的 behavior 作用
  const actionKeys = data.waitOn.map(key => `${data.target}-${key}`);

  let timeout = 0;
  // 遍历 jobs ，找到匹配的任务执行周期
  for (let value of jobs.values()) {
    if (!value.bufferMap) {
      continue;
    }
    actionKeys.forEach(key => {
      if (value.bufferMap.has(key)) {
        // waitOn 依赖的任务取最大间隔的那个
        timeout = Math.max(value.interval, timeout);
      }
    });
  }
  setTimeout(() => {
    postToRise(data);
  }, timeout + 1);
}