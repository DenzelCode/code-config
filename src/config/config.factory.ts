import { ConfigDefinition, Dictionary } from '../types';
import { Config } from './config';

export class ConfigFactory {
  private static storage: Dictionary<Config<any>> = {};

  static getConfig<T extends Object = Dictionary>(
    path: string,
    defaultValues?: T,
  ): ConfigDefinition<T> {
    const config = this.storage[path] || (this.storage[path] = new Config<T>(path, defaultValues));

    return config as unknown as ConfigDefinition<T>;
  }
}
