import type { Db } from 'mongodb'
import { z } from 'zod'

export const CONFIG_FILE_NAME = 'mongogrator.config'
export const CONFIG_TS_FILE_NAME = `${CONFIG_FILE_NAME}.ts`
export const CONFIG_JS_FILE_NAME = `${CONFIG_FILE_NAME}.js`

export const ConfigFormatSchema = z.enum(['js', 'ts'])

export type MongogratorMigrationCallback = (args: {
	db: Db
}) => Promise<void>

const callbackSchema = z.custom<MongogratorMigrationCallback>(
	(val) => typeof val === 'function',
	{ message: 'Callback must be a function' },
)

export const mongogratorConfigSchema = z.object({
	url: z.string().url(),
	database: z.string(),
	migrationsPath: z.string(),
	logsCollectionName: z.string(),
	format: ConfigFormatSchema,
	callbacksBeforeMigrations: callbackSchema.array().optional().default([]),
	callbacksAfterMigrations: callbackSchema.array().optional().default([]),
})

export type MongogratorConfig = z.input<typeof mongogratorConfigSchema>

export const buildMongogratorConfig = (input: z.input<typeof mongogratorConfigSchema>) =>
	mongogratorConfigSchema.parse(input)

export type MongogratorMigration = {
	migrate: (db: Db) => Promise<void>
}

export const buildMigration = (input: MongogratorMigration) => input

