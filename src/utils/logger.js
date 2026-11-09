class Logger {
  constructor() {
    this.logLevel = process.env.LOG_LEVEL || 'info';
  }

  info(message) {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`);
  }

  error(message) {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`);
  }

  warn(message) {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`);
  }

  debug(message) {
    if (this.logLevel === 'debug') {
      console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`);
    }
  }
}

module.exports = { Logger };
