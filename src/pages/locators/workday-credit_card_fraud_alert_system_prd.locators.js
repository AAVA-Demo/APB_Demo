// Locators for Credit Card Fraud Alert System PRD
const locators = {
  alertTable: (page) => page.locator('[data-testid="fraud-alert-table"]'),
  alertRow: (page, alertId) => page.locator(`[data-testid="fraud-alert-row-${alertId}"]`),
  resolveButton: (page, alertId) => page.locator(`[data-testid="resolve-btn-${alertId}"]`),
  statusField: (page, alertId) => page.locator(`[data-testid="status-field-${alertId}"]`),
  reportButton: (page, alertId) => page.locator(`[data-testid="report-btn-${alertId}"]`),
  errorBanner: (page) => page.locator('[data-testid="error-banner"]'),
};
module.exports = locators;
