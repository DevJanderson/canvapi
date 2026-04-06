import type { HttpMethod } from '../types'
import type {
  APIInfo,
  AuthScheme,
  Endpoint,
  Parameter,
  ParsedAPI,
  RequestBody,
  Resource,
  Response,
  Schema,
  SchemaRef,
  Server,
  Webhook,
} from './types'

const HTTP_METHODS: HttpMethod[] = ['get', 'post', 'put', 'delete', 'patch', 'options', 'head']

/* eslint-disable @typescript-eslint/no-explicit-any */

export function transformSpec(spec: any): ParsedAPI {
  return {
    info: extractInfo(spec),
    servers: extractServers(spec),
    auth: extractAuth(spec),
    resources: extractResources(spec),
    schemas: extractSchemas(spec),
    webhooks: extractWebhooks(spec),
  }
}

function extractInfo(spec: any): APIInfo {
  const info = spec.info ?? {}
  return {
    title: info.title ?? 'Untitled API',
    version: info.version ?? '0.0.0',
    description: info.description,
    contact: info.contact,
    license: info.license,
    openapiVersion: spec.openapi ?? spec.swagger ?? 'unknown',
  }
}

function extractServers(spec: any): Server[] {
  if (!spec.servers?.length) {
    return [{ url: '/', description: 'Default' }]
  }
  return spec.servers.map((s: any) => ({
    url: s.url,
    description: s.description,
  }))
}

function extractAuth(spec: any): AuthScheme[] {
  const schemes = spec.components?.securitySchemes
  if (!schemes) return []

  return Object.entries(schemes).map(([name, scheme]: [string, any]) => ({
    name,
    type: scheme.type,
    scheme: scheme.scheme,
    bearerFormat: scheme.bearerFormat,
    in: scheme.in,
    paramName: scheme.name,
  }))
}

function extractResources(spec: any): Resource[] {
  const paths = spec.paths ?? {}
  const endpointsByTag = new Map<string, Endpoint[]>()

  for (const [path, methods] of Object.entries<any>(paths)) {
    for (const method of HTTP_METHODS) {
      const operation = methods[method]
      if (!operation) continue

      const endpoint = buildEndpoint(method, path, operation)
      const tag = endpoint.tags[0] ?? 'default'

      if (!endpointsByTag.has(tag)) {
        endpointsByTag.set(tag, [])
      }
      endpointsByTag.get(tag)!.push(endpoint)
    }
  }

  return Array.from(endpointsByTag.entries()).map(([name, endpoints]) => ({
    name,
    endpoints,
  }))
}

function buildEndpoint(method: HttpMethod, path: string, op: any): Endpoint {
  return {
    method,
    path,
    summary: op.summary,
    description: op.description,
    operationId: op.operationId,
    tags: op.tags ?? [],
    parameters: (op.parameters ?? []).map(buildParameter),
    requestBody: op.requestBody ? buildRequestBody(op.requestBody) : undefined,
    responses: buildResponses(op.responses ?? {}),
    security: extractSecurityNames(op.security),
    deprecated: op.deprecated ?? false,
  }
}

function buildParameter(param: any): Parameter {
  return {
    name: param.name,
    in: param.in,
    required: param.required ?? false,
    description: param.description,
    schema: buildSchemaRef(param.schema ?? {}),
  }
}

function buildRequestBody(body: any): RequestBody {
  const content: Record<string, { schema: SchemaRef; example?: unknown }> = {}

  for (const [mediaType, value] of Object.entries<any>(body.content ?? {})) {
    content[mediaType] = {
      schema: buildSchemaRef(value.schema ?? {}),
      example: value.example,
    }
  }

  return {
    description: body.description,
    required: body.required ?? false,
    content,
  }
}

function buildResponses(responses: any): Response[] {
  return Object.entries<any>(responses).map(([statusCode, res]) => {
    const content: Record<string, { schema: SchemaRef; example?: unknown }> = {}

    for (const [mediaType, value] of Object.entries<any>(res.content ?? {})) {
      content[mediaType] = {
        schema: buildSchemaRef(value.schema ?? {}),
        example: value.example,
      }
    }

    return {
      statusCode,
      description: res.description ?? '',
      content: Object.keys(content).length > 0 ? content : undefined,
    }
  })
}

function buildSchemaRef(schema: any): SchemaRef {
  return {
    type: schema.type,
    format: schema.format,
    items: schema.items ? buildSchemaRef(schema.items) : undefined,
    properties: schema.properties
      ? Object.fromEntries(
          Object.entries<any>(schema.properties).map(([k, v]) => [k, buildSchemaRef(v)]),
        )
      : undefined,
    required: schema.required,
    enum: schema.enum,
    description: schema.description,
    nullable: schema.nullable,
    default: schema.default,
    example: schema.example,
  }
}

function extractSchemas(spec: any): Schema[] {
  const schemas = spec.components?.schemas ?? {}

  return Object.entries<any>(schemas).map(([name, schema]) => {
    const properties: Record<string, SchemaRef> = {}
    const references: string[] = []

    for (const [propName, propSchema] of Object.entries<any>(schema.properties ?? {})) {
      properties[propName] = buildSchemaRef(propSchema)
      collectReferences(propSchema, references)
    }

    return {
      name,
      properties,
      required: schema.required ?? [],
      description: schema.description,
      references,
    }
  })
}

function collectReferences(schema: any, refs: string[]): void {
  if (schema.$ref) {
    const refName = schema.$ref.split('/').pop()
    if (refName && !refs.includes(refName)) {
      refs.push(refName)
    }
  }
  if (schema.items) {
    collectReferences(schema.items, refs)
  }
  if (schema.properties) {
    for (const prop of Object.values<any>(schema.properties)) {
      collectReferences(prop, refs)
    }
  }
}

function extractWebhooks(spec: any): Webhook[] {
  const webhooks = spec.webhooks ?? {}

  return Object.entries<any>(webhooks).flatMap(([name, methods]) =>
    HTTP_METHODS.filter((m) => methods[m]).map((method) => ({
      name,
      method,
      description: methods[method].summary ?? methods[method].description,
      requestBody: methods[method].requestBody
        ? buildRequestBody(methods[method].requestBody)
        : undefined,
    })),
  )
}

function extractSecurityNames(security?: any[]): string[] {
  if (!security) return []
  return security.flatMap((s: any) => Object.keys(s))
}
