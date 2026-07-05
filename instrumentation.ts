// Next.js Instrumentation — runs before app code on the server
// Fixes broken localStorage in Node.js 25 with --localstorage-file (no path)
// When --localstorage-file is provided without a valid path, localStorage exists
// but getItem/setItem/etc. are not standard functions — this breaks next-themes
export async function register() {
  if (typeof globalThis.localStorage !== 'undefined') {
    try {
      globalThis.localStorage.getItem('__probe__')
    } catch {
      const store: Record<string, string> = {}
      ;(globalThis as Record<string, unknown>).localStorage = {
        getItem: (key: string) => store[key] ?? null,
        setItem: (key: string, value: string) => { store[key] = String(value) },
        removeItem: (key: string) => { delete store[key] },
        clear: () => { Object.keys(store).forEach(k => delete store[k]) },
        get length() { return Object.keys(store).length },
        key: (index: number) => Object.keys(store)[index] ?? null,
      }
    }
  }
}
