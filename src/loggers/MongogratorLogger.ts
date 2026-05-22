import { MongogratorError } from '../errors/MongogratorError.js'

const ANSI = {
	reset: '\x1b[0m',
	bold: '\x1b[1m',
	blue: '\x1b[34m',
	red: '\x1b[31m',
} as const

// Honor the NO_COLOR convention (https://no-color.org) so output can be
// forced plain when desired. Otherwise colorize even outside a TTY, since
// CI log viewers such as Vercel build logs render ANSI codes.
const colorEnabled = !process.env.NO_COLOR

const colorize = ({ text, codes }: { text: string; codes: string[] }) =>
	colorEnabled ? `${codes.join('')}${text}${ANSI.reset}` : text

export namespace MongogratorLogger {
	const prefixLog = (level: string, color: string) =>
		colorize({
			text: `[Mongogrator:${new Date().toISOString().split('.')[0]}:${level}]`,
			codes: [ANSI.bold, color],
		})

	export function logInfo(...values: unknown[]) {
		console.log(prefixLog('info', ANSI.blue), ...values)
	}

	export function logError(error: Error): void
	export function logError(message: string): void
	export function logError(errorOrMessage: Error | string) {
		if (errorOrMessage instanceof Error) {
			console.error(
				prefixLog('error', ANSI.red),
				...(errorOrMessage instanceof MongogratorError
					? [errorOrMessage.name, errorOrMessage.message]
					: [errorOrMessage.stack]),
			)
		} else {
			console.error(prefixLog('error', ANSI.red), errorOrMessage)
		}
	}
}
