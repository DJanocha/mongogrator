import { MongogratorLogger } from '../loggers/MongogratorLogger.js'
import { version } from '../pkg.js'
import { BaseCommandStrategy } from './BaseCommandStrategy.js'

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
