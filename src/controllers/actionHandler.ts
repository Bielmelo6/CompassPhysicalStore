import readline from 'readline';
import { nearestStores } from '../services/cepService';
import logger from '../utils/logger';
import { formatCep } from '../utils/formatCep';

async function handleAction(action: string) {
  switch (action) {
    case "consulta":
      await promptCep();
      break;
    case "finalizar":
      console.log("Finalizando o programa...");
      rl.close();
      process.exit(0);
      break;
    default:
      console.log("Ação não reconhecida.");
      promptAction();
      break;
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function promptAction() {
  rl.question("\nDigite a ação (consulta ou finalizar): ", async (action) => {
    await handleAction(action.trim().toLowerCase());
  });
}

async function promptCep() {
    rl.question("Digite o CEP para consulta: ", async (cep) => {
        logger.info({
            message: 'Iniciada consulta de CEP',
            cep: cep.trim(),
          });
      try {
        const response = await nearestStores(cep.trim());
  
        if (response.success) {
          if (Array.isArray(response.data) && response.data.length > 0) {
            logger.info({
                message: 'Lojas encontradas',
                totalLojas: response.data.length,
                cep: formatCep(cep.trim()),
              });
            console.log("Lojas encontradas dentro de um raio de 100 km:");
            response.data.forEach((loja, index) => {
              const distanciaKm = (loja.distancia / 1000).toFixed(2);
              const complemento = loja.complemento ? `Complemento: ${loja.complemento}, ` : "";
              console.log(`${index + 1}. Nome: ${loja.nome}, Cidade: ${loja.localidade}, Logradouro: ${loja.logradouro}, ${complemento}Distância: ${distanciaKm} km`);
            });
          } else {
            logger.info({
                message: 'Nenhuma loja encontrada',
                cep: formatCep(cep.trim()),
              });
            console.log("Nenhuma loja encontrada dentro de um raio de 100 km.");
          }
        } else {
          console.log(response.message);  
        }
      } catch (error) {
        if (error instanceof Error) {
          console.log("Erro ao processar a solicitação:", error.message);
        } else {
          console.log("Erro desconhecido. Tente novamente mais tarde.");
        }
      }
  
      promptAction();  // Volta para o menu de ações
    });
  }
export function startPrompt() {
  promptAction();
}