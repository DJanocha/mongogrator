import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { ConfigurationHandler } from '../config/ConfigurationHandler.js'
import type { MongogratorMigration } from '../config/config.js'
import { MigrationsService } from '../db/MigrationsService.js'
import { Client } from '../db/MongoDb.js'
import { MongogratorError } from '../errors/MongogratorError.js'
import { MongogratorLogger } from '../loggers/MongogratorLogger.js'
import { BaseCommandStrategy } from './BaseCommandStrategy.js'

export class MigrateCommand extends BaseCommandStrategy {
	static triggers = ['migrate']
	static description = 'Run all migrations that have not been applied yet'
	static flags: string[] = ['[--config <path>]']
	static detailedDescription = `
		This command executes all pending migration files in the migrations directory.
		Migrations that have already been applied are skipped.
		By default the config file is loaded from the current working directory; pass
		--config <path> or set MONGOGRATOR_CONFIG_PATH to point at a specific
		mongogrator.config.{ts,js} file. The --config flag wins over the env var.
		The config file determines the location of the migrations folder.
		Each migration file must default-export a value created with buildMigration({ migrate }).
	`

	async execute() {
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
		const migrationFiles = MigrationsService.getMigrations([migrationsDir])
		const clientInstance = new Client(config)

		await clientInstance.run(async ({ collection, db }) => {
			for (const cb of config.callbacksBeforeMigrations) {
				await cb({ db })
			}

			const migrationsService = new MigrationsService(collection)
			const appliedMigrationsSet = await migrationsService.getAppliedSet()
			for (const file of migrationFiles) {
				if (!appliedMigrationsSet.has(path.parse(file).name)) {
					const migration = await loadMigration(
						path.join(migrationsDir, file),
						file,
					)
					await migration.migrate(db)
					await migrationsService.insertApplied(path.parse(file).name)
					MongogratorLogger.logInfo(`Migration ${file} applied`)
				}
			}

			for (const cb of config.callbacksAfterMigrations) {
				await cb({ db })
			}
		})
	}
}

async function loadMigration(
	absPath: string,
	displayName: string,
): Promise<MongogratorMigration> {
	const mod = await import(pathToFileURL(absPath).href)
	const migration = mod.default as MongogratorMigration | undefined
	if (!migration || typeof migration.migrate !== 'function') {
		throw new MongogratorError(
			`Migration "${displayName}" must default-export a value created with buildMigration({ migrate })`,
		)
	}
	return migration
}
