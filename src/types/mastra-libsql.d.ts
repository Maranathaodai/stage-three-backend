declare module '@mastra/libsql' {
  export class LibSQLVector {
    constructor(options?: any);
    upsert(items?: any[]): Promise<{ success: boolean; upserted: number }>;
    query(query?: any, opts?: any): Promise<{ results: any[] }>;
  }

  export class LibSQLStore {
    constructor(options?: any);
    connect(): Promise<void>;
  }

  const _default: { LibSQLStore: typeof LibSQLStore; LibSQLVector: typeof LibSQLVector };
  export default _default;
}
