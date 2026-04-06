import type { HttpMethod } from '../types'
import type { AuthScheme } from '../parser/types'

/** Node types rendered on the canvas */
export type CanvasNodeType = 'auth' | 'resource' | 'schema'

/** Base node position */
export interface Position {
  x: number
  y: number
}

/** A node on the canvas */
export interface CanvasNode {
  id: string
  type: CanvasNodeType
  position: Position
  data: AuthNodeData | ResourceNodeData | SchemaNodeData
}

/** Auth node data */
export interface AuthNodeData {
  nodeType: 'auth'
  schemes: AuthScheme[]
}

/** Resource node (group of endpoints) */
export interface ResourceNodeData {
  nodeType: 'resource'
  name: string
  description?: string
  endpoints: EndpointSummary[]
}

/** Compact endpoint info for display inside a resource node */
export interface EndpointSummary {
  method: HttpMethod
  path: string
  summary?: string
  deprecated: boolean
  operationId?: string
}

/** Schema node data */
export interface SchemaNodeData {
  nodeType: 'schema'
  name: string
  properties: SchemaProperty[]
  description?: string
}

export interface SchemaProperty {
  name: string
  type: string
  required: boolean
  format?: string
  enum?: unknown[]
}

/** Edge types on the canvas */
export type CanvasEdgeType = 'auth-dependency' | 'resource-dependency' | 'schema-reference'

/** An edge connecting two nodes */
export interface CanvasEdge {
  id: string
  source: string
  target: string
  type: CanvasEdgeType
  label?: string
  animated?: boolean
}

/** Full canvas graph */
export interface CanvasGraph {
  nodes: CanvasNode[]
  edges: CanvasEdge[]
}
