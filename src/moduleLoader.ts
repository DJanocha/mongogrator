import { createJiti } from 'jiti'

/**
 * Shared jiti instance used to import user-authored TypeScript files
 * (the config and migration files) at runtime.
 *
 * Consumers run mongogrator with plain `node`, which cannot import `.ts`
 * files on its own. jiti transpiles them on the fly so no loader flag
 * (e.g. `NODE_OPTIONS="--import tsx"`) is required on the consumer side.
 */
const jiti = createJiti(import.meta.url)

/**
 * Imports a module from an absolute path, transparently handling both
 * `.ts` and `.js` files. Returns the full module namespace.
 */
export async function loadModule(absPath: string): Promise<unknown> {
	return jiti.import(absPath)
}
