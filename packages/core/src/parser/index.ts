import $RefParser from '@apidevtools/json-schema-ref-parser'
import type { ParsedAPI } from './types'
import { transformSpec } from './transform'

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
 * Parse an OpenAPI spec from a URL, file path, or object.
 * Resolves all $ref pointers and transforms into Canvapi's internal format.
 */
export async function parseSpec(source: string | object): Promise<ParsedAPI> {
  const dereferenced = await $RefParser.dereference(source as string)
  return transformSpec(dereferenced)
}
