import { Dictionary } from '../types';
import { Config } from './config';

export class ConfigFactory {
  static getConfig<T extends Object = Dictionary<any>>(path: string, defaultValues?: T): Config<T> {
    return new Config<T>(path, defaultValues);
  }
}
