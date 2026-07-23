/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_ANPR_SERVICE_URL?: string;
  readonly VITE_FACE_SERVICE_URL?: string;
  readonly VITE_BEHAVIOR_SERVICE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
