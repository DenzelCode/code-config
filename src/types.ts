import { ConfigInterface } from './config/config.interface';

export interface Dictionary<T = any> {
  [key: string]: T;
}

export type ConfigDefinition<T = Dictionary> = T & ConfigInterface<T>;
