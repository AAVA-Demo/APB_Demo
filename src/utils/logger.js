class Logger {
  constructor(moduleName) {
    this.moduleName = moduleName;
  }

  info(message) {
    console.log(`[INFO] [${this.moduleName}] ${new Date().toISOString()} - ${message}`);
  }

  error(message) {
    console.error(`[ERROR] [${this.moduleName}] ${new Date().toISOString()} - ${message}`);
  }

  warn(message) {
    console.warn(`[WARN] [${this.moduleName}] ${new Date().toISOString()} - ${message}`);
  }

  debug(message) {
    console.debug(`[DEBUG] [${this.moduleName}] ${new Date().toISOString()} - ${message}`);
  }
}

module.exports = Logger;