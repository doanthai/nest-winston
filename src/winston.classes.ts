/* eslint @typescript-eslint/explicit-module-boundary-types: 'off' */
import { Logger } from 'winston';
import { LoggerService } from '@nestjs/common';
import { AsyncLocalStorage } from 'node:async_hooks';

export class WinstonLogger implements LoggerService {
  private context?: string;

  constructor(
    private readonly logger: Logger,
    private readonly als?: AsyncLocalStorage<any>,
  ) {}

  public setContext(context: string) {
    this.context = context;
  }

  public log(message: any, context?: string): any {
    const requestId = this.als?.getStore()?.requestId ?? '';
    context = context || this.context;

    if (!!message && 'object' === typeof message) {
      const { message: msg, level = 'info', ...meta } = message;

      return this.logger.log(level, msg as string, { context, requestId, ...meta });
    }

    return this.logger.info(message, { context, requestId });
  }

  public fatal(message: any, trace?: string, context?: string): any {
    const requestId = this.als?.getStore()?.requestId ?? '';
    context = context || this.context;

    if (message instanceof Error) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { message: msg, name, stack, ...meta } = message;

      return this.logger.log({
        level: 'fatal',
        message: msg,
        context,
        stack: [trace || stack],
        error: message,
        requestId,
        ...meta,
      });
    }

    if (!!message && 'object' === typeof message) {
      const { message: msg, ...meta } = message;

      return this.logger.log({ level: 'fatal', message: msg, context, stack: [trace], requestId, ...meta });
    }

    return this.logger.log({ level: 'fatal', message, context, stack: [trace], requestId });
  }

  public error(message: any, trace?: string, context?: string): any {
    const requestId = this.als?.getStore()?.requestId ?? '';
    context = context || this.context;

    if (message instanceof Error) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { message: msg, name, stack, ...meta } = message;

      return this.logger.error(msg, { context, stack: [trace || message.stack], error: message, requestId, ...meta });
    }

    if (!!message && 'object' === typeof message) {
      const { message: msg, ...meta } = message;

      return this.logger.error(msg as string, { context, stack: [trace], requestId, ...meta });
    }

    return this.logger.error(message, { context, stack: [trace], requestId });
  }

  public warn(message: any, context?: string): any {
    const requestId = this.als?.getStore()?.requestId ?? '';
    context = context || this.context;

    if (!!message && 'object' === typeof message) {
      const { message: msg, ...meta } = message;

      return this.logger.warn(msg as string, { context, requestId, ...meta });
    }

    return this.logger.warn(message, { context, requestId });
  }

  public debug?(message: any, context?: string): any {
    const requestId = this.als?.getStore()?.requestId ?? '';
    context = context || this.context;

    if (!!message && 'object' === typeof message) {
      const { message: msg, ...meta } = message;

      return this.logger.debug(msg as string, { context, requestId, ...meta });
    }

    return this.logger.debug(message, { context, requestId });
  }

  public verbose?(message: any, context?: string): any {
    const requestId = this.als?.getStore()?.requestId ?? '';
    context = context || this.context;

    if (!!message && 'object' === typeof message) {
      const { message: msg, ...meta } = message;

      return this.logger.verbose(msg as string, { context, requestId, ...meta });
    }

    return this.logger.verbose(message, { context, requestId });
  }

  public getWinstonLogger(): Logger {
    return this.logger;
  }
}
