import type { CanvasNode } from './types'

const NODE_WIDTH = 220
const NODE_HEIGHT_BASE = 120
const ENDPOINT_HEIGHT = 28
const GAP_X = 280
const GAP_Y = 80

/**
 * Auto-layout nodes in a left-to-right flow:
 * Auth → Resources → Schemas
 *
 * Resources are laid out in a grid. Schemas in a row below.
 * Mutates node positions in place.
 */
export function applyAutoLayout(nodes: CanvasNode[]): void {
  const authNodes = nodes.filter((n) => n.type === 'auth')
  const resourceNodes = nodes.filter((n) => n.type === 'resource')
  const schemaNodes = nodes.filter((n) => n.type === 'schema')

  let offsetX = 0

  // Auth column
  if (authNodes.length > 0) {
    const totalHeight = getTotalHeight(authNodes)
    let y = -(totalHeight / 2)
    for (const node of authNodes) {
      node.position = { x: offsetX, y }
      y += getNodeHeight(node) + GAP_Y
    }
    offsetX += NODE_WIDTH + GAP_X
  }

  // Resources grid (max 3 columns)
  const maxCols = Math.min(3, resourceNodes.length)
  const rows = Math.ceil(resourceNodes.length / maxCols)
  const gridStartX = offsetX

  for (let i = 0; i < resourceNodes.length; i++) {
    const col = i % maxCols
    const row = Math.floor(i / maxCols)
    const x = gridStartX + col * (NODE_WIDTH + GAP_X)
    const y = row * (getMaxRowHeight(resourceNodes, row, maxCols) + GAP_Y)
    resourceNodes[i].position = { x, y }
  }

  // Schemas row below resources
  const resourceBottomY = rows * (getMaxColumnHeight(resourceNodes, maxCols) + GAP_Y)
  const schemaStartX = gridStartX

  for (let i = 0; i < schemaNodes.length; i++) {
    schemaNodes[i].position = {
      x: schemaStartX + i * (NODE_WIDTH + GAP_X / 2),
      y: resourceBottomY,
    }
  }
}

function getNodeHeight(node: CanvasNode): number {
  if (node.data.nodeType === 'resource') {
    return NODE_HEIGHT_BASE + node.data.endpoints.length * ENDPOINT_HEIGHT
  }
  if (node.data.nodeType === 'schema') {
    return NODE_HEIGHT_BASE + node.data.properties.length * ENDPOINT_HEIGHT
  }
  return NODE_HEIGHT_BASE
}

function getTotalHeight(nodes: CanvasNode[]): number {
  return nodes.reduce((sum, n) => sum + getNodeHeight(n) + GAP_Y, -GAP_Y)
}

function getMaxRowHeight(
  nodes: CanvasNode[],
  row: number,
  cols: number,
): number {
  let max = 0
  for (let col = 0; col < cols; col++) {
    const idx = row * cols + col
    if (idx < nodes.length) {
      max = Math.max(max, getNodeHeight(nodes[idx]))
    }
  }
  return max
}

function getMaxColumnHeight(nodes: CanvasNode[], cols: number): number {
  let max = 0
  const rows = Math.ceil(nodes.length / cols)
  for (let row = 0; row < rows; row++) {
    max = Math.max(max, getMaxRowHeight(nodes, row, cols))
  }
  return max
}
