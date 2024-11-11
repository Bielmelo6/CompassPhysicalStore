import axios from 'axios';
import { exportDataBase } from '../database/mongoConnection';
import { handleInvalidCepError, handleOtherError } from '../utils/errorHandler';
import { formatCep } from '../utils/formatCep';
import logger from '../utils/logger';

export const fetchAddressByCep = async (cep: string) => {
  const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
  return response.data;
};

export const getGeoLoc = async (cep: string) => {

  const url = `https://maps.googleapis.com/maps/api/geocode/json`;

  try {
    const response = await axios.get(url, {
      params: {
        address: cep,
        key: process.env.GOOGLE_API_KEY
      }
    });
    if (response.data.status === 'OK') {
      console.log(`Funcionando: ${response.data.status}`);
    } else {
      console.log(`Erro na API: Sem resultados`);
    }
    return response.data.results[0].geometry.location;
  } catch (error) {
    console.error('Erro ao fazer a solicitação para a Geocoding API');
  }
}

export const nearestStores = async (cep: string) => {

  logger.info(`Iniciando a consulta de lojas para o CEP: ${cep}`);

  try {
    const formattedCep = formatCep(cep.trim());
    const coordinates = await getGeoLoc(formattedCep);

    if (!coordinates || !coordinates.lat || !coordinates.lng) {
      throw new Error('Não foi possível obter as coordenadas para o CEP informado.');
    }

    logger.info(`Coordenadas obtidas: ${coordinates.lat}, ${coordinates.lng}`);

    const { lat, lng } = coordinates;
    const stores = await exportDataBase();

    const nearests = await stores.aggregate([
      {
        $geoNear: {
          near: { type: 'Point', coordinates: [lat, lng] },
          distanceField: 'distancia',
          maxDistance: 100000,
          spherical: true,
        },
      },
      {
        $sort: { distancia: 1 },
      },
    ]).toArray();

    if (nearests.length === 0) {
      logger.info('Nenhuma loja encontrada no raio de 100 km.');
      return { success: true, message: 'Nenhuma loja encontrada dentro de um raio de 100 km.' };
    }

    logger.info(`Encontradas ${nearests.length} lojas.`);
    return { success: true, data: nearests };

  } catch (error) {
    logger.error(`Erro ao processar a consulta de lojas: ${error instanceof Error ? error.message : error}`);
    return { success: false, message: error instanceof Error ? error.message : 'Erro desconhecido. Tente novamente mais tarde.' };
  }
};

