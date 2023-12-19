import { Options } from "./types.ts"

export function parseOptions(lines?: string[]): Options {
  const options = new Map<string, string>()

  for (const line of (lines ?? [])) {
    const eqlIndex = line.indexOf("=")
    if (eqlIndex == null) continue

    const name = line.substring(0, eqlIndex).trim()
    const value = line.substring(eqlIndex + 1).trim()
    options.set(name, value)
  }

  return {
    layoutFn: options.get("layoutFn") ?? "LAYOUT",
  }
}
