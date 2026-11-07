const { expect } = require('@playwright/test');

/**
 * Categories Page Object
 * Handles all interactions with the Category-wise Spending Analysis page
 * Covers: Category Visualization, Drill-down, Transaction Details
 */
exports.CategoriesPage = class CategoriesPage {

  constructor(page) {
    this.page = page;
    
    // Navigation Locators
    this.navCategories = page.locator('a[href="#/categories"]');
    
    // Filter Locators
    this.filterPanel = page.locator('.filter-panel');
    this.periodDropdown = page.locator('select[ng-model*="period"]');
    this.pieChartButton = page.locator('button:has-text("Pie Chart")');
    this.barChartButton = page.locator('button:has-text("Bar Chart")');
    
    // Chart Locators
    this.chartContainer = page.locator('.chart-container');
    this.chartCanvas = page.locator('canvas');
    
    // Transaction List Locators
    this.transactionListSection = page.locator('.chart-container:has(h3)');
    this.transactionListHeading = page.locator('h3:has-text("Transactions")');
    this.transactionTable = page.locator('table.table');
    this.transactionRows = page.locator('table.table tbody tr');
    this.closeButton = page.locator('button:has-text("Close")');
    
    // Message Locators
    this.errorMessage = page.locator('.alert-danger');
    this.emptyStateMessage = page.locator('p:has-text("No spending data")');
    this.noTransactionsMessage = page.locator('p:has-text("No transactions are available")');
    this.drillDownErrorMessage = page.locator('.alert-danger:has-text("Backend service")');
    
    // Loading Locators
    this.loadingIndicator = page.locator('p:has-text("Loading category data")');
    
    // Login Locators
    this.usernameInput = page.locator('#username, input[name="username"]');
    this.passwordInput = page.locator('#password, input[name="password"]');
    this.loginButton = page.locator('button[type="submit"], button:has-text("Login")');
  }

  async navigate() {
    await this.page.goto('https://creditcard-dashboard.example.com');
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToCategories() {
    await this.navCategories.click();
    await this.page.waitForLoadState('networkidle');
  }

  async login(username, password) {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async waitForChartLoad() {
    await this.chartContainer.waitFor({ state: 'visible', timeout: 10000 });
    await this.page.waitForTimeout(1000);
  }

  async getChartCategories() {
    return await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return [];
      const chart = Chart.getChart(canvas);
      return chart ? chart.data.labels : [];
    });
  }

  async getCategoryAmounts() {
    return await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return {};
      const chart = Chart.getChart(canvas);
      if (!chart) return {};
      const result = {};
      chart.data.labels.forEach((label, index) => {
        result[label] = chart.data.datasets[0].data[index];
      });
      return result;
    });
  }

  async verifyDistinctColors() {
    const colors = await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return [];
      const chart = Chart.getChart(canvas);
      if (!chart || !chart.data.datasets[0]) return [];
      return chart.data.datasets[0].backgroundColor;
    });
    // Verify all colors are unique
    const uniqueColors = new Set(colors);
    expect(uniqueColors.size).toBe(colors.length);
  }

  async hoverCategorySegment(categoryName) {
    // Get category index
    const index = await this.page.evaluate((name) => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return -1;
      const chart = Chart.getChart(canvas);
      return chart ? chart.data.labels.indexOf(name) : -1;
    }, categoryName);
    
    if (index === -1) return;
    
    // Calculate approximate position of segment
    const canvas = this.chartCanvas;
    const box = await canvas.boundingBox();
    const centerX = box.x + box.width / 2;
    const centerY = box.y + box.height / 2;
    
    // Move to segment (approximate position based on index)
    const angle = (index / 9) * 2 * Math.PI;
    const radius = Math.min(box.width, box.height) / 3;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    
    await this.page.mouse.move(x, y);
    await this.page.waitForTimeout(500);
  }

  async getTooltipText() {
    const tooltip = this.page.locator('.chartjs-tooltip, [role="tooltip"]');
    await expect(tooltip).toBeVisible({ timeout: 2000 });
    return await tooltip.textContent();
  }

  async hasChartData() {
    return await this.page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return false;
      const chart = Chart.getChart(canvas);
      if (!chart || !chart.data.datasets[0]) return false;
      return chart.data.datasets[0].data && chart.data.datasets[0].data.length > 0;
    });
  }

  async clickCategory(categoryName) {
    // Trigger click event on chart for specific category
    await this.page.evaluate((name) => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return;
      const chart = Chart.getChart(canvas);
      if (!chart) return;
      const index = chart.data.labels.indexOf(name);
      if (index === -1) return;
      
      // Simulate click on category
      const meta = chart.getDatasetMeta(0);
      const element = meta.data[index];
      if (element) {
        const event = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        });
        canvas.dispatchEvent(event);
      }
    }, categoryName);
    
    await this.page.waitForTimeout(1000);
  }

  async getTransactionList() {
    await this.transactionTable.waitFor({ state: 'visible', timeout: 5000 });
    const rows = await this.transactionRows.all();
    const transactions = [];
    
    for (const row of rows) {
      const cells = await row.locator('td').allTextContents();
      if (cells.length >= 3) {
        transactions.push({
          date: cells[0],
          description: cells[1],
          amount: cells[2]
        });
      }
    }
    
    return transactions;
  }

  async selectPeriod(period) {
    await this.periodDropdown.selectOption({ label: period });
    await this.page.waitForTimeout(500);
  }

  async toggleChartType(type) {
    if (type === 'pie') {
      await this.pieChartButton.click();
    } else if (type === 'bar') {
      await this.barChartButton.click();
    }
    await this.page.waitForTimeout(1000);
  }

  async closeTransactionDetails() {
    await this.closeButton.click();
    await this.page.waitForTimeout(500);
  }

};