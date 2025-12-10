import { config } from 'dotenv';
import path from 'path';
import '@testing-library/jest-dom/vitest';

config({ path: path.resolve(__dirname, '.env.test') });
