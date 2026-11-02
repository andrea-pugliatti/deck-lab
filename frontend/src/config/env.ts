export const API_BASE_URL: string = import.meta.env.DEV ? "" : import.meta.env.VITE_API_URL || "";
export const IMAGES_BASE_URL: string = import.meta.env.DEV
  ? ""
  : import.meta.env.VITE_IMAGES_BASE_URL || "";
