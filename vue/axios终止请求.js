import axios from 'axios'
export function getData(params) {
    return http({
        url: '',
        method: 'post',
        params:params,
        cancelToken: new axios.CancelToken((c) =>{
            this.source = c
        })
    })
}

/*
*   methods: {
*       cancelQuery() {
*           if (typeof this.source == 'function) {
*               this.source('终止请求')
*           }
*       },
*       getTableData() {
*           this.cancelQuery()
*           getData(param).then(res => {
*
*           })
*       }
*   }
* */