const fs = require('fs');
const path = require('path');

function getBaseUrl() {
  const env = process.env.TEST_ENV || 'qa';
  const configPath = path.join(__dirname, '../../data/urls.json');
  
  if (!fs.existsSync(configPath)) {
    throw new Error(`Configuration file not found: ${configPath}`);
  }
  
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  
  if (!config[env]) {
    throw new Error(`Environment '${env}' not found in configuration`);
  }
  
  return config[env].baseUrl;
}

function getApiUrl() {
  const env = process.env.TEST_ENV || 'qa';
  const configPath = path.join(__dirname, '../../data/urls.json');
  
  if (!fs.existsSync(configPath)) {
    throw new Error(`Configuration file not found: ${configPath}`);
  }
  
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  
  if (!config[env]) {
    throw new Error(`Environment '${env}' not found in configuration`);
  }
  
  return config[env].apiUrl;
}

module.exports = {
  getBaseUrl,
  getApiUrl
};
