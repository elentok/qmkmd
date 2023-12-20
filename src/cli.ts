import { Command } from "npm:commander"
import { build } from "./commands/build.ts"
import { LayerError, LayoutError } from "./lib/types.ts"
import { format } from "./commands/format.ts"

function main() {
  const program = new Command()

  program.command("build <input.md> [generated-layout.h]")
    .description("Generates QMK header file from Markdown layout")
    .action(build)

  program.command("format <input.md>")
    .description("Formats the layer blocks by aligning the keys correctly")
    .action(format)

  try {
    program.parse()
  } catch (e) {
    if (e instanceof LayerError || e instanceof LayoutError) {
      console.error(e.message)
      Deno.exit(1)
    } else {
      throw e
    }
  }
}

if (import.meta.main) {
  main()
}
