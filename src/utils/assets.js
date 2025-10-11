// Helper to reference files from the Vite public/ folder respecting base path
// Usage: <img src={pub('logo.jpg')} /> or pub(service.img)
export function pub(path) {
  const clean = String(path || '').replace(/^\/+/, '');
  return `${import.meta.env.BASE_URL}${clean}`;
}
