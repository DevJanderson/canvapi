import { describe, expect, it } from 'vitest'
import { parseSpec } from '../parser'

const PETSTORE_SPEC = {
  openapi: '3.1.0',
  info: {
    title: 'Petstore API',
    version: '1.0.0',
    description: 'A sample pet store API',
    contact: { name: 'Dev', email: 'dev@example.com' },
    license: { name: 'MIT' },
  },
  servers: [
    { url: 'https://api.petstore.com', description: 'Production' },
    { url: 'http://localhost:3000', description: 'Local' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      apiKey: {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-Key',
      },
    },
    schemas: {
      Pet: {
        type: 'object',
        required: ['name'],
        properties: {
          id: { type: 'integer', format: 'int64' },
          name: { type: 'string' },
          status: { type: 'string', enum: ['available', 'pending', 'sold'] },
          owner: { type: 'object', properties: { id: { type: 'integer' } } },
        },
      },
      Error: {
        type: 'object',
        properties: {
          code: { type: 'integer' },
          message: { type: 'string' },
        },
      },
    },
  },
  paths: {
    '/pets': {
      get: {
        tags: ['Pets'],
        summary: 'List all pets',
        operationId: 'listPets',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'limit',
            in: 'query',
            required: false,
            description: 'Max items to return',
            schema: { type: 'integer', default: 25 },
          },
        ],
        responses: {
          '200': {
            description: 'A list of pets',
            content: {
              'application/json': {
                schema: { type: 'array', items: { type: 'object' } },
              },
            },
          },
          '401': { description: 'Unauthorized' },
        },
      },
      post: {
        tags: ['Pets'],
        summary: 'Create a pet',
        operationId: 'createPet',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  status: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Pet created' },
          '400': { description: 'Bad request' },
        },
      },
    },
    '/pets/{petId}': {
      get: {
        tags: ['Pets'],
        summary: 'Get a pet by ID',
        operationId: 'getPet',
        parameters: [
          {
            name: 'petId',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          '200': { description: 'A pet' },
          '404': { description: 'Not found' },
        },
      },
      delete: {
        tags: ['Pets'],
        summary: 'Delete a pet',
        operationId: 'deletePet',
        deprecated: true,
        parameters: [
          {
            name: 'petId',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          '204': { description: 'Deleted' },
        },
      },
    },
    '/health': {
      get: {
        summary: 'Health check',
        responses: {
          '200': { description: 'OK' },
        },
      },
    },
  },
  webhooks: {
    petAdopted: {
      post: {
        summary: 'Pet was adopted',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { type: 'object', properties: { petId: { type: 'integer' } } },
            },
          },
        },
      },
    },
  },
}

