import fs from 'fs';
import path from 'path';
import {
  getController,
  getEntity,
  getGateway,
  getModule,
  getRepository,
  getService,
  getTransformer,
} from './stubs';

export interface GeneratorResponse {
  success: boolean;
  message: string;
}

export default class Generator {
  public readonly basePath = path.resolve('src', 'main');

  public readonly entityPath = path.resolve(this.basePath, 'entities');

  public readonly servicePath = path.resolve(this.basePath, 'services');

  public readonly controllerPath = path.resolve(this.basePath, 'controllers');

  public readonly modulesPath = path.resolve(this.basePath, 'modules');

  public readonly repositoryPath = path.resolve(this.basePath, 'repositories');

  public readonly transformerPath = path.resolve(this.basePath, 'transformers');

  public readonly gatewayPath = path.resolve(this.basePath, 'gateways');

  constructor(private readonly entity: string, private table: string) {
    this.entity = this.entity.toLowerCase();
  }

  public async addEntityToMainModule(): Promise<GeneratorResponse> {
    try {
      const file = await this.readMainModule();
      const [headImports, splitModule] = file.split('@Module({\r\n');
      const [, splitImport] = splitModule.split(' imports: ');
      const [modulesArray] = splitImport
        .replace('[', '')
        .replace(/[\r\n]+/gm, '')
        .split('],');

      const unsanitizedModules = modulesArray
        .split(',')
        .map((module) => module.trim());

      const modules = [];

      unsanitizedModules.forEach((module) => {
        if (module) {
          modules.push(module.trim());
        }
      });

      const moduleName = `${this.entityCapitalized}Module`;
      if (modules.includes(moduleName)) {
        modules.push(moduleName);

        const parsed = `[\n ${modules.join(', \n')}, \n]`;

        const [toReplace] = splitImport.split('],');

        // Adiciona o novo modulo
        let newFile = file.replace(`${toReplace}]`, parsed);

        // Adiciona o import do novo modulo
        const unsanitizedImports = headImports.split("';");

        const imports = [];

        unsanitizedImports.forEach((imported) => {
          imported = imported.replace(/[\r\n]+/gm, '').trim();

          if (imported) {
            imports.push(`${imported}';`);
          }
        });

        const lastImport = imports[imports.length - 1];
        const newImport = `${lastImport} \n import { ${this.entityCapitalized}Module } from './${this.entityCapitalized}Module';`;

        newFile = newFile.replace(lastImport, newImport);

        const writed = await this.writeMainModule(newFile);

        return {
          success: writed,
          message: writed
            ? 'Modulo adicionado com sucesso'
            : 'Não foi possível adicionaro modulo, adicione manualmente !',
        };
      }
      return { success: true, message: 'Módulo já está sendo importado' };
    } catch (e) {
      return { success: false, message: e.message };
    }
  }

  private readMainModule(): Promise<string> {
    return new Promise((resolve, reject) => {
      fs.readFile(
        path.resolve(this.modulesPath, 'Modules.ts'),
        'utf8',
        (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        },
      );
    });
  }

  private writeMainModule(data: string): Promise<boolean> {
    return this.write(data, 'Modules.ts', this.modulesPath);
  }

  public async generateTransformer(): Promise<GeneratorResponse> {
    try {
      const stub = await getTransformer();
      const replaced = this.replace(stub);
      const filename = `${this.entityCapitalized}Transformer.ts`;
      const writed = await this.write(replaced, filename, this.transformerPath);

      return { success: writed, message: 'Transformer gerado !' };
    } catch (e) {
      return { success: false, message: e.message };
    }
  }

  public async generateGateway(): Promise<GeneratorResponse> {
    try {
      const stub = await getGateway();
      const replaced = this.replace(stub);
      const filename = `${this.entityCapitalized}Gateway.ts`;
      const writed = await this.write(replaced, filename, this.gatewayPath);

      return { success: writed, message: 'Transformer gerado !' };
    } catch (e) {
      return { success: false, message: e.message };
    }
  }

  public async generateEntity(): Promise<GeneratorResponse> {
    try {
      const stub = await getEntity();
      const replaced = this.replace(stub);
      const filename = `${this.capitalizeFirst(this.entity)}.ts`;
      const writed = await this.write(replaced, filename, this.entityPath);

      return { success: writed, message: 'Entidade gerada !' };
    } catch (e) {
      return { success: false, message: e.message };
    }
  }

  public async generateController(): Promise<GeneratorResponse> {
    try {
      const stub = await getController();
      const replaced = this.replace(stub);
      const filename = `${this.entityCapitalized}Controller.ts`;
      const writed = await this.write(replaced, filename, this.controllerPath);

      return { success: writed, message: 'Controller gerada !' };
    } catch (e) {
      return { success: false, message: e.message };
    }
  }

  public async generateModule(): Promise<GeneratorResponse> {
    try {
      const stub = await getModule();
      const replaced = this.replace(stub);
      const filename = `${this.entityCapitalized}Module.ts`;
      const writed = await this.write(replaced, filename, this.modulesPath);

      return { success: writed, message: 'Modulo gerado !' };
    } catch (e) {
      return { success: false, message: e.message };
    }
  }

  public async generateService(): Promise<GeneratorResponse> {
    try {
      const stub = await getService();
      const replaced = this.replace(stub);
      const filename = `${this.entityCapitalized}Service.ts`;
      const writed = await this.write(replaced, filename, this.servicePath);

      return { success: writed, message: 'Service gerado !' };
    } catch (e) {
      return { success: false, message: e.message };
    }
  }

  public async generateRepository(): Promise<GeneratorResponse> {
    try {
      const stub = await getRepository();
      const replaced = this.replace(stub);
      const filename = `${this.entityCapitalized}Repository.ts`;
      const writed = await this.write(replaced, filename, this.repositoryPath);

      return { success: writed, message: 'Repository gerado !' };
    } catch (e) {
      return { success: false, message: e.message };
    }
  }

  private replace(file: string): string {
    return file
      .replace(this.entityRegex, this.entity)
      .replace(this.entity1UpperRegex, this.capitalizeFirst(this.entity))
      .replace(this.tableRegex, this.table.toLowerCase());
  }

  private get entityRegex() {
    return new RegExp('{{entity}}', 'g');
  }

  private get entity1UpperRegex() {
    return new RegExp('{{Entity}}', 'g');
  }

  private get tableRegex() {
    return new RegExp('{{table}}', 'g');
  }

  private write(
    data: string,
    filename: string,
    filepath: string,
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      fs.writeFile(path.resolve(filepath, filename), data, 'utf8', (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  }

  private get entityCapitalized() {
    return this.capitalizeFirst(this.entity);
  }

  public capitalizeFirst(str: string): string {
    return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
  }
}
