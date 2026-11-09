class Logger {
  static info(message) {
    const timestamp = new Date().toISOString();
    console.log(`[INFO] [${timestamp}] ${message}`);
  }

  static error(message) {
    const timestamp = new Date().toISOString();
    console.error(`[ERROR] [${timestamp}] ${message}`);
  }

  static warn(message) {
    const timestamp = new Date().toISOString();
    console.warn(`[WARN] [${timestamp}] ${message}`);
  }

  static debug(message) {
    const timestamp = new Date().toISOString();
    console.debug(`[DEBUG] [${timestamp}] ${message}`);
  }
}

module.exports = { Logger };
