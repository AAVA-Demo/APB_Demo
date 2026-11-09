/**
 * Custom logger utility for Playwright automation framework
 * Provides structured logging with timestamps and log levels
 */

class Logger {
  constructor() {
    this.logLevel = process.env.LOG_LEVEL || 'info';
    this.levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3
    };
  }

  formatMessage(level, message) {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  }

  shouldLog(level) {
    return this.levels[level] <= this.levels[this.logLevel];
  }

  error(message) {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage('error', message));
    }
  }

  warn(message) {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message));
    }
  }

  info(message) {
    if (this.shouldLog('info')) {
      console.log(this.formatMessage('info', message));
    }
  }

  debug(message) {
    if (this.shouldLog('debug')) {
      console.log(this.formatMessage('debug', message));
    }
  }
}

module.exports = new Logger();