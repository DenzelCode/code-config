import { Dictionary } from '../types';

export interface ConfigInterface<T = Dictionary> {
  get(key: string): any;

  init(create?: boolean): T & ConfigInterface<T>;

  set(key: string, value: T): T & ConfigInterface<T>;

  save(): T & ConfigInterface<T>;

  remove(key: string): T & ConfigInterface<T>;

  clear(): T & ConfigInterface<T>;

  exists(): boolean;

  setPath(path: string, create?: boolean): void;

  apply(object: T): void;
}
