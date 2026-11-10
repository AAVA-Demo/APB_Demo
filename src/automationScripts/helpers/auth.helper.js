const { Logger } = require('../utils/logger');

class AuthHelper {
  static logger = new Logger('AuthHelper');
  
  static async authenticate(page, userId) {
    this.logger.info(`Authenticating user: ${userId}`);
    await page.evaluate((userId) => {
      window.sessionStorage.setItem('cc_auth_token', `mock_token_${Date.now()}`);
      window.sessionStorage.setItem('cc_user', JSON.stringify({
        userId: userId,
        name: 'Test User',
        email: 'test@example.com'
      }));
    }, userId);
  }
  
  static async setExpiredToken(page) {
    this.logger.info('Setting expired authentication token');
    await page.evaluate(() => {
      window.sessionStorage.setItem('cc_auth_token', 'expired_token_123');
      window.sessionStorage.setItem('token_expiry', '2024-01-01');
    });
  }
  
  static async clearAuthentication(page) {
    this.logger.info('Clearing authentication');
    await page.evaluate(() => {
      window.sessionStorage.removeItem('cc_auth_token');
      window.sessionStorage.removeItem('cc_user');
    });
  }
}

module.exports = { AuthHelper };
