const environments = {
  dev: {
    baseUrl: 'https://app.creditcard.demo',
    apiBaseUrl: 'https://api.creditcard.demo'
  },
  qa: {
    baseUrl: 'https://qa.app.creditcard.demo',
    apiBaseUrl: 'https://qa.api.creditcard.demo'
  },
  staging: {
    baseUrl: 'https://staging.app.creditcard.demo',
    apiBaseUrl: 'https://staging.api.creditcard.demo'
  },
  prod: {
    baseUrl: 'https://prod.app.creditcard.demo',
    apiBaseUrl: 'https://prod.api.creditcard.demo'
  }
};

const currentEnv = process.env.TEST_ENV || 'dev';

function getBaseUrl() {
  return environments[currentEnv].baseUrl;
}

function getApiBaseUrl() {
  return environments[currentEnv].apiBaseUrl;
}

module.exports = {
  getBaseUrl,
  getApiBaseUrl,
  currentEnv
};