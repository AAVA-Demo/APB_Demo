class Logger {
  constructor(context) {
    this.context = context;
  }

  info(message) {
    console.log(`[INFO] [${this.context}] ${new Date().toISOString()} - ${message}`);
  }

  warn(message) {
    console.warn(`[WARN] [${this.context}] ${new Date().toISOString()} - ${message}`);
  }

  error(message) {
    console.error(`[ERROR] [${this.context}] ${new Date().toISOString()} - ${message}`);
  }

  debug(message) {
    if (process.env.DEBUG === 'true') {
      console.log(`[DEBUG] [${this.context}] ${new Date().toISOString()} - ${message}`);
    }
  }
}

module.exports = { Logger };