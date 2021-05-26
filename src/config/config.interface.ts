import { ConfigDefinition, Dictionary } from '../types';

export interface ConfigInterface<T = Dictionary> {
  get(key: string): any;

  init(create?: boolean): ConfigDefinition<T>;

  set(key: string, value: T): ConfigDefinition<T>;

  save(): ConfigDefinition<T>;

  remove(key: string): ConfigDefinition<T>;

  clear(): ConfigDefinition<T>;

  exists(): boolean;

  setPath(path: string, create?: boolean): void;

  apply(object: T): void;

  load(create: boolean): ConfigDefinition<T>;
}
