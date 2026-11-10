class Logger {
  constructor(context) {
    this.context = context;
  }
  
  info(message) {
    console.log(`[${new Date().toISOString()}] [${this.context}] [INFO] ${message}`);
  }
  
  error(message) {
    console.error(`[${new Date().toISOString()}] [${this.context}] [ERROR] ${message}`);
  }
  
  warn(message) {
    console.warn(`[${new Date().toISOString()}] [${this.context}] [WARN] ${message}`);
  }
  
  debug(message) {
    console.debug(`[${new Date().toISOString()}] [${this.context}] [DEBUG] ${message}`);
  }
}

module.exports = { Logger };
