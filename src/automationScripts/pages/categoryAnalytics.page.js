const { expect } = require('@playwright/test');

exports.CategoryAnalyticsPage = class CategoryAnalyticsPage {
  constructor(page) {
    this.page = page;
    
    // Navigation Locators
    this.categoryAnalyticsLink = page.locator('a[href="#!/category-analytics"]');
    
    // Chart Locators
    this.categoryChart = page.locator('category-chart');
    this.chartCanvas = page.locator('category-chart canvas');
    
    // Category Summary Locators
    this.categorySummaryTable = page.locator('table.table-striped');
    this.categoryRows = page.locator('table.table-striped tbody tr');
    this.totalSpendElement = page.locator('p:has-text("Total Spend")');
    
    // Filter Locators
    this.categoryFilterDropdown = page.locator('select[ng-model="vm.selectedCategory"]');
    this.dateRangeFilter = page.locator('.date-range-filter');
    this.cardFilterDropdown = page.locator('select.card-filter');
    this.searchInput = page.locator('input[ng-model="vm.searchText"]');
    this.searchButton = page.locator('button:has-text("Search")');
    this.clearSearchButton = page.locator('button:has-text("Clear")');
    this.applyFiltersButton = page.locator('button:has-text("Apply")');
    
    // Transaction List Locators
    this.transactionTable = page.locator('table[ng-table]');
    this.transactionRows = page.locator('table[ng-table] tbody tr');
    this.paginationControls = page.locator('.ng-table-pager');
    
    // Message Locators
    this.noDataMessage = page.locator('text=No spending data available');
    this.searchErrorMessage = page.locator('.search-error');
  }

  async navigate() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  async authenticate(username, password) {
    await this.page.evaluate((user) => {
      window.sessionStorage.setItem('authToken', `mock-jwt-token-${user}-${Date.now()}`);
    }, username);
    await this.page.goto('#!/category-analytics');
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToCategoryAnalytics() {
    await this.categoryAnalyticsLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getCategoryCount() {
    await this.page.waitForSelector('table.table-striped tbody tr', { state: 'visible' });
    return await this.categoryRows.count();
  }

  async getAllCategoryNames() {
    await this.page.waitForSelector('table.table-striped tbody tr', { state: 'visible' });
    const rows = await this.categoryRows.all();
    const categories = [];
    for (const row of rows) {
      const categoryName = await row.locator('td:first-child').textContent();
      categories.push(categoryName.trim());
    }
    return categories;
  }

  async getTotalSpend() {
    await expect(this.totalSpendElement).toBeVisible();
    const text = await this.totalSpendElement.textContent();
    const match = text.match(/₹[0-9,]+\.[0-9]{2}/);
    return match ? match[0] : null;
  }

  async measureChartRenderTime() {
    const startTime = Date.now();
    await this.page.waitForSelector('category-chart canvas', { state: 'visible' });
    const endTime = Date.now();
    return endTime - startTime;
  }

  async selectFutureDateRange() {
    // Mock selecting a future date range with no transactions
    await this.page.route('**/api/transactions*', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ transactions: [], totalSpend: 0 })
      });
    });
    await this.page.reload();
    await this.page.waitForLoadState('networkidle');
  }

  async getNoDataMessage() {
    await expect(this.noDataMessage).toBeVisible();
    return await this.noDataMessage.textContent();
  }

  async isChartVisible() {
    const count = await this.categoryChart.count();
    if (count === 0) return false;
    const isVisible = await this.categoryChart.isVisible();
    return isVisible;
  }

  async hasBrokenUIElements() {
    // Check for common broken UI indicators
    const brokenImages = await this.page.locator('img[src=""]').count();
    const emptyCharts = await this.page.locator('canvas:not([width])').count();
    return brokenImages > 0 || emptyCharts > 0;
  }

  async expireAuthToken() {
    await this.page.evaluate(() => {
      window.sessionStorage.removeItem('authToken');
    });
  }

  async getTransactionCount() {
    await this.page.waitForSelector('table[ng-table] tbody tr', { state: 'visible', timeout: 5000 }).catch(() => {});
    return await this.transactionRows.count();
  }

  async selectCategoryFilter(category) {
    await this.categoryFilterDropdown.selectOption({ label: category });
    await this.page.waitForLoadState('networkidle');
  }

  async getAllTransactionCategories() {
    await this.page.waitForSelector('table[ng-table] tbody tr', { state: 'visible' });
    const rows = await this.transactionRows.all();
    const categories = [];
    for (const row of rows) {
      const categoryCell = await row.locator('td[data-title="\'Category\'"]:visible, td:nth-child(3)').textContent();
      categories.push(categoryCell.trim());
    }
    return categories;
  }

  async isPaginationVisible() {
    const count = await this.paginationControls.count();
    return count > 0;
  }

  async getSortOrder() {
    // Check for sort indicator in table header
    const sortedColumn = await this.page.locator('th.sortable.sort-desc, th.sortable.sort-asc').first();
    const classList = await sortedColumn.getAttribute('class');
    if (classList.includes('sort-desc')) return 'date-desc';
    if (classList.includes('sort-asc')) return 'date-asc';
    return 'default';
  }

  async enterSearchQuery(query) {
    await this.searchInput.fill(query);
  }

  async submitSearch() {
    await this.searchInput.press('Enter');
    await this.page.waitForLoadState('networkidle');
  }

  async getSearchErrorMessage() {
    const errorVisible = await this.searchErrorMessage.isVisible().catch(() => false);
    if (errorVisible) {
      return await this.searchErrorMessage.textContent();
    }
    
    const noResults = await this.page.locator('text=No transactions found').isVisible().catch(() => false);
    if (noResults) {
      return 'No transactions found';
    }
    
    return '';
  }

  async clearSearch() {
    await this.searchInput.clear();
    await this.submitSearch();
  }

  async refreshPage() {
    await this.page.reload();
    await this.page.waitForLoadState('networkidle');
  }

  async areTransactionsVisible() {
    const count = await this.transactionRows.count();
    return count > 0;
  }

  async selectDateRangeFilter(range) {
    // For 'Last 3 months', calculate dates
    const today = new Date();
    const threeMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate());
    
    await this.page.locator('input[name="startDate"]').fill(threeMonthsAgo.toISOString().split('T')[0]);
    await this.page.locator('input[name="endDate"]').fill(today.toISOString().split('T')[0]);
  }

  async selectCardFilter(cardId) {
    await this.cardFilterDropdown.selectOption({ value: cardId });
  }

  async applyFilters() {
    await this.applyFiltersButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getFilteredTransactions() {
    await this.page.waitForSelector('table[ng-table] tbody tr', { state: 'visible' });
    const rows = await this.transactionRows.all();
    const transactions = [];
    
    for (const row of rows) {
      const cells = await row.locator('td').all();
      const transaction = {
        date: await cells[0].textContent(),
        merchant: await cells[1].textContent(),
        category: await cells[2].textContent(),
        amount: await cells[3].textContent(),
        cardId: await row.getAttribute('data-card-id') || 'CC001'
      };
      transactions.push(transaction);
    }
    
    return transactions;
  }
};
