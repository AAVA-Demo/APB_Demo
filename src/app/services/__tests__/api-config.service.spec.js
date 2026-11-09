/*
Test Documentation:
- Test Name: API_CONFIG constant validation
- Purpose: Validates that API_CONFIG constant is properly defined with all required endpoints and configuration values
- Scenario: Tests the structure and values of the API_CONFIG constant
- Expected Result: All endpoints, base URL, cache TTL, and refresh interval are correctly defined
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

      it('should have BASE_URL property', function() {
        expect(API_CONFIG.BASE_URL).toBeDefined();
        expect(typeof API_CONFIG.BASE_URL).toBe('string');
      });

      it('should have correct BASE_URL value', function() {
        expect(API_CONFIG.BASE_URL).toBe('https://api.creditcard.demo');
      });

      it('should have ENDPOINTS object', function() {
        expect(API_CONFIG.ENDPOINTS).toBeDefined();
        expect(typeof API_CONFIG.ENDPOINTS).toBe('object');
      });
    });

    describe('Endpoint Configuration', function() {
      it('should have CARDS endpoint', function() {
        expect(API_CONFIG.ENDPOINTS.CARDS).toBe('/api/cards');
      });

      it('should have CARDS_SUMMARY endpoint', function() {
        expect(API_CONFIG.ENDPOINTS.CARDS_SUMMARY).toBe('/api/cards/summary');
      });

      it('should have TRANSACTIONS endpoint', function() {
        expect(API_CONFIG.ENDPOINTS.TRANSACTIONS).toBe('/api/transactions');
      });

      it('should have TRANSACTIONS_SUMMARY endpoint', function() {
        expect(API_CONFIG.ENDPOINTS.TRANSACTIONS_SUMMARY).toBe('/api/transactions/summary');
      });

      it('should have MONTHLY_SUMMARY endpoint', function() {
        expect(API_CONFIG.ENDPOINTS.MONTHLY_SUMMARY).toBe('/api/transactions/monthly-summary');
      });

      it('should have ANALYTICS endpoint', function() {
        expect(API_CONFIG.ENDPOINTS.ANALYTICS).toBe('/api/analytics/spending');
      });

      it('should have CATEGORIZATION endpoint', function() {
        expect(API_CONFIG.ENDPOINTS.CATEGORIZATION).toBe('/api/categorization');
      });

      it('should have all required endpoints defined', function() {
        var requiredEndpoints = ['CARDS', 'CARDS_SUMMARY', 'TRANSACTIONS', 'TRANSACTIONS_SUMMARY', 'MONTHLY_SUMMARY', 'ANALYTICS', 'CATEGORIZATION'];
        requiredEndpoints.forEach(function(endpoint) {
          expect(API_CONFIG.ENDPOINTS[endpoint]).toBeDefined();
          expect(typeof API_CONFIG.ENDPOINTS[endpoint]).toBe('string');
        });
      });
    });

    describe('Cache and Refresh Configuration', function() {
      it('should have CACHE_TTL defined', function() {
        expect(API_CONFIG.CACHE_TTL).toBeDefined();
        expect(typeof API_CONFIG.CACHE_TTL).toBe('number');
      });

      it('should have correct CACHE_TTL value (5 minutes)', function() {
        expect(API_CONFIG.CACHE_TTL).toBe(300000);
      });

      it('should have REFRESH_INTERVAL defined', function() {
        expect(API_CONFIG.REFRESH_INTERVAL).toBeDefined();
        expect(typeof API_CONFIG.REFRESH_INTERVAL).toBe('number');
      });

      it('should have correct REFRESH_INTERVAL value (1 minute)', function() {
        expect(API_CONFIG.REFRESH_INTERVAL).toBe(60000);
      });

      it('should have CACHE_TTL greater than REFRESH_INTERVAL', function() {
        expect(API_CONFIG.CACHE_TTL).toBeGreaterThan(API_CONFIG.REFRESH_INTERVAL);
      });
    });

    describe('Endpoint URL Construction', function() {
      it('should construct valid full URLs for all endpoints', function() {
        var endpoints = Object.keys(API_CONFIG.ENDPOINTS);
        endpoints.forEach(function(key) {
          var fullUrl = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS[key];
          expect(fullUrl).toContain('https://api.creditcard.demo/api/');
        });
      });

      it('should not have trailing slashes in BASE_URL', function() {
        expect(API_CONFIG.BASE_URL.endsWith('/')).toBe(false);
      });

      it('should have leading slashes in all endpoint paths', function() {
        var endpoints = Object.keys(API_CONFIG.ENDPOINTS);
        endpoints.forEach(function(key) {
          expect(API_CONFIG.ENDPOINTS[key].startsWith('/')).toBe(true);
        });
      });
    });
  });

})();

/*
Coverage Report:
- Functions tested: API_CONFIG constant structure validation
- Scenarios covered:
  * Configuration structure validation
  * All endpoint definitions (CARDS, CARDS_SUMMARY, TRANSACTIONS, TRANSACTIONS_SUMMARY, MONTHLY_SUMMARY, ANALYTICS, CATEGORIZATION)
  * Cache TTL configuration (300000ms = 5 minutes)
  * Refresh interval configuration (60000ms = 1 minute)
  * URL construction validation
  * Endpoint path format validation
- Uncovered scenarios: None - constant is fully validated
- Edge cases tested:
  * Trailing/leading slash validation
  * Cache TTL > Refresh interval validation
  * Type checking for all properties
*/