import { MongoClient } from 'mongodb';

const uri = `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@apicluster.qvgzt4v.mongodb.net/`;
const client = new MongoClient(uri);

export const exportDataBase = async () => {
  try {
    await client.connect();
    console.log('Conectado ao MongoDB');
    const db = client.db('APICluster');
    const stores = db.collection('stores');
    return stores;
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
    throw error;
  }
};


export const closeMongoConnection = async () => {
  await client.close();
};