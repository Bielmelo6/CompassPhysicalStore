import { closeMongoConnection } from './src/database/mongoConnection';
import { nearestStores } from './src/services/cepService';
import app from './src/routes/routes';
import dotenv from 'dotenv';
import readline from 'readline';
import { startPrompt } from './src/controllers/actionHandler';

const main = async () => {
  dotenv.config({ path: './.env' });
  try {
    app;
    startPrompt();
  } catch (error) {
    console.error('Erro:', error);
  } finally {
    await closeMongoConnection();
  }
};

main();