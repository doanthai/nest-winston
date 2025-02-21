import { Logger, LoggerOptions } from 'winston';
import { ModuleMetadata } from '@nestjs/common/interfaces';
import { Type } from '@nestjs/common';
import { AsyncLocalStorage } from 'node:async_hooks';

export type WinstonModuleOptions = LoggerOptions & {
  /**
   * Optional Winston instance to use
   * This takes precedence on any other options provided
   */
  instance?: Logger;
  /**
   * Optional AsyncLocalStorage instance to use
   * This is used to store the current request id
   */
  als?: AsyncLocalStorage<any>;
};

export type NestLikeConsoleFormatOptions = {
  colors?: boolean;
  prettyPrint?: boolean;
  processId?: boolean;
  appName?: boolean;
};

export interface WinstonModuleOptionsFactory {
  createWinstonModuleOptions(): Promise<WinstonModuleOptions> | WinstonModuleOptions;
}

export interface WinstonModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (
    ...args: any[]
  ) => Promise<WinstonModuleOptions> | WinstonModuleOptions;
  inject?: any[];
  useClass?: Type<WinstonModuleOptionsFactory>;
}
