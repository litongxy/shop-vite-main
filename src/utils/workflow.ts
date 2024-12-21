export function transformToGraphFormat(parsedData) {
  const nodes :any[] = []
  const edges :any[] = []

  // 映射节点
  parsedData.nodes.forEach((node) => {
    const position = { x: 260 * (nodes.length + 1) , y: 100 }
    if (node.position) {
      position.x = node.position.x
      position.y = node.position.y
    }
    nodes.push({
      id: node.name,
      type: 'node',
      position,
      data: node
    })
  })

  // 映射连接关系
  if (parsedData.connections) {
    Object.keys(parsedData.connections).forEach((sourceName) => {
      parsedData.connections[sourceName].forEach((targets) => {
        targets.forEach((target) => {
          edges.push({
            id: `e${sourceName}-${target.node}`,
            source: sourceName,
            target: target.node,
            //animated: true
          })
        })
      })
    })
  }

  return { nodes, edges }
}


export  function getWorkflowSaveData(originWrokflowData, newNodes ,newEdges) {
  const nodes = []

  for (let i = 0; i < newNodes.length; i++) {
    const node = newNodes[i]
    nodes.push({
      ...node.data,
      position: node.position,
    })
  }

  const edges = newEdges
  const connections = {}

  edges.forEach((edge) => {
    const { source, target } = edge;

    // 如果 connections 中没有对应的 source 节点，创建对应的空数组
    if (!connections[source]) {
      connections[source] = [[]];
    }

    // 查找此 source 对应的 target 数组
    const targetGroup = connections[source][0];

    // 如果目标节点已存在，不重复添加
    if (!targetGroup.some((targetObj) => targetObj.node === target)) {
      targetGroup.push({ node: target });
    }
  })


  originWrokflowData.nodes = nodes
  originWrokflowData.edges = edges
  originWrokflowData.connections = connections
  console.log('originWrokflowData ', originWrokflowData)
  return originWrokflowData
}
