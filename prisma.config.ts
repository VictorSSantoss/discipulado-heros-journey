import { defineConfig } from '@prisma/config';
import * as dotenv from 'dotenv'; // Import dotenv

// Manually load the .env file
dotenv.config();

export default defineConfig({
  datasource: {
    // Now this will correctly find your connection string
    url: process.env.DATABASE_URL, 
  },
  migrations: {
    seed: 'tsx --env-file=.env prisma/seed.ts',
  },
});