describe('parseSpec', () => {
  it('parses a full OpenAPI spec', async () => {
    const result = await parseSpec(PETSTORE_SPEC)
    expect(result).toBeDefined()
    expect(result.info).toBeDefined()
    expect(result.servers).toBeDefined()
    expect(result.auth).toBeDefined()
    expect(result.resources).toBeDefined()
    expect(result.schemas).toBeDefined()
    expect(result.webhooks).toBeDefined()
  })

  describe('info', () => {
    it('extracts API info', async () => {
      const { info } = await parseSpec(PETSTORE_SPEC)
      expect(info.title).toBe('Petstore API')
      expect(info.version).toBe('1.0.0')
      expect(info.description).toBe('A sample pet store API')
      expect(info.openapiVersion).toBe('3.1.0')
      expect(info.contact?.email).toBe('dev@example.com')
      expect(info.license?.name).toBe('MIT')
    })

    it('handles missing info gracefully', async () => {
      const { info } = await parseSpec({ openapi: '3.0.0', info: {}, paths: {} })
      expect(info.title).toBe('Untitled API')
      expect(info.version).toBe('0.0.0')
    })
  })

  describe('servers', () => {
    it('extracts servers', async () => {
      const { servers } = await parseSpec(PETSTORE_SPEC)
      expect(servers).toHaveLength(2)
      expect(servers[0].url).toBe('https://api.petstore.com')
      expect(servers[0].description).toBe('Production')
      expect(servers[1].url).toBe('http://localhost:3000')
    })

    it('provides default server when none specified', async () => {
      const { servers } = await parseSpec({ openapi: '3.0.0', info: {}, paths: {} })
      expect(servers).toHaveLength(1)
      expect(servers[0].url).toBe('/')
    })
  })

  describe('auth', () => {
    it('extracts security schemes', async () => {
      const { auth } = await parseSpec(PETSTORE_SPEC)
      expect(auth).toHaveLength(2)

      const bearer = auth.find((a) => a.name === 'bearerAuth')
      expect(bearer?.type).toBe('http')
      expect(bearer?.scheme).toBe('bearer')
      expect(bearer?.bearerFormat).toBe('JWT')

      const apiKey = auth.find((a) => a.name === 'apiKey')
      expect(apiKey?.type).toBe('apiKey')
      expect(apiKey?.in).toBe('header')
      expect(apiKey?.paramName).toBe('X-API-Key')
    })
  })

  describe('resources', () => {
    it('groups endpoints by tag', async () => {
      const { resources } = await parseSpec(PETSTORE_SPEC)

      const pets = resources.find((r) => r.name === 'Pets')
      expect(pets).toBeDefined()
      expect(pets!.endpoints).toHaveLength(4)
    })

    it('puts untagged endpoints in default', async () => {
      const { resources } = await parseSpec(PETSTORE_SPEC)

      const defaultResource = resources.find((r) => r.name === 'default')
      expect(defaultResource).toBeDefined()
      expect(defaultResource!.endpoints).toHaveLength(1)
      expect(defaultResource!.endpoints[0].path).toBe('/health')
    })

    it('extracts endpoint details', async () => {
      const { resources } = await parseSpec(PETSTORE_SPEC)
      const pets = resources.find((r) => r.name === 'Pets')!
      const listPets = pets.endpoints.find((e) => e.operationId === 'listPets')!

      expect(listPets.method).toBe('get')
      expect(listPets.path).toBe('/pets')
      expect(listPets.summary).toBe('List all pets')
      expect(listPets.security).toContain('bearerAuth')
      expect(listPets.deprecated).toBe(false)
    })

    it('extracts parameters', async () => {
      const { resources } = await parseSpec(PETSTORE_SPEC)
      const pets = resources.find((r) => r.name === 'Pets')!
      const listPets = pets.endpoints.find((e) => e.operationId === 'listPets')!

      expect(listPets.parameters).toHaveLength(1)
      expect(listPets.parameters[0].name).toBe('limit')
      expect(listPets.parameters[0].in).toBe('query')
      expect(listPets.parameters[0].required).toBe(false)
      expect(listPets.parameters[0].schema.default).toBe(25)
    })

    it('extracts request body', async () => {
      const { resources } = await parseSpec(PETSTORE_SPEC)
      const pets = resources.find((r) => r.name === 'Pets')!
      const createPet = pets.endpoints.find((e) => e.operationId === 'createPet')!

      expect(createPet.requestBody).toBeDefined()
      expect(createPet.requestBody!.required).toBe(true)
      expect(createPet.requestBody!.content['application/json']).toBeDefined()
    })

    it('extracts responses', async () => {
      const { resources } = await parseSpec(PETSTORE_SPEC)
      const pets = resources.find((r) => r.name === 'Pets')!
      const listPets = pets.endpoints.find((e) => e.operationId === 'listPets')!

      expect(listPets.responses).toHaveLength(2)
      expect(listPets.responses[0].statusCode).toBe('200')
      expect(listPets.responses[0].description).toBe('A list of pets')
      expect(listPets.responses[1].statusCode).toBe('401')
    })

    it('marks deprecated endpoints', async () => {
      const { resources } = await parseSpec(PETSTORE_SPEC)
      const pets = resources.find((r) => r.name === 'Pets')!
      const deletePet = pets.endpoints.find((e) => e.operationId === 'deletePet')!

      expect(deletePet.deprecated).toBe(true)
    })
  })

  describe('schemas', () => {
    it('extracts component schemas', async () => {
      const { schemas } = await parseSpec(PETSTORE_SPEC)
      expect(schemas).toHaveLength(2)

      const pet = schemas.find((s) => s.name === 'Pet')!
      expect(pet.required).toContain('name')
      expect(pet.properties.id.type).toBe('integer')
      expect(pet.properties.name.type).toBe('string')
      expect(pet.properties.status.enum).toEqual(['available', 'pending', 'sold'])
    })
  })

  describe('webhooks', () => {
    it('extracts webhooks', async () => {
      const { webhooks } = await parseSpec(PETSTORE_SPEC)
      expect(webhooks).toHaveLength(1)
      expect(webhooks[0].name).toBe('petAdopted')
      expect(webhooks[0].method).toBe('post')
      expect(webhooks[0].description).toBe('Pet was adopted')
      expect(webhooks[0].requestBody).toBeDefined()
    })
  })
})
