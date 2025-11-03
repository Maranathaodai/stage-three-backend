declare module '@mastra/loggers-http' {
  export class HttpTransport {
    constructor();
    send(): Promise<void>;
  }

  export default HttpTransport;
}
declare module '@mastra/loggers-http' {
  export class HttpTransport {
    constructor(options?: any);
    send(...args: any[]): Promise<any>;
  }

  const _default: { HttpTransport: typeof HttpTransport };
  export default _default;
}
