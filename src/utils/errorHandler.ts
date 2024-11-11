import logger from './logger';

export function handleInvalidCepError(cep: string): string {
  const message = `Digite um CEP válido (ex: 01001-000)`;
  return message;
}

export function handleOtherError(error: Error): string {
  const message = `Ocorreu um erro: ${error.message}`;
  logger.error({
    message: 'Erro inesperado',
    error: error.message,
    stack: error.stack,
  });
  return message;
}
  
  export const handleApiError = (message: string) => {
    logger.error(message);
    return `Erro ao processar a solicitação: ${message}`;
  };