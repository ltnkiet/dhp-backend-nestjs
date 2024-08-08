export enum HEADER_KEY {
  CAPTCHA_TOKEN = 'X-Captcha-Token',
  LOG_ID = 'X-Log-ID',
  SESSION_TOKEN = 'X-Session-Token',
}

export const ERR_CODE = {
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR'.toLowerCase(),
};

export const APP_ACTION = {
  HANDLE_EXCEPTION: 'HANDLE_EXCEPTION'.toLowerCase(),
};

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

  AUDIT_WEBHOOK_URL = 'AUDIT_WEBHOOK_URL',
}

export const INJECTION_TOKEN = {
  AUDIT_SERVICE: Symbol.for('AUDIT_SERVICE'),
  HTTP_SERVICE: Symbol.for('HTTP_SERVICE'),
  REDIS_SERVICE: Symbol.for('REDIS_SERVICE'),
};
