import logger from "./logger";

export const formatCep = (cep: string) => {
    const cleanedCep = cep.replace(/\D/g, '');
    if (cleanedCep.length !== 8) {
      throw new Error('CEP inválido');
    }
    return cleanedCep.replace(/^(\d{5})(\d{3})$/, '$1-$2');
  };