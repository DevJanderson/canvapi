/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Lightweight browser-safe $ref resolver.
 * Resolves all internal $ref pointers in an OpenAPI spec object.
 * Only handles local references (#/components/schemas/Foo etc.)
 */
export function dereferenceSpec(spec: any): any {
  return resolveRefs(structuredClone(spec), spec)
}

function resolveRefs(obj: any, root: any): any {
  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => resolveRefs(item, root))
  }

  if ('$ref' in obj && typeof obj.$ref === 'string') {
    const resolved = resolvePointer(root, obj.$ref)
    if (resolved !== undefined) {
      return resolveRefs(structuredClone(resolved), root)
    }
    return obj
  }

  const result: any = {}
  for (const [key, value] of Object.entries(obj)) {
    result[key] = resolveRefs(value, root)
  }
  return result
}

function resolvePointer(root: any, ref: string): any {
  if (!ref.startsWith('#/')) return undefined

  const path = ref.slice(2).split('/')
  let current = root

  for (const segment of path) {
    const decoded = segment.replace(/~1/g, '/').replace(/~0/g, '~')
    if (current === null || current === undefined || typeof current !== 'object') {
      return undefined
    }
    current = current[decoded]
  }

  return current
}
