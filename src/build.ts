import { stringifyLayer } from "./lib/layer.ts"
import { readLayout } from "./lib/reader.ts"

const layout = readLayout("examples/iris.md")
console.log("Options", layout.options)
for (const layer of layout.layers) {
  console.info()
  console.info("Layer")
  console.info(stringifyLayer(layer, layout.structure).join("\n"))
}
