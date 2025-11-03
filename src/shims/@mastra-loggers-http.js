// Minimal CommonJS shim for @mastra/loggers-http used during deploy bundling.
// Exports a named HttpTransport to satisfy static bundler analysis.
class HttpTransport {
  constructor() {}
  send() {
    return Promise.resolve();
  }
}

exports.HttpTransport = HttpTransport;
module.exports = { HttpTransport };
