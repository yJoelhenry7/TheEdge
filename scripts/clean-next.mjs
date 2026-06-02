import { rmSync } from "node:fs"
import { join } from "node:path"

const target = join(process.cwd(), ".next")

try {
  rmSync(target, { recursive: true, force: true })
  console.log("Removed .next cache")
} catch (error) {
  console.error(
    "Could not remove .next — stop `npm run dev`, close other terminals, then retry."
  )
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
}
