const loc = require('./locators/workday-credit_card_fraud_alert_system_prd.locators');
const TD = require('../data/workday-test-data');
const URL = TD.urls.creditCardFraudAlertSystemPrd; // must be defined in test data

class CreditCardFraudAlertSystemPrdPage {
  constructor(page) { this.page = page; }

  async goto() {
    await this.page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  }

  async getAlertRows() {
    return loc.alertTable(this.page).locator('tr');
  }

  async resolveAlert(alertId) {
    await loc.resolveButton(this.page, alertId).click();
  }

  async getAlertStatus(alertId) {
    return loc.statusField(this.page, alertId).textContent();
  }

  async reportAlert(alertId) {
    await loc.reportButton(this.page, alertId).click();
  }

  async errorBannerVisible() {
    return await loc.errorBanner(this.page).isVisible();
  }
}
module.exports = CreditCardFraudAlertSystemPrdPage;
