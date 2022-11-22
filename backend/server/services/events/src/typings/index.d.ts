declare namespace NodeJS {
  export interface ProcessEnv {
    POSTGRES_HOST: string;
    POSTGRES_PORT: number;
    POSTGRES_PASSWORD: string;
    POSTGRES_DB: string;
    POSTGRES_USER: string;
    POSTGRES_WARRANTY_DB: string;

    LOG_NAME: string;
    NODE_ENV: string;

    ADDRESS: string;
    PRIVATE_KEY: string;

    INFURA_URL: string;

    SOL_NETWORK: string;
    SOL_PRICE_URL: string;
    SOL_PRIVATE_KEYPAIR: string;

    CDG_TOKEN_ID: string;

    JWT_SECRET: string;

    SIGNATURE_EXPIRED: number;
  }
}
