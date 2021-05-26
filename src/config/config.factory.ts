import { Dictionary } from '../types';
import { Config } from './config';

export class ConfigFactory {
  private static storage: Dictionary<Config<any>>;

  static getConfig<T extends Object = Dictionary<any>>(path: string, defaultValues?: T): Config<T> {
    return this.storage[path] || new Config<T>(path, defaultValues);
  }
}
