export class HttpTransport {
  constructor() {}
  send() {
    return Promise.resolve();
  }
}

// export named and default as same binding
export default HttpTransport;
