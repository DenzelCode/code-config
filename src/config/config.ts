import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { get, set, defaults } from 'lodash';
import { dirname } from 'path';
import { ConfigDefinition, Dictionary } from '../types';
import { ConfigInterface } from './config.interface';

export class Config<T = Dictionary> implements ConfigInterface<T> {
  private __isInitialized = false;

  private __prettify = false;

  constructor(private __path: string, private __defaultValues?: T) {
    this.apply(__defaultValues);
  }

  init(create: boolean = true): ConfigDefinition<T> {
    if (this.__isInitialized) {
      return this.getSelf();
    }

    this.apply(this.__defaultValues);

    this.load(create);

    this.__isInitialized = true;

    return this.getSelf();
  }

  initWithoutCreate() {
    return this.init(false);
  }

  initPrettify() {
    return this.initWithoutCreate().prettify().save();
  }

  load(create: boolean = true): ConfigDefinition<T> {
    try {
      let exists = this.exists();

      if (create && !exists) {
        this.save();

        exists = true;
      }

      if (exists) {
        const content = readFileSync(this.__path, { encoding: 'utf8' });

        const json = JSON.parse(content);

        this.apply(json);
      }
    } catch (e) {
      console.error('An error occurred parsing the config file', this.__path, e);
    }

    return this.getSelf();
  }

  get(key: string) {
    if (!this.isValidKey(key)) {
      return null;
    }

    return get(this, key);
  }

  set(key: string, value: T): ConfigDefinition<T> {
    if (!this.isValidKey(key)) {
      return this.getSelf();
    }

    set(this, key, value);

    return this.getSelf();
  }

  remove(key: string): ConfigDefinition<T> {
    if (!this.isValidKey(key)) {
      return this.getSelf();
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

    return this.getSelf();
  }

  clear(): ConfigDefinition<T> {
    for (const key in this) {
      if (!this.isValidKey(key)) {
        continue;
      }

      this.remove(key);
    }

    return this.getSelf();
  }

  apply(object: T): ConfigDefinition<T> {
    if (!object) {
      return this.getSelf();
    }

    object = defaults(object, this.__defaultValues ?? {});

    for (const key in object) {
      if (key in this && !this.isValidKey(key)) {
        continue;
      }

      (this as Dictionary)[key] = object[key];
    }

    return this.getSelf();
  }

  isValidKey(key: string): boolean {
    return !key.startsWith('__') && typeof (this as Dictionary)[key] !== 'function';
  }

  prettify(): ConfigDefinition<T> {
    this.__prettify = true;

    return this.getSelf();
  }

  normalize(): ConfigDefinition<T> {
    this.__prettify = false;

    return this.getSelf();
  }

  save(prettify?: boolean): ConfigDefinition<T> {
    const parentDir = dirname(this.__path);

    if (!existsSync(parentDir)) {
      mkdirSync(parentDir, { recursive: true });
    }

    writeFileSync(this.__path, this.toJSON(prettify || this.__prettify));

    return this.getSelf();
  }

  toJSON(prettify?: boolean): string {
    const object: Dictionary = {};

    for (const key in this) {
      if (this.isValidKey(key)) {
        object[key] = this[key];
      }
    }

    if (prettify || this.__prettify) {
      return JSON.stringify(object, null, '\t');
    } else {
      return JSON.stringify(object);
    }
  }

  toObject(): T {
    return JSON.parse(this.toJSON());
  }

  exists(): boolean {
    return this.__path && this.__path !== '.' && existsSync(this.__path);
  }

  setPath(path: string, create: boolean = true): void {
    this.__path = path;

    this.load(create);
  }

  private getSelf() {
    return this as unknown as ConfigDefinition<T>;
  }
}
