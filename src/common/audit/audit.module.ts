import {
  APP_ENV,
  AuditService,
  AxiosHttpService,
  StdOutAuditGateway,
  WebhookAuditGateway,
} from 'mvc-common-toolkit';

import { Global, Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ENV_KEY, INJECTION_TOKEN } from '@common/constants';

const auditServiceProvider: Provider = {
  provide: INJECTION_TOKEN.AUDIT_SERVICE,
  useFactory: (configService: ConfigService) => {
    const isProd =
      configService.get(ENV_KEY.NODE_ENV, APP_ENV.DEVELOPMENT) ===
      APP_ENV.PRODUCTION;

    const webhookUrl = configService.get(ENV_KEY.AUDIT_WEBHOOK_URL, '');
    const httpService = new AxiosHttpService();
    const shouldUseWebhook = (webhookUrl && isProd && true) || !!webhookUrl;

    const gateway = shouldUseWebhook
      ? new WebhookAuditGateway(webhookUrl, httpService, {
          projectName: 'digital-hippo-backend',
        })
      : new StdOutAuditGateway();

    const auditService = new AuditService(gateway);

    return auditService;
  },
  inject: [ConfigService],
};

@Global()
@Module({
  providers: [auditServiceProvider],
  exports: [auditServiceProvider],
})
export class AuditModule {}
