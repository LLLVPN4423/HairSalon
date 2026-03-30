/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_EMAILJS_SERVICE_ID: string;
  readonly VITE_EMAILJS_TEMPLATE_ID: string;
  readonly VITE_EMAILJS_PUBLIC_KEY: string;
  readonly VITE_BANK_ID: string;
  readonly VITE_ACCOUNT_NUMBER: string;
  readonly VITE_ACCOUNT_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
