export const configTemplates = {
	ts: `import { buildMongogratorConfig } from '@danieljanocha/mongogrator'

export default buildMongogratorConfig({
	url: 'mongodb://localhost:27017', // Cluster url
	database: 'test', // Database name for which the migrations will be executed
	migrationsPath: './migrations', // Migrations directory relative to the location of the config file
	logsCollectionName: 'migrations', // Name of the logs collection that will be stored in the database
	format: 'ts', // Format type of the migration files ['ts', 'js']
	callbacksBeforeMigrations: [], // Async hooks (args: { db }) => Promise<void>, run once before the batch
	callbacksAfterMigrations: [], // Async hooks (args: { db }) => Promise<void>, run once after the batch
})
`,
	js: `import { buildMongogratorConfig } from '@danieljanocha/mongogrator'

export default buildMongogratorConfig({
	url: 'mongodb://localhost:27017', // Cluster url
	database: 'test', // Database name for which the migrations will be executed
	migrationsPath: './migrations', // Migrations directory relative to the location of the config file
	logsCollectionName: 'migrations', // Name of the logs collection that will be stored in the database
	format: 'js', // Format type of the migration files ['ts', 'js']
	callbacksBeforeMigrations: [], // Async hooks ({ db }) => Promise<void>, run once before the batch
	callbacksAfterMigrations: [], // Async hooks ({ db }) => Promise<void>, run once after the batch
})
`,
}

export const migrationTemplates = {
	ts: `import { buildMigration } from '@danieljanocha/mongogrator'

export default buildMigration({
	migrate: async (_db) => {
		// Migration code here
	},
})
`,
	js: `import { buildMigration } from '@danieljanocha/mongogrator'

export default buildMigration({
	migrate: async (_db) => {
		// Migration code here
	},
})
`,
}
