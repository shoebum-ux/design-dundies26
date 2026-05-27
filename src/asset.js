// Resolve a public-folder asset against Vite's base URL so paths work both on the
// dev server ('/') and on GitHub Pages ('/design-dundies26/').
export const asset = (path) => import.meta.env.BASE_URL + path.replace(/^\//, '')
