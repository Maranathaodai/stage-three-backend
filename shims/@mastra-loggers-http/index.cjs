class HttpTransport {
  constructor() {}
  send() {
    // no-op stub for bundler analysis
    return Promise.resolve();
  }
}

// Export only a named export to keep module shape simple and avoid
// default/named reexport confusion during bundling.
exports.HttpTransport = HttpTransport;
module.exports = { HttpTransport };
// Intentionally export an empty module to prevent bundlers from generating
// self-referential reexports for HttpTransport. The app does not use this.
module.exports = {};
