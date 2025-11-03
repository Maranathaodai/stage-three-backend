export class LibSQLStore {
  constructor() {}
  async connect() {
    // no-op stub
    return Promise.resolve();
  }
}

// Minimal stub export matching upstream API surface expected by Mastra bundler
export class LibSQLVector {
  constructor(options = {}) {
    this.options = options;
  }

  async upsert(items = []) {
    // no-op: pretend we stored vectors
    return { success: true, upserted: items.length };
  }

  async query(query, opts = {}) {
    // no-op: return empty result set
    return { results: [] };
  }
}

export default { LibSQLStore, LibSQLVector };
