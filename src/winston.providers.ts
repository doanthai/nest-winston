import { Logger, LoggerOptions, createLogger } from 'winston';
import { Provider, Type } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER, WINSTON_MODULE_OPTIONS, WINSTON_MODULE_PROVIDER } from './winston.constants';
import { WinstonModuleAsyncOptions, WinstonModuleOptions, WinstonModuleOptionsFactory } from './winston.interfaces';
import { WinstonLogger } from './winston.classes';
import { AsyncLocalStorage } from 'node:async_hooks';

export function createNestWinstonLogger(loggerOpts: WinstonModuleOptions): WinstonLogger {
  if (loggerOpts.instance) {
    return new WinstonLogger(loggerOpts.instance, loggerOpts.als);
  }
  return new WinstonLogger(createLogger(loggerOpts), loggerOpts.als);
}

export function createWinstonProviders(loggerOpts: WinstonModuleOptions): Provider[] {
  return [
    {
      provide: WINSTON_MODULE_PROVIDER,
      useFactory: () => createLogger(loggerOpts),
    },
    {
      provide: WINSTON_MODULE_NEST_PROVIDER,
      useFactory: (logger: Logger, als: AsyncLocalStorage<any>) => {
        return new WinstonLogger(logger, als);
      },
      inject: [WINSTON_MODULE_PROVIDER, AsyncLocalStorage],
    },
  ];
}

export function createWinstonAsyncProviders(options: WinstonModuleAsyncOptions): Provider[] {
  const providers: Provider[] = [
    {
      provide: WINSTON_MODULE_PROVIDER,
      useFactory: (loggerOpts: LoggerOptions) => createLogger(loggerOpts),
      inject: [WINSTON_MODULE_OPTIONS],
    },
    {
      provide: WINSTON_MODULE_NEST_PROVIDER,
      useFactory: (logger: Logger, als: AsyncLocalStorage<any>) => {
        return new WinstonLogger(logger, als);
      },
      inject: [WINSTON_MODULE_PROVIDER, AsyncLocalStorage],
    },
  ];

  if (options.useClass) {
    const useClass = options.useClass as Type<WinstonModuleOptionsFactory>;
    providers.push(
      ...[
        {
          provide: WINSTON_MODULE_OPTIONS,
          useFactory: async (optionsFactory: WinstonModuleOptionsFactory) =>
            await optionsFactory.createWinstonModuleOptions(),
          inject: [useClass],
        },
        {
          provide: useClass,
          useClass,
        },
      ],
    );
  }

  if (options.useFactory) {
    providers.push({
      provide: WINSTON_MODULE_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject || [],
    });
  }

  return providers;
}
