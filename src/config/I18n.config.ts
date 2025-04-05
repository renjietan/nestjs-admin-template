import { ConfigType, registerAs } from "@nestjs/config";
import { join } from "path";

import { env } from "~/global/env";

export const I18nRegToken = "il8n";

export const I18nConfig = registerAs(I18nRegToken, () => {
    return {
        fallbackLanguage: env("FALLBACK_LANGUAGE"),
        loaderOptions: {
          path: join(__dirname, "../i18n/"),
          watch: true,
        },
        throwOnMissingKey: true,
        typesOutputPath: join(__dirname, '../../types/i18n.generated.ts'),
      }
});

export type IIi8nConfig = ConfigType<typeof I18nConfig>;
