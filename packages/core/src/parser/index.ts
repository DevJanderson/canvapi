import type { ParsedAPI } from './types'
import { transformSpec } from './transform'
import { dereferenceSpec } from './deref'

export type { ParsedAPI } from './types'
export type {
  APIInfo,
  AuthScheme,
  Endpoint,
  Parameter,
  RequestBody,
  Resource,
  Response,
  Schema,
  SchemaRef,
  Server,
  Webhook,
} from './types'

/**
 * Parse an OpenAPI spec from a URL or object.
 * Resolves all $ref pointers and transforms into Canvapi's internal format.
 * Uses a lightweight browser-safe resolver for local $ref pointers.
 */
export async function parseSpec(source: string | object): Promise<ParsedAPI> {
  let spec: object

  if (typeof source === 'string') {
    const response = await fetch(source)
    if (!response.ok) {
      throw new Error(`Failed to fetch spec from ${source}: ${response.status}`)
    }
    spec = await response.json()
  } else {
    spec = source
  }

  const dereferenced = dereferenceSpec(spec)
  return transformSpec(dereferenced)
}
