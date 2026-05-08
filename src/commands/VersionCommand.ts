import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { MongogratorLogger } from '../loggers/MongogratorLogger.js'
import { BaseCommandStrategy } from './BaseCommandStrategy.js'

const moduleDir = path.dirname(fileURLToPath(import.meta.url))
const pkgPath = path.resolve(moduleDir, '../../package.json')
const { version } = JSON.parse(fs.readFileSync(pkgPath, 'utf-8')) as {
	version: string
}

export class VersionCommand extends BaseCommandStrategy {
	static triggers = ['version', '-v', '--version']
	static description = 'Prints the current version of Mongogrator'
	static detailedDescription = `
		This command displays the current version of Mongogrator and exits.
		`

	async execute() {
		MongogratorLogger.logInfo(`version: ${version}`)
	}
}
