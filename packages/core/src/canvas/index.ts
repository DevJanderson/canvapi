import type { ParsedAPI } from '../parser/types'
import { buildEdges } from './edges'
import { applyAutoLayout } from './layout'
import { buildNodes } from './nodes'
import type { CanvasGraph } from './types'

export type {
  CanvasEdge,
  CanvasEdgeType,
  CanvasGraph,
  CanvasNode,
  CanvasNodeType,
  AuthNodeData,
  ResourceNodeData,
  SchemaNodeData,
  EndpointSummary,
  SchemaProperty,
  Position,
} from './types'

/**
 * Transform a parsed API into a canvas graph (nodes + edges)
 * with auto-layout positioning.
 */
export function buildCanvasGraph(api: ParsedAPI): CanvasGraph {
  const nodes = buildNodes(api)
  const edges = buildEdges(api, nodes)
  applyAutoLayout(nodes)

  return { nodes, edges }
}
