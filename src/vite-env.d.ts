/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** "false" switches src/services/api.ts from mock data to real FastAPI requests. */
  readonly VITE_USE_MOCK_API?: string
  /** Base URL of the FastAPI backend, e.g. http://localhost:8000/api/v1 */
  readonly VITE_API_BASE_URL?: string
  readonly VITE_API_TIMEOUT_MS?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
