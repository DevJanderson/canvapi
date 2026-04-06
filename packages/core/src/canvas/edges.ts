import type { ParsedAPI } from '../parser/types'
import type { CanvasEdge, CanvasNode } from './types'

export function buildEdges(api: ParsedAPI, nodes: CanvasNode[]): CanvasEdge[] {
  const edges: CanvasEdge[] = []
  const nodeIds = new Set(nodes.map((n) => n.id))

  buildAuthEdges(api, nodeIds, edges)
  buildSchemaReferenceEdges(api, nodeIds, edges)
  buildResourceDependencyEdges(api, nodeIds, edges)

  return edges
}

/** Connect auth node to resources that require authentication */
function buildAuthEdges(
  api: ParsedAPI,
  nodeIds: Set<string>,
  edges: CanvasEdge[],
): void {
  if (!nodeIds.has('auth')) return

  for (const resource of api.resources) {
    const resourceId = `resource-${resource.name}`
    if (!nodeIds.has(resourceId)) continue

    const hasSecuredEndpoint = resource.endpoints.some((ep) => ep.security.length > 0)
    if (hasSecuredEndpoint) {
      edges.push({
        id: `auth-to-${resourceId}`,
        source: 'auth',
        target: resourceId,
        type: 'auth-dependency',
        animated: true,
      })
    }
  }
}

/** Connect schemas that reference other schemas */
function buildSchemaReferenceEdges(
  api: ParsedAPI,
  nodeIds: Set<string>,
  edges: CanvasEdge[],
): void {
  for (const schema of api.schemas) {
    const sourceId = `schema-${schema.name}`
    if (!nodeIds.has(sourceId)) continue

    for (const ref of schema.references) {
      const targetId = `schema-${ref}`
      if (!nodeIds.has(targetId)) continue
      if (sourceId === targetId) continue

      edges.push({
        id: `${sourceId}-to-${targetId}`,
        source: sourceId,
        target: targetId,
        type: 'schema-reference',
        label: ref,
      })
    }
  }
}

/** Connect resources that share schema dependencies */
function buildResourceDependencyEdges(
  api: ParsedAPI,
  nodeIds: Set<string>,
  edges: CanvasEdge[],
): void {
  const resourceSchemas = new Map<string, Set<string>>()

  for (const resource of api.resources) {
    const schemas = new Set<string>()
    for (const endpoint of resource.endpoints) {
      collectEndpointSchemas(endpoint, api, schemas)
    }
    resourceSchemas.set(resource.name, schemas)
  }

  const resourceNames = Array.from(resourceSchemas.keys())
  for (let i = 0; i < resourceNames.length; i++) {
    for (let j = i + 1; j < resourceNames.length; j++) {
      const nameA = resourceNames[i]
      const nameB = resourceNames[j]
      const schemasA = resourceSchemas.get(nameA)!
      const schemasB = resourceSchemas.get(nameB)!

      const shared = [...schemasA].filter((s) => schemasB.has(s))
      if (shared.length === 0) continue

      const sourceId = `resource-${nameA}`
      const targetId = `resource-${nameB}`
      if (!nodeIds.has(sourceId) || !nodeIds.has(targetId)) continue

      edges.push({
        id: `${sourceId}-to-${targetId}`,
        source: sourceId,
        target: targetId,
        type: 'resource-dependency',
        label: shared.join(', '),
      })
    }
  }
}

function collectEndpointSchemas(
  endpoint: ParsedAPI['resources'][number]['endpoints'][number],
  api: ParsedAPI,
  schemas: Set<string>,
): void {
  for (const response of endpoint.responses) {
    if (!response.content) continue
    for (const media of Object.values(response.content)) {
      matchSchemaName(media.schema, api, schemas)
    }
  }

  if (endpoint.requestBody) {
    for (const media of Object.values(endpoint.requestBody.content)) {
      matchSchemaName(media.schema, api, schemas)
    }
  }
}

function matchSchemaName(
  schemaRef: { type?: string; properties?: Record<string, unknown> },
  api: ParsedAPI,
  schemas: Set<string>,
): void {
  if (!schemaRef.properties) return
  const propKeys = Object.keys(schemaRef.properties).sort().join(',')

  for (const schema of api.schemas) {
    const schemaPropKeys = Object.keys(schema.properties).sort().join(',')
    if (propKeys === schemaPropKeys) {
      schemas.add(schema.name)
    }
  }
}
