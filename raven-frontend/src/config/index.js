import configDev from './env/config.dev';
import configLocal from './env/config.local';
import configTest from './env/config.testing';
import configStaging from './env/config.staging';
import configProduction from './env/config.prod';

const config =
  {
    local: configLocal,
    development: configDev,
    test: configTest,
    staging: configStaging,
    production: configProduction,
  }[process.env.REACT_APP_ENV] || configLocal;

export default config;
