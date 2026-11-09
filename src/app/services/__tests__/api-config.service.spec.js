/*
Test Documentation:
- Test Name: API_CONFIG constant definition
- Purpose: Validates that API_CONFIG constant is properly defined with all required properties
- Scenario: Verify baseUrl, endpoints, and cacheTimeout are correctly configured
- Expected Result: API_CONFIG should be defined with correct structure and values
*/
/*
Coverage Report:
- Constants tested: API_CONFIG
- Properties verified: baseUrl, endpoints (cards, cardsSummary, transactions, userProfile), cacheTimeout
- Scenarios covered: constant initialization, property existence, value validation
- Uncovered scenarios: none (constant definition only)
*/

describe('API_CONFIG Constant', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var API_CONFIG;
  
  beforeEach(inject(function(_API_CONFIG_) {
    API_CONFIG = _API_CONFIG_;
  }));
  
  it('should be defined', function() {
    expect(API_CONFIG).toBeDefined();
  });
  
  it('should have baseUrl property set to /api', function() {
    expect(API_CONFIG.baseUrl).toBe('/api');
  });
  
  it('should have endpoints object with all required endpoints', function() {
    expect(API_CONFIG.endpoints).toBeDefined();
    expect(API_CONFIG.endpoints.cards).toBe('/cards');
    expect(API_CONFIG.endpoints.cardsSummary).toBe('/cards/summary');
    expect(API_CONFIG.endpoints.transactions).toBe('/transactions');
    expect(API_CONFIG.endpoints.userProfile).toBe('/user/profile');
  });
  
  it('should have cacheTimeout set to 300000 milliseconds', function() {
    expect(API_CONFIG.cacheTimeout).toBe(300000);
  });
  
  it('should have all required top-level properties', function() {
    expect(Object.keys(API_CONFIG)).toContain('baseUrl');
    expect(Object.keys(API_CONFIG)).toContain('endpoints');
    expect(Object.keys(API_CONFIG)).toContain('cacheTimeout');
  });
});