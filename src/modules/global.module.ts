import { AxiosHttpService, stringUtils } from 'mvc-common-toolkit';

import { Global, Logger, Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { ENV_KEY, INJECTION_TOKEN } from '@common/constants';

const httpServiceProvider: Provider = {
  provide: INJECTION_TOKEN.HTTP_SERVICE,
  useFactory: () => {
    return new AxiosHttpService();
  },
};

const JwtModuleProvider = JwtModule.registerAsync({
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const logger = new Logger('JwtModule');
    let secret = configService.get(ENV_KEY.JWT_SECRET);
    if (!secret) {
      logger.warn(
        'JWT_SECRET config is not set. A random secret will be used, and all JWTs will be invalid after a restart.',
      );

      secret = stringUtils.generatePassword();
    }
    return {
      secret,
      signOptions: {
        expiresIn: configService.get(ENV_KEY.JWT_EXPIRATION, '24h'),
      },
    };
  },
});

@Global()
@Module({
  providers: [httpServiceProvider],
  exports: [INJECTION_TOKEN.HTTP_SERVICE, JwtModuleProvider],
  imports: [JwtModuleProvider],
})
export class GlobalModule {}
