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
