/**
 * Created by 17073565 on 2018/5/14.
 */
require('./style.less')
import {map} from 'lodash-es'
import {square} from './lib/math'
const {log} = require('./utils')

log('hello world')
log(map([1,2,3], square))

if( module.hot) {
    module.hot.accept(['./utils','./lib/math'], () => {
        alert(square(4))
    })
}