import { defineConfig } from '@prisma/config';

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
  // The seed command MUST be inside migrations for Prisma 7
  migrations: {
    seed: 'tsx --env-file=.env prisma/seed.ts',
  },
});