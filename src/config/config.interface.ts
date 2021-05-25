import { Dictionary } from '../types';

export interface ConfigDefinition<T = Dictionary> {
  get(key: string): any;

  init(create?: boolean): T & ConfigDefinition<T>;

  set(key: string, value: T): T & ConfigDefinition<T>;

  save(): T & ConfigDefinition<T>;

  remove(key: string): T & ConfigDefinition<T>;

  clear(): T & ConfigDefinition<T>;

  exists(): boolean;

  setPath(path: string, create?: boolean): void;
}
