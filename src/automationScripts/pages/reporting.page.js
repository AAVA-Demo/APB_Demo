const { expect } = require('@playwright/test');

exports.ReportingPage = class ReportingPage {
  constructor(page) {
    this.page = page;
    this.reportingDashboard = page.locator('[data-testid="reporting-dashboard"]');
    this.reportingMenuItem = page.locator('[data-testid="reporting-menu"]');
    this.filtersSection = page.locator('[data-testid="filters-section"]');
    this.metricsSection = page.locator('[data-testid="metrics-section"]');
    this.filteredResults = page.locator('[data-testid="filtered-results"]');
    this.avgResolutionTimeMetric = page.locator('[data-testid="avg-resolution-time"]');
    this.avgStepsPerCaseMetric = page.locator('[data-testid="avg-steps-per-case"]');
    this.errorIndicator = page.locator('[data-testid="metrics-error"]');
    this.warningIndicator = page.locator('[data-testid="metrics-warning"]');
    this.filterTypeDropdown = page.locator('[data-testid="filter-type"]');
    this.dateRangeSelector = page.locator('[data-testid="date-range"]');
    this.applyFilterButton = page.locator('[data-testid="apply-filter"]');
  }

  async navigateToReporting() {
    await expect(this.reportingMenuItem).toBeVisible();
    await this.reportingMenuItem.click();
    await expect(this.filtersSection).toBeVisible();
  }

  async applyFilter(filterType, value) {
    await expect(this.filterTypeDropdown).toBeVisible();
    await this.filterTypeDropdown.selectOption({ label: filterType });
    
    if (typeof value === 'boolean') {
      await this.page.locator(`[data-testid="filter-value-${value}"]`).check();
    }
    
    await this.applyFilterButton.click();
    await expect(this.filteredResults).toBeVisible();
  }

  async setDateRange(range) {
    await expect(this.dateRangeSelector).toBeVisible();
    await this.dateRangeSelector.selectOption({ label: range });
  }

  async getAverageResolutionTime() {
    await expect(this.avgResolutionTimeMetric).toBeVisible();
    const text = await this.avgResolutionTimeMetric.textContent();
    return text.trim();
  }

  async getAverageStepsPerCase() {
    await expect(this.avgStepsPerCaseMetric).toBeVisible();
    const text = await this.avgStepsPerCaseMetric.textContent();
    return text.trim();
  }

  async checkForSensitiveInformation() {
    const pageContent = await this.metricsSection.textContent();
    
    const sensitivePatterns = [
      /\b[A-Z][a-z]+\s+[A-Z][a-z]+\b/,
      /\b\d{3}-\d{2}-\d{4}\b/,
      /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/,
      /account\s*#?\s*\d{8,}/i
    ];
    
    for (const pattern of sensitivePatterns) {
      if (pattern.test(pageContent)) {
        return true;
      }
    }
    
    return false;
  }

  async areMetricsLoaded() {
    try {
      await this.metricsSection.waitFor({ state: 'visible', timeout: 5000 });
      const hasContent = await this.metricsSection.textContent();
      return hasContent && hasContent.trim().length > 0;
    } catch {
      return false;
    }
  }

  async getMetricsValues() {
    const metrics = {};
    
    if (await this.avgResolutionTimeMetric.isVisible()) {
      metrics.avgResolutionTime = await this.avgResolutionTimeMetric.textContent();
    }
    
    if (await this.avgStepsPerCaseMetric.isVisible()) {
      metrics.avgStepsPerCase = await this.avgStepsPerCaseMetric.textContent();
    }
    
    return metrics;
  }

  async checkForEmptyMetrics(metricsValues) {
    for (const key in metricsValues) {
      const value = metricsValues[key];
      if (!value || value.trim() === '' || value === 'N/A' || value === '0') {
        return true;
      }
    }
    return false;
  }
};
