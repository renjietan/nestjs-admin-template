import { BadRequestException, Controller, Post, Req } from "@nestjs/common";
import {
  ApiBody,
  ApiConsumes,
  ApiExcludeController,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { FastifyRequest } from "fastify";

import { AuthUser } from "~/common/decorators/auth/auth-user.decorator";
import {
  definePermission,
  Perm,
} from "~/common/decorators/auth/permission.decorator";

import { ApiSecurityAuth } from "~/common/decorators/swagger.decorator";

import { I18nService } from "nestjs-i18n";
import { I18nTranslations } from "types/i18n.generated";
import { FileUploadDto } from "./upload.dto";
import { UploadService } from "./upload.service";

export const permissions = definePermission("upload", {
  UPLOAD: "upload",
} as const);

@ApiExcludeController()
@ApiSecurityAuth()
@ApiTags("Tools - 上传模块")
@Controller("upload")
export class UploadController {
  constructor(
    private uploadService: UploadService,
    private readonly i18n: I18nService<I18nTranslations>
  ) {}

  @Post()
  @Perm(permissions.UPLOAD)
  @ApiOperation({ summary: "上传" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    type: FileUploadDto,
  })
  async upload(@Req() req: FastifyRequest, @AuthUser() user: IAuthUser) {
    if (!req.isMultipart())
      throw new BadRequestException("Request is not multipart");

    const file = await req.file();

    // https://github.com/fastify/fastify-multipart
    // const parts = req.files()
    // for await (const part of parts)
    //   console.log(part.file)

    try {
      const path = await this.uploadService.saveFile(file, user?.uid ?? -1);

      return {
        filename: path,
      };
    } catch (error) {
      throw new BadRequestException(this.i18n.t("index.File.UploadFailed"));
    }
  }
}
