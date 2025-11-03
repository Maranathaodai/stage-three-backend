class HttpTransport {
  constructor() {}
  send() {
    return Promise.resolve();
  }
}

// Export only a named export via CommonJS to avoid reexport cycles when bundlers
// transform CJS <-> ESM.
module.exports = { HttpTransport };
