"use client"

// Fix for Node.js 25 experimental localStorage (--localstorage-file without valid path)
// next-themes tries to access localStorage during SSR which fails in this env
if (typeof globalThis.localStorage !== 'undefined') {
  try {
    globalThis.localStorage.getItem('__test__')
  } catch {
    Object.defineProperty(globalThis, 'localStorage', {
      value: {
        _store: {} as Record<string, string>,
        getItem(key: string) { return this._store[key] ?? null },
        setItem(key: string, value: string) { this._store[key] = value },
        removeItem(key: string) { delete this._store[key] },
        clear() { this._store = {} },
        get length() { return Object.keys(this._store).length },
        key(index: number) { return Object.keys(this._store)[index] ?? null },
      } as Storage,
      writable: true,
      configurable: true,
    })
  }
}

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { type ThemeProviderProps } from 'next-themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
