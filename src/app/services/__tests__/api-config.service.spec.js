/*
Test Documentation:
- Test Name: API_CONFIG constant validation
- Purpose: Validate API_CONFIG constant structure and values
- Scenario: Verify baseUrl, endpoints, and timeout configuration
- Expected Result: All configuration values are correctly defined
*/

(function() {
  'use strict';

  describe('API_CONFIG Constant', function() {
    var API_CONFIG;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_API_CONFIG_) {
      API_CONFIG = _API_CONFIG_;
    }));

    /*
    Test Documentation:
    - Test Name: should be defined
    - Purpose: Ensure API_CONFIG constant is injected
    - Scenario: Inject API_CONFIG
    - Expected Result: API_CONFIG is defined
    */
    it('should be defined', function() {
      expect(API_CONFIG).toBeDefined();
    });

    /*
    Test Documentation:
    - Test Name: should have baseUrl property
    - Purpose: Verify baseUrl exists
    - Scenario: Check baseUrl property
    - Expected Result: baseUrl equals '/api'
    */
    it('should have baseUrl property', function() {
      expect(API_CONFIG.baseUrl).toBe('/api');
    });

    /*
    Test Documentation:
    - Test Name: should have endpoints object
    - Purpose: Verify endpoints configuration
    - Scenario: Check endpoints object structure
    - Expected Result: endpoints contains creditCards, transactions, analytics
    */
    it('should have endpoints object with correct values', function() {
      expect(API_CONFIG.endpoints).toBeDefined();
      expect(API_CONFIG.endpoints.creditCards).toBe('/creditcards');
      expect(API_CONFIG.endpoints.transactions).toBe('/transactions');
      expect(API_CONFIG.endpoints.analytics).toBe('/analytics/spending');
    });

    /*
    Test Documentation:
    - Test Name: should have timeout property
    - Purpose: Verify timeout configuration
    - Scenario: Check timeout value
    - Expected Result: timeout equals 10000ms
    */
    it('should have timeout property set to 10000', function() {
      expect(API_CONFIG.timeout).toBe(10000);
    });
  });

  /*
  Coverage Report:
  - Functions tested: N/A (constant)
  - Scenarios covered: constant structure validation, all properties verified
  - Uncovered scenarios: none
  */
})();