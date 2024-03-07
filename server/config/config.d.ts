declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      JWT_SECRET: string;
      DB_URI?: string;
      NODE_ENV?: string;
      COOKIE_EXPIRE?: string;
      JWT_EXPIRE?: string;
      STRIPE_API_KEY: string;
      STRIPE_SECRET_KEY: string;
    }
  }
}

export {};
