class HttpTransport {
  constructor() {}
  send() {
    return Promise.resolve();
  }
}

// Provide both a default export (module.exports) and a named export property so
// consumers that statically analyze reexports can resolve the symbol without
// producing a self-reexport cycle.
module.exports = HttpTransport;
module.exports.HttpTransport = HttpTransport;
exports.HttpTransport = HttpTransport;
class HttpTransport {
  constructor() {}
  send() {
    return Promise.resolve();
  }
}

module.exports = { HttpTransport };
