import type { HttpMethod } from '../types'

/** Fully parsed and structured API representation */
export interface ParsedAPI {
  info: APIInfo
  servers: Server[]
  auth: AuthScheme[]
  resources: Resource[]
  schemas: Schema[]
  webhooks: Webhook[]
}

export interface APIInfo {
  title: string
  version: string
  description?: string
  contact?: {
    name?: string
    email?: string
    url?: string
  }
  license?: {
    name: string
    url?: string
  }
  openapiVersion: string
}

export interface Server {
  url: string
  description?: string
}

export interface AuthScheme {
  name: string
  type: 'apiKey' | 'http' | 'oauth2' | 'openIdConnect'
  scheme?: string
  bearerFormat?: string
  in?: 'header' | 'query' | 'cookie'
  paramName?: string
}

export interface Resource {
  name: string
  description?: string
  endpoints: Endpoint[]
}

export interface Endpoint {
  method: HttpMethod
  path: string
  summary?: string
  description?: string
  operationId?: string
  tags: string[]
  parameters: Parameter[]
  requestBody?: RequestBody
  responses: Response[]
  security: string[]
  deprecated: boolean
}

export interface Parameter {
  name: string
  in: 'query' | 'path' | 'header' | 'cookie'
  required: boolean
  description?: string
  schema: SchemaRef
}

export interface RequestBody {
  description?: string
  required: boolean
  content: Record<string, MediaType>
}

export interface MediaType {
  schema: SchemaRef
  example?: unknown
}

export interface Response {
  statusCode: string
  description: string
  content?: Record<string, MediaType>
}

export interface SchemaRef {
  type?: string
  format?: string
  items?: SchemaRef
  properties?: Record<string, SchemaRef>
  required?: string[]
  enum?: unknown[]
  ref?: string
  description?: string
  nullable?: boolean
  default?: unknown
  example?: unknown
}

export interface Schema {
  name: string
  properties: Record<string, SchemaRef>
  required: string[]
  description?: string
  references: string[]
}

export interface Webhook {
  name: string
  method: HttpMethod
  description?: string
  requestBody?: RequestBody
}
