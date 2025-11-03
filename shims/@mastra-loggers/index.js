// Minimal stub of the logger exports Mastra may import during bundling.
// Provide a named `PinoLogger` export since the deploy bundler expects it.
export class PinoLogger {
	constructor(options = {}) {
		this.options = options;
	}
	info(...args) {
		// no-op in shim
	}
	warn(...args) {}
	error(...args) {}
	debug(...args) {}
	child() {
		return this; // simple child logger that is the same stub
	}
}

export const Loggers = { PinoLogger };
export default Loggers;
