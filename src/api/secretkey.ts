import request from '/@/utils/request_xyt.ts'
export const saveSecrets = (data?: any) => {
  return request({
    url: '/secrets',
    method: 'post',
    data,
  })
}
export const updataSecrets = (id: number, data?: any) => {
  return request({
    url: `/secrets/${id}`,
    method: 'put',
    data,
  })
}
export const ListSecrets = (params?: any) => {
  return request({
    url: '/secrets',
    method: 'get',
    params,
  })
}
export const deleteSecrets = (id?: any) => {
  return request({
    url: `/secrets/${id}`,
    method: 'delete',
  })
}
export const getSecretsDetail = (id?: any) => {
  return request({
    url: `/secrets/${id}`,
    method: 'get',
  })
}

export const secretstemplates = (params?: any) => {
  return request({
    url: '/secrets/templates',
    method: 'get',
    params,
  })
}
export const secret_tpls = (params?: any) => {
  return request({
    // http://flow.dev.mallzone.cn/api/v1/secret_tpls
    url: '/secret_tpls',
    method: 'get',
    params,
  })
}
