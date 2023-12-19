import { stringifyLayer } from "./lib/layer.ts"
import { writeQmkCode } from "./lib/qmk-writer.ts"
import { readLayout } from "./lib/reader.ts"

const layout = readLayout("examples/iris.md")
console.info(writeQmkCode(layout).join("\n"))
// for (const layer of layout.layers) {
//   console.info()
//   console.info("Layer")
//   console.info(stringifyLayer(layer, layout.structure).join("\n"))
// }
