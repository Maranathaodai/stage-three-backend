export const HttpTransport = class HttpTransportStub {
  constructor() {}
  send() {
    // no-op stub for deploy bundling
    return Promise.resolve();
  }
};

export default HttpTransport;
