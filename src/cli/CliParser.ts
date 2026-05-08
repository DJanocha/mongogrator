import type { CommandOptions } from '../commands/BaseCommandStrategy.js'

export class CliParser {
	private command
	private args: CommandOptions['args']
	private flags: CommandOptions['flags']

	constructor(argv: typeof process.argv) {
		this.command = argv[2] ?? ''
		const rest = argv.slice(3)
		const args: string[] = []
		const flags: CommandOptions['flags'] = {}

		for (let i = 0; i < rest.length; i++) {
			const token = rest[i]
			if (!token.startsWith('-')) {
				args.push(token)
				continue
			}

			const stripped = token.startsWith('--') ? token.slice(2) : token.slice(1)
			const eqIndex = stripped.indexOf('=')

			if (eqIndex !== -1) {
				const key = stripped.slice(0, eqIndex)
				const value = stripped.slice(eqIndex + 1)
				flags[key] = value
				continue
			}

			const next = rest[i + 1]
			if (next !== undefined && !next.startsWith('-')) {
				flags[stripped] = next
				i++
			} else {
				flags[stripped] = true
			}
		}

		this.args = args
		this.flags = flags
	}

	public get commandName(): string {
		return this.command
	}

	public get commandOptions(): CommandOptions {
		return {
			args: this.args,
			flags: this.flags,
		}
	}
}
