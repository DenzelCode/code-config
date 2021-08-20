# code-config
A type friendly JSON configuration file for NodeJS.

## Why Lodash?

code-config makes dealing with dynamic/static configuration files in TypeScript so much easier since it implements a system that allows you to define the JSON definition and it can also infer the types by the default value you pass through parameters.

## Installation

Using yarn:
```shell
$ yarn add code-config
```

Using npm:
```shell
$ npm i code-config
```
Note: add `--save` if you are using npm < 5.0.0

## Examples

Getting a JSON configuration file from a path:

```typescript
import { ConfigFactory } from 'code-config';

interface Definition {
  hello: string
}

export const config = ConfigFactory.getConfig<Definition>('path/to/config.json').initPrettify();

console.log(config.hello); // Should work perfectly.

console.log(config.test); // Should throw a type error.
```
