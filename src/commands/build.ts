import { writeQmkCode } from "../lib/writer/qmk-writer.ts"
import { parseLayoutFile } from "../lib/parser/parser.ts"

export function build(input: string, output = "generated-layout.h") {
  const layout = parseLayoutFile(input)
  const outputContents = writeQmkCode(layout).join("\n")
  Deno.writeTextFileSync(output, outputContents)

  console.info(`Generated ${output}`)
}
