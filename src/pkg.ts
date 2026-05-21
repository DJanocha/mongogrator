import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const moduleDir = path.dirname(fileURLToPath(import.meta.url))
const pkgPath = path.resolve(moduleDir, '../package.json')

export const { version } = JSON.parse(fs.readFileSync(pkgPath, 'utf-8')) as {
	version: string
}
