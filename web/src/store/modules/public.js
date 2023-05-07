import Storage from '@/assets/utils/storage.js'
import * as api from '@/assets/api/index.js';

let tagName = 'LABEL-LIST'

let storage = new Storage()

let tagItem = storage.getItem(tagName)

let commonTagList = tagItem ? tagItem : []

export default {
  namespaced: true, //子模块必须添加命名空间
  state: {
    list: [], //常用题的列表
    listShow:false,
    tagList:[], //服务端标签列表
    commonTagList, //自定义标签列表
    tagListShow:false
  },
  mutations: {
    //设置常用标题的数据
    setCommonUse(state, { list, show }) {
      state.list = list
      state.listShow = show
    },
    // 设置标签数据
    addTagList(state, { list, show }) {
      state.tagList = list
      state.tagListShow = show
    },
    //设置常用标签数据
    setCommonTag({ commonTagList }, value) {
      let params = { name: tagName, value }
      storage.setItem(params)
      commonTagList = value;
    },
  },
  actions: {
    // 获取常用题的列表数据
    async getCommonUse(state) {
      let res = await api.commonList({})
      if (res.code === 0) {
        if (res.data.length) {
          res.data.forEach(el=>{
            el.field_item = JSON.parse(el.field_item)
          })
        }
        let item = {
          list:res.data,
          show:true
        }
        state.commit('setCommonUse', item);
        return true;
      }
    },
    // 获取标签列表数据
    async getTagList(state) {
      let res = await api.getTag({})
      if (res.code === 0) {
        let item = {
          list:res.data,
          show:true
        }
        state.commit('addTagList', item);
        return true;
      }
    }
  },
  getters: {}
}
