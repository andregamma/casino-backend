import moment from 'moment';
import fs from 'fs';
import path from 'path';
import { brFormat } from '../utils/dateUtils';

export class FLogger {
  private path = path.resolve('logs');

  private get date(): string {
    return moment(Date.now()).format('MM-YYYY');
  }

  private get fullpath() {
    return path.resolve(this.path, this.date);
  }

  private get time(): string {
    return moment(Date.now()).format('DD-MM-YYYY');
  }

  private fullTime(add?: string): string {
    return `[${moment().format(brFormat)}] ${add || ''}`;
  }

  public getAllLogs() {
    const dir = fs.readdirSync(this.path);
    const objs = [];

    dir.forEach((d) => {
      const p = path.resolve(this.path, d);

      const files = fs.readdirSync(p);

      files.forEach((file) => {
        const pf = path.resolve(p, file);
        const data: string = fs.readFileSync(pf, { encoding: 'utf8' });

        data.split('\n').forEach((str) => {
          try {
            if (str) {
              objs.push(JSON.parse(str));
            }
          } catch (e) {
            console.log(str, e.message);
          }
        });
      });
    });

    return objs;
  }

  log(message: any, save = false) {
    console.log(this.fullTime('LOG -'), message);
    if (save) {
      this.save(message, 'log');
    }
  }

  error(message: any) {
    console.log('\x1b[1m\x1b[31m%s\x1b[0m', this.fullTime('ERROR -'), message);
    this.save(message, 'error');
  }

  warn(message: any) {
    console.log('\x1b[1m\x1b[33m%s\x1b[0m', this.fullTime('WARN -'), message);
    this.save(message, 'warn');
  }

  private save(message: any, type: string) {
    const obj = {
      type,
      message,
      time: this.fullTime().replace('[', '').replace('] ', ''),
    };

    if (!fs.existsSync(this.path)) {
      fs.mkdirSync(this.path);
    }

    const filename = `${this.time}.log`;
    const filepath = path.resolve(this.fullpath, filename);
    const str = `${JSON.stringify(obj)}\n`;

    if (!fs.existsSync(this.fullpath)) {
      fs.mkdirSync(this.fullpath);
    }

    if (fs.existsSync(filepath)) {
      fs.appendFileSync(filepath, str);
    } else {
      fs.writeFileSync(filepath, str);
    }
  }
}
