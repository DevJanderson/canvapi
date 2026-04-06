import yaml from 'js-yaml'
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
 * Parse an OpenAPI spec from a URL, string, or object.
 * Supports JSON and YAML. Resolves all local $ref pointers.
 */
export async function parseSpec(source: string | object): Promise<ParsedAPI> {
  let spec: object

  if (typeof source === 'object') {
    spec = source
  } else if (source.trimStart().startsWith('{')) {
    spec = JSON.parse(source)
  } else if (source.startsWith('http://') || source.startsWith('https://') || source.startsWith('/')) {
    spec = await fetchSpec(source)
  } else {
    spec = parseYamlOrJson(source)
  }

  const dereferenced = dereferenceSpec(spec)
  return transformSpec(dereferenced)
}

async function fetchSpec(url: string): Promise<object> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch spec from ${url}: ${response.status}`)
  }

  const text = await response.text()
  return parseYamlOrJson(text)
}

function parseYamlOrJson(text: string): object {
  const trimmed = text.trimStart()

  if (trimmed.startsWith('{')) {
    return JSON.parse(text)
  }

  const parsed = yaml.load(text)
  if (typeof parsed !== 'object' || parsed === null) {
    throw new Error('Invalid spec: expected an object')
  }
  return parsed as object
}
