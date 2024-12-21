import request from '/@/utils/request_xyt.ts'
import yaml from "js-yaml";

export function getList(params?: any) {
  return request({
    url: '/workflow/getList',
    method: 'get',
    params,
  })
}

export const doEdit = (data: any) => {
  return request({
    url: '/workflow/doEdit',
    method: 'post',
    data,
  })
}

// 获取工作流列表
export const getWorklflowList = (params : any) => {
  return request({
    url: `/workflow/workflowList`,
    method: 'get',
    params
  })
}

export const getWorkflow = (workflowName: any) => {
  return request({
    url: `/workflow/${ workflowName}`,
    method: 'get',
  })
}


// 获取工作流节点列表
export const getWorkflowNodes = () => {
  return request({
    url: `/workflow/node_tpls`,
    method: 'get',
  })
}

// 获取凭证列表
export const getCredentials = (credentialType :string ) => {
  return request({
    url: `/credentials/`,
    method: 'get',
    params: {
      credentialType
    }
  })
}

// 创建工作流
export const createWorklflow = (workflowName: any, data :any) => {
  return request({
    url: `/workflow/${ workflowName}`,
    method: 'post',
    data
  })
}

// 更新工作流
export const updateWorklflow = (workflowName: string, data :any) => {
  return request({
    url: `/workflow/${ workflowName}`,
    method: 'put',
    data
  })
}

// 删除工作流
export const deleteWorklflow = (workflowName: any) => {
  return request({
    url: `/workflow/${ workflowName}`,
    method: 'delete',
  })
}


export const getInitWorkflow = () => {
  // 原始 YAML 字符串
  const yamlText = `
nodes:
  - name: Webhook
    type: webhook
    credentials:
      frp:
        serverAddr: 'frp.lo.mytool.zone'
        serverPort: 2023
        token: '20230326mytoolzone!'
        customDomains:
          - 'node.lo.mytool.zone'
        localIP: "127.0.0.1"
        proxyName: 'ipInfo'
    parameters:
      sync_response: true
      httpMethod: GET
      path: ipInfo
      port: 8081
      exportQuery:
        desc: desc
    global:
      desc: "={{ $last.desc }}"
  - name: getIPInfo
    type: ipInfo

global:
  gitUrl: "git.test.com"
connections:
  Webhook:
    - - node: getIPInfo
`

  try {
    // 解析 YAML 字符串为 JavaScript 对象
    const parsedData = yaml.load(yamlText)
    const id = Math.random()*100000
    parsedData.name = `workflow_${id}`
    return Promise.resolve({ data: parsedData })
  } catch (error) {
    return Promise.reject(error);
  }
}

