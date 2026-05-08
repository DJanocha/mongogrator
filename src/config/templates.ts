export const configTemplates = {
	ts: `import { mongogratorConfigSchema, type TMongogratorConfig } from 'mongogrator'

const mongogratorConfig: TMongogratorConfig = mongogratorConfigSchema.parse({
	url: 'mongodb://localhost:27017', // Cluster url
	database: 'test', // Database name for which the migrations will be executed
	migrationsPath: './migrations', // Migrations directory relative to the location of the config file
	logsCollectionName: 'migrations', // Name of the logs collection that will be stored in the database
	format: 'ts', // Format type of the migration files ['ts', 'js']
	callbacksBeforeMigrations: [], // Async hooks (args: { db }) => Promise<void>, run once before the batch
	callbacksAfterMigrations: [], // Async hooks (args: { db }) => Promise<void>, run once after the batch
})

export default mongogratorConfig
`,
	js: `/** @type {import('mongogrator').TMongogratorConfig} */
const mongogratorConfig = {
	url: 'mongodb://localhost:27017', // Cluster url
	database: 'test', // Database name for which the migrations will be executed
	migrationsPath: './migrations', // Migrations directory relative to the location of the config file
	logsCollectionName: 'migrations', // Name of the logs collection that will be stored in the database
	format: 'js', // Format type of the migration files ['ts', 'js']
	callbacksBeforeMigrations: [], // Async hooks ({ db }) => Promise<void>, run once before the batch
	callbacksAfterMigrations: [], // Async hooks ({ db }) => Promise<void>, run once after the batch
}

export default mongogratorConfig
`,
}

export const migrationTemplates = {
	ts: `import type { Db } from 'mongodb'

/**
 * This function is called when the migration is run.
 * @param _db The mongodb database object that's passed to the migration
 */
export const migrate = async (_db: Db): Promise<void> => {
	// Migration code here
}
`,
	js: `/**
 * This function is called when the migration is run.
 * @param {import("mongodb").Db} _db The mongodb database object that's passed to the migration
 * @returns {Promise<void>}
 */
export const migrate = async (_db) => {
	// Migration code here
}
`,
}
