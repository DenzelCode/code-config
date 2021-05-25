import { existsSync, readFileSync, writeFileSync } from 'fs';
import { get, set, defaults } from 'lodash';
import { Dictionary } from '../types';
import { ConfigDefinition } from './config.interface';

export class Config<T = Dictionary> implements ConfigDefinition<T> {
  constructor(private _path: string, private _defaultValues?: T) {}

  init(create: boolean = true): T & ConfigDefinition<T> {
    this.apply(this._defaultValues);

    this.load(create);

    return this as unknown as T & ConfigDefinition<T>;
  }

  load(create: boolean = true): T & ConfigDefinition<T> {
    try {
      let exists = this.exists();

      if (create && !exists) {
        this.save();

        exists = true;
      }

      if (exists) {
        const content = readFileSync(this._path, { encoding: 'utf8' });

        const json = JSON.parse(content);

        this.apply(json);
      }
    } catch (e) {
      console.error('An error occurred parsing the config file', this._path, e);
    }

    return this as unknown as T & ConfigDefinition<T>;
  }

  get(key: string) {
    if (!this.isValidKey(key)) {
      return null;
    }

    return get(this, key);
  }

  set(key: string, value: T): T & ConfigDefinition<T> {
    if (!this.isValidKey(key)) {
      return this as unknown as T & ConfigDefinition<T>;
    }

    set(this, key, value);

    return this as unknown as T & ConfigDefinition<T>;
  }

  remove(key: string): T & ConfigDefinition<T> {
    if (!this.isValidKey(key)) {
      return this as unknown as T & ConfigDefinition<T>;
    }

    const properties = key.split('.');

    let values: Dictionary = this;

    properties.forEach((segment, index) => {
      if (
        !values ||
        !(segment in values) ||
        (!(values[segment] instanceof Object) &&
          !Array.isArray(values[segment]) &&
          index !== properties.length - 1)
      ) {
        return;
      }

      if (index === properties.length - 1) {
        delete values[segment];

        return;
      }

      values = values[segment];
    });

    return this as unknown as T & ConfigDefinition<T>;
  }

  clear(): T & ConfigDefinition<T> {
    for (const key in this) {
      if (!this.isValidKey(key)) {
        continue;
      }

      this.remove(key);
    }

    return this as unknown as T & ConfigDefinition<T>;
  }

  private apply(object: Dictionary): void {
    object = defaults(object, this._defaultValues ?? {});

    for (const key in object) {
      if (key in this && !this.isValidKey(key)) {
        continue;
      }

      (this as Dictionary)[key] = object[key];
    }
  }

  isValidKey(key: string): boolean {
    return !key.startsWith('_') && typeof (this as Dictionary)[key] !== 'function';
  }

  save(): T & ConfigDefinition<T> {
    writeFileSync(this._path, this.toJSON());

    return this as unknown as T & ConfigDefinition<T>;
  }

  toJSON(): string {
    const object: Dictionary = {};

    for (const key in this) {
      if (this.isValidKey(key)) {
        object[key] = this[key];
      }
    }

    return JSON.stringify(object, null, '\t');
  }

  exists(): boolean {
    return this._path && this._path !== '.' && existsSync(this._path);
  }

  setPath(path: string, create: boolean = true): void {
    this._path = path;

    this.load(create);
  }
}
