/**
 * Logging that stays readable when a stage is grinding through 2,000 venues:
 * one line per venue, a counter, and a summary at the end.
 */
const start = Date.now()

const elapsed = () => `${((Date.now() - start) / 1000).toFixed(1)}s`

export const log = {
	info: (...args) => console.log(`[${elapsed()}]`, ...args),
	warn: (...args) => console.warn(`[${elapsed()}] warn:`, ...args),
	error: (...args) => console.error(`[${elapsed()}] error:`, ...args),

	/** A stage banner, so a piped log says which step produced what. */
	stage: (name) => console.log(`\n── ${name} ${'─'.repeat(Math.max(0, 60 - name.length))}`),

	/**
	 * Prints a tally as aligned rows. Every stage ends with one of these, so a
	 * run that did nothing says so instead of exiting silently.
	 */
	summary: (title, counts) => {
		const width = Math.max(...Object.keys(counts).map((k) => k.length))
		console.log(`\n${title}`)
		for (const [key, value] of Object.entries(counts)) {
			console.log(`  ${key.padEnd(width)}  ${value}`)
		}
		console.log('')
	}
}
