import type { Db } from 'mongodb'
import { z } from 'zod'

export const CONFIG_FILE_NAME = 'mongogrator.config'
export const CONFIG_TS_FILE_NAME = `${CONFIG_FILE_NAME}.ts`
export const CONFIG_JS_FILE_NAME = `${CONFIG_FILE_NAME}.js`

const ConfigFormatSchema = z.enum(['js', 'ts'])

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
	callbacksBeforeMigrations: z.array(callbackSchema).default([]),
	callbacksAfterMigrations: z.array(callbackSchema).default([]),
})

export type TMongogratorConfig = z.infer<typeof mongogratorConfigSchema>
