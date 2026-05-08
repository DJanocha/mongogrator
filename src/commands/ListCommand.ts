import path from 'node:path'
import { ConfigurationHandler } from '../config/ConfigurationHandler.js'
import { MigrationsService } from '../db/MigrationsService.js'
import { Client } from '../db/MongoDb.js'
import { BaseCommandStrategy } from './BaseCommandStrategy.js'

export class ListCommand extends BaseCommandStrategy {
	static triggers = ['list']
	static description = 'List all migrations and their status'
	static flags: string[] = ['[--config <path>]']
	static detailedDescription = `
		This command lists all the migration files located in the configured migrations directory.
		It checks each migration file to determine whether it has been applied to the database.
		Each migration will be displayed with a status of either "MIGRATED" if it has been applied,
		or "NOT MIGRATED" if it has not been applied yet.
		Pass --config <path> to use a specific config file.
	`

	async execute() {
		const configPath =
			typeof this.commandOptions.flags.config === 'string'
				? this.commandOptions.flags.config
				: undefined

		const { config, configFilePath } = await ConfigurationHandler.readConfig({
			configPath,
		})

		const baseDir = configPath ? path.dirname(configFilePath) : process.cwd()
		const migrationsDir = path.resolve(baseDir, config.migrationsPath)
		const files = MigrationsService.getMigrations([migrationsDir])
		const clientInstance = new Client(config)

		await clientInstance.run(async ({ collection }) => {
			const migrationsService = new MigrationsService(collection)
			const appliedMigrationsSet = await migrationsService.getAppliedSet()
			const migrations = files.map((file) => {
				const migration = path.parse(file).name
				const status = appliedMigrationsSet.has(migration)
					? 'MIGRATED'
					: 'NOT MIGRATED'
				return { migration, status }
			})
			console.table(migrations)
		})
	}
}
