import { parseVariable } from "./helpers.ts"
import { Options } from "./types.ts"

export function parseOptions(lines?: string[]): Options {
  const options = new Map<string, string>()

  for (const line of (lines ?? [])) {
    const v = parseVariable(line)
    if (v != null) {
      options.set(v.name, v.value)
    }
  }

  return {
    layoutFn: options.get("layoutFn") ?? "LAYOUT",
  }
}
