import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { MongogratorError } from '../errors/MongogratorError.js'
import { MongogratorLogger } from '../loggers/MongogratorLogger.js'
import type z from 'zod'
import {
	CONFIG_FILE_NAME,
	CONFIG_JS_FILE_NAME,
	CONFIG_TS_FILE_NAME,
	ConfigFormatSchema,
	mongogratorConfigSchema,
} from './config.js'
import { configTemplates } from './templates.js'

export type ReadConfigOptions = {
	configPath?: string
}

export type LoadedConfig = {
	config: z.output<typeof mongogratorConfigSchema>
	configFilePath: string
}

export namespace ConfigurationHandler {
	export async function readConfig(
		options: ReadConfigOptions = {},
	): Promise<LoadedConfig> {
		const { configPath } = options

		if (configPath) {
			const absPath = path.resolve(process.cwd(), configPath)
			if (!fs.existsSync(absPath)) {
				throw new MongogratorError(
					`Config file not found at "${absPath}"`,
				)
			}
			const module = await import(pathToFileURL(absPath).href)
			const config = await mongogratorConfigSchema.parseAsync(module.default)
			return { config, configFilePath: absPath }
		}

		for (const configFileName of [CONFIG_TS_FILE_NAME, CONFIG_JS_FILE_NAME]) {
			const absPath = path.join(process.cwd(), configFileName)
			if (fs.existsSync(absPath)) {
				const module = await import(pathToFileURL(absPath).href)
				const config = await mongogratorConfigSchema.parseAsync(
					module.default,
				)
				return { config, configFilePath: absPath }
			}
		}

		throw new MongogratorError(`${CONFIG_FILE_NAME} file not found`)
	}

	export async function initConfig(useJs: boolean) {
		const fileName = useJs ? CONFIG_JS_FILE_NAME : CONFIG_TS_FILE_NAME
		const extension : z.infer<typeof ConfigFormatSchema> = useJs ? 'js' : 'ts'
		const configFilePath = path.join(process.cwd(), fileName)
		if (fs.existsSync(configFilePath)) {
			throw new MongogratorError(`${fileName} already initialized`)
		}
		fs.writeFileSync(configFilePath, configTemplates[extension])
		MongogratorLogger.logInfo(`Config file created at ${configFilePath}`)
	}
}
