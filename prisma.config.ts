import { defineConfig } from '@prisma/config';

export default defineConfig({
  datasource: {
    // This tells Prisma to look for the URL in your .env file
    url: process.env.DATABASE_URL,
  },
});