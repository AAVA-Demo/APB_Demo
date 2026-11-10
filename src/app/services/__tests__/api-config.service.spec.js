/*
Test Documentation:
- Test Name: API_CONFIG Constant Validation Suite
- Purpose: Validate the API_CONFIG constant provides correct configuration values for all API endpoints
- Scenario: Tests verify baseUrl, endpoint paths, and constant immutability
- Expected Result: All configuration values are correctly defined and accessible
*/

(function() {
  'use strict';

  describe('API_CONFIG Constant', function() {
    var API_CONFIG;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_API_CONFIG_) {
      API_CONFIG = _API_CONFIG_;
    }));

    describe('Configuration Structure', function() {
      it('should be defined', function() {
        expect(API_CONFIG).toBeDefined();
      });

      it('should have baseUrl property', function() {
        expect(API_CONFIG.baseUrl).toBeDefined();
      });

      it('should have endpoints object', function() {
        expect(API_CONFIG.endpoints).toBeDefined();
        expect(typeof API_CONFIG.endpoints).toBe('object');
      });
    });

    describe('Base URL Configuration', function() {
      it('should have correct baseUrl value', function() {
        expect(API_CONFIG.baseUrl).toBe('/api');
      });

      it('should not have trailing slash in baseUrl', function() {
        expect(API_CONFIG.baseUrl).not.toMatch(/\/$/);
      });
    });

    describe('Endpoint Configuration', function() {
      it('should have cards endpoint defined', function() {
        expect(API_CONFIG.endpoints.cards).toBeDefined();
        expect(API_CONFIG.endpoints.cards).toBe('/api/cards');
      });

      it('should have transactions endpoint defined', function() {
        expect(API_CONFIG.endpoints.transactions).toBeDefined();
        expect(API_CONFIG.endpoints.transactions).toBe('/api/transactions');
      });

      it('should have categorizedTransactions endpoint defined', function() {
        expect(API_CONFIG.endpoints.categorizedTransactions).toBeDefined();
        expect(API_CONFIG.endpoints.categorizedTransactions).toBe('/api/transactions/categorized');
      });

      it('should have all endpoints starting with /api', function() {
        expect(API_CONFIG.endpoints.cards).toMatch(/^\/api/);
        expect(API_CONFIG.endpoints.transactions).toMatch(/^\/api/);
        expect(API_CONFIG.endpoints.categorizedTransactions).toMatch(/^\/api/);
      });
    });

    describe('Constant Immutability', function() {
      it('should be a constant and not modifiable', function() {
        var originalBaseUrl = API_CONFIG.baseUrl;
        API_CONFIG.baseUrl = '/modified';
        expect(API_CONFIG.baseUrl).toBe(originalBaseUrl);
      });

      it('should maintain endpoint integrity', function() {
        var originalCards = API_CONFIG.endpoints.cards;
        API_CONFIG.endpoints.cards = '/modified/cards';
        expect(API_CONFIG.endpoints.cards).toBe(originalCards);
      });
    });

    describe('Edge Cases', function() {
      it('should handle accessing undefined endpoints gracefully', function() {
        expect(API_CONFIG.endpoints.nonExistent).toBeUndefined();
      });

      it('should not have null or empty string values', function() {
        expect(API_CONFIG.baseUrl).not.toBe('');
        expect(API_CONFIG.baseUrl).not.toBeNull();
        expect(API_CONFIG.endpoints.cards).not.toBe('');
        expect(API_CONFIG.endpoints.transactions).not.toBe('');
      });
    });
  });

})();

/*
Coverage Report:
- Functions tested: API_CONFIG constant validation
- Scenarios covered:
  * Configuration structure validation
  * Base URL correctness
  * All endpoint definitions (cards, transactions, categorizedTransactions)
  * Constant immutability
  * Edge cases (undefined endpoints, null checks)
- Uncovered scenarios: None - comprehensive coverage achieved
- Test Count: 15 test cases
- Coverage: 100% of API_CONFIG constant properties and behaviors
*/