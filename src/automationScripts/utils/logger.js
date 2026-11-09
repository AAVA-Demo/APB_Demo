/**
 * Logger Utility
 * Provides centralized logging functionality for all test scripts
 * Supports different log levels and formatted output
 */

class Logger {
  /**
   * Log an informational message
   * @param {string} message - Message to log
   */
  static info(message) {
    const timestamp = new Date().toISOString();
    console.log(`[INFO] [${timestamp}] ${message}`);
  }

  /**
   * Log an error message
   * @param {string} message - Error message to log
   * @param {Error} error - Optional error object
   */
  static error(message, error = null) {
    const timestamp = new Date().toISOString();
    console.error(`[ERROR] [${timestamp}] ${message}`);
    if (error) {
      console.error(`[ERROR] [${timestamp}] Stack trace:`, error.stack);
    }
  }

  /**
   * Log a warning message
   * @param {string} message - Warning message to log
   */
  static warn(message) {
    const timestamp = new Date().toISOString();
    console.warn(`[WARN] [${timestamp}] ${message}`);
  }

  /**
   * Log a debug message
   * @param {string} message - Debug message to log
   */
  static debug(message) {
    const timestamp = new Date().toISOString();
    console.debug(`[DEBUG] [${timestamp}] ${message}`);
  }

  /**
   * Log test step information
   * @param {number} stepNumber - Step number
   * @param {string} stepDescription - Step description
   */
  static step(stepNumber, stepDescription) {
    const timestamp = new Date().toISOString();
    console.log(`[STEP ${stepNumber}] [${timestamp}] ${stepDescription}`);
  }

  /**
   * Log test result
   * @param {string} testName - Test name
   * @param {string} result - Test result (PASS/FAIL)
   * @param {number} duration - Test duration in milliseconds
   */
  static result(testName, result, duration) {
    const timestamp = new Date().toISOString();
    console.log(`[RESULT] [${timestamp}] Test: ${testName} | Result: ${result} | Duration: ${duration}ms`);
  }
}

module.exports = { Logger };
