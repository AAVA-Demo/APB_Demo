class Logger {
  constructor(moduleName) {
    this.moduleName = moduleName;
    this.timestamp = () => new Date().toISOString();
  }

  info(message) {
    console.log(`[${this.timestamp()}] [INFO] [${this.moduleName}] ${message}`);
  }

  error(message) {
    console.error(`[${this.timestamp()}] [ERROR] [${this.moduleName}] ${message}`);
  }

  warn(message) {
    console.warn(`[${this.timestamp()}] [WARN] [${this.moduleName}] ${message}`);
  }

  debug(message) {
    console.debug(`[${this.timestamp()}] [DEBUG] [${this.moduleName}] ${message}`);
  }
}

module.exports = { Logger };
