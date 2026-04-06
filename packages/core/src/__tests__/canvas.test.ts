import { describe, expect, it } from 'vitest'
import type { ParsedAPI } from '../parser/types'
import { buildCanvasGraph } from '../canvas'
import type { AuthNodeData, ResourceNodeData, SchemaNodeData } from '../canvas/types'

const MOCK_API: ParsedAPI = {
  info: {
    title: 'Test API',
    version: '1.0.0',
    openapiVersion: '3.1.0',
  },
  servers: [{ url: 'https://api.test.com' }],
  auth: [
    { name: 'bearerAuth', type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
  ],
  resources: [
    {
      name: 'Users',
      endpoints: [
        {
          method: 'get',
          path: '/users',
          summary: 'List users',
          tags: ['Users'],
          parameters: [],
          responses: [{ statusCode: '200', description: 'OK' }],
          security: ['bearerAuth'],
          deprecated: false,
        },
        {
          method: 'post',
          path: '/users',
          summary: 'Create user',
          tags: ['Users'],
          parameters: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    email: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: [{ statusCode: '201', description: 'Created' }],
          security: ['bearerAuth'],
          deprecated: false,
        },
      ],
    },
    {
      name: 'Products',
      endpoints: [
        {
          method: 'get',
          path: '/products',
          summary: 'List products',
          tags: ['Products'],
          parameters: [],
          responses: [{ statusCode: '200', description: 'OK' }],
          security: [],
          deprecated: false,
        },
      ],
    },
  ],
  schemas: [
    {
      name: 'User',
      required: ['name', 'email'],
      properties: {
        id: { type: 'integer', format: 'int64' },
        name: { type: 'string' },
        email: { type: 'string' },
      },
      references: [],
    },
    {
      name: 'Order',
      required: ['userId'],
      properties: {
        id: { type: 'integer' },
        userId: { type: 'integer' },
      },
      references: ['User'],
    },
  ],
  webhooks: [],
}

describe('buildCanvasGraph', () => {
  it('returns nodes and edges', () => {
    const graph = buildCanvasGraph(MOCK_API)
    expect(graph.nodes).toBeDefined()
    expect(graph.edges).toBeDefined()
    expect(graph.nodes.length).toBeGreaterThan(0)
  })

  describe('nodes', () => {
    it('creates an auth node', () => {
      const graph = buildCanvasGraph(MOCK_API)
      const authNode = graph.nodes.find((n) => n.type === 'auth')
      expect(authNode).toBeDefined()
      expect(authNode!.id).toBe('auth')
      const data = authNode!.data as AuthNodeData
      expect(data.schemes).toHaveLength(1)
      expect(data.schemes[0].name).toBe('bearerAuth')
    })

    it('creates resource nodes', () => {
      const graph = buildCanvasGraph(MOCK_API)
      const resourceNodes = graph.nodes.filter((n) => n.type === 'resource')
      expect(resourceNodes).toHaveLength(2)

      const users = resourceNodes.find((n) => n.id === 'resource-Users')
      expect(users).toBeDefined()
      const data = users!.data as ResourceNodeData
      expect(data.name).toBe('Users')
      expect(data.endpoints).toHaveLength(2)
      expect(data.endpoints[0].method).toBe('get')
      expect(data.endpoints[0].path).toBe('/users')
    })

    it('creates schema nodes', () => {
      const graph = buildCanvasGraph(MOCK_API)
      const schemaNodes = graph.nodes.filter((n) => n.type === 'schema')
      expect(schemaNodes).toHaveLength(2)

      const userSchema = schemaNodes.find((n) => n.id === 'schema-User')
      expect(userSchema).toBeDefined()
      const data = userSchema!.data as SchemaNodeData
      expect(data.name).toBe('User')
      expect(data.properties).toHaveLength(3)
      expect(data.properties.find((p) => p.name === 'name')?.required).toBe(true)
    })

    it('assigns positions to all nodes', () => {
      const graph = buildCanvasGraph(MOCK_API)
      for (const node of graph.nodes) {
        expect(node.position).toBeDefined()
        expect(typeof node.position.x).toBe('number')
        expect(typeof node.position.y).toBe('number')
      }
    })

    it('does not overlap nodes', () => {
      const graph = buildCanvasGraph(MOCK_API)
      const positions = graph.nodes.map((n) => `${n.position.x},${n.position.y}`)
      const uniquePositions = new Set(positions)
      expect(uniquePositions.size).toBe(positions.length)
    })
  })

  describe('edges', () => {
    it('creates auth edges to secured resources', () => {
      const graph = buildCanvasGraph(MOCK_API)
      const authEdges = graph.edges.filter((e) => e.type === 'auth-dependency')
      expect(authEdges).toHaveLength(1)
      expect(authEdges[0].source).toBe('auth')
      expect(authEdges[0].target).toBe('resource-Users')
      expect(authEdges[0].animated).toBe(true)
    })

    it('does not create auth edge to unsecured resources', () => {
      const graph = buildCanvasGraph(MOCK_API)
      const authToProducts = graph.edges.find(
        (e) => e.type === 'auth-dependency' && e.target === 'resource-Products',
      )
      expect(authToProducts).toBeUndefined()
    })

    it('creates schema reference edges', () => {
      const graph = buildCanvasGraph(MOCK_API)
      const schemaEdges = graph.edges.filter((e) => e.type === 'schema-reference')
      expect(schemaEdges).toHaveLength(1)
      expect(schemaEdges[0].source).toBe('schema-Order')
      expect(schemaEdges[0].target).toBe('schema-User')
      expect(schemaEdges[0].label).toBe('User')
    })
  })

  describe('edge cases', () => {
    it('handles API with no auth', () => {
      const noAuth: ParsedAPI = { ...MOCK_API, auth: [] }
      const graph = buildCanvasGraph(noAuth)
      const authNode = graph.nodes.find((n) => n.type === 'auth')
      expect(authNode).toBeUndefined()
      const authEdges = graph.edges.filter((e) => e.type === 'auth-dependency')
      expect(authEdges).toHaveLength(0)
    })

    it('handles API with no schemas', () => {
      const noSchemas: ParsedAPI = { ...MOCK_API, schemas: [] }
      const graph = buildCanvasGraph(noSchemas)
      const schemaNodes = graph.nodes.filter((n) => n.type === 'schema')
      expect(schemaNodes).toHaveLength(0)
    })

    it('handles empty API', () => {
      const empty: ParsedAPI = {
        info: { title: 'Empty', version: '0.0.0', openapiVersion: '3.0.0' },
        servers: [],
        auth: [],
        resources: [],
        schemas: [],
        webhooks: [],
      }
      const graph = buildCanvasGraph(empty)
      expect(graph.nodes).toHaveLength(0)
      expect(graph.edges).toHaveLength(0)
    })
  })
})
