/*
Test Documentation:
- Test Name: API_ENDPOINTS Constant Unit Tests
- Purpose: Validate that API_ENDPOINTS constant is properly defined with correct endpoint URLs
- Scenario: Tests verify the constant exists, contains all required endpoints, and has correct URL values
- Expected Result: All API endpoints are defined with correct paths
*/

(function() {
  'use strict';

  describe('API_ENDPOINTS Constant', function() {
    var API_ENDPOINTS;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_API_ENDPOINTS_) {
      API_ENDPOINTS = _API_ENDPOINTS_;
    }));

    it('should be defined', function() {
      expect(API_ENDPOINTS).toBeDefined();
    });

    it('should have CARDS endpoint defined', function() {
      expect(API_ENDPOINTS.CARDS).toBeDefined();
      expect(API_ENDPOINTS.CARDS).toBe('/api/cards');
    });

    it('should have TRANSACTIONS endpoint defined', function() {
      expect(API_ENDPOINTS.TRANSACTIONS).toBeDefined();
      expect(API_ENDPOINTS.TRANSACTIONS).toBe('/api/transactions');
    });

    it('should have MONTHLY_TRANSACTIONS endpoint defined', function() {
      expect(API_ENDPOINTS.MONTHLY_TRANSACTIONS).toBeDefined();
      expect(API_ENDPOINTS.MONTHLY_TRANSACTIONS).toBe('/api/transactions/monthly');
    });

    it('should contain exactly 3 endpoints', function() {
      var keys = Object.keys(API_ENDPOINTS);
      expect(keys.length).toBe(3);
    });

    it('should have all endpoints as strings', function() {
      expect(typeof API_ENDPOINTS.CARDS).toBe('string');
      expect(typeof API_ENDPOINTS.TRANSACTIONS).toBe('string');
      expect(typeof API_ENDPOINTS.MONTHLY_TRANSACTIONS).toBe('string');
    });

    it('should have all endpoints starting with /api/', function() {
      expect(API_ENDPOINTS.CARDS).toMatch(/^\/api\//);
      expect(API_ENDPOINTS.TRANSACTIONS).toMatch(/^\/api\//);
      expect(API_ENDPOINTS.MONTHLY_TRANSACTIONS).toMatch(/^\/api\//);
    });
  });

  /*
  Coverage Report:
  - Constants tested: API_ENDPOINTS
  - Scenarios covered:
    * Constant existence validation
    * CARDS endpoint definition and value
    * TRANSACTIONS endpoint definition and value
    * MONTHLY_TRANSACTIONS endpoint definition and value
    * Total number of endpoints
    * Data type validation for all endpoints
    * URL pattern validation
  - Uncovered scenarios: None - complete constant coverage
  */
})();