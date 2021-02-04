import Questioner from './questioner';
import Generator from './generator';
import { exec } from 'child_process';

const questioner = new Questioner();

(async () => {
  const [, , entity] = process.argv;

  // const entity = await questioner.ask('Nome da entidade:')
  // const table = await questioner.ask('Nome da tabela:')

  const customTable = await questioner.ask(
    'Usar nome de tabela customizado ? [y/N]:',
  );
  let table = `${entity}s`;

  if (customTable.includes('y')) {
    table = await questioner.ask('Nome da tabela:');
  }

  const generator = new Generator(entity, table);

  const generateEntity = await questioner.ask('Gerar entidade ? [N/y]:');

  if (generateEntity.includes('y')) {
    const entityGenerated = await generator.generateEntity();

    console.log(entityGenerated.message);
  }

  const generateController = await questioner.ask('Gerar Controller ? [Y/n]:');

  // Por padrão vai gerar a controller
  if (!generateController || generateController.includes('y')) {
    const controllerGenerated = await generator.generateController();

    console.log(controllerGenerated.message);
  }

  const generateGateway = await questioner.ask('Gerar Gateway ? [N/y]');

  if (generateGateway.includes('y')) {
    const gatewayGenerated = await generator.generateGateway();

    console.error(gatewayGenerated.message);
  }

  const generateModule = await questioner.ask('Gerar Modulo ? [Y/n]:');

  if (!generateModule || generateModule.includes('y')) {
    const moduleGenerated = await generator.generateModule();

    console.log(moduleGenerated.message);
  }

  const generateService = await questioner.ask('Gerar Service ? [Y/n]:');

  if (!generateService || generateService.includes('y')) {
    const serviceGenerated = await generator.generateService();

    console.log(serviceGenerated.message);
  }

  const generateRepository = await questioner.ask('Gerar Repository ? [Y/n]:');

  if (!generateRepository || generateRepository.includes('y')) {
    const repositoryGenerated = await generator.generateRepository();

    console.log(repositoryGenerated.message);
  }

  const autoInsertModule = await questioner.ask(
    'Auto importar o modulo ? [Y/n]:',
  );

  if (!autoInsertModule || autoInsertModule.includes('y')) {
    const moduleInserted = await generator.addEntityToMainModule();

    console.log(moduleInserted.message);
  }

  questioner.end();

  exec('yarn prettier');
})();
