export const HttpTransport = class HttpTransportStub {
  constructor() {}
  send() {
    // no-op stub for deploy bundling
    return Promise.resolve();
  }
};

// Default export as an object with the named export to match possible reexport patterns
export default { HttpTransport };
