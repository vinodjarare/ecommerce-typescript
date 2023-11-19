declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      JWT_SECRET: string;
      DB_URI?: string;
      NODE_ENV?: string;
    }
  }
}

export {};
