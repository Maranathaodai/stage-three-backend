declare module '@mastra/loggers' {
  export class PinoLogger {
    constructor(options?: any);
    info(...args: any[]): void;
    warn(...args: any[]): void;
    error(...args: any[]): void;
    debug(...args: any[]): void;
    child(): any;
  }

  const _default: { PinoLogger: typeof PinoLogger };
  export default _default;
}
