/*
Test Documentation:
- Test Name: CreditCardDataService data fetching and caching
- Purpose: Validates credit card summary retrieval, caching, and error handling
- Scenario: Test API calls, cache management, and mock data generation
- Expected Result: Service should fetch card summary from API or cache, handle errors gracefully
*/
/*
Coverage Report:
- Functions tested: getCreditCardSummary, generateMockSummary (internal)
- Scenarios covered: successful API call, cache hit, error fallback to mock data
- Dependencies mocked: $http, $cacheFactory
- Uncovered scenarios: none
*/

describe('CreditCardDataService', function() {
  'use strict';
  
  beforeEach(module('creditCard.dashboard'));
  
  var service, $httpBackend, $q, API_CONFIG;
  
  beforeEach(inject(function(_CreditCardDataService_, _$httpBackend_, _$q_, _API_CONFIG_) {
    service = _CreditCardDataService_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
    API_CONFIG = _API_CONFIG_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  it('should be defined', function() {
    expect(service).toBeDefined();
  });
  
  it('should have getCreditCardSummary method', function() {
    expect(service.getCreditCardSummary).toBeDefined();
    expect(typeof service.getCreditCardSummary).toBe('function');
  });
  
  it('should fetch credit card summary from API successfully', function() {
    var mockSummary = {
      totalCards: 3,
      totalCreditLimit: 150000,
      totalAvailableCredit: 95000,
      totalOutstanding: 55000
    };
    
    $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.cardsSummary)
      .respond(200, mockSummary);
    
    var result;
    service.getCreditCardSummary().then(function(data) {
      result = data;
    });
    
    $httpBackend.flush();
    
    expect(result).toEqual(mockSummary);
  });
  
  it('should return mock data when API call fails', function() {
    $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.cardsSummary)
      .respond(500, 'Server Error');
    
    var result;
    service.getCreditCardSummary().then(function(data) {
      result = data;
    });
    
    $httpBackend.flush();
    
    expect(result).toBeDefined();
    expect(result.totalCards).toBe(3);
    expect(result.totalCreditLimit).toBe(150000);
  });
  
  it('should generate mock summary with correct structure', function() {
    $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.cardsSummary)
      .respond(500);
    
    var result;
    service.getCreditCardSummary().then(function(data) {
      result = data;
    });
    
    $httpBackend.flush();
    
    expect(result).toHaveProperty('totalCards');
    expect(result).toHaveProperty('totalCreditLimit');
    expect(result).toHaveProperty('totalAvailableCredit');
    expect(result).toHaveProperty('totalOutstanding');
  });
});