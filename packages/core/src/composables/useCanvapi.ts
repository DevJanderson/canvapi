import { ref, computed, type Ref } from 'vue'
import { parseSpec } from '../parser'
import type { ParsedAPI } from '../parser/types'
import { buildCanvasGraph } from '../canvas'
import type { CanvasGraph } from '../canvas/types'
import type { HttpMethod } from '../types'

export interface UseCanvapiOptions {
  specUrl: string
  initialFilter?: HttpMethod | null
}

export interface UseCanvapiReturn {
  api: Ref<ParsedAPI | null>
  graph: Ref<CanvasGraph | null>
  loading: Ref<boolean>
  error: Ref<string | null>
  methodFilter: Ref<HttpMethod | null>
  filteredGraph: Ref<CanvasGraph | null>
  reload: () => Promise<void>
}

export function useCanvapi(options: UseCanvapiOptions): UseCanvapiReturn {
  const api = ref<ParsedAPI | null>(null)
  const graph = ref<CanvasGraph | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const methodFilter = ref<HttpMethod | null>(options.initialFilter ?? null)

  const filteredGraph = computed<CanvasGraph | null>(() => {
    if (!graph.value) return null
    if (!methodFilter.value) return graph.value

    const method = methodFilter.value
    const filteredNodes = graph.value.nodes.map((node) => {
      if (node.data.nodeType !== 'resource') return node

      return {
        ...node,
        data: {
          ...node.data,
          endpoints: node.data.endpoints.filter((ep) => ep.method === method),
        },
      }
    }).filter((node) => {
      if (node.data.nodeType === 'resource') {
        return node.data.endpoints.length > 0
      }
      return true
    })

    const nodeIds = new Set(filteredNodes.map((n) => n.id))
    const filteredEdges = graph.value.edges.filter(
      (e) => nodeIds.has(e.source) && nodeIds.has(e.target),
    )

    return { nodes: filteredNodes, edges: filteredEdges }
  })

  async function load(specUrl: string): Promise<void> {
    loading.value = true
    error.value = null

    try {
      const parsed = await parseSpec(specUrl)
      api.value = parsed
      graph.value = buildCanvasGraph(parsed)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to parse OpenAPI spec'
      api.value = null
      graph.value = null
    } finally {
      loading.value = false
    }
  }

  async function reload(): Promise<void> {
    await load(options.specUrl)
  }

  // Load on init
  load(options.specUrl)

  return {
    api,
    graph,
    loading,
    error,
    methodFilter,
    filteredGraph,
    reload,
  }
}
