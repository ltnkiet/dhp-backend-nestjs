export enum ENV_KEY {
  NODE_ENV = 'NODE_ENV',
  PORT = 'PORT',

  MONGO_URI = 'MONGO_URI',

  AUDIT_GATEWAY_URL = 'AUDIT_GATEWAY_URL',
  AUDIT_GATEWAY_USERNAME = 'AUDIT_GATEWAY_USERNAME',
  AUDIT_GATEWAY_PASSWORD = 'AUDIT_GATEWAY_PASSWORD',

  JWT_EXPIRATION = 'JWT_EXPIRATION',
  JWT_SECRET = 'JWT_SECRET',

  GOOGLE_RECAPTCHA_SECRET = 'GOOGLE_RECAPTCHA_SECRET',
  GOOGLE_RECAPTCHA_VERIFY_ENDPOINT = 'GOOGLE_RECAPTCHA_VERIFY_ENDPOINT',

  SMTP_MAIL_FROM = 'SMTP_MAIL_FROM',
  SMTP_HOST = 'SMTP_HOST',
  SMTP_PORT = 'SMTP_PORT',
  SMTP_SECURE = 'SMTP_SECURE',
  SMTP_USERNAME = 'SMTP_USERNAME',
  SMTP_PASSWORD = 'SMTP_PASSWORD',

  APP_PUBLIC_URL = 'APP_PUBLIC_URL',

  REDIS_HOST = 'REDIS_HOST',
  REDIS_PORT = 'REDIS_PORT',
  REDIS_PASSWORD = 'REDIS_PASSWORD',
  SERVICE_NAME = 'SERVICE_NAME',

  AUDIT_WEBHOOK_URL = 'AUDIT_WEBHOOK_URL',
}

export const INJECTION_TOKEN = {
  AUDIT_SERVICE: Symbol.for('AUDIT_SERVICE'),
  HTTP_SERVICE: Symbol.for('HTTP_SERVICE'),
  REDIS_SERVICE: Symbol.for('REDIS_SERVICE'),
};
