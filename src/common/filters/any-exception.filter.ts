import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { PathImpl2 } from "@nestjs/config";
import { FastifyReply, FastifyRequest } from "fastify";
import { I18nContext } from "nestjs-i18n";
import { QueryFailedError } from "typeorm";
import { I18nTranslations } from "types/i18n.generated";

import { BusinessException } from "~/common/exceptions/biz.exception";
import { isDev } from "~/global/env";

interface myError {
  readonly status: number;
  readonly statusCode?: number;

  readonly message?: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor() {
    this.registerCatchAllExceptionsHook();
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<FastifyRequest>();
    const response = ctx.getResponse<FastifyReply>();
    const i18n = I18nContext.current<I18nTranslations>(host);
    const url = request.raw.url!;
    const status = this.getStatus(exception);
    let message = this.getErrorMessage(exception);
    try {
      // 只针对 DTO 的验证 进行转换
      let i18n_path = `${message}` as PathImpl2<I18nTranslations>;
      let error = i18n.t(i18n_path) as string;
      let error_array = error?.split(":");
      message = error_array?.[error_array.length - 1] ?? "";
    } catch (error) {
      this.logger.error(`Error：(${status}) not i18n ${error?.message} Path: ${decodeURI(url)}`);
    }
    // 系统内部错误时
    if (
      status === HttpStatus.INTERNAL_SERVER_ERROR &&
      !(exception instanceof BusinessException)
    ) {
      Logger.error(exception, undefined, "Catch");
      // 生产环境下隐藏错误信息
      if (!isDev) message = i18n.t("index.System.SERVER_ERROR")?.split(":")[1];
    } else {
      this.logger.warn(`Error：(${status}) ${message} Path: ${decodeURI(url)}`);
    }

    const apiErrorCode =
      exception instanceof BusinessException
        ? exception.getErrorCode()
        : status;
    // 返回基础响应结果
    const resBody: IBaseResponse = {
      status: apiErrorCode,
      message,
      data: null,
    };
    response.status(status).send(resBody);
  }

  getStatus(exception: unknown): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    } else if (exception instanceof QueryFailedError) {
      console.log("This is QueryFailedError");
      return HttpStatus.INTERNAL_SERVER_ERROR;
    } else {
      console.log("This is myError=========", exception);
      return (
        (exception as myError)?.status ??
        (exception as myError)?.statusCode ??
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  getErrorMessage(exception: unknown): string {
    if (exception instanceof HttpException) {
      return exception.message;
    } else if (exception instanceof QueryFailedError) {
      return exception.message;
    } else {
      return (
        (exception as any)?.response?.message ??
        (exception as myError)?.message ??
        `${exception}`
      );
    }
  }

  registerCatchAllExceptionsHook() {
    process.on("unhandledRejection", (reason) => {
      console.error("unhandledRejection: ", reason);
    });

    process.on("uncaughtException", (err) => {
      console.error("uncaughtException: ", err);
    });
  }
}
