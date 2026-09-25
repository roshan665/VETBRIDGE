import { useCallback, useEffect, useRef, useState } from 'react'

export interface AsyncDataState<T> {
  data: T | null
  isLoading: boolean
  error: string | null
}

/**
 * Minimal data-fetching helper.
 *
 * Keeps loading/error plumbing out of pages while the API layer is still mock.
 * When FastAPI is wired in, swapping the loader function is the only change.
 */
export function useAsyncData<T>(loader: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loaderRef = useRef(loader)
  loaderRef.current = loader

  const reload = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await loaderRef.current()
      setData(result)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to load data')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void reload()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload, ...deps])

  return { data, isLoading, error, reload, setData } satisfies AsyncDataState<T> & {
    reload: () => Promise<void>
    setData: React.Dispatch<React.SetStateAction<T | null>>
  }
}
