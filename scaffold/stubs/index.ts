import fs from 'fs';
import path from 'path';

const getFile = (name): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.resolve(__dirname, name), 'utf-8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const getEntity = () => getFile('entity.stub');

const getController = () => getFile('controller.stub');

const getModule = () => getFile('module.stub');

const getService = () => getFile('service.stub');

const getRepository = () => getFile('repository.stub');

const getGateway = () => getFile('gateway.stub');

const getTransformer = () => getFile('transformer.stub');

export {
  getEntity,
  getController,
  getModule,
  getService,
  getRepository,
  getGateway,
  getTransformer,
};
