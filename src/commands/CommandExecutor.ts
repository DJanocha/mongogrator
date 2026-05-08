import { CliParser } from '../cli/CliParser.js'
import { AddCommand } from './AddCommand.js'
import { InitCommand } from './InitCommand.js'
import { ListCommand } from './ListCommand.js'
import { MigrateCommand } from './MigrateCommand.js'
import { VersionCommand } from './VersionCommand.js'

type TCommand = CommandExecutor['commandsList'][number]
export class CommandExecutor {
	private commandName
	private commandOptions

	private commandsList = [
		InitCommand,
		AddCommand,
		ListCommand,
		MigrateCommand,
		VersionCommand,
	] as const

	private commandMap = Object.fromEntries(
		this.commandsList.flatMap((cmd) =>
			cmd.triggers.map((trigger) => [trigger, cmd]),
		),
	)

	constructor(argv: typeof process.argv) {
		const { commandName, commandOptions } = new CliParser(argv)
		this.commandName = commandName
		this.commandOptions = commandOptions
	}

	public async executeCommand() {
		const command = this.commandMap[this.commandName]
		this.handlePrintHelp(command)
		await new command(this.commandOptions).execute()
	}

	private handlePrintHelp(chosenCommand?: TCommand) {
		// if the commandName is found and the help flag is present, print the detailed description
		const { flags } = this.commandOptions
		const isHelpFlagPresent = flags.help || flags.h
		if (chosenCommand && isHelpFlagPresent) {
			console.log(chosenCommand.detailedDescription)
			process.exit(0)
		}
		// if the commandName is not found, print the general help message
		if (!chosenCommand) {
			console.log('Mongogrator CLI')
			console.log('Usage: mongogrator <command> [options]')
			console.log('\nCommands:')
			const PADDING_END = 25
			const PADDING_START = 2
			const printHelp = ({ triggers, args, flags, description }: TCommand) =>
				console.log(
					''.padStart(PADDING_START),
					`${triggers.join(', ')} ${args.join(', ')}${flags.join(', ')}`.padEnd(
						PADDING_END,
					),
					`${description}`,
				)
			this.commandsList.forEach(printHelp)
			console.log('\nFlags:')
			console.log(
				''.padStart(PADDING_START),
				'--help, -h'.padEnd(PADDING_END),
				'Prints the detailed description of the command',
			)
			console.log(
				''.padStart(PADDING_START),
				'--config <path>'.padEnd(PADDING_END),
				'Use a custom mongogrator config file (e.g. ./infra/mongogrator.config.ts)',
			)
			process.exit(0)
		}
	}
}
