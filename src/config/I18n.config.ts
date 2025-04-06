import { ConfigType, registerAs } from "@nestjs/config";
import { join } from "path";

import { env, isDev } from "~/global/env";

export const I18nRegToken = "il8n";

export const I18nConfig = registerAs(I18nRegToken, () => {
  let types_path = isDev ? join(process.cwd(),"types/i18n.generated.ts") : join(__dirname, "../../types/i18n.generated.ts");
  return {
    fallbackLanguage: env("FALLBACK_LANGUAGE"),
    loaderOptions: {
      path: join(__dirname, "../i18n/"),
      watch: true,
    },
    throwOnMissingKey: true,
    typesOutputPath: types_path,
  };
});

export type IIi8nConfig = ConfigType<typeof I18nConfig>;
