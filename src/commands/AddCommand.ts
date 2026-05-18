import fs from 'node:fs'
import path from 'node:path'
import { ConfigurationHandler } from '../config/ConfigurationHandler.js'
import { migrationTemplates } from '../config/templates.js'
import { MongogratorError } from '../errors/MongogratorError.js'
import { MongogratorLogger } from '../loggers/MongogratorLogger.js'
import { BaseCommandStrategy } from './BaseCommandStrategy.js'

export class AddCommand extends BaseCommandStrategy {
	static triggers = ['add']
	static description = 'Creates a new migration file with the provided name'
	static flags: string[] = ['[--config <path>]']
	static detailedDescription = `
		This command creates a new migration file in the configured migrationsPath directory.
		It takes one argument, the name of the migration file to be created. It appends a timestamp
		to the name to ensure uniqueness. The migration file can be generated in either JavaScript (.js)
		or TypeScript (.ts) format, based on the specified configuration in the mongogrator.config file.
		Pass --config <path> or set MONGOGRATOR_CONFIG_PATH to use a specific config file
		(--config wins over the env var); the migration is then created relative to the config
		file's directory.
	`

	async execute() {
		const fileName =
			this.commandOptions.args[0] ?? this.throwWhenNoFileNameProvided()

		const configPath =
			typeof this.commandOptions.flags.config === 'string'
				? this.commandOptions.flags.config
				: undefined

		const { config, configFilePath } = await ConfigurationHandler.readConfig({
			configPath,
		})

		const migrationsDir = path.resolve(
			path.dirname(configFilePath),
			config.migrationsPath,
		)
		this.createMigrationDirectoryIfNotExists(migrationsDir)

		const newFilePath = path.join(
			migrationsDir,
			`${this.getTimestamp()}_${fileName}.${config.format}`,
		)

		fs.writeFileSync(newFilePath, migrationTemplates[config.format])
		MongogratorLogger.logInfo(`Migration created at ${newFilePath}`)
	}

	private throwWhenNoFileNameProvided = () => {
		throw new MongogratorError('Please provide a name for the migration file')
	}

	private createMigrationDirectoryIfNotExists = (migrationsPath: string) =>
		!fs.existsSync(migrationsPath) &&
		fs.mkdirSync(migrationsPath, { recursive: true })

	// new Date().toISOString() returns a string in the format "YYYY-MM-DDTHH:mm:ss.sssZ"
	// So we remove all the characters and only keep the digits so we get the format "YYYYMMDDHHmmsssss"
	private getTimestamp = () =>
		new Date().toISOString().replace(/[TZ\-\.:]/g, '')
}
