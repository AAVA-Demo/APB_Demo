const { test, expect } = require('../../fixtures');
const CreditCardFraudAlertSystemPrdPage = require('../../pages/workday-credit_card_fraud_alert_system_prd.page');
const TD = require('../../data/workday-test-data');

test.describe('[UI] CAP001: Credit Card Fraud Alert System PRD', { tag: ['@smoke', '@regression', '@capital-one'] }, () => {
  let fraudPage;

  test.beforeEach(async ({ page }) => {
    fraudPage = new CreditCardFraudAlertSystemPrdPage(page);
    await fraudPage.goto();
  });

  test('[C001] Should load fraud alert dashboard and display alert table', async ({ page }) => {
    await expect(page).toHaveURL(TD.urlPatterns.creditCardFraudAlertSystemPrd);
    await expect(page).toHaveTitle(TD.pageTitles.creditCardFraudAlertSystemPrd);
    await expect(fraudPage.page.locator('[data-testid="fraud-alert-table"]')).toBeVisible();
  });

  test('[C002] Should display all fraud alerts in the table', async ({ page }) => {
    const rows = await fraudPage.getAlertRows();
    await expect(rows).toHaveCount(TD.fraudAlerts.length + 1); // header + alerts
    for (const alert of TD.fraudAlerts) {
      await expect(page.locator(`[data-testid="fraud-alert-row-${alert.id}"]`)).toBeVisible();
      await expect(page.locator(`[data-testid="status-field-${alert.id}"]`)).toHaveText(alert.status);
    }
  });

  test('[C003] Should resolve a new alert and update status', async ({ page }) => {
    const alert = TD.fraudAlerts.find(a => a.status === TD.statuses.new);
    await fraudPage.resolveAlert(alert.id);
    await expect(page.locator(`[data-testid="status-field-${alert.id}"]`)).toHaveText(TD.statuses.resolved);
  });

  test('[C004] Should display error if alert cannot be resolved', async ({ page }) => {
    try {
      await fraudPage.resolveAlert('999');
      await expect(page.locator('[data-testid="error-banner"]')).toBeVisible();
      await expect(page.locator('[data-testid="error-banner"]')).toHaveText(TD.errors.resolveFailed);
    } catch (err) {
      console.error('[C004] Resolve failed as expected:', err);
      throw err;
    }
  });

  test('[C005] Should allow reporting a fraud alert and update status', async ({ page }) => {
    const alert = TD.fraudAlerts.find(a => a.status === TD.statuses.new);
    await fraudPage.reportAlert(alert.id);
    await expect(page.locator(`[data-testid="status-field-${alert.id}"]`)).toHaveText(TD.statuses.reported);
  });

});
