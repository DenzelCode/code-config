import { ConfigDefinition, Dictionary } from '../types';

export interface ConfigInterface<T = Dictionary> {
  get(key: string): any;

  initWithoutCreate(): ConfigDefinition<T>;

  init(create?: boolean): ConfigDefinition<T>;

  initPrettify(): ConfigDefinition<T>;

  set(key: string, value: T): ConfigDefinition<T>;

  save(prettify?: boolean): ConfigDefinition<T>;

  toJSON(prettify?: boolean): string;

  toObject(): T;

  remove(key: string): ConfigDefinition<T>;

  clear(): ConfigDefinition<T>;

  exists(): boolean;

  setPath(path: string, create?: boolean): void;

  apply(object: T): ConfigDefinition<T>;

  load(create: boolean): ConfigDefinition<T>;

  prettify(): ConfigDefinition<T>;

  normalize(): ConfigDefinition<T>;
}
