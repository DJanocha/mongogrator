export const configTemplates = {
	ts: `import { buildMongogratorConfig } from '@danieljanocha/mongogrator'

export default buildMongogratorConfig({
	url: 'mongodb://localhost:27017', // Cluster url
	database: 'test', // Default database name injected as 'db' into migrations/hooks
	migrationsPath: './migrations', // Migrations directory relative to the location of the config file
	logsCollectionName: 'migrations', // Name of the logs collection that will be stored in the database
	format: 'ts', // Format type of the migration files ['ts', 'js']
	callbacksBeforeMigrations: [], // Async hooks ({ db, client }) => Promise<void>, run once before the batch
	callbacksAfterMigrations: [], // Async hooks ({ db, client }) => Promise<void>, run once after the batch
	// generateId: () => crypto.randomUUID(), // Optional. Sets the _id of every row inserted into the logs collection. Default: MongoDB auto-generated ObjectId.
})
`,
	js: `import { buildMongogratorConfig } from '@danieljanocha/mongogrator'

export default buildMongogratorConfig({
	url: 'mongodb://localhost:27017', // Cluster url
	database: 'test', // Default database name injected as 'db' into migrations/hooks
	migrationsPath: './migrations', // Migrations directory relative to the location of the config file
	logsCollectionName: 'migrations', // Name of the logs collection that will be stored in the database
	format: 'js', // Format type of the migration files ['ts', 'js']
	callbacksBeforeMigrations: [], // Async hooks ({ db, client }) => Promise<void>, run once before the batch
	callbacksAfterMigrations: [], // Async hooks ({ db, client }) => Promise<void>, run once after the batch
	// generateId: () => crypto.randomUUID(), // Optional. Sets the _id of every row inserted into the logs collection. Default: MongoDB auto-generated ObjectId.
})
`,
}

export const migrationTemplates = {
	ts: `import { buildMigration } from '@danieljanocha/mongogrator'

export default buildMigration({
	migrate: async ({ db, client }) => {
		// 'db' is the default database from config.database
		// 'client' is the underlying MongoClient — use it for multi-database setups, e.g.:
		//   const authDb = client.db('auth')
		//   const twitchDb = client.db('twitch')
	},
})
`,
	js: `import { buildMigration } from '@danieljanocha/mongogrator'

export default buildMigration({
	migrate: async ({ db, client }) => {
		// 'db' is the default database from config.database
		// 'client' is the underlying MongoClient — use it for multi-database setups, e.g.:
		//   const authDb = client.db('auth')
		//   const twitchDb = client.db('twitch')
	},
})
`,
}
