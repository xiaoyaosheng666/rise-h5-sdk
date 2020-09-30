
const state = {
  // 从直播教室获取的数据
  user: null
}
// 追踪设置
export const mutations = {
  setUser(data) {
    state.user = data;
  }
}

export default state;