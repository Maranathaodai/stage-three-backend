class HttpTransport {
  constructor() {}
  send() {
    return Promise.resolve();
  }
}

// Export only a named export to avoid default/named reexport confusion when the
// bundler converts CommonJS -> ESM. This keeps the module shape simpler and
// reduces chances of creating a self-reexport cycle during static analysis.
exports.HttpTransport = HttpTransport;
module.exports = { HttpTransport };
class HttpTransport {
  constructor() {}
  send() {
    return Promise.resolve();
  }
}

module.exports = { HttpTransport };
