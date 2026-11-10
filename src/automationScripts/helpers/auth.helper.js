const { Logger } = require('../utils/logger');
const config = require('../../data/config.json');

exports.AuthHelper = class AuthHelper {
  constructor(page) {
    this.page = page;
    this.logger = new Logger();
  }

  async authenticate() {
    await this.page.goto(config.baseUrl);
    await this.page.evaluate(() => {
      window.sessionStorage.setItem('authToken', 'mock-token-12345');
    });
    this.logger.info('Authenticated with mock token');
  }

  async authenticateAsUser(userId) {
    await this.page.evaluate((uid) => {
      window.sessionStorage.setItem('authToken', 'mock-token-12345');
      window.sessionStorage.setItem('userId', uid);
    }, userId);
    this.logger.info(`Authenticated as user: ${userId}`);
  }
};
