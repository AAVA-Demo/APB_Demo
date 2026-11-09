const { Logger } = require('../utils/logger');

const logger = new Logger('AuthHelper');

exports.AuthHelper = class AuthHelper {
  static async authenticate(page, userId, token) {
    logger.info(`Authenticating user: ${userId}`);
    
    // Set authentication token in localStorage or cookies
    await page.addInitScript((authData) => {
      localStorage.setItem('authToken', authData.token);
      localStorage.setItem('userId', authData.userId);
    }, { userId, token });
    
    logger.info('Authentication token set successfully');
  }

  static async setExpiredToken(page) {
    logger.info('Setting expired authentication token');
    
    await page.addInitScript(() => {
      localStorage.setItem('authToken', 'expired-jwt-token');
      localStorage.setItem('tokenExpiry', Date.now() - 86400000); // Expired 1 day ago
    });
    
    logger.info('Expired token set');
  }

  static async setMalformedToken(page) {
    logger.info('Setting malformed authentication token');
    
    await page.addInitScript(() => {
      localStorage.setItem('authToken', 'invalid-malformed-token');
    });
    
    logger.info('Malformed token set');
  }

  static async clearAuthentication(page) {
    logger.info('Clearing authentication');
    
    await page.evaluate(() => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('tokenExpiry');
    });
    
    logger.info('Authentication cleared');
  }
};