/*
Test Documentation:
- Test Name: apiConfig - constant values
- Purpose: Validates API configuration constant
- Scenario: Service provides correct API endpoints and configuration
- Expected Result: Returns correct baseUrl, endpoints, and timeout values
*/
/*
Coverage Report:
- Functions tested: constant injection
- Scenarios covered: baseUrl validation, endpoints validation, timeout validation
- Uncovered scenarios: none
*/

describe('apiConfig', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var apiConfig;
  
  beforeEach(inject(function(_apiConfig_) {
    apiConfig = _apiConfig_;
  }));
  
  it('should be defined', function() {
    expect(apiConfig).toBeDefined();
  });
  
  it('should have correct baseUrl', function() {
    expect(apiConfig.baseUrl).toBe('/api');
  });
  
  it('should have all required endpoints', function() {
    expect(apiConfig.endpoints).toBeDefined();
    expect(apiConfig.endpoints.creditCards).toBe('/creditcards');
    expect(apiConfig.endpoints.transactions).toBe('/transactions');
    expect(apiConfig.endpoints.monthlyTransactions).toBe('/transactions/monthly');
    expect(apiConfig.endpoints.cards).toBe('/cards');
    expect(apiConfig.endpoints.cardMetadata).toBe('/cards/{id}/metadata');
  });
  
  it('should have correct timeout value', function() {
    expect(apiConfig.timeout).toBe(5000);
  });
});