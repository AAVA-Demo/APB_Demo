/*
Test Documentation:
- Test Name: API_CONFIG constant definition
- Purpose: Verify API_CONFIG constant is properly defined with correct structure
- Scenario: Module loads and constant contains required endpoints
- Expected Result: API_CONFIG should have baseUrl and endpoints object with all required paths
*/

describe('API_CONFIG Constant', function() {
  'use strict';

  var API_CONFIG;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_API_CONFIG_) {
    API_CONFIG = _API_CONFIG_;
  }));

  /*
  Test Documentation:
  - Test Name: should be defined
  - Purpose: Verify API_CONFIG constant exists
  - Scenario: Inject API_CONFIG constant
  - Expected Result: API_CONFIG should be defined
  */
  it('should be defined', function() {
    expect(API_CONFIG).toBeDefined();
  });

  /*
  Test Documentation:
  - Test Name: should have baseUrl property
  - Purpose: Verify baseUrl is configured
  - Scenario: Check baseUrl property exists and is a string
  - Expected Result: baseUrl should be defined and be a string
  */
  it('should have baseUrl property', function() {
    expect(API_CONFIG.baseUrl).toBeDefined();
    expect(typeof API_CONFIG.baseUrl).toBe('string');
    expect(API_CONFIG.baseUrl).toBe('https://api.creditcard.demo');
  });

  /*
  Test Documentation:
  - Test Name: should have endpoints object
  - Purpose: Verify endpoints configuration exists
  - Scenario: Check endpoints property is an object
  - Expected Result: endpoints should be defined and be an object
  */
  it('should have endpoints object', function() {
    expect(API_CONFIG.endpoints).toBeDefined();
    expect(typeof API_CONFIG.endpoints).toBe('object');
  });

  /*
  Test Documentation:
  - Test Name: should have dashboard endpoint
  - Purpose: Verify dashboard API endpoint is configured
  - Scenario: Check dashboard endpoint path
  - Expected Result: dashboard endpoint should be '/api/dashboard/kpis'
  */
  it('should have dashboard endpoint', function() {
    expect(API_CONFIG.endpoints.dashboard).toBe('/api/dashboard/kpis');
  });

  /*
  Test Documentation:
  - Test Name: should have cards endpoint
  - Purpose: Verify cards API endpoint is configured
  - Scenario: Check cards endpoint path
  - Expected Result: cards endpoint should be '/api/cards'
  */
  it('should have cards endpoint', function() {
    expect(API_CONFIG.endpoints.cards).toBe('/api/cards');
  });

  /*
  Test Documentation:
  - Test Name: should have cardDetails endpoint with parameter
  - Purpose: Verify card details endpoint supports dynamic cardId
  - Scenario: Check cardDetails endpoint has :cardId parameter
  - Expected Result: cardDetails endpoint should be '/api/cards/:cardId'
  */
  it('should have cardDetails endpoint with parameter', function() {
    expect(API_CONFIG.endpoints.cardDetails).toBe('/api/cards/:cardId');
  });

  /*
  Test Documentation:
  - Test Name: should have analyticsTrends endpoint
  - Purpose: Verify analytics trends endpoint is configured
  - Scenario: Check analyticsTrends endpoint path
  - Expected Result: analyticsTrends endpoint should be '/api/analytics/trends'
  */
  it('should have analyticsTrends endpoint', function() {
    expect(API_CONFIG.endpoints.analyticsTrends).toBe('/api/analytics/trends');
  });
});

/*
Coverage Report:
- Functions tested: N/A (constant configuration)
- Scenarios covered: constant definition, baseUrl validation, all endpoint paths validation
- Uncovered scenarios: none (all configuration paths tested)
*/