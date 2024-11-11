import { exportDataBase } from '../database/mongoConnection';
import { Store } from '../models/Store';

export const addStore = async (store: Store) => {
  const stores = await exportDataBase();
  const result = await stores.insertOne(store);
  console.log('Loja adicionada:', result.insertedId);
};

export const findStores = async () => {
  const storesCollection = await exportDataBase();
  return await storesCollection.find().toArray();
};