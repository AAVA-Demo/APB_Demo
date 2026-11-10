const { expect } = require('@playwright/test');
const { WaitUtils } = require('../utils/wait.utils');
const { Logger } = require('../utils/logger');

exports.CardSpecificAnalysisPage = class CardSpecificAnalysisPage {
  constructor(page) {
    this.page = page;
    this.logger = new Logger();
    this.waitUtils = new WaitUtils(page);
    
    // Locators
    this.cardDetailsContainer = page.locator('.card-details-container');
    this.spendingDataSection = page.locator('.panel:has-text("Spending Analysis")');
    this.transactionHistoryTable = page.locator('.card-details-container table');
    this.errorMessage = page.locator('.alert-danger, .error-message');
    this.noActivityMessage = page.locator('.card-details-container .alert-info, .no-activity-message');
    this.cardInfoPanel = page.locator('.panel:has-text("Card Information")');
    this.financialSummaryPanel = page.locator('.panel:has-text("Financial Summary")');
  }

  async navigateToCardDetails(cardId) {
    await this.page.goto(`#/cards/${cardId}`);
    await this.waitUtils.waitForPageLoad();
    await expect(this.page).toHaveURL(new RegExp(`cards/${cardId}`));
    this.logger.info(`Navigated to card details: ${cardId}`);
  }

  async attemptNavigateToCardDetails(cardId) {
    const response = await this.page.goto(`#/cards/${cardId}`, { waitUntil: 'networkidle' });
    this.logger.info(`Attempted navigation to card ${cardId}, status: ${response.status()}`);
    return {
      status: response.status(),
      ok: response.ok()
    };
  }

  async getCardSpendingData() {
    await this.waitUtils.waitForElement(this.spendingDataSection);
    
    const spendingData = await this.page.evaluate(() => {
      const getText = (selector) => document.querySelector(selector)?.textContent.trim() || '';
      const getValue = (text) => parseFloat(text.replace(/[$,%]/g, '')) || 0;
      
      return {
        monthlySpend: getValue(getText('table tr:has-text("Monthly Spend:") td:last-child')),
        transactionCount: parseInt(getText('table tr:has-text("Transaction Count:") td:last-child')) || 0,
        topCategory: getText('table tr:has-text("Top Category:") td:last-child') || 'N/A',
        utilizationPercentage: getValue(getText('table tr:has-text("Utilization Rate:") td:last-child'))
      };
    });
    
    this.logger.info('Retrieved card spending data');
    return spendingData;
  }

  async getCardDetails() {
    await this.waitUtils.waitForElement(this.financialSummaryPanel);
    
    const cardDetails = await this.page.evaluate(() => {
      const getText = (selector) => document.querySelector(selector)?.textContent.trim() || '';
      const getValue = (text) => parseFloat(text.replace(/[$,]/g, '')) || 0;
      
      return {
        creditLimit: getValue(getText('table tr:has-text("Credit Limit:") td:last-child')),
        availableCredit: getValue(getText('table tr:has-text("Available Credit:") td:last-child')),
        outstandingBalance: getValue(getText('table tr:has-text("Outstanding Balance:") td:last-child')),
        utilizationRate: parseFloat(getText('table tr:has-text("Utilization Rate:") td:last-child').replace(/[^0-9.]/g, '')) || 0
      };
    });
    
    this.logger.info('Retrieved card details');
    return cardDetails;
  }

  async getTransactionHistory() {
    await this.waitUtils.waitForElement(this.transactionHistoryTable);
    
    const transactions = await this.page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('.card-details-container table tbody tr'));
      return rows.map(row => {
        const cells = row.querySelectorAll('td');
        return {
          transactionId: cells[0]?.textContent.trim(),
          date: cells[1]?.textContent.trim(),
          amount: parseFloat(cells[2]?.textContent.replace(/[$,]/g, '')),
          category: cells[3]?.textContent.trim(),
          merchant: cells[4]?.textContent.trim(),
          cardId: row.getAttribute('data-card-id')
        };
      });
    });
    
    this.logger.info(`Retrieved ${transactions.length} transactions`);
    return transactions;
  }

  async getErrorMessage() {
    await this.waitUtils.waitForElement(this.errorMessage);
    const message = await this.errorMessage.textContent();
    return message.trim();
  }
};
