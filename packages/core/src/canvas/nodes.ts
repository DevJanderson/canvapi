import type { ParsedAPI } from '../parser/types'
import type {
  AuthNodeData,
  CanvasNode,
  ResourceNodeData,
  SchemaNodeData,
  SchemaProperty,
} from './types'

export function buildNodes(api: ParsedAPI): CanvasNode[] {
  const nodes: CanvasNode[] = []

  if (api.auth.length > 0) {
    nodes.push(buildAuthNode(api))
  }

  for (const resource of api.resources) {
    nodes.push(buildResourceNode(resource.name, resource))
  }

  for (const schema of api.schemas) {
    nodes.push(buildSchemaNode(schema))
  }

  return nodes
}

function buildAuthNode(api: ParsedAPI): CanvasNode {
  const data: AuthNodeData = {
    nodeType: 'auth',
    schemes: api.auth,
  }

  return {
    id: 'auth',
    type: 'auth',
    position: { x: 0, y: 0 },
    data,
  }
}

function buildResourceNode(
  name: string,
  resource: ParsedAPI['resources'][number],
): CanvasNode {
  const data: ResourceNodeData = {
    nodeType: 'resource',
    name,
    description: resource.description,
    endpoints: resource.endpoints.map((ep) => ({
      method: ep.method,
      path: ep.path,
      summary: ep.summary,
      deprecated: ep.deprecated,
      operationId: ep.operationId,
    })),
  }

  return {
    id: `resource-${name}`,
    type: 'resource',
    position: { x: 0, y: 0 },
    data,
  }
}

function buildSchemaNode(schema: ParsedAPI['schemas'][number]): CanvasNode {
  const properties: SchemaProperty[] = Object.entries(schema.properties).map(
    ([name, prop]) => ({
      name,
      type: formatType(prop.type, prop.format, prop.items),
      required: schema.required.includes(name),
      format: prop.format,
      enum: prop.enum,
    }),
  )

  const data: SchemaNodeData = {
    nodeType: 'schema',
    name: schema.name,
    properties,
    description: schema.description,
  }

  return {
    id: `schema-${schema.name}`,
    type: 'schema',
    position: { x: 0, y: 0 },
    data,
  }
}

function formatType(
  type?: string,
  format?: string,
  items?: { type?: string },
): string {
  if (!type) return 'unknown'
  if (type === 'array' && items?.type) return `${items.type}[]`
  if (format) return `${type}(${format})`
  return type
}
