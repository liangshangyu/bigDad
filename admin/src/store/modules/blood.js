import { getTypeList, getTargetList, search, searchInfo, searchTarget, queryDetials } from '../../api/bloodRe'

const blood = {
  state: {
    typeList: [],
    targetList: [],
    result: [],
    resultInfo: [],
    datasheet: [
      {
        typeName: '',
        sheetTypeValue: ''
      }
    ]
  },
  mutations: {
    SET_TYPELIST: (state, data) => {
      state.typeList = data
    },
    STATE_TARGETLIST: (state, data) => {
      state.targetList = data
    },
    SET_RESULT: (state, data) => {
      state.result = data
    },
    SET_INFO: (state, data) => {
      state.resultInfo = data
    },
    SET_DATASHEET: (state, data) => {
      state.datasheet = data
    }
  },
  actions: {
    getListOfType: ({ commit }) => {
      return new Promise((resolve, reject) => {
        getTypeList({}).then(response => {
          commit('SET_TYPELIST', response)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    /* getListOfTarget: ({ commit }, data) => {
      return new Promise((resolve, reject) => {
        getTargetList(data).then(res => {
          commit('STATE_TARGETLIST', res)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },*/
    doSearch: ({ commit }, data) => {
      return new Promise((resolve, reject) => {
        search(data).then(res => {
          commit('SET_RESULT', res)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    doSearchInfo: ({ commit }, data) => {
      return new Promise((resolve, reject) => {
        searchInfo(data).then(res => {
          commit('SET_INFO', res)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    searchTarget: ({ commit }, data) => {
      return new Promise((resolve, reject) => {
        searchTarget(data).then(res => {
          commit('STATE_TARGETLIST', res)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    queryDataSheet: ({ commit }, data) => {
      return new Promise((resolve, reject) => {
        queryDetials(data).then(res => {
          commit('SET_DATASHEET', res)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}
export default blood
