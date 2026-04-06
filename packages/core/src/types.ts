export interface CanvapiProps {
  /** URL or path to the OpenAPI spec (JSON/YAML) */
  specUrl: string
  /** Additional OpenAPI specs for microservices */
  additionalSpecs?: ServiceSpec[]
  /** Default layout preset */
  layout?: LayoutPreset
  /** Default theme */
  theme?: 'dark' | 'light'
}

export interface ServiceSpec {
  /** Display name for the service */
  name: string
  /** URL or path to the OpenAPI spec */
  specUrl: string
  /** Port the service runs on */
  port?: number
}

export type LayoutPreset =
  | 'canvas-full'
  | 'overview'
  | 'developer'
  | 'frontend'
  | 'backend'
  | 'ai-ready'
  | 'all'

export type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head'

export type BlockId =
  | 'overview'
  | 'servers'
  | 'auth'
  | 'resources'
  | 'schemas'
  | 'parameters'
  | 'responses'
  | 'webhooks'
  | 'try-it'
  | 'snippets'
  | 'ai'
  | 'components'

export interface BlockState {
  id: BlockId
  visible: boolean
  minimized: boolean
  order: number
}
