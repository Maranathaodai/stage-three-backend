export class HttpTransport {
  constructor() {}
  send() {
    // no-op stub for deploy bundling
    return Promise.resolve();
  }
}

// Export default as the same binding to avoid reexport/self-reference issues
export default HttpTransport;
