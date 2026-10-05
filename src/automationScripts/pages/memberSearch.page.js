const { expect } = require('@playwright/test');

exports.MemberSearchPage = class MemberSearchPage {
  constructor(page) {
    this.page = page;
    this.memberSearchLink = page.locator('a:has-text("Member Search")');
    this.memberSearchModule = page.locator('[data-testid="member-search-module"]');
    this.memberIdInput = page.locator('input[name="memberId"]');
    this.searchFilterDropdown = page.locator('select[name="searchFilter"]');
    this.searchButton = page.locator('button:has-text("Search")');
    this.searchResultsContainer = page.locator('[data-testid="search-results"]');
    this.issueTypeInput = page.locator('input[name="issueType"]');
  }

  async navigateToMemberSearch() {
    await expect(this.memberSearchLink).toBeVisible();
    await this.memberSearchLink.click();
    await expect(this.memberSearchModule).toBeVisible();
  }

  async searchMember(memberId, filter) {
    await expect(this.memberIdInput).toBeVisible();
    await this.memberIdInput.fill(memberId);
    if (filter && filter.trim() !== '') {
      await this.searchFilterDropdown.selectOption({ label: filter });
    }
    await expect(this.searchButton).toBeEnabled();
    await this.searchButton.click();
  }

  async verifyMemberDisplayedInResults(memberId) {
    await expect(this.searchResultsContainer).toBeVisible({ timeout: 10000 });
    const memberRow = this.page.locator(`[data-member-id="${memberId}"]`);
    await expect(memberRow).toBeVisible();
  }

  async searchMemberWithKnownIssue(memberId, issueType) {
    await this.navigateToMemberSearch();
    await expect(this.memberIdInput).toBeVisible();
    await this.memberIdInput.fill(memberId);
    if (issueType && issueType.trim() !== '') {
      await this.issueTypeInput.fill(issueType);
    }
    await expect(this.searchButton).toBeEnabled();
    await this.searchButton.click();
  }
};
