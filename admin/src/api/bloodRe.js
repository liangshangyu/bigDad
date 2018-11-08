const env = process.env.NODE_ENV
const baseUrl = env === 'development' ? 'api/' : ''
import { post } from '@/utils/http'
export const getTypeList = (p) => post(baseUrl + 'lineage-query/lineage/allquerytypes', p)

export const getTargetList = (param) => post(baseUrl + 'lineage-query/lineage/allvertices', param)

export const search = (param) => post(baseUrl + 'lineage-query/lineage/common/query', param)

export const searchInfo = (param) => post(baseUrl + 'lineage-query/lineage/vertexdependencyinfo', param)

export const searchTarget = (param) => post(baseUrl + 'lineage-query/lineage/vertices', param)

export const queryDetials = (param) => post(baseUrl + 'lineage-query/lineage/hivetable/details', param)